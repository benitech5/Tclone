// src/navigation/AppNavigator.ts

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, SettingsStackParamList } from './Types';
import HomeScreen from '../screens/homeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContactsScreen from '../screens/contactsScreen';
import ChatScreen from '../screens/chatScreen';
import NewChatScreen from '../screens/NewChatScreen';
import CallsScreen from '../screens/CallsScreen';

// Import the new settings screens
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import HelpScreen from '../screens/HelpScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';
import StoryViewerScreen from '../screens/StoryViewerScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

// A separate navigator for the settings section
function SettingsNavigator() {
    return (
        <SettingsStack.Navigator screenOptions={{ headerShown: true, headerTitleStyle: { fontWeight: 'bold' } }}>
            <SettingsStack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ title: 'Settings' }} />
            <SettingsStack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: 'Account' }} />
            <SettingsStack.Screen name="ChatSettings" component={ChatSettingsScreen} options={{ title: 'Chats' }} />
            <SettingsStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
            <SettingsStack.Screen name="Help" component={HelpScreen} options={{ title: 'Help' }} />
            <SettingsStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{ title: 'Privacy' }} />
            <SettingsStack.Screen name="SecuritySettings" component={SecuritySettingsScreen} options={{ title: 'Security' }} />
        </SettingsStack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Home" component={HomeScreen} />
            <RootStack.Screen name="Profile" component={ProfileScreen} />
            <RootStack.Screen name="Contacts" component={ContactsScreen} />
            <RootStack.Screen name="Chat" component={ChatScreen} />
            <RootStack.Screen name="NewChat" component={NewChatScreen} />
            <RootStack.Screen name="Calls" component={CallsScreen} />
            {/* Nest the Settings Navigator */}
            <RootStack.Screen name="Settings" component={SettingsNavigator} />
            {/* Add the Story Viewer as a modal */}
            <RootStack.Screen 
                name="StoryViewer" 
                component={StoryViewerScreen} 
                options={{ presentation: 'modal' }}
            />
        </RootStack.Navigator>
    );
}
