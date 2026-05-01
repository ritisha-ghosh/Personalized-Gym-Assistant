// import axios from 'axios';

// // Change this to your actual backend URL (usually port 5000 or 8000)
// const API_BASE_URL = 'http://localhost:5000/api'; 

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to attach the Token to every request automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the ACCESS token
api.interceptors.request.use(
  (config) => {
    // Updated to 'accessToken' to match your AuthController/Context logic
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add a response interceptor to handle 401 (Expired Token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Call your refresh endpoint
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = res.data.accessToken;
          
          localStorage.setItem('accessToken', newAccessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

export default api;