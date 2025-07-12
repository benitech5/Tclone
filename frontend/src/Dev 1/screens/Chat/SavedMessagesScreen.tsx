import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useChatSettings } from '../../hooks/useChatSettings';
import { useTheme } from '../../ThemeContext';

const SavedMessagesScreen = () => {
  const { getMessageStyle, getReplyStyle } = useChatSettings();
  const { theme } = useTheme();

  const savedMessages = [
    { id: '1', text: 'This is a saved message', isReply: false },
    { id: '2', text: 'Another important message to remember', isReply: true },
    { id: '3', text: 'Meeting notes: Tomorrow at 3 PM', isReply: false },
  ];

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