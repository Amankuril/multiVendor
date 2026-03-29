import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getVendorOrders,
    updateOrderItemStatus,
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../middlewares/validators/order.validation.js';

const router = Router();

// Buyer routes
router.post('/', authenticate, authorize('BUYER'), validate(createOrderSchema), createOrder);
router.get('/my-orders', authenticate, authorize('BUYER'), getMyOrders);

// Vendor routes
router.get('/vendor-orders', authenticate, authorize('VENDOR'), getVendorOrders);
router.patch('/:id/status', authenticate, authorize('VENDOR'), validate(updateOrderStatusSchema), updateOrderItemStatus);

// Shared (buyer, vendor, admin) route
router.get('/:id', authenticate, getOrderById);

export default router;
