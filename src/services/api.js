import axios from 'axios';
import store from '../store';
import { logout, addNotification } from '../store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error:', error.response || error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        store.dispatch(addNotification({
          type: 'error',
          message: 'Session expired. Please login again.'
        }));
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      store.dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to perform this action.'
      }));
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      store.dispatch(addNotification({
        type: 'warning',
        message: 'Resource not found.'
      }));
    }

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      if (errors) {
        Object.values(errors).forEach(message => {
          store.dispatch(addNotification({
            type: 'error',
            message: Array.isArray(message) ? message[0] : message
          }));
        });
      }
    }

    // Handle 500 Internal Server errors
    if (error.response?.status >= 500) {
      store.dispatch(addNotification({
        type: 'error',
        message: 'Server error. Please try again later.'
      }));
    }

    // Handle network errors
    if (!error.response) {
      store.dispatch(addNotification({
        type: 'error',
        message: 'Network error. Please check your connection.'
      }));
    }

    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth endpoints
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    googleLogin: (data) => api.post('/auth/google', data),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    refreshToken: () => api.post('/auth/refresh-token'),
    getMe: () => api.get('/auth/me')
  },

  // User endpoints
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    updatePassword: (data) => api.put('/users/password', data),
    updateAddress: (data) => api.put('/users/address', data),
    deleteAccount: () => api.delete('/users/account'),
    getOrders: () => api.get('/users/orders'),
    getWishlist: () => api.get('/users/wishlist'),
    addToWishlist: (productId) => api.post('/users/wishlist', { productId }),
    removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`)
  },

  // Product endpoints
  products: {
    getAll: (params) => api.get('/products', { params }),
    getFeatured: () => api.get('/products/featured'),
    getById: (id) => api.get(`/products/${id}`),
    getRelated: (id) => api.get(`/products/${id}/related`),
    search: (query) => api.get('/products/search', { params: { q: query } }),
    getCategories: () => api.get('/categories'),
    getByCategory: (categoryId, params) => api.get(`/categories/${categoryId}/products`, { params }),
    getReviews: (productId) => api.get(`/products/${productId}/reviews`),
    addReview: (productId, data) => api.post(`/products/${productId}/reviews`, data)
  },

  // Cart endpoints
  cart: {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart', data),
    update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/${id}`),
    clear: () => api.delete('/cart')
  },

  // Order endpoints
  orders: {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
    track: (id) => api.get(`/orders/${id}/track`),
    getInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' })
  },

  // Payment endpoints
  payments: {
    initialize: (data) => api.post('/payments/initialize', data),
    verify: (transactionId) => api.get(`/payments/verify/${transactionId}`),
    status: (orderId) => api.get(`/payments/status/${orderId}`),
    mobileMoney: (data) => api.post('/payments/mobile-money', data),
    cashOnDelivery: (data) => api.post('/payments/cash-on-delivery', data),
    history: () => api.get('/payments/history')
  },

  // Admin endpoints
  admin: {
    // Dashboard
    getDashboard: () => api.get('/admin/dashboard'),
    getStats: () => api.get('/admin/stats'),
    getSalesReport: (params) => api.get('/admin/reports/sales', { params }),

    // Products
    getProducts: (params) => api.get('/admin/products', { params }),
    createProduct: (data) => api.post('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    getLowStock: () => api.get('/admin/products/low-stock'),

    // Orders
    getOrders: (params) => api.get('/admin/orders', { params }),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
    getRecentOrders: () => api.get('/admin/orders/recent'),

    // Users
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // Categories
    createCategory: (data) => api.post('/admin/categories', data),
    updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

    // Settings
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (data) => api.put('/admin/settings', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Company endpoints
  company: {
    getInfo: () => api.get('/company'),
    getContact: () => api.get('/company/contact'),
    getSocial: () => api.get('/company/social'),
    updateInfo: (data) => api.put('/company', data),
    uploadLogo: (file) => {
      const formData = new FormData();
      formData.append('logo', file);
      return api.post('/company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    updateContact: (data) => api.put('/company/contact', data),
    updateSocial: (data) => api.put('/company/social', data)
  },

  // Utility methods
  upload: {
    image: (file, folder = 'general') => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      return api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    multiple: (files, folder = 'general') => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('folder', folder);
      return api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
  }
};

export default apiService;