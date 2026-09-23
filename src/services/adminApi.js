// services/adminApi.js
import axios from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL } from '@/utils/apiConfig'

// This instance is completely separate from services/api.js (the
// customer-facing one). Do NOT import API/axiosInstance from services/api.js
// in any admin page - that instance's interceptor overwrites whatever
// Authorization header you set with the customer's auth_token cookie
// whenever one exists, and its 401 handler redirects to /login (customer)
// instead of /admin/login. That mismatch is what causes an admin action
// to randomly bounce to the customer login page even though the admin
// session itself is still perfectly valid.

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

adminApi.interceptors.request.use((config) => {
    const token = Cookies.get('admin_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Only treat this as "session invalid" for 401 (bad/expired
            // token). A 403 can also mean "staff account, super-admin-only
            // route" - a real, valid session that's simply not allowed
            // here - so don't log the admin out for that; let the calling
            // page show its own error instead.
            if (error.response?.status === 401) {
                Cookies.remove('admin_token')
                Cookies.remove('admin_user')
                if (typeof window !== 'undefined') {
                    window.location.href = '/admin/login'
                }
            }
        }
        return Promise.reject(error)
    }
)

export default adminApi
