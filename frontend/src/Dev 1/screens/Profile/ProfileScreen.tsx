// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Profile'
>;

const ProfileScreen = ({ navigation }: { navigation: ProfileScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.profileHeader}
        onPress={() => navigation.navigate('Account')}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#0088cc" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Justin Philips</Text>
          <Text style={styles.phone}>+233 725089765</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <View style={styles.menu}>
        {['New Group', 'Contacts', 'Saved Messages', 'Settings'].map((item) => (
          <TouchableOpacity 
            key={item}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.replace(/\s+/g, '') as any)}
          >
            <Text style={styles.menuText}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    color: '#757575',
    marginTop: 4,
  },
  menu: {
    backgroundColor: 'white',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
});

export default ProfileScreen;