/**
 * Higher-order function that wraps async route handlers
 * to catch errors and forward them to Express error middleware.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;
