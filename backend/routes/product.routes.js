import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.js';
import { createProductSchema, updateProductSchema } from '../middlewares/validators/product.validation.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Vendor-only routes
router.post('/', authenticate, authorize('VENDOR'), validate(createProductSchema), createProduct);
router.put('/:id', authenticate, authorize('VENDOR'), validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, authorize('VENDOR'), deleteProduct);

export default router;
