// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList, AuthStackParamList } from '../types/navigation';
import ChatsScreen from '../screens/Chat/ChatsScreen';
import ChatSettingsScreen from '../screens/Chat/ChatSettingsScreen';
import ChatDetailsScreen from '../screens/Chat/ChatDetailsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Settings/NotificationsScreen';
import ContactsScreen from '../screens/Contacts/ContactsScreen';
import CallsScreen from '../screens/Contacts/CallsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AccountScreen from '../screens/Profile/AccountScreen';
import PrivacyScreen from '../screens/Profile/PrivacyScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
    <Stack.Screen name="Contacts" component={ContactsScreen} />
    <Stack.Screen name="Calls" component={CallsScreen} />
  </Stack.Navigator>
);

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;