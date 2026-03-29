import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: [true, 'Vendor is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            minlength: [2, 'Title must be at least 2 characters'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        compareAtPrice: {
            type: Number,
            min: [0, 'Compare price cannot be negative'],
            default: 0,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Electronics',
                'Clothing',
                'Home & Garden',
                'Sports',
                'Books',
                'Toys',
                'Health & Beauty',
                'Automotive',
                'Food & Beverages',
                'Other',
            ],
            index: true,
        },
        images: [
            {
                type: String,
            },
        ],
        inventory: {
            type: Number,
            required: [true, 'Inventory count is required'],
            min: [0, 'Inventory cannot be negative'],
            default: 0,
        },
        sku: {
            type: String,
            trim: true,
            uppercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        ratings: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// Text index for search
productSchema.index({ title: 'text', description: 'text' });

// Compound index for vendor isolation queries
productSchema.index({ vendor: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
