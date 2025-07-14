import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightTheme = {
  mode: 'light',
  background: '#fff',
  text: '#222',
  accent: '#e53935',
  card: '#f5f5f5',
  border: '#eee',
  subtext: '#888',
  buttonBg: '#ffeaea',
  buttonText: '#e53935',
};

const darkTheme = {
  mode: 'dark',
  background: '#232634',
  text: '#fff',
  accent: '#e53935',
  card: '#2a2d3a',
  border: '#2a2d3a',
  subtext: '#bbb',
  buttonBg: '#31344b',
  buttonText: '#fff',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
  isDarkMode: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from AsyncStorage on app start
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme === 'dark') {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('themeMode', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme.mode === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
    saveTheme(newTheme.mode === 'dark');
  };

  if (isLoading) {
    // Return a loading state or default theme while loading
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isDarkMode: theme.mode === 'dark' 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 