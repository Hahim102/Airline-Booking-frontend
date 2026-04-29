import { createContext, useState, useCallback, useEffect } from 'react';
import apiClient, { setAuthStore } from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { accessToken, roles } = response.data;

      setAccessToken(accessToken);
      setUser({ roles });

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, fullName, phone) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        fullName,
        phone,
        role: 'ROLE_USER', // Register as customer only
        lastLoginAt: new Date().toISOString(),
      });

      const { accessToken, roles } = response.data;

      setAccessToken(accessToken);
      setUser({ roles });

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);


    const logout = useCallback(async () => {
      setAccessToken(null);
      setUser(null);
      setError(null);

      try {
        await apiClient.post('/auth/logout', {}, {
          withCredentials: true,
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }, []);


  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || false;
  }, [user]);


  const hasAnyRole = useCallback((roles) => {
    return roles.some(role => user?.roles?.includes(role)) || false;
  }, [user]);


  useEffect(() => {
    setAuthStore({
      accessToken,
      logout,
    });
  }, [accessToken, logout]);


  useEffect(() => {

    setIsLoading(false);
  }, []);

  const value = {
    user,
    accessToken,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
