import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useChatSettings } from '../../hooks/useChatSettings';
import { useTheme } from '../../ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../store/store';

const SavedMessagesScreen = () => {
  const { getMessageStyle, getReplyStyle } = useChatSettings();
  const { theme } = useTheme();
  const [savedMessages, setSavedMessages] = useState([]);
  const user = useAppSelector((state) => state.auth.user);

  const fetchSavedMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://192.168.96.216:8082/api/messages/user/${user?.id}/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedMessages(response.data);
    } catch (e) {
      setSavedMessages([]);
    }
  };

  const saveMessage = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/messages/${messageId}/save`, null, {
        params: { userId: user?.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSavedMessages();
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Saved Messages</Text>
      <ScrollView style={styles.messagesContainer}>
        {savedMessages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            {message.isReply ? (
              <View style={getReplyStyle()}>
                <Text style={[styles.messageText, { fontSize: getMessageStyle().fontSize, color: '#fff' }]}>
                  {message.text}
                </Text>
              </View>
            ) : (
              <Text style={[styles.messageText, getMessageStyle(), { color: theme.text }]}>
                {message.text}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageText: {
    padding: 8,
  },
});

export default SavedMessagesScreen; 