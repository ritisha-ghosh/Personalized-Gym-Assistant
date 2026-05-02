import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // Your backend's base URL
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
    const token = localStorage.getItem('token');
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
export const login = (credentials) => api.post('/login', credentials);
export const signup = (userData) => api.post('/signup', userData);

// This is the function to get the currently logged-in user's data
export const getCurrentUser = () => api.get('/me');

// This is the function to update the user's profile
export const updateUserProfile = (profileData) => api.put('/me', profileData);

export const refreshAccessToken = () => api.post('/refresh-token');

export default api;