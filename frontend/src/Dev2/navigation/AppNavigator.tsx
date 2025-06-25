// src/navigation/AppNavigator.ts

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './Types';
import HomeScreen from '../screens/homeScreen';
import DrawerMenuScreen from '../screens/DrawerMenuScreen';
import ContactsScreen from '../screens/contactsScreen';
import ChatListScreen from '../screens/chatListScreen';
import ChatScreen from '../screens/chatScreen';
import StoriesListScreen from '../screens/StoriesListScreen';
import MainChatListScreen from '../screens/MainChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CallsScreen from '../screens/CallsScreen';
import NewChatScreen from '../screens/NewChatScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Home" component={HomeScreen} />
            <AppStack.Screen name="DrawerMenu" component={DrawerMenuScreen} />
            <AppStack.Screen name="Contacts" component={ContactsScreen} />
            <AppStack.Screen name="ChatList" component={ChatListScreen} />
            <AppStack.Screen name="Chat" component={ChatScreen} />
            <AppStack.Screen name="StoriesList" component={StoriesListScreen} />
            <AppStack.Screen name="MainChatList" component={MainChatListScreen} />
            <AppStack.Screen name="Profile" component={ProfileScreen} />
            <AppStack.Screen name="Calls" component={CallsScreen} />
            <AppStack.Screen name="NewChat" component={NewChatScreen} />
        </AppStack.Navigator>
    );
}
