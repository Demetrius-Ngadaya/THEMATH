import axios from 'axios';
import { API_BASE_URL } from '@/utils/apiConfig';

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