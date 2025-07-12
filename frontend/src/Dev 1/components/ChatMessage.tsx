import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '../SettingsContext';

interface ChatMessageProps {
  message: string;
  isReply?: boolean;
  sender?: string;
  timestamp?: string;
  style?: any;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isReply = false, 
  sender, 
  timestamp, 
  style 
}) => {
  const { chatSettings } = useSettings();

  if (isReply) {
    return (
      <View style={[styles.replyContainer, { borderRadius: chatSettings.messageCorner }, style]}>
        <Text style={[styles.replyText, { fontSize: chatSettings.messageSize }]}>
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.messageContainer}>
      {sender && (
        <Text style={styles.sender}>{sender}</Text>
      )}
      <Text style={[styles.messageText, { fontSize: chatSettings.messageSize }]}>
        {message}
      </Text>
      {timestamp && (
        <Text style={styles.timestamp}>{timestamp}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 2,
  },
  messageText: {
    color: '#000',
  },
  replyContainer: {
    backgroundColor: '#b388ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  replyText: {
    color: '#fff',
  },
  sender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default ChatMessage; 