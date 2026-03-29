import { Router } from 'express';
import {
    getVendorDashboard,
    getVendorProducts,
    getVendorAnalytics,
} from '../controllers/vendor.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authenticated vendor
router.use(authenticate, authorize('VENDOR'));

router.get('/dashboard', getVendorDashboard);
router.get('/products', getVendorProducts);
router.get('/analytics', getVendorAnalytics);

export default router;
