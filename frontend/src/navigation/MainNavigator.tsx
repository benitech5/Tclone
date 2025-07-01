// src/navigation/MainNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import ChatsScreen from '../screens/ChatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName="Chats"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="Chats" component={ChatsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen
      name="ChatSettings"
      component={ChatSettingsScreen}
      options={{
        headerShown: true,
        title: 'Chat Settings',
        headerStyle: { backgroundColor: '#0088cc' },
        headerTintColor: '#fff',
      }}
    />
    <Stack.Screen name="Privacy" component={PrivacyScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);