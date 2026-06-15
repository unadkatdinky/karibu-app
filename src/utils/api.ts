import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Your Go backend URL
  withCredentials: true, // CRITICAL! This sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// ============================================
// RESPONSE INTERCEPTOR
// ============================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      
      // 🚨 THE CIRCUIT BREAKER 🚨
      if (originalRequest.url === '/auth/refresh') {
        // REMOVED window.location.href
        // Just reject the promise. Zustand's catch block will handle the rest!
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await api.post('/auth/refresh');
          return api(originalRequest);
        } catch (refreshError) {
          // REMOVED window.location.href
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;