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
  ProfileSetup: { phoneNumber: string };
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
  ChatRoom: { chatId: string; chatName: string };
  ChatDetails: { chatId: string };
  CallScreen: { callId: string; callerName: string; callType: 'audio' | 'video'; isIncoming: boolean };
  CallHistory: undefined;
  GroupChat: { groupId: string; groupName: string };
  MediaGallery: { chatId: string; chatName: string };
  Search: undefined;
  VoiceMessage: { chatId: string; chatName: string };
  InviteToGroup: { groupId: string };
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
  ChatFolders: undefined;
  InviteFriends: { groupId?: string; groupName?: string };
  AddContact: undefined;
  ContactProfile: { contactId: string };
  RecentCalls: undefined;
  CallInfo: undefined;
  GlobalSearch: undefined;
  InChatSearch: undefined;
  EditProfile: undefined;
  BlockedUsers: undefined;
  ChatFolderView: undefined;
  NewGroup: undefined;
  GroupInfo: { groupId: string };
  NewChannel: undefined;
  ChannelInfo: undefined;
  JoinRequests: undefined;
  PowerSaving: undefined;
};