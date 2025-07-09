import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import ChatsScreen from '../screens/Chat/ChatsScreen';
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

// Placeholder for Orbixa Features
const OrbixaFeaturesScreen = () => (
  <View style={styles.centered}><Text>Orbixa Features (Placeholder)</Text></View>
);
// Placeholder for Add Account
const AddAccountScreen = () => (
  <View style={styles.centered}><Text>Add Account (Placeholder)</Text></View>
);
// Placeholder for My Profile
const MyProfileScreen = () => (
  <View style={styles.centered}><Text>My Profile (Placeholder)</Text></View>
);
// Placeholder for New Group
const NewGroupScreen = () => (
  <View style={styles.centered}><Text>New Group (Placeholder)</Text></View>
);

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      let rootNav = props.navigation;
      if (rootNav.getParent) rootNav = rootNav.getParent();
      rootNav.navigate('Confirmation', {
        message: 'Do you want to logout of your account?',
        onConfirm: () => {
          dispatch(logout());
          if (rootNav && rootNav.reset) {
            rootNav.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        },
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
        onConfirm: () => {
          dispatch(logout());
          if (rootNav && rootNav.reset) {
            rootNav.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        },
      });
    }, 300);
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarCircle} />
        <Text style={styles.profileName}>Justin Philips</Text>
        <Text style={styles.profileNumber}>+233 657481924</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          { flexDirection: 'row', alignItems: 'center', padding: 16, opacity: pressed ? 0.5 : 1 }
        ]}
        onPress={handleAddAccount}
      >
        <Ionicons name="person-add" size={24} color="#333" style={{ marginRight: 20 }} />
        <Text style={{ fontSize: 16 }}>Add Account</Text>
      </Pressable>
      <DrawerItemList {...props} />
      <Pressable
        style={({ pressed }) => [
          { flexDirection: 'row', alignItems: 'center', padding: 16, opacity: pressed ? 0.5 : 1 }
        ]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={24} color="#333" style={{ marginRight: 20 }} />
        <Text style={{ fontSize: 16 }}>Logout</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Chats"
    drawerContent={props => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="Chats" component={PatchedChatsScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} /> }} />
    <Drawer.Screen name="My Profile" component={MyProfileScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    <Drawer.Screen name="New Group" component={NewGroupScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
    <Drawer.Screen name="Contacts" component={ContactsScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
    <Drawer.Screen name="Calls" component={CallsScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="call-outline" size={size} color={color} /> }} />
    <Drawer.Screen name="Saved Messages" component={SavedMessagesScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="bookmark" size={size} color={color} /> }} />
    <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
    <Drawer.Screen name="Invite Friends" component={InviteFriendsScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} /> }} />
    <Drawer.Screen name="Orbixa Features" component={OrbixaFeaturesScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="star-outline" size={size} color={color} /> }} />
  </Drawer.Navigator>
);

// Patch ChatsScreen to show welcome message for only 2 seconds
const PatchedChatsScreen = (props: any) => {
  const user = useAppSelector((state) => state.auth.user);
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {showWelcome && (
        <View style={{ backgroundColor: '#e0f7fa', padding: 10 }}>
          <Text style={{ textAlign: 'center', color: '#007AFF', fontWeight: 'bold' }}>
            Welcome, {user?.name || 'User'}! 🎉
          </Text>
        </View>
      )}
      <ChatsScreen {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#d32f2f',
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
    backgroundColor: '#fff',
  },
});

export default DrawerNavigator;