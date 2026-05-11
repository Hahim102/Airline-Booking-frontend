import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { authService, tokenStorage, authHelpers } from '../api/authService';
import { setAuthStore, clearAuthStore } from '../api/authStore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const hasInitialized = useRef(false);
  const refreshIntervalRef = useRef(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  const isTokenExpired = useCallback((token) => {
    try {
      if (!token) return true;
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload?.exp) return true;
      return payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }, []);

  const login = useCallback(async (email, password, captchaToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password, captchaToken);
      const { accessToken, user: userData } = response;

      setAccessToken(accessToken);
      tokenStorage.setToken(accessToken);
      setUser(userData);

      setAuthStore({
        accessToken: accessToken,
        logout,
      });

      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);


  const register = useCallback(async (email, password, fullName, phone, captchaToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(email, password, fullName, phone, captchaToken);
      const { accessToken, user: userData } = response;

      setAccessToken(accessToken);
      tokenStorage.setToken(accessToken);
      setUser(userData);

      setAuthStore({
        accessToken: accessToken,
        logout,
      });


      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      return { success: true, user: currentUser };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);


  const logout = useCallback(async ({ server = true } = {}) => {
    try {
      if (server) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      tokenStorage.removeToken();
      setAccessToken(null);
      setUser(null);
      setError(null);
      clearAuthStore();
    }
  }, []);


  const hasRole = useCallback((role) => {
    return authHelpers.hasRole(user, role);
  }, [user]);


  const hasAnyRole = useCallback((roles) => {
    return authHelpers.hasAnyRole(user, roles);
  }, [user]);


  useEffect(() => {
    setAuthStore({
      accessToken,
      logout,
    });
  }, [accessToken, logout]);


  useEffect(() => {
    if (!accessToken) return;

    const fetchMe = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Fetch current user failed:', err);
        setUser(null);
      }
    };

    fetchMe();
  }, [accessToken]);


  useEffect(() => {
    if (accessToken) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async () => {
      try {
        const storedToken = tokenStorage.getToken();
        if (storedToken && !isTokenExpired(storedToken)) {
          setAccessToken(storedToken);
          setAuthStore({
            accessToken: storedToken,
            logout,
          });

          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            return;
          } catch (meError) {
            if (
              meError.response?.status === 401 ||
              meError.response?.status === 403 ||
              meError.response?.status === 500
            ) {
              tokenStorage.removeToken();
              setAccessToken(null);
            } else {
              throw meError;
            }
          }
        } else if (storedToken) {
          tokenStorage.removeToken();
        }
        

        let refreshResponse = null;

        try {
          refreshResponse = await authService.refresh();
        } catch {
          refreshResponse = null;
        }

        if (!refreshResponse?.accessToken) {
          setUser(null);
          return;
        }

        const { accessToken } = refreshResponse;

        setAccessToken(accessToken);
        tokenStorage.setToken(accessToken);

        setAuthStore({
          accessToken: accessToken,
          logout,
        });

        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.log('No active session - user needs to login', err);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    setUser,
    accessToken,
    isInitializing,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: authHelpers.isAuthenticated(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
