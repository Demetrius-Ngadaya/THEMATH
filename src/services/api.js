// services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use(async (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchCsrfCookie = async () => {
    try {
        await axios.get('https://backendapi.emcc-lab.com//sanctum/csrf-cookie', {
            withCredentials: true,
        });
        console.log('CSRF cookie fetched');
        return true;
    } catch (error) {
        console.error('Failed to fetch CSRF cookie:', error);
        return false;
    }
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthEndpoint = error.config.url.includes('/register') ||
                error.config.url.includes('/login');
            if (!isAuthEndpoint) {
                Cookies.remove('auth_token');
                Cookies.remove('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const API = {
    // Generic methods
    get: (url, params) => api.get(url, { params }),
    post: (url, data) => api.post(url, data),
    put: (url, data) => api.put(url, data),
    delete: (url) => api.delete(url),

    // Auth
    register: async (data) => {
        await fetchCsrfCookie();
        return api.post('/register', data);
    },
    login: async (data) => {
        await fetchCsrfCookie();
        return api.post('/login', data);
    },
    logout: () => api.post('/logout'),

    // Products
    getProducts: (params) => api.get('/products', { params }),
    getProduct: (id) => api.get(`/products/${id}`),

    // Categories
    getCategories: () => api.get('/categories'),

    // Wishlist methods
    getWishlist: () => api.get('/wishlist'),
    addToWishlist: (productId) => api.post('/wishlist/add', { product_id: productId }),
    removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
    checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),

    // Cart methods
    getCart: () => api.get('/cart'),
    addToCart: (data) => api.post('/cart/add', data),
    updateCartItem: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
    removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
    clearCart: () => api.delete('/cart/clear'),

    // Orders
    getOrders: () => api.get('/orders'),
    getOrder: (id) => api.get(`/orders/${id}`),
    createOrder: () => api.post('/orders'),
    createDirectOrder: (data) => api.post('/direct-order', data),

    // Checkout
    getCheckoutSummary: () => api.get('/checkout/summary'),

    // Payments
    initiatePayment: (data) => api.post('/payments/mno', data),
};

export default API;