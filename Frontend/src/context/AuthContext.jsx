import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store authenticated user information ({ id, username, email, role })
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spotify_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error message helper
  const clearError = () => setError(null);

  // Register function
  const register = async ({ username, email, password, role }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        role: role || 'user',
      });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('spotify_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        username: username || undefined,
        email: email || undefined,
        password,
      });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('spotify_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please check your inputs.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('spotify_user');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
