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
    Onboarding: undefined;
    Login: undefined;
    Otp: { phone: string };
    Home: undefined;
    ChatList: undefined;
    Chat: { chatId: string };
    Contacts: undefined;
    Profile: undefined;
    EditProfile: undefined;
    NewContact: undefined;
    GroupInfo: { groupId: string };
    ChannelInfo: { channelId: string };
    UserProfile: { userId: string };
    NewStory: undefined;
    MessageActionsPopup: { messageId: string };
    NotificationSettings: undefined;
    PrivacySettings: undefined;
    SecuritySettings: undefined;
    DataAndStorageSettings: undefined;
    AppearanceSettings: undefined;
    LanguageSettings: undefined;
};

// Define the navigation prop type for the RootStack
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
