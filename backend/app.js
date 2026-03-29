import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// ─── Global Middlewares ─────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Marketplace API is running smoothly.' });
});

// ─── Mount Routes ───────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/vendor', vendorRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: err.errors || [],
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

export default app;