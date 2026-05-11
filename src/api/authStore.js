
let authStore = {
  accessToken: null,
  logout: null,
};


export const setAuthStore = (store) => {
  authStore = { ...authStore, ...store };
};


export const getAuthStore = () => authStore;


export const getAccessToken = () => authStore.accessToken;


export const clearAuthStore = () => {
  authStore = {
    accessToken: null,
    logout: null,
  };
};
