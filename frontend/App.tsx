import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from '../frontend/src/screens/splashscreen'; // Your custom splash
import MainApp from './src/MainApp'; // Your main app logic

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading (fonts, API calls, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync(); // Hide native splash
      }
    }
    prepare();
  }, []);

  // Show your custom splash until app is ready
  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return <MainApp />; // Switch to main app
}