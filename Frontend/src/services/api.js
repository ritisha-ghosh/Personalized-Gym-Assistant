import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Add a request interceptor to include the token in all requests.
  The token is retrieved from localStorage, where we will store it after login.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export API functions that your components can call
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (userData) => api.post('/auth/signup', userData); // Kept for legacy, but new flow uses OTP

// This is the function to get the currently logged-in user's data
export const getCurrentUser = () => api.get('/users/profile'); // Corrected path to match user routes

// This is the function to update the user's profile
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData); // Correct path to match user routes

export const refreshAccessToken = () => api.post('/auth/refresh-token');

export default api;