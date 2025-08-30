import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import type { User, AuthResponse, LoginResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  verifyLoginOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
    } catch (error) {
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

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOTP, verifyLoginOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};