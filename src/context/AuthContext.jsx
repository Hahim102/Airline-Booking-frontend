import { createContext, useState, useCallback, useEffect} from 'react';
import apiClient, { setAuthStore } from '../api/apiClient';

export const AuthContext = createContext(null);

const ACCESS_TOKEN_STORAGE_KEY = 'airline.accessToken';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Track app initialization
  const [error, setError] = useState(null);


  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {

      const response = await apiClient.post('/auth/login', {
        email,
        password,
      },);


      console.log("🔥 LOGIN RESPONSE:", response.data);

      const { token, user } = response.data;

      console.log("🔥 ROLE:", user.role);

      setAccessToken(token);
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);

      setUser(user);

      setAuthStore({
        accessToken: token,
        logout,
      });


      return { success: true, user };
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
      });


      console.log(response.data);

      const { token, user } = response.data;
      

      setAccessToken(token);
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      setUser(user);
      
      setAuthStore({
        accessToken: token,
        logout,
      });


      const me = await apiClient.get('/users/me',);

      setUser(me.data);

      return { success: true, user: me.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      setAccessToken(null);
      setUser(null);
      setError(null);
    }
  }, []);



  const hasRole = useCallback((role) => {
    if (!user?.role) return false;
    if (typeof user.role === 'string') {
      return user.role.includes(role);
    }
    return Array.isArray(user.role) ? user.role.includes(role) : false;
  }, [user]);


  const hasAnyRole = useCallback((roles) => {
    if (!user?.role || !Array.isArray(roles)) return false;
    // Handle both string and array formats for user.role
    const userRoles = typeof user.role === 'string' ? user.role.split(',').map(r => r.trim()) : user.role;
    return roles.some(role => userRoles.includes(role));
  }, [user]);

  useEffect(() => {
    setAuthStore({
      accessToken,
      logout,
    });
  },[accessToken, logout]);



  useEffect(() => {
    if (!accessToken) return;

    const fetchMe = async () => {
      try {
        const meRes = await apiClient.get('/users/me');
        setUser(meRes.data);
      } catch (err) {
        console.error('Fetch /users/me failed:', err);
        setUser(null);
      }
    };

    fetchMe();
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) return;

    const fetchMe = async () => {
      try {
        const storedToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
        if (storedToken) {
          setAccessToken(storedToken);
          setAuthStore({
            accessToken: storedToken,
            logout,
          });

          const meRes = await apiClient.get('/users/me');
          setUser(meRes.data);
          return;
        }

        const refreshRes = await apiClient.post("/auth/refresh");
        const token = refreshRes.data.token;

        setAccessToken(token);
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);

        setAuthStore({
          accessToken: token,
          logout,
        });

        const meRes = await apiClient.get('/users/me');
        setUser(meRes.data);

      } catch (err) {
        console.log('No active session - user needs to login', err);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchMe();
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
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
