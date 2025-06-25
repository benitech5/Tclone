import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AuthProvider } from './store/AuthContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for notifications!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
      // TODO: Send token to backend for this user
    };
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
} 