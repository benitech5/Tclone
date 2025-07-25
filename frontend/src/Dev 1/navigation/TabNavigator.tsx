import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/Chat/HomeScreen';
import CallsScreen from '../screens/Contacts/CallsScreen';
import ContactsScreen from '../screens/Contacts/ContactsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import RecentCallsScreen from '../screens/Contacts/RecentCallsScreen';
import CallInfoScreen from '../screens/Contacts/CallInfoScreen';
import InviteFriendsScreen from '../screens/Contacts/InviteFriendsScreen';
import AddContactScreen from '../screens/Contacts/AddContactScreen';
import ContactProfileScreen from '../screens/Contacts/ContactProfileScreen';
import SavedMessagesScreen from '../screens/Chat/SavedMessagesScreen';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logout } from '../store/authSlice';
import { useTheme } from '../ThemeContext';

// Placeholder for Orbixa Features
const OrbixaFeaturesScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.text }]}>Orbixa Features (Placeholder)</Text>
    </View>
  );
};

// Placeholder for Add Account
const AddAccountScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.text }]}>Add Account (Placeholder)</Text>
    </View>
  );
};

// Placeholder for My Profile
const MyProfileScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.text }]}>My Profile (Placeholder)</Text>
    </View>
  );
};

// Placeholder for New Group
const NewGroupScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.text }]}>New Group (Placeholder)</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  
  const handleLogout = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      let rootNav = props.navigation;
      if (rootNav.getParent) rootNav = rootNav.getParent();
      rootNav.navigate('Confirmation', {
        message: 'Do you want to logout of your account?',
        action: 'logout',
      });
    }, 300);
  };
  
  const handleAddAccount = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      let rootNav = props.navigation;
      if (rootNav.getParent) rootNav = rootNav.getParent();
      rootNav.navigate('Confirmation', {
        message: 'Do you want to add a new account? You will be taken to onboarding and your previous account will not be saved.',
        action: 'addAccount',
      });
    }, 300);
  };
  
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.background }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <View style={[
          styles.profileContainer,
          {
            backgroundColor: theme.accent,
            alignItems: 'flex-start',
            paddingLeft: 30,
            borderRadius: 20,
            marginBottom: 2,
            flex: 1,
          }
        ]}>
          <View style={styles.avatarCircle} />
          <Text style={styles.profileName}>Justin Philips,</Text>
          <Text style={styles.profileNumber}>+233 657481924</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            { 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 16, 
              opacity: pressed ? 0.5 : 1,
              backgroundColor: theme.background,
              marginHorizontal: 1,
              marginVertical: 0,
              borderRadius: 8,
            }
          ]}
          onPress={handleAddAccount}
        >
          <Ionicons name="person-add" size={24} color={theme.text} style={{ marginRight: 20 }} />
          <Text style={[styles.drawerItemText, { color: theme.text }]}>Add Account</Text>
        </Pressable>  
        {/* Horizontal line divider */}
        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 4, marginHorizontal:2 }} />
        <DrawerItemList {...props} />
        {/* Horizontal line divider above Logout */}
        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 4, marginHorizontal: 2 }} />
        <Pressable
          style={({ pressed }) => [
            { 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 16, 
              opacity: pressed ? 0.5 : 1,
              backgroundColor: theme.background,
              marginHorizontal: 1,
              marginVertical: 0,
              borderRadius: 0,
            }
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color={theme.text} style={{ marginRight: 20 }} />
          <Text style={[styles.drawerItemText, { color: theme.text }]}>Logout</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Drawer.Navigator
      initialRouteName="Chats"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        drawerStyle: { backgroundColor: theme.background },
        drawerLabelStyle: { color: theme.text },
        drawerActiveTintColor: theme.accent,
        drawerInactiveTintColor: theme.subtext,
      }}
    >
       <Drawer.Screen 
        name="My Profile" 
        component={MyProfileScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Chats" 
        component={PatchedHomeScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="New Group" 
        component={NewGroupScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Calls" 
        component={CallsScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="call-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Saved Messages" 
        component={SavedMessagesScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Feather name="bookmark" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Invite Friends" 
        component={InviteFriendsScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      <Drawer.Screen 
        name="Orbixa Features" 
        component={OrbixaFeaturesScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <MaterialIcons name="star-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
    </Drawer.Navigator>
  );
};

// Patch HomeScreen to show welcome message for only 2 seconds
const PatchedHomeScreen = (props: any) => {
  const user = useAppSelector((state) => state.auth.user);
  const { theme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {showWelcome && (
        <View style={{ backgroundColor: theme.mode === 'dark' ? '#2a2d3a' : '#e0f7fa', padding: 10 }}>
          <Text style={{ textAlign: 'center', color: theme.accent, fontWeight: 'bold' }}>
            Welcome, {user?.name || 'User'}! 🎉
          </Text>
        </View>
      )}
      <HomeScreen {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  profileName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileNumber: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
  },
  drawerItemText: {
    fontSize: 16,
  },
});

export default DrawerNavigator;