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
  Home: undefined;
  Chats: undefined;
  Settings: undefined;
  ChatSettings: undefined;
  Privacy: undefined;
  Notifications: undefined;
  Profile: undefined;
  Account: undefined;
  ChatDetails: { chatId: string };
  ForwardMessage: undefined;
  SavedMessages: undefined;
  PinnedMessages: undefined;
  MediaShared: undefined;
  Confirmation: { message: string; onConfirm: () => void; onCancel?: () => void };
  Contacts: undefined;
  Calls: undefined;
  DataAndStorage: undefined;
  Devices: undefined;
  Language: undefined;
  Theme: undefined;
  ChatFolders: undefined;
  InviteFriends: undefined;
  AddContact: undefined;
  ContactProfile: undefined;
  RecentCalls: undefined;
  CallInfo: undefined;
  GlobalSearch: undefined;
  InChatSearch: undefined;
  EditProfile: undefined;
  BlockedUsers: undefined;
  ChatFolderView: undefined;
  NewGroup: undefined;
  GroupInfo: undefined;
  InviteToGroup: undefined;
  NewChannel: undefined;
  ChannelInfo: undefined;
  JoinRequests: undefined;
};