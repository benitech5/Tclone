import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../store/store';

const PinnedMessagesScreen = () => {
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const user = useAppSelector((state) => state.auth.user);

  const fetchPinnedMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://192.168.96.216:8082/api/messages/user/${user?.id}/pinned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPinnedMessages(response.data);
    } catch (e) {
      setPinnedMessages([]);
    }
  };

  const pinMessage = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/messages/${messageId}/pin`, null, {
        params: { userId: user?.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPinnedMessages();
    } catch (e) {}
  };

  const bulkPinMessages = async (messageIds) => {
    try {
      const token = await AsyncStorage.getItem('token');
      for (const messageId of messageIds) {
        await axios.post(`http://192.168.96.216:8082/api/messages/${messageId}/pin`, null, {
          params: { userId: user?.id },
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchPinnedMessages();
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pinned Messages Screen (Placeholder)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default PinnedMessagesScreen;