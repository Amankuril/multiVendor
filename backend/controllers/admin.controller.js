import User from '../models/user.model.js';
import Vendor from '../models/vendor.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/v1/admin/dashboard — Platform overview
export const getAdminDashboard = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalVendors,
        approvedVendors,
        pendingVendors,
        totalProducts,
        totalOrders,
        recentOrders,
        revenueAgg,
    ] = await Promise.all([
        User.countDocuments({ role: 'BUYER' }),
        Vendor.countDocuments(),
        Vendor.countDocuments({ status: 'APPROVED' }),
        Vendor.countDocuments({ status: 'PENDING' }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find()
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 })
            .limit(5),
        Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalCommission: { $sum: '$commission' } } },
        ]),
    ]);

    const revenue = revenueAgg[0] || { totalRevenue: 0, totalCommission: 0 };

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
                commission: { $sum: '$commission' },
                orders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            stats: {
                totalUsers,
                totalVendors,
                approvedVendors,
                pendingVendors,
                totalProducts,
                totalOrders,
                totalRevenue: revenue.totalRevenue,
                totalCommission: revenue.totalCommission,
            },
            monthlyRevenue,
            recentOrders,
        }, 'Admin dashboard data fetched.')
    );
});

// GET /api/v1/admin/vendors — All vendors with filters
export const getVendors = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [vendors, total] = await Promise.all([
        Vendor.find(filter)
            .populate('userId', 'name email phone isActive')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Vendor.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            vendors,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Vendors fetched.')
    );
});

// PATCH /api/v1/admin/vendors/:id/status — Approve/Suspend/Reject vendor
export const updateVendorStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!['APPROVED', 'SUSPENDED', 'REJECTED'].includes(status)) {
        throw new ApiError(400, 'Invalid status. Must be APPROVED, SUSPENDED, or REJECTED.');
    }

    const vendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!vendor) {
        throw new ApiError(404, 'Vendor not found.');
    }

    res.status(200).json(new ApiResponse(200, { vendor }, `Vendor ${status.toLowerCase()} successfully.`));
});

// GET /api/v1/admin/users — All users
export const getUsers = asyncHandler(async (req, res) => {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        User.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Users fetched.')
    );
});

// PATCH /api/v1/admin/users/:id/toggle — Toggle user active status
export const toggleUserActive = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, 'User not found.');
    }

    if (user.role === 'ADMIN') {
        throw new ApiError(400, 'Cannot deactivate admin accounts.');
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json(new ApiResponse(200, { user }, `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`));
});

// GET /api/v1/admin/orders — All orders
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate('buyer', 'name email')
            .populate('items.vendor', 'storeName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Order.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Orders fetched.')
    );
});

// GET /api/v1/admin/products — All products for moderation
export const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find()
            .populate('vendor', 'storeName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Product.countDocuments(),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Products fetched.')
    );
});

// PATCH /api/v1/admin/products/:id/toggle — Toggle product active
export const toggleProductActive = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, 'Product not found.');
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json(
        new ApiResponse(200, { product }, `Product ${product.isActive ? 'activated' : 'deactivated'}.`)
    );
});

// GET /api/v1/admin/revenue-trend — Monthly revenue for chart
export const getRevenueTrend = asyncHandler(async (req, res) => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const trend = monthlyRevenue.map(m => ({
        month: m._id,
        revenue: m.revenue,
    }));

    res.status(200).json(
        new ApiResponse(200, { trend }, 'Revenue trend fetched.')
    );
});
