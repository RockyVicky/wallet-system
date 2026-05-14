import axios from 'axios';
import Cookies from 'js-cookie';

const backendInternalUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_INTERNAL_URL ||
  'http://127.0.0.1:3001';

/**
 * Simplified API configuration.
 * Using a relative path '/api-backend' ensures the browser always talks to the 
 * frontend server (port 3000), which then proxies to the backend.
 * This is the most reliable way to handle mobile IP access.
 */
const api = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api-backend' : backendInternalUrl,
  timeout: 60000, // Increased to 60s to handle Render.com free tier cold starts
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token') || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
