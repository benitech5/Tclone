// src/screens/AccountScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../store/store';

type AccountScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Account'
>;

const updateStatus = async (isOnline) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const user = useAppSelector((state) => state.auth.user);
    await axios.put(`http://192.168.96.216:8082/api/user/${user?.id}/status`, null, {
      params: { isOnline },
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {}
};

const fetchOnlineUsers = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://192.168.96.216:8082/api/user/online', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Use response.data for online users
  } catch (e) {}
};

const AccountScreen = ({ navigation }: { navigation: AccountScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value="+233 725089765"
            editable={false}
          />
          <Text style={styles.hint}>Tap to change phone number</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            defaultValue="Justin Philips"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            placeholder="Add a bio"
            multiline
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hint: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AccountScreen;