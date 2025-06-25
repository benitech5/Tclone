// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';

const MOCK_USER = {
  name: 'Jane Doe',
  avatar: 'https://via.placeholder.com/80x80.png?text=User',
};

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{MOCK_USER.name}</Text>
        <Text style={styles.welcome}>Welcome back!</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChatList' as never)}>
          <Text style={styles.menuText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Contacts' as never)}>
          <Text style={styles.menuText}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile' as never)}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Calls' as never)}>
          <Text style={styles.menuText}>Calls</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    paddingTop: 60,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  welcome: {
    fontSize: 16,
    color: '#888',
  },
  menu: {
    width: '90%',
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  menuText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
});
