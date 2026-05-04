import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
    
    if (error.response?.status === 401 &&
       !originalRequest?._retry &&
       !originalRequest.url.includes('/auth/refresh') &&
        authStore.accessToken) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post('/auth/refresh', {}, {
          withCredentials: true,
        });

        const { token } = response.data;

        authStore.accessToken = token;

        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;

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
