import { z } from 'zod';

export const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                product: z.string().min(1, 'Product ID is required'),
                quantity: z.number().int().min(1, 'Quantity must be at least 1'),
            })
        )
        .min(1, 'At least one item is required'),
    shippingAddress: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zipCode: z.string().min(1, 'Zip code is required'),
        country: z.string().optional().default('India'),
    }),
    paymentMethod: z.enum(['COD', 'CARD', 'UPI', 'NET_BANKING']).optional().default('COD'),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
