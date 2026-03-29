import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('BUYER'), createReview);
router.get('/product/:productId', getProductReviews);

export default router;
