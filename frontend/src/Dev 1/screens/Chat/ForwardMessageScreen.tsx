import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForwardMessageScreen = () => {
  const forwardMessage = async (originalMessageId, forwardContent) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/messages/${originalMessageId}/reply`, { content: forwardContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally refresh messages or navigate
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Forward Message Screen (Placeholder)</Text>
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

export default ForwardMessageScreen; 