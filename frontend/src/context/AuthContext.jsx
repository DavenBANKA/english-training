import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = apiService.getAuthToken();
      if (token) {
        const response = await apiService.getProfile();
        if (response.success) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await apiService.login(email, password);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (email, password, full_name) => {
    const response = await apiService.register(email, password, full_name);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continuer la déconnexion même si l'API échoue
    } finally {
      // Toujours nettoyer localement
      apiService.removeAuthToken();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
