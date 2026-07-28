import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com//api';

const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const PublicAPI = {
    // Products
    getProducts: (params) => publicApi.get('/products', { params }),
    getProduct: (id) => publicApi.get(`/products/${id}`),

    // Categories
    getCategories: () => publicApi.get('/categories'),
};

export default PublicAPI;