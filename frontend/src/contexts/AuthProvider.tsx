import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import type { User, AuthResponse, LoginResponse } from '../types';
import { AuthContext, type AuthContextType } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  };

  const verifyLoginOTP = async (email: string, otp: string) => {
    const response = await api.post<AuthResponse>('/auth/verify-login-otp', { email, otp });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
  };

  const signup = async (email: string, password: string) => {
    await api.post('/auth/signup', { email, password });
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    verifyOTP,
    verifyLoginOTP,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};