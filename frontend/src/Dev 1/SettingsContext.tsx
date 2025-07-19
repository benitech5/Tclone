import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatSettings {
  messageSize: number;
  messageCorner: number;
}

interface DataAndStorageSettings {
  autoDownloadMobileData: boolean;
  autoDownloadWifi: boolean;
  autoDownloadRoaming: boolean;
  saveToGalleryPrivate: boolean;
  saveToGalleryGroups: boolean;
  saveToGalleryChannels: boolean;
  streaming: boolean;
}

interface SettingsContextType {
  chatSettings: ChatSettings;
  updateMessageSize: (size: number) => void;
  updateMessageCorner: (corner: number) => void;
  dataAndStorageSettings: DataAndStorageSettings;
  updateDataAndStorageSetting: (key: keyof DataAndStorageSettings, value: boolean) => void;
  resetDataAndStorageSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: ChatSettings = {
  messageSize: 16,
  messageCorner: 17,
};

const defaultDataAndStorageSettings: DataAndStorageSettings = {
  autoDownloadMobileData: false,
  autoDownloadWifi: false,
  autoDownloadRoaming: false,
  saveToGalleryPrivate: false,
  saveToGalleryGroups: false,
  saveToGalleryChannels: false,
  streaming: true,
};

const SettingsContext = createContext<SettingsContextType>({
  chatSettings: defaultSettings,
  updateMessageSize: () => {},
  updateMessageCorner: () => {},
  dataAndStorageSettings: defaultDataAndStorageSettings,
  updateDataAndStorageSetting: () => {},
  resetDataAndStorageSettings: () => {},
  isLoading: true,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [chatSettings, setChatSettings] = useState<ChatSettings>(defaultSettings);
  const [dataAndStorageSettings, setDataAndStorageSettings] = useState<DataAndStorageSettings>(defaultDataAndStorageSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedChatSettings = await AsyncStorage.getItem('chatSettings');
      if (savedChatSettings) {
        const parsedSettings = JSON.parse(savedChatSettings);
        setChatSettings(parsedSettings);
      }
      const savedDataAndStorageSettings = await AsyncStorage.getItem('dataAndStorageSettings');
      if (savedDataAndStorageSettings) {
        const parsedDataSettings = JSON.parse(savedDataAndStorageSettings);
        setDataAndStorageSettings(parsedDataSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
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

  const saveDataAndStorageSettings = async (newSettings: DataAndStorageSettings) => {
    try {
      await AsyncStorage.setItem('dataAndStorageSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving data and storage settings:', error);
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

  const updateDataAndStorageSetting = (key: keyof DataAndStorageSettings, value: boolean) => {
    const newSettings = { ...dataAndStorageSettings, [key]: value };
    setDataAndStorageSettings(newSettings);
    saveDataAndStorageSettings(newSettings);
    // Example: What should happen when toggles are true/false
    switch (key) {
      case 'saveToGalleryPrivate':
      case 'saveToGalleryGroups':
      case 'saveToGalleryChannels':
        // If true: Media is saved to gallery. If false: Media is not saved.
        // Implement actual media handling logic elsewhere in the app.
        break;
      case 'autoDownloadMobileData':
      case 'autoDownloadWifi':
      case 'autoDownloadRoaming':
        // If true: Media auto-downloads under that condition. If false: User must manually download.
        break;
      case 'streaming':
        // If true: Stream videos/audio directly. If false: Require full download before playback.
        break;
      default:
        break;
    }
  };

  const resetDataAndStorageSettings = () => {
    setDataAndStorageSettings(defaultDataAndStorageSettings);
    saveDataAndStorageSettings(defaultDataAndStorageSettings);
    // Reset logic: All toggles to default values
  };

  return (
    <SettingsContext.Provider
      value={{
        chatSettings,
        updateMessageSize,
        updateMessageCorner,
        dataAndStorageSettings,
        updateDataAndStorageSetting,
        resetDataAndStorageSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext); 