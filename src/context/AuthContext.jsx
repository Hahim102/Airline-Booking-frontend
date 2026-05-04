import { createContext, useState, useCallback, useEffect} from 'react';
import apiClient, { setAuthStore } from '../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

      setUser(user);

      setAuthStore({
        accessToken: token,
        logout,
      });


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
      });


      console.log(response.data);

      const { token, user } = response.data;
      

      setAccessToken(token);
      setUser(user);
      
      setAuthStore({
        accessToken: token,
        logout,
      });


      const me = await apiClient.get('/users/me',);

      setUser(me.data);

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
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setError(null);
    }
  }, []);


  const hasRole = useCallback((role) => {
    return user?.role?.includes(role) || false;
  }, [user]);


  const hasAnyRole = useCallback((roles) => {
    return roles?.some(role => user?.role?.includes(role)) || false;
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
        setUser(null);
      }
    };

    fetchMe();
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) return;

    const fetchMe = async () => {
      try {
        const refreshRes = await apiClient.post("/auth/refresh");
        const token = refreshRes.data.token;

        setAccessToken(token);

        setAuthStore({
          accessToken: token,
          logout,
        });

      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
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
