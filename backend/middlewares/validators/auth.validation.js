import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    role: z.enum(['BUYER', 'VENDOR']).optional().default('BUYER'),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const vendorRegisterSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    storeName: z.string().min(2, 'Store name must be at least 2 characters').max(100),
    storeDescription: z.string().max(500).optional().default(''),
    phone: z.string().optional(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    phone: z.string().optional(),
    address: z
        .object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional(),
        })
        .optional(),
});
