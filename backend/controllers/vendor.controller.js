import Vendor from '../models/vendor.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/v1/vendor/dashboard — Vendor dashboard stats
export const getVendorDashboard = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    const [totalProducts, activeProducts, totalOrders, recentOrders, lowStockProducts] = await Promise.all([
        Product.countDocuments({ vendor: vendor._id }),
        Product.countDocuments({ vendor: vendor._id, isActive: true }),
        Order.countDocuments({ 'items.vendor': vendor._id }),
        Order.find({ 'items.vendor': vendor._id })
            .populate('buyer', 'name email')
            .populate('items.product', 'title price')
            .sort({ createdAt: -1 })
            .limit(5),
        Product.find({ vendor: vendor._id, inventory: { $lte: 5 }, isActive: true })
            .select('title inventory')
            .limit(10),
    ]);

    const commissionAmount = (vendor.totalRevenue * vendor.commissionRate) / 100;
    const netRevenue = vendor.totalRevenue - commissionAmount;

    res.status(200).json(
        new ApiResponse(200, {
            vendor,
            stats: {
                totalProducts,
                activeProducts,
                totalOrders,
                totalRevenue: vendor.totalRevenue,
                commissionRate: vendor.commissionRate,
                commissionAmount,
                netRevenue,
                totalSales: vendor.totalSales,
            },
            recentOrders,
            lowStockProducts,
        }, 'Vendor dashboard data fetched.')
    );
});

// GET /api/v1/vendor/products — Vendor's own products
export const getVendorProducts = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find({ vendor: vendor._id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Product.countDocuments({ vendor: vendor._id }),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Vendor products fetched.')
    );
});

// GET /api/v1/vendor/analytics — Revenue analytics
export const getVendorAnalytics = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    // Monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
        { $match: { 'items.vendor': vendor._id, createdAt: { $gte: sixMonthsAgo } } },
        { $unwind: '$items' },
        { $match: { 'items.vendor': vendor._id } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                orders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        { $match: { 'items.vendor': vendor._id } },
        {
            $group: {
                _id: '$items.product',
                title: { $first: '$items.title' },
                totalSold: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
    ]);

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
        { $match: { vendor: vendor._id } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            monthlyRevenue,
            topProducts,
            categoryBreakdown,
            summary: {
                totalRevenue: vendor.totalRevenue,
                totalSales: vendor.totalSales,
                commissionRate: vendor.commissionRate,
                netRevenue: vendor.totalRevenue - (vendor.totalRevenue * vendor.commissionRate) / 100,
            },
        }, 'Vendor analytics fetched.')
    );
});
