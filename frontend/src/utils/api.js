import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const token = JSON.parse(userInfo).token;
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('userInfo');
            // Check if we're not already on the login page to avoid infinite loops
            if (!window.location.pathname.includes('admin-login')) {
                window.location.href = '/admin-login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
