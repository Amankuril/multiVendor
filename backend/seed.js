import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import Vendor from './models/vendor.model.js';
import Product from './models/product.model.js';

dotenv.config({ path: './.env' });

const PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Vendor.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@marketplace.com',
            password: 'Admin123!',
            role: 'ADMIN',
            isActive: true,
        });
        console.log('👑 Admin created: admin@marketplace.com / Admin123!');

        // Create Buyers
        const buyer1 = await User.create({
            name: 'John Buyer',
            email: 'buyer@test.com',
            password: 'Buyer123!',
            role: 'BUYER',
            phone: '9876543210',
            address: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
        });
        const buyer2 = await User.create({
            name: 'Jane Shopper',
            email: 'jane@test.com',
            password: 'Buyer123!',
            role: 'BUYER',
        });
        console.log('🛒 Buyers created: buyer@test.com, jane@test.com / Buyer123!');

        // Create Vendors
        const vendorUser1 = await User.create({
            name: 'TechWorld Store',
            email: 'vendor1@test.com',
            password: 'Vendor123!',
            role: 'VENDOR',
        });
        const vendor1 = await Vendor.create({
            userId: vendorUser1._id,
            storeName: 'TechWorld Electronics',
            storeDescription: 'Premium electronics and gadgets at competitive prices.',
            status: 'APPROVED',
            commissionRate: 10,
        });

        const vendorUser2 = await User.create({
            name: 'Fashion Hub',
            email: 'vendor2@test.com',
            password: 'Vendor123!',
            role: 'VENDOR',
        });
        const vendor2 = await Vendor.create({
            userId: vendorUser2._id,
            storeName: 'Fashion Hub',
            storeDescription: 'Trendy clothes and accessories for everyone.',
            status: 'APPROVED',
            commissionRate: 12,
        });

        const vendorUser3 = await User.create({
            name: 'Pending Seller',
            email: 'vendor3@test.com',
            password: 'Vendor123!',
            role: 'VENDOR',
        });
        const vendor3 = await Vendor.create({
            userId: vendorUser3._id,
            storeName: 'New Store',
            storeDescription: 'A new store awaiting approval.',
            status: 'PENDING',
        });
        console.log('🏪 Vendors created: vendor1@test.com, vendor2@test.com, vendor3@test.com / Vendor123!');

        // Create Products for Vendor 1 (Electronics)
        const electronicsProducts = [
            { title: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.', price: 2999, compareAtPrice: 4999, category: 'Electronics', inventory: 50, sku: 'TECH-001' },
            { title: 'Smart Watch Pro', description: 'Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.', price: 5499, compareAtPrice: 7999, category: 'Electronics', inventory: 30, sku: 'TECH-002' },
            { title: 'Portable Power Bank 20000mAh', description: 'High-capacity power bank with fast charging support and LED display.', price: 1299, compareAtPrice: 1999, category: 'Electronics', inventory: 100, sku: 'TECH-003' },
            { title: 'USB-C Hub 7-in-1', description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.', price: 1799, compareAtPrice: 2499, category: 'Electronics', inventory: 45, sku: 'TECH-004' },
            { title: 'Mechanical Keyboard RGB', description: 'Full-size mechanical keyboard with Cherry MX switches and customizable RGB backlighting.', price: 3499, compareAtPrice: 4999, category: 'Electronics', inventory: 25, sku: 'TECH-005' },
            { title: 'Webcam 4K Ultra HD', description: 'Professional grade 4K webcam with auto-focus and built-in stereo microphone.', price: 4999, compareAtPrice: 6999, category: 'Electronics', inventory: 3, sku: 'TECH-006' },
        ];

        // Create Products for Vendor 2 (Fashion)
        const fashionProducts = [
            { title: 'Classic Leather Jacket', description: 'Genuine leather jacket with premium stitching and modern slim fit design.', price: 4999, compareAtPrice: 7999, category: 'Clothing', inventory: 20, sku: 'FASH-001' },
            { title: 'Running Shoes Ultra Boost', description: 'Lightweight and comfortable running shoes with responsive cushioning.', price: 3299, compareAtPrice: 4599, category: 'Sports', inventory: 40, sku: 'FASH-002' },
            { title: 'Designer Sunglasses', description: 'UV400 protection polarized sunglasses with premium metal frame.', price: 1899, compareAtPrice: 2999, category: 'Clothing', inventory: 60, sku: 'FASH-003' },
            { title: 'Cotton Premium T-Shirt Pack', description: 'Pack of 3 premium cotton t-shirts in solid colors. Breathable and comfortable.', price: 999, compareAtPrice: 1499, category: 'Clothing', inventory: 80, sku: 'FASH-004' },
            { title: 'Yoga Mat Premium', description: 'Non-slip yoga mat with alignment lines and carrying strap.', price: 1499, compareAtPrice: 2199, category: 'Sports', inventory: 35, sku: 'FASH-005' },
            { title: 'Organic Face Cream', description: 'All-natural organic face cream with vitamin E and aloe vera for glowing skin.', price: 799, compareAtPrice: 1299, category: 'Health & Beauty', inventory: 70, sku: 'FASH-006' },
        ];

        for (let i = 0; i < electronicsProducts.length; i++) {
            await Product.create({
                ...electronicsProducts[i],
                vendor: vendor1._id,
                images: [PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]],
                ratings: { average: (3.5 + Math.random() * 1.5).toFixed(1), count: Math.floor(Math.random() * 50) + 5 },
            });
        }

        for (let i = 0; i < fashionProducts.length; i++) {
            await Product.create({
                ...fashionProducts[i],
                vendor: vendor2._id,
                images: [PRODUCT_IMAGES[(i + 3) % PRODUCT_IMAGES.length]],
                ratings: { average: (3.5 + Math.random() * 1.5).toFixed(1), count: Math.floor(Math.random() * 50) + 5 },
            });
        }

        console.log('📦 12 sample products created');

        console.log('\n═══════════════════════════════════════════');
        console.log('  🚀 Seed completed successfully!');
        console.log('═══════════════════════════════════════════');
        console.log('  Admin:  admin@marketplace.com / Admin123!');
        console.log('  Buyer:  buyer@test.com / Buyer123!');
        console.log('  Vendor: vendor1@test.com / Vendor123!');
        console.log('  Vendor: vendor2@test.com / Vendor123!');
        console.log('═══════════════════════════════════════════\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seed();
