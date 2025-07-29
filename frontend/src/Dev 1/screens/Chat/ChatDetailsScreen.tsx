import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../ThemeContext';
import { useAppSelector } from '../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSettings } from '../../SettingsContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice';
  isMine: boolean;
}

const ChatDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { chatId, chatName } = route.params;
  const { theme } = useTheme();
  const { chatSettings } = useSettings();
  const user = useAppSelector((state) => state.auth.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Load messages from AsyncStorage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`chat_messages_${chatId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([]);
        }
      } catch (e) {
        setMessages([]);
      }
    };
    loadMessages();
  }, [chatId]);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(`chat_messages_${chatId}`,
        JSON.stringify(messages.map(msg => ({ ...msg, timestamp: msg.timestamp.toISOString() })))
      );
    }
  }, [messages, chatId]);

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://192.168.188.31:8082/api/messages/chat/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessages(response.data.map((msg: any) => ({ 
          ...msg, 
          timestamp: new Date(msg.timestamp), 
          isMine: msg.senderId === user?.id 
        })));
      } catch (e) {
        // Fallback to local storage if API fails
        const stored = await AsyncStorage.getItem(`chat_messages_${chatId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([]);
        }
      }
    };
    fetchMessages();
  }, [chatId, user?.id]);

  // Set up navigation header
  useEffect(() => {
    navigation.setOptions && navigation.setOptions({
      headerShown: true,
      title: chatName,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="call" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions({
                options: ['View Details', 'Mute', 'Clear Chat', 'Delete Chat', 'Cancel'],
                destructiveButtonIndex: 3,
                cancelButtonIndex: 4,
                title: chatName,
              }, (buttonIndex) => {
                if (buttonIndex === 0) {
                  Alert.alert('View Details', 'Show chat details here.');
                } else if (buttonIndex === 1) {
                  Alert.alert('Mute', 'Chat muted.');
                } else if (buttonIndex === 2) {
                  setMessages([]);
                } else if (buttonIndex === 3) {
                  Alert.alert('Delete Chat', 'Chat deleted.');
                }
              });
            }}
          >
            <Icon name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chatName, theme]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        content: newMessage.trim(),
        senderId: user?.id,
        senderName: user?.name || 'Me',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.post(`http://192.168.188.31:8082/api/messages/chat/${chatId}`, message, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setNewMessage('');
      } catch (e) {
        Alert.alert('Error', 'Failed to send message to backend. Message will be saved locally.');
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setNewMessage('');
      }
    }
  };

  const reactToMessage = async (messageId: string, reaction: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.188.31:8082/api/messages/${messageId}/react`, null, {
        params: { reaction },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally refresh messages or update local state
    } catch (e) {
      console.error('Failed to react to message:', e);
    }
  };

  const editMessage = async (messageId: string, updatedContent: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://192.168.96.216:8082/api/messages/${messageId}`, { content: updatedContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local message state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: updatedContent }
          : msg
      ));
    } catch (e) {
      console.error('Failed to edit message:', e);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.96.216:8082/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (e) {
      console.error('Failed to delete message:', e);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow,
      item.isMine ? styles.myMessageRow : styles.theirMessageRow
    ]}>
      <View style={[
        styles.messageBubble,
        { borderRadius: chatSettings.messageCorner },
        item.isMine
          ? { backgroundColor: '#e53935' }
          : { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border }
      ]}>
        <Text style={[
          styles.messageText,
          { fontSize: chatSettings.messageSize },
          item.isMine ? { color: '#fff' } : { color: theme.text }
        ]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, { color: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]}> 
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderInputBar = () => (
    <View style={[styles.inputContainer, { backgroundColor: theme.background }]}> 
      <TouchableOpacity style={styles.attachButton}>
        <Icon name="add" size={24} color={theme.text} />
      </TouchableOpacity>
      <View style={[styles.textInputContainer, { backgroundColor: theme.card }]}> 
        <TextInput
          style={[styles.textInput, { color: theme.text }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.subtext}
          multiline
          maxLength={1000}
        />
      </View>
      {newMessage.trim() ? (
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
          onPress={sendMessage}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.micButton}>
          <Icon name="mic" size={24} color={theme.text} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          // TODO: Load older messages
        }}
        onEndReachedThreshold={0.1}
      />
      {renderInputBar()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    marginBottom: 10,
  },
  messageText: {},
  messageTime: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 16,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatDetailsScreen;