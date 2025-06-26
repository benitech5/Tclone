// src/navigation/types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    Onboarding: undefined;
    PhoneNumber: undefined;
    Email: undefined;
    ConfirmationCode: { email: string };
    TwoStepVerification: undefined;
    Login: undefined;
    Otp: { phoneNumber: string };
};

export type SettingsStackParamList = {
    ProfileSettings: undefined;
    AccountSettings: undefined;
    ChatSettings: undefined;
    NotificationSettings: undefined;
    Help: undefined;
    PrivacyPolicy: undefined;
    PrivacySettings: undefined;
    SecuritySettings: undefined;
};

export type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
    Contacts: undefined;
    Chat: { chatId: string; chatName: string };
    NewChat: undefined;
    Calls: undefined;
    StoryViewer: { userId: string };
    // Integrating other stacks
    Auth: { screen: keyof AuthStackParamList };
    Settings: { screen: keyof SettingsStackParamList };
    Logout: undefined; // For handling logout action
};

// Define the navigation prop type for the RootStack
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
