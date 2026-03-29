import { z } from 'zod';

export const createProductSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
    price: z.number().min(0, 'Price cannot be negative'),
    compareAtPrice: z.number().min(0).optional().default(0),
    category: z.enum([
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Sports',
        'Books',
        'Toys',
        'Health & Beauty',
        'Automotive',
        'Food & Beverages',
        'Other',
    ]),
    images: z.array(z.string().url()).optional().default([]),
    inventory: z.number().int().min(0, 'Inventory cannot be negative'),
    sku: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
