import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (user: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    loadAuth();
  }, []);

  const login = async (user: any, token: string) => {
    setUser(user);
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 