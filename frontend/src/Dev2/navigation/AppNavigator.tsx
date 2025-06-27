// src/navigation/AppNavigator.ts

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/loginScreen';
import OtpScreen from '../screens/otpScreen';
import HomeScreen from '../screens/homeScreen';
import ChatListScreen from '../screens/chatListScreen';
import ChatScreen from '../screens/chatScreen';
import ContactsScreen from '../screens/contactsScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NewContactScreen from '../screens/NewContactScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import ChannelInfoScreen from '../screens/ChannelInfoScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import NewStoryScreen from '../screens/NewStoryScreen';
import MessageActionsPopup from '../screens/MessageActionsPopup';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';
import DataAndStorageSettingsScreen from '../screens/DataAndStorageSettingsScreen';
import AppearanceSettingsScreen from '../screens/AppearanceSettingsScreen';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import { RootStackParamList } from './Types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Profile" component={ProfileSettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="NewContact" component={NewContactScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="ChannelInfo" component={ChannelInfoScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="NewStory" component={NewStoryScreen} />
      <Stack.Screen name="MessageActionsPopup" component={MessageActionsPopup} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
      <Stack.Screen name="DataAndStorageSettings" component={DataAndStorageSettingsScreen} />
      <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
