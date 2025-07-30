// src/navigation/MainNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MainStackParamList, AuthStackParamList } from "../types/navigation";
import HomeScreen from "../screens/Chat/HomeScreen";
import ChatSettingsScreen from "../screens/Settings/ChatSettingsScreen";
import ChatRoomScreen from "../screens/Chat/ChatRoomScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import NotificationsAndSoundsScreen from "../screens/Settings/NotificationsAndSoundsScreen";
import ContactsScreen from "../screens/Contacts/ContactsScreen";
import CallsScreen from "../screens/Contacts/CallsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import AccountScreen from "../screens/Profile/AccountScreen";
import PrivacyAndSecurityScreen from "../screens/Settings/PrivacyAndSecurityScreen";
import ForwardMessageScreen from "../screens/Chat/ForwardMessageScreen";
import SavedMessagesScreen from "../screens/Chat/SavedMessagesScreen";
import PinnedMessagesScreen from "../screens/Chat/PinnedMessagesScreen";
import MediaSharedScreen from "../screens/Chat/MediaSharedScreen";
import ConfirmationScreen from "../screens/Other/ConfirmationScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DataAndStorageScreen from "../screens/Settings/DataAndStorageScreen";
import DevicesScreen from "../screens/Settings/DevicesScreen";
import LanguageScreen from "../screens/Settings/LanguageScreen";
import ThemeScreen from "../screens/Settings/ThemeScreen";
import ChatFoldersScreen from "../screens/Settings/ChatFoldersScreen";
import InviteFriendsScreen from "../screens/Contacts/InviteFriendsScreen";
import AddContactScreen from "../screens/Contacts/AddContactScreen";
import ContactProfileScreen from "../screens/Contacts/ContactProfileScreen";
import RecentCallsScreen from "../screens/Contacts/RecentCallsScreen";
import CallInfoScreen from "../screens/Contacts/CallInfoScreen";
import GlobalSearchScreen from "../screens/Search/GlobalSearchScreen";
import InChatSearchScreen from "../screens/Search/InChatSearchScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import BlockedUsersScreen from "../screens/Profile/BlockedUsersScreen";
import ChatFolderViewScreen from "../screens/Other/ChatFolderViewScreen";
import NewGroupScreen from "../screens/Other/NewGroupScreen";
import GroupInfoScreen from "../screens/Other/GroupInfoScreen";
import InviteToGroupScreen from "../screens/Other/InviteToGroupScreen";
import NewChannelScreen from "../screens/Other/NewChannelScreen";
import ChannelInfoScreen from "../screens/Other/ChannelInfoScreen";
import JoinRequestsScreen from "../screens/Other/JoinRequestsScreen";
import PowerSavingScreen from "../screens/Settings/PowerSavingScreen";
import StoryShowScreen from "../screens/Chat/StoryShowScreen";
import AddStoryScreen from "../screens/Chat/AddStoryScreen";
import CameraScreen from "../screens/Chat/CameraScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: true,
      animation: "slide_from_right",
      headerStyle: {
        backgroundColor: "#dc143c",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
    }}
  >
    <Stack.Screen
      name="Home"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ChatRoom" 
      component={ChatRoomScreen}
      options={({ route, navigation }) => ({
        title: route.params?.chatName || 'Chat',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ChatSettings"
      component={ChatSettingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Privacy" component={PrivacyAndSecurityScreen} />
    <Stack.Screen
      name="Notifications"
      component={NotificationsAndSoundsScreen}
    />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen
      name="Contacts"
      component={ContactsScreen}
      options={{
        title: "Contacts",
        headerShown: false,
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Search contacts")}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen name="Calls" component={CallsScreen} />
    <Stack.Screen name="ForwardMessage" component={ForwardMessageScreen} />
    <Stack.Screen name="SavedMessages" component={SavedMessagesScreen} />
    <Stack.Screen name="PinnedMessages" component={PinnedMessagesScreen} />
    <Stack.Screen name="MediaShared" component={MediaSharedScreen} />
    <Stack.Screen
      name="Confirmation"
      component={ConfirmationScreen}
      options={{ title: "Confirm" }}
    />
    <Stack.Screen name="DataAndStorage" component={DataAndStorageScreen} />
    <Stack.Screen name="Devices" component={DevicesScreen} />
    <Stack.Screen name="Language" component={LanguageScreen} />
    <Stack.Screen name="Theme" component={ThemeScreen} />
    <Stack.Screen name="ChatFolders" component={ChatFoldersScreen} />
    <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
    <Stack.Screen name="AddContact" component={AddContactScreen} />
    <Stack.Screen name="ContactProfile" component={ContactProfileScreen} />
    <Stack.Screen name="RecentCalls" component={RecentCallsScreen} />
    <Stack.Screen name="CallInfo" component={CallInfoScreen} />
    <Stack.Screen name="GlobalSearch" component={GlobalSearchScreen} />
    <Stack.Screen name="InChatSearch" component={InChatSearchScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
    <Stack.Screen name="ChatFolderView" component={ChatFolderViewScreen} />
    <Stack.Screen name="NewGroup" component={NewGroupScreen} />
    <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
    <Stack.Screen name="InviteToGroup" component={InviteToGroupScreen} />
    <Stack.Screen name="NewChannel" component={NewChannelScreen} />
    <Stack.Screen name="ChannelInfo" component={ChannelInfoScreen} />
    <Stack.Screen name="JoinRequests" component={JoinRequestsScreen} />
    <Stack.Screen name="PowerSaving" component={PowerSavingScreen} />
    <Stack.Screen name="StoryShow" component={StoryShowScreen} />
    <Stack.Screen name="AddStory" component={AddStoryScreen} />
    <Stack.Screen 
      name="Camera" 
      component={CameraScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;
