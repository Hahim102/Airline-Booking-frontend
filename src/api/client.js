import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include httpOnly cookies
});

let authStore = {
  accessToken: null,
  refreshToken: null,
  logout: null,
};


export const setAuthStore = (store) => {
  authStore = store;
};


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


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 &&
       !originalRequest?._retry &&
       !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true, // Include httpOnly cookies
        });

        const { accessToken } = response.data;

        authStore.accessToken = accessToken;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
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
