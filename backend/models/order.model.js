import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    title: String,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING',
    },
});

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total cannot be negative'],
        },
        commission: {
            type: Number,
            default: 0,
        },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, default: 'India' },
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'CARD', 'UPI', 'NET_BANKING'],
            default: 'COD',
        },
        orderStatus: {
            type: String,
            enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            default: 'PLACED',
        },
        orderNumber: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique order number before saving
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    }
    next();
});

// Index for vendor order queries
orderSchema.index({ 'items.vendor': 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
