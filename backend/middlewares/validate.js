import ApiError from '../utils/ApiError.js';

/**
 * Generic Zod validation middleware factory.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate req.body against
 */
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            throw new ApiError(400, 'Validation failed', errorMessages);
        }
        req.body = result.data; // Use the parsed & sanitized data
        next();
    };
};

export default validate;
