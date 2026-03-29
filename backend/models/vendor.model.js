import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        storeName: {
            type: String,
            required: [true, 'Store name is required'],
            trim: true,
            minlength: [2, 'Store name must be at least 2 characters'],
            maxlength: [100, 'Store name cannot exceed 100 characters'],
        },
        storeDescription: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: '',
        },
        storeLogo: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'],
            default: 'PENDING',
        },
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
        totalSales: {
            type: Number,
            default: 0,
        },
        totalRevenue: {
            type: Number,
            default: 0,
        },
        payoutInfo: {
            bankName: String,
            accountNumber: String,
            ifscCode: String,
        },
        commissionRate: {
            type: Number,
            default: 10, // 10% platform commission
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
