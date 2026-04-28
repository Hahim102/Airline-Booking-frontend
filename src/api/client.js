import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for auth context (will be set from context)
let authStore = {
  accessToken: null,
  refreshToken: null,
  logout: null,
};

/**
 * Set auth store (called from AuthContext)
 */
export const setAuthStore = (store) => {
  authStore = store;
};

/**
 * Request interceptor: Attach access token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle 401 and refresh token
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true, // Include httpOnly cookies
        });

        const { accessToken } = response.data;

        // Update auth store with new token
        authStore.accessToken = accessToken;

        // Update original request header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        if (authStore.logout) {
          authStore.logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
