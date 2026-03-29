import api from './api';

export const authService = {
    register: (data) => api.post('/auth/register', data),
    vendorRegister: (data) => api.post('/auth/vendor-register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

export const productService = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getCategories: () => api.get('/products/categories'),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const orderService = {
    create: (data) => api.post('/orders', data),
    getMyOrders: (params) => api.get('/orders/my-orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    getVendorOrders: (params) => api.get('/orders/vendor-orders', { params }),
    updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
    updateItemStatus: (orderId, itemId, data) => api.patch(`/orders/${orderId}/items/${itemId}/status`, data),
};

export const reviewService = {
    create: (data) => api.post('/reviews', data),
    getByProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
};

export const vendorService = {
    getDashboard: () => api.get('/vendor/dashboard'),
    getProducts: (params) => api.get('/vendor/products', { params }),
    getAnalytics: () => api.get('/vendor/analytics'),
};

export const adminService = {
    getDashboard: () => api.get('/admin/dashboard'),
    getVendors: (params) => api.get('/admin/vendors', { params }),
    updateVendor: (id, data) => api.patch(`/admin/vendors/${id}/status`, data),
    getUsers: (params) => api.get('/admin/users', { params }),
    toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
    getOrders: (params) => api.get('/admin/orders', { params }),
    getProducts: (params) => api.get('/admin/products', { params }),
    toggleProduct: (id) => api.patch(`/admin/products/${id}/toggle`),
    getRevenueTrend: () => api.get('/admin/revenue-trend'),
};
