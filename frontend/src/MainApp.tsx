import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import ChatsScreen from './screens/ChatsScreen';
import ContactsScreen from './screens/ContactsScreen';
import ChatDetailsScreen from './screens/ChatDetailsScreen';
import CallsScreen from './screens/CallsScreen'; // Add this later
import SettingsScreen from './screens/SettingsScreen'; // Add this later

// Types for TypeScript
type RootStackParamList = {
    HomeTabs: undefined;
    ChatDetails: { chatId: string };
};

type HomeTabsParamList = {
    Chats: undefined;
    Calls: undefined;
    Contacts: undefined;
    Settings: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabsParamList>();

// Tab Navigator (Main Interface)
function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Chats':
                            iconName = 'chatbubbles';
                            break;
                        case 'Calls':
                            iconName = 'call';
                            break;
                        case 'Contacts':
                            iconName = 'people';
                            break;
                        case 'Settings':
                            iconName = 'settings';
                            break;
                        default:
                            iconName = 'chatbubbles';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0088cc',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Chats" component={ChatsScreen} />
            <Tab.Screen name="Calls" component={CallsScreen} />
            <Tab.Screen name="Contacts" component={ContactsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

// Main App Navigator
export default function MainApp() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="HomeTabs"
                    component={HomeTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChatDetails"
                    component={ChatDetailsScreen}
                    options={({ route }) => ({
                        title: `Chat ${route.params.chatId}`,
                        headerBackTitle: 'Back',
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}