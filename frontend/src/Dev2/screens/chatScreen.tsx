import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMessages, sendMessage } from '../api/ChatService';
import { useRoute } from '@react-navigation/native';

const chatBg = require('../../../assets/chat-bg.png'); // Try new path for background asset
const avatar = 'https://randomuser.me/api/portraits/men/3.jpg';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const route = useRoute();
  const { chatId, chatName } = route.params || {};

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(chatId);
        setMessages(data);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const sent = await sendMessage(chatId, newMessage);
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{chatName || 'Chat'}</Text>
          <Text style={styles.status}>Online</Text>
        </View>
        <TouchableOpacity style={{ marginHorizontal: 8 }}>
          <Ionicons name="call-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 8 }}>
          <Ionicons name="videocam-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 8 }}>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <ImageBackground source={chatBg} style={styles.bg}>
        {loading ? (
          <ActivityIndicator size="large" color="#d0021b" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageRow, item.isOwn ? styles.ownRow : styles.otherRow]}>
                <View style={[styles.bubble, item.isOwn ? styles.ownBubble : styles.otherBubble]}>
                  <Text style={[styles.messageText, item.isOwn ? styles.ownText : styles.otherText]}>{item.text}</Text>
                </View>
              </View>
            )}
            style={styles.list}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputBar}>
            <TouchableOpacity>
              <Ionicons name="attach" size={24} color="#d0021b" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type your message here"
              value={newMessage}
              onChangeText={setNewMessage}
              placeholderTextColor="#aaa"
              editable={!sending}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending}>
              <Ionicons name="send" size={24} color="#d0021b" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#d0021b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 8 },
  name: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  status: { color: '#fff', fontSize: 12 },
  bg: { flex: 1 },
  list: { flex: 1, padding: 10 },
  messageRow: { flexDirection: 'row', marginVertical: 4 },
  ownRow: { justifyContent: 'flex-end' },
  otherRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  ownBubble: { backgroundColor: '#d0021b', borderTopRightRadius: 4, marginLeft: 'auto' },
  otherBubble: { backgroundColor: '#fff', borderTopLeftRadius: 4, marginRight: 'auto', borderWidth: 1, borderColor: '#eee' },
  messageText: { fontSize: 16 },
  ownText: { color: '#fff' },
  otherText: { color: '#222' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: { flex: 1, fontSize: 16, backgroundColor: '#f2f2f7', borderRadius: 20, paddingHorizontal: 16, marginHorizontal: 8 },
  sendButton: { padding: 8 },
}); 