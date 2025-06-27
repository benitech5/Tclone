import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Types';
import ChatService from '../api/ChatService';

// Define the type for a message
interface Message {
  id: string;
  text: string;
  sender: string;
}

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type Nav = NavigationProp<RootStackParamList>;

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<Nav>();
  const { chatId } = route.params;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await ChatService.getMessages(chatId);
        setMessages(data);
      } catch (e) {
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (message.trim()) {
      setSending(true);
      try {
        const sent = await ChatService.sendMessage(chatId, message);
        setMessages([...messages, sent]);
        setMessage('');
      } catch (e) {
        setError('Failed to send message.');
      } finally {
        setSending(false);
      }
    }
  };

  // Example header with navigation triggers (replace with real data/logic)
  const isGroup = chatId && chatId.startsWith('group');
  const isChannel = chatId && chatId.startsWith('channel');
  const userId = '1'; // Replace with actual userId from chat data
  const groupId = chatId;
  const channelId = chatId;

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isGroup ? (
          <TouchableOpacity onPress={() => navigation.navigate('GroupInfo', { groupId })}>
            <Text style={styles.headerTitle}>Group Info</Text>
          </TouchableOpacity>
        ) : isChannel ? (
          <TouchableOpacity onPress={() => navigation.navigate('ChannelInfo', { channelId })}>
            <Text style={styles.headerTitle}>Channel Info</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId })}>
            <Text style={styles.headerTitle}>User Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              setSelectedMessageId(item.id);
              setPopupVisible(true);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.message, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={sending}>
          <Text style={styles.sendButtonText}>{sending ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
      {/* MessageActionsPopup navigation example */}
      {/* {popupVisible && (
        <MessageActionsPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onAction={action => {
            setPopupVisible(false);
            // handle action
          }}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  message: { padding: 12, marginVertical: 4, borderRadius: 8, maxWidth: '80%' },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#eee', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fafafa' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
  sendButton: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ChatScreen; 