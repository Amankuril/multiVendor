import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Authenticate middleware — verifies JWT from Authorization header.
 * Attaches user to req.user
 */
export const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new ApiError(401, 'Token is invalid. User not found.');
        }

        if (!user.isActive) {
            throw new ApiError(403, 'Your account has been deactivated.');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, 'Invalid or expired token.');
    }
});

/**
 * Authorize middleware — checks if user has one of the required roles.
 * Must be used AFTER authenticate.
 * @param  {...string} roles - Allowed roles (e.g., 'ADMIN', 'VENDOR')
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required.');
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`);
        }

        next();
    };
};
