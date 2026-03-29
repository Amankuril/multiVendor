import { Router } from 'express';
import {
    getAdminDashboard,
    getVendors,
    updateVendorStatus,
    getUsers,
    toggleUserActive,
    getAllOrders,
    getAllProducts,
    toggleProductActive,
    getRevenueTrend,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authenticated admin
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/revenue-trend', getRevenueTrend);
router.get('/vendors', getVendors);
router.patch('/vendors/:id/status', updateVendorStatus);
router.get('/users', getUsers);
router.patch('/users/:id/toggle', toggleUserActive);
router.get('/orders', getAllOrders);
router.get('/products', getAllProducts);
router.patch('/products/:id/toggle', toggleProductActive);

export default router;
