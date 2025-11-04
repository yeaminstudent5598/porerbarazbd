// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser } from '@/modules/user/user.interface'; // User interface ইম্পোর্ট করুন

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean; // লোডিং স্টেট (Hydration-এর জন্য)
  login: (userData: IUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // পেজ লোড হলে localStorage থেকে টোকেন লোড করার চেষ্টা
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse auth data from localStorage", e);
      localStorage.clear(); // ভুল ডেটা থাকলে ক্লিয়ার করুন
    }
    setIsLoading(false); // লোডিং শেষ
  }, []);

  const login = (userData: IUser, token: string) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // TODO: ইউজারকে লগইন পেজে রিডাইরেক্ট করুন
    // window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// কাস্টম হুক
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};