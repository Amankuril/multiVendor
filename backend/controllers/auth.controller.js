import User from '../models/user.model.js';
import Vendor from '../models/vendor.model.js';
import { generateToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'An account with this email already exists.');
    }

    const user = await User.create({ name, email, password, role: role || 'BUYER', phone });

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(201).json(new ApiResponse(201, { user, token }, 'Registration successful.'));
});

// POST /api/v1/auth/vendor-register
export const vendorRegister = asyncHandler(async (req, res) => {
    const { name, email, password, storeName, storeDescription, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'An account with this email already exists.');
    }

    const user = await User.create({ name, email, password, role: 'VENDOR', phone });

    const vendor = await Vendor.create({
        userId: user._id,
        storeName,
        storeDescription: storeDescription || '',
        status: 'PENDING',
    });

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(201).json(
        new ApiResponse(201, { user, vendor, token }, 'Vendor registration successful. Awaiting approval.')
    );
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    if (!user.isActive) {
        throw new ApiError(403, 'Your account has been deactivated.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateToken({ userId: user._id, role: user.role });

    // Remove password from response
    user.password = undefined;

    res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful.'));
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    let vendor = null;
    if (user.role === 'VENDOR') {
        vendor = await Vendor.findOne({ userId: user._id });
    }

    res.status(200).json(new ApiResponse(200, { user, vendor }, 'Profile fetched successfully.'));
});

// PUT /api/v1/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone, address },
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully.'));
});
