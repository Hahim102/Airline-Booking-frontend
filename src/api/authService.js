import apiClient from './apiClient';

const AUTH_API = '/auth';
const ACCESS_TOKEN_STORAGE_KEY = 'airline.accessToken';


export const authService = {
  login: async (email, password, captchaToken) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/login`, {
        email,
        password,
        captchaToken,
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  confirmResetPassword: async (email, otp) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/confirm-reset-password`, {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
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
      console.error('Register error:', error);
      throw error;
    }
  },
  
  verifyOtp: async (email, otp) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/verify-otp`, {
        email,
        otp,
      });

      return response.data;
    } catch (error) {
      console.error("Verify OTP error:", error);
      throw error;
    }
  },

  confirmResetPasswordIntent: async (email, otp) => {
    try {
      const response = await apiClient.post(`${AUTH_API}/confirm-reset-password-intent`, {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error("Confirm reset password intent error:", error);
      throw error;
    }
  },


  logout: async () => {
    try {
      await apiClient.post(`${AUTH_API}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },


  refresh: async () => {
    try {
      const response = await apiClient.post(`${AUTH_API}/refresh`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 ||
        error.response?.status === 403) {

        return null;
      }

      console.error("Token refresh error:", error);

      return null;
  }
 },


  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
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
