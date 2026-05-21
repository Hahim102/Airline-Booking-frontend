import {
  getAuthStore,
  setAuthStore,
  clearAuthStore
} from './authStore';

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const normalizeApiError = (error) => {
  const apiError = error.response?.data;

  return {
    status: error.response?.status,
    code: apiError?.code,
    message: apiError?.message || error.message || 'Something went wrong',
    data: apiError?.data,
    path: apiError?.path,
  };
};

export const setupInterceptors = (apiClient) => {
  apiClient.interceptors.request.use(
    (config) => {
      const authStore = getAuthStore();

      if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(normalizeApiError(error));
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = getAuthStore();

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !originalRequest.url.includes('/auth/refresh') &&
        !originalRequest.url.includes('/auth/logout') &&
        authStore.accessToken
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              if (!token) {
                reject(normalizeApiError(error));
                return;
              }

              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const response = await apiClient.post(
            '/auth/refresh',
            {},
            {
              withCredentials: true,
            }
          );

          const authData = response.data.data;
          const accessToken = authData.accessToken;

          setAuthStore({
            accessToken,
          });

          onRefreshed(accessToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          return apiClient(originalRequest);
        } catch (refreshError) {
          onRefreshed(null);

          clearAuthStore();

          const currentAuthStore = getAuthStore();

          if (currentAuthStore.logout) {
            await currentAuthStore.logout({ server: false });
          }

          return Promise.reject(normalizeApiError(refreshError));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};