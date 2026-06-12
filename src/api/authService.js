import apiClient from './apiClient';

const AUTH_API = '/auth';
const ACCESS_TOKEN_STORAGE_KEY = 'airline.accessToken';


const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};


export const authService = {
  login: async (email, password, captchaToken) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/login`, {
        email,
        password,
        captchaToken,
      });

      console.log('Login response:', response.data.data);

      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed'));
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/forgot-password`, {
        email,
      });
      return response.data.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error(getApiErrorMessage(error, 'Forgot password failed'));
    }
  },

  resendForgotPasswordOtp: async (email) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/resend-forgot-password-otp`, {
        email,
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to resend forgot password OTP'));
    }
  },

  resetPassword: async (email, newPassword) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/reset-password`, {
        email,
        newPassword,
      });
      return response.data.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(getApiErrorMessage(error, 'Reset password failed'));
    }
  },

  confirmResetPassword: async (email, otp) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/confirm-reset-password`, {
        email,
        otp,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Confirm OTP failed'));
    }
  },


  register: async (email, password, fullName, phone, captchaToken) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/register`, {
        email,
        password,
        fullName,
        phone,
        captchaToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration failed'));
    }
  },

  createUser: async (userData) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/admin/create-user`,
          userData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  verifyOtp: async (email, otp) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/verify-otp`, {
        email,
        otp,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'OTP verification failed'));
      throw error;
    }
  },

  resendVerifyOtp: async (email) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/resend-verify-otp`, {
        email,
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to resend OTP'));
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post(`${AUTH_API}/logout`);
      return response.data.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(getApiErrorMessage(error, 'Logout failed'));
    }
  },


  refresh: async () => {
    try {
      const response = await apiClient.post(`${AUTH_API}/refresh`, {}, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Token refresh failed'));
  }
 },


  updatePassword: async (userId, currentPassword, newPassword) => {
    try {
      const response = await apiClient.put(`${AUTH_API}/update-password?userId=${userId}`, {
        currentPassword,
        newPassword,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to update password'));
    }
  },
};


export const tokenStorage = {
  setToken: (token) => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  },


  getToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  },


  removeToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  },


  hasToken: () => {
    return !!localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  },

  setUser: (user) => {
    localStorage.setItem('airline.user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('airline.user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem('airline.user');
  },
};


export const authHelpers = {

  hasRole: (user, role) => {
    if (!user?.role) return false;
    if (typeof user.role === 'string') {
      return user.role === role;
    }
    return Array.isArray(user.role) ? user.role.includes(role) : false;
  },


  hasAnyRole: (user, roles) => {
    if (!user?.role || !Array.isArray(roles)) return false;
    const userRoles = typeof user.role === 'string' 
      ? user.role.split(',').map(r => r.trim()) 
      : user.role;
    return roles.some(role => userRoles.includes(role));
  },


  isAuthenticated: (user) => {
    return !!user;
  },
};
