import Product from '../models/product.model.js';
import Vendor from '../models/vendor.model.js';
import Review from '../models/review.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/v1/products — Public, with filters, search, pagination
export const getProducts = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        order = 'desc',
        vendor,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('vendor', 'storeName storeLogo rating')
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit)),
        Product.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        }, 'Products fetched successfully.')
    );
});

// GET /api/v1/products/:id — Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('vendor', 'storeName storeLogo rating storeDescription');

    if (!product) {
        throw new ApiError(404, 'Product not found.');
    }

    const reviews = await Review.find({ product: product._id })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json(new ApiResponse(200, { product, reviews }, 'Product fetched successfully.'));
});

// POST /api/v1/products — Vendor only
export const createProduct = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    if (vendor.status !== 'APPROVED') {
        throw new ApiError(403, 'Your vendor account is not yet approved.');
    }

    const product = await Product.create({
        ...req.body,
        vendor: vendor._id,
    });

    res.status(201).json(new ApiResponse(201, { product }, 'Product created successfully.'));
});

// PUT /api/v1/products/:id — Vendor only (own products)
export const updateProduct = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    const product = await Product.findOne({ _id: req.params.id, vendor: vendor._id });
    if (!product) {
        throw new ApiError(404, 'Product not found or you are not authorized to update it.');
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json(new ApiResponse(200, { product }, 'Product updated successfully.'));
});

// DELETE /api/v1/products/:id — Vendor only (own products)
export const deleteProduct = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
        throw new ApiError(404, 'Vendor profile not found.');
    }

    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });
    if (!product) {
        throw new ApiError(404, 'Product not found or you are not authorized to delete it.');
    }

    res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully.'));
});

// GET /api/v1/products/categories — Public
export const getCategories = asyncHandler(async (req, res) => {
    const categories = [
        'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
        'Toys', 'Health & Beauty', 'Automotive', 'Food & Beverages', 'Other',
    ];

    res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched.'));
});
