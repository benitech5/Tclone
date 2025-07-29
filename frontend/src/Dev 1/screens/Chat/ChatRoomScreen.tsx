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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import { useAppSelector } from '../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSettings } from '../../SettingsContext';

type ChatRoomNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'ChatRoom'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ChatRoomScreenProps {
  navigation: ChatRoomNavigationProp;
  route: {
    params: {
      chatId: string;
      chatName: string;
    };
  };
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice';
  isMine: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing?',
    senderId: 'other',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text',
    isMine: false,
  },
  {
    id: '2',
    content: 'I\'m doing great! Thanks for asking. How about you?',
    senderId: 'me',
    senderName: 'Me',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text',
    isMine: true,
  },
  {
    id: '3',
    content: 'Pretty good! Working on some exciting projects.',
    senderId: 'other',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 2400000),
    type: 'text',
    isMine: false,
  },
  {
    id: '4',
    content: 'That sounds interesting! What kind of projects?',
    senderId: 'me',
    senderName: 'Me',
    timestamp: new Date(Date.now() - 1800000),
    type: 'text',
    isMine: true,
  },
];

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ navigation, route }) => {
  const { chatId, chatName } = route.params;
  const { theme } = useTheme();
  const { chatSettings } = useSettings();
  const user = useAppSelector((state) => state.auth.user);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // default to true
  const flatListRef = useRef<FlatList>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Load messages from AsyncStorage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`chat_messages_${chatId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert timestamp strings back to Date objects
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
        JSON.stringify(messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp ? msg.timestamp.toISOString() : null
        })))
      );
    }
  }, [messages, chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://10.132.219.185:8082/api/messages/chat/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } });
        // Convert timestamp strings to Date objects
        setMessages(response.data.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp && !isNaN(Date.parse(msg.timestamp)) ? new Date(msg.timestamp) : null,
          isMine: msg.senderId === user?.id
        })));
      } catch (e) {
        // fallback to local
        setError('Failed to load messages');
        const stored = await AsyncStorage.getItem(`chat_messages_${chatId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    // Set up navigation header
    navigation.setOptions({
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
              setMenuVisible(true);
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
        await axios.post(`http://10.132.219.185:8082/api/messages/chat/${chatId}`, message, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setNewMessage('');
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      } catch (e) {
        Alert.alert('Error', 'Failed to send message to backend. Message will be saved locally.');
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setNewMessage('');
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    }
  };

  const reactToMessage = async (messageId, reaction) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/messages/${messageId}/react`, null, {
        params: { reaction },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally refresh messages
    } catch (e) {}
  };

  const editMessage = async (messageId, updatedContent) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://192.168.96.216:8082/api/messages/${messageId}`, { content: updatedContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally refresh messages
    } catch (e) {}
  };

  const deleteMessage = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.96.216:8082/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally refresh messages
    } catch (e) {}
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
          ? { backgroundColor: '#e53935' } // red for sent
          : { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border } // white/gray for received
      ]}>
        <Text style={[
          styles.messageText,
          { fontSize: chatSettings.messageSize },
          item.isMine ? { color: '#fff' } : { color: theme.text }
        ]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, { color: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]}>
          {item.timestamp ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
      </View>
    </View>
  );

  const renderInputBar = () => {
    console.log('Input value:', newMessage); // Debug log
    return (
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
        {newMessage.trim().length > 0 ? (
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: 'red' }]} // Bright green for visibility
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
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <>
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
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
        </TouchableWithoutFeedback>
        <View style={{ position: 'absolute', top: 60, right: 20, backgroundColor: '#fff', borderRadius: 8, elevation: 5, minWidth: 200 }}>
          {[
            { label: 'View contact', screen: 'ContactProfile' },
            { label: 'Search', screen: 'SearchScreen' },
            { label: 'New group', screen: 'New Group' }, // <-- update to real NewGroupScreen
            { label: 'Media, links, and docs', screen: 'MediaSharedScreen' },
            { label: 'Chat theme', screen: 'ChatSettingsScreen' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={{ padding: 16, borderBottomWidth: idx < 4 ? 1 : 0, borderBottomColor: '#eee' }}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate(item.screen);
              }}
            >
              <Text style={{ color: '#222', fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{ padding: 16 }}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
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

export default ChatRoomScreen; 