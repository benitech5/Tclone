// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  PhoneLogin: undefined;
  Register: undefined;
  Otp: { phoneNumber: string };
};

export type MainStackParamList = {
  Chats: undefined;
  Settings: undefined;
  ChatSettings: undefined;
  Privacy: undefined;
  Notifications: undefined;
  Profile: undefined;
  Account: undefined;
  ChatDetails: { chatId: string };
  // Add other screens as needed
};