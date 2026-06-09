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
// Runs BEFORE every request
// Used to add authentication headers
api.interceptors.request.use(
  (config) => {
    // You can add custom headers here if needed
    // For now, cookies are automatically sent (withCredentials: true)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Runs AFTER every response
// Used to handle token expiry, refresh tokens, etc
api.interceptors.response.use(
  (response) => {
    // Success response, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ---- Handle 401 Unauthorized ----
    // This means access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await api.post('/auth/refresh');
        
        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user must login again
        // Clear auth state
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;