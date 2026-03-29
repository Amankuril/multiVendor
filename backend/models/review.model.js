import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Each user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
