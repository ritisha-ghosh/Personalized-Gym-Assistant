import axios from 'axios';

// Your backend is likely running on port 5000. Adjust if it's different.
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We'll use an interceptor to automatically add the JWT token to every request
// after the user logs in. This is a very powerful pattern.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Prepend 'Bearer ' to the token as is standard for JWTs
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = (userData) => {
  return api.post('/auth/signup', userData);
};

export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export default api;