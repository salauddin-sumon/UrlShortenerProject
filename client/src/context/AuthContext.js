import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';

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
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { user, accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    const { user, accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    const response = await api.patch('/api/auth/profile', data);
    const updatedUser = response.data.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};