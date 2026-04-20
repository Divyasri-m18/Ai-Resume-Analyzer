import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const getAuthorizedConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, getAuthorizedConfig }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
