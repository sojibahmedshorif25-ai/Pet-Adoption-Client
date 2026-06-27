import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  };

  const googleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const base = API_URL ? `${API_URL}` : window.location.origin;
    window.location.href = `${base}/api/auth/google`;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
