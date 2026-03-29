import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Vendor from '../models/vendor.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/v1/orders — Buyer creates order
export const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Validate and fetch products, check inventory
    const orderItems = [];
    let totalAmount = 0;
    let totalCommission = 0;

    for (const item of items) {
        const product = await Product.findById(item.product).populate('vendor');
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.product}`);
        }
        if (!product.isActive) {
            throw new ApiError(400, `Product "${product.title}" is no longer available.`);
        }
        if (product.inventory < item.quantity) {
            throw new ApiError(400, `Insufficient stock for "${product.title}". Available: ${product.inventory}`);
        }

        const itemTotal = product.price * item.quantity;
        const itemCommission = (itemTotal * (product.vendor.commissionRate || 10)) / 100;
        totalAmount += itemTotal;
        totalCommission += itemCommission;

        orderItems.push({
            product: product._id,
            vendor: product.vendor._id,
            title: product.title,
            price: product.price,
            quantity: item.quantity,
            status: 'PENDING',
        });

        // Deduct inventory
        product.inventory -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        buyer: req.user._id,
        items: orderItems,
        totalAmount,
        commission: totalCommission,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID', // Mock: non-COD = instant paid
        orderStatus: 'PLACED',
    });

    // Update vendor sales
    const vendorUpdates = {};
    for (const item of orderItems) {
        const vid = item.vendor.toString();
        if (!vendorUpdates[vid]) vendorUpdates[vid] = { sales: 0, revenue: 0 };
        vendorUpdates[vid].sales += item.quantity;
        vendorUpdates[vid].revenue += item.price * item.quantity;
    }

    for (const [vendorId, update] of Object.entries(vendorUpdates)) {
        await Vendor.findByIdAndUpdate(vendorId, {
            $inc: { totalSales: update.sales, totalRevenue: update.revenue },
        });
    }

    const populatedOrder = await Order.findById(order._id)
        .populate('buyer', 'name email')
        .populate('items.product', 'title images price')
        .populate('items.vendor', 'storeName');

    res.status(201).json(new ApiResponse(201, { order: populatedOrder }, 'Order placed successfully.'));
});

// GET /api/v1/orders/my-orders — Buyer's orders
export const getMyOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find({ buyer: req.user._id })
            .populate('items.product', 'title images price')
            .populate('items.vendor', 'storeName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Order.countDocuments({ buyer: req.user._id }),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Orders fetched successfully.')
    );
});

// GET /api/v1/orders/:id — Order detail (buyer or vendor)
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('buyer', 'name email phone')
        .populate('items.product', 'title images price')
        .populate('items.vendor', 'storeName');

    if (!order) {
        throw new ApiError(404, 'Order not found.');
    }

    // Allow access to buyer, vendor of any item, or admin
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    let isVendor = false;
    if (req.user.role === 'VENDOR') {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (vendor) {
            isVendor = order.items.some((item) => item.vendor._id.toString() === vendor._id.toString());
        }
    }

    if (!isBuyer && !isVendor && !isAdmin) {
        throw new ApiError(403, 'You are not authorized to view this order.');
    }

    res.status(200).json(new ApiResponse(200, { order }, 'Order fetched successfully.'));
});

// GET /api/v1/orders/vendor-orders — Orders containing this vendor's items
export const getVendorOrders = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find({ 'items.vendor': vendor._id })
            .populate('buyer', 'name email')
            .populate('items.product', 'title images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Order.countDocuments({ 'items.vendor': vendor._id }),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Vendor orders fetched.')
    );
});

// PATCH /api/v1/orders/:id/status — Vendor updates item status
export const updateOrderItemStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new ApiError(404, 'Order not found.');
    }

    let updated = false;
    for (const item of order.items) {
        if (item.vendor.toString() === vendor._id.toString()) {
            item.status = status;
            updated = true;
        }
    }

    if (!updated) {
        throw new ApiError(403, 'You have no items in this order.');
    }

    // If all items are same status, update order status too
    const allStatuses = order.items.map((i) => i.status);
    if (allStatuses.every((s) => s === 'DELIVERED')) {
        order.orderStatus = 'DELIVERED';
        order.paymentStatus = 'PAID';
    } else if (allStatuses.every((s) => s === 'CANCELLED')) {
        order.orderStatus = 'CANCELLED';
    } else if (allStatuses.some((s) => s === 'SHIPPED')) {
        order.orderStatus = 'SHIPPED';
    } else if (allStatuses.some((s) => s === 'CONFIRMED')) {
        order.orderStatus = 'PROCESSING';
    }

    await order.save();

    res.status(200).json(new ApiResponse(200, { order }, 'Order status updated.'));
});
