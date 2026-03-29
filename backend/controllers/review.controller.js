import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import Vendor from '../models/vendor.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/v1/reviews — Buyer leaves a review
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found.');
    }

    // Check if user already reviewed this product
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
        throw new ApiError(409, 'You have already reviewed this product.');
    }

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        vendor: product.vendor,
        rating,
        comment,
    });

    // Update product rating
    const stats = await Review.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
        product.ratings.average = Math.round(stats[0].avgRating * 10) / 10;
        product.ratings.count = stats[0].count;
        await product.save();

        // Update vendor rating
        const vendorStats = await Review.aggregate([
            { $match: { vendor: product.vendor } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);

        if (vendorStats.length > 0) {
            await Vendor.findByIdAndUpdate(product.vendor, {
                'rating.average': Math.round(vendorStats[0].avgRating * 10) / 10,
                'rating.count': vendorStats[0].count,
            });
        }
    }

    await review.populate('user', 'name avatar');

    res.status(201).json(new ApiResponse(201, { review }, 'Review submitted successfully.'));
});

// GET /api/v1/reviews/product/:productId — Get reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
        Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Review.countDocuments({ product: req.params.productId }),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            reviews,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        }, 'Reviews fetched successfully.')
    );
});
