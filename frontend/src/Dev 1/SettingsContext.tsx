import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatSettings {
  messageSize: number;
  messageCorner: number;
}

interface SettingsContextType {
  chatSettings: ChatSettings;
  updateMessageSize: (size: number) => void;
  updateMessageCorner: (corner: number) => void;
  isLoading: boolean;
}

const defaultSettings: ChatSettings = {
  messageSize: 16,
  messageCorner: 17,
};

const SettingsContext = createContext<SettingsContextType>({
  chatSettings: defaultSettings,
  updateMessageSize: () => {},
  updateMessageCorner: () => {},
  isLoading: true,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [chatSettings, setChatSettings] = useState<ChatSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('chatSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setChatSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading chat settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: ChatSettings) => {
    try {
      await AsyncStorage.setItem('chatSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving chat settings:', error);
    }
  };

  const updateMessageSize = (size: number) => {
    const newSettings = { ...chatSettings, messageSize: size };
    setChatSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateMessageCorner = (corner: number) => {
    const newSettings = { ...chatSettings, messageCorner: corner };
    setChatSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        chatSettings,
        updateMessageSize,
        updateMessageCorner,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext); 