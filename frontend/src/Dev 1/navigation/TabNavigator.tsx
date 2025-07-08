import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsScreen from '../screens/Chat/ChatsScreen';
import ChatDetailsScreen from '../screens/Chat/ChatDetailsScreen';
import CallsScreen from '../screens/Contacts/CallsScreen';
import ContactsScreen from '../screens/Contacts/ContactsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const ChatsStack = createNativeStackNavigator();

function ChatsStackScreen() {
  return (
    <ChatsStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="Chats" component={ChatsScreen} />
      <ChatsStack.Screen name="ChatDetails" component={ChatDetailsScreen} />
    </ChatsStack.Navigator>
  );
}

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        if (route.name === 'ChatsTab') {
          iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        } else if (route.name === 'Calls') {
          iconName = focused ? 'call' : 'call-outline';
        } else if (route.name === 'Contacts') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }
        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarLabel:
        route.name === 'ChatsTab'
          ? 'Chats'
          : route.name,
    })}
  >
    <Tab.Screen name="ChatsTab" component={ChatsStackScreen} options={{ tabBarLabel: 'Chats' }} />
    <Tab.Screen name="Calls" component={CallsScreen} />
    <Tab.Screen name="Contacts" component={ContactsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default TabNavigator; 