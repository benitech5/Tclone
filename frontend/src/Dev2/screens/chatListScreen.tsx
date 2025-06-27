import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChatService from '../api/ChatService';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await ChatService.getChats();
        setChats(data);
      } catch (e) {
        setError('Failed to load chats.');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const handleChatPress = (item) => {
    if (item.type === 'group') {
      navigation.navigate('GroupInfo', { groupId: item.id });
    } else if (item.type === 'channel') {
      navigation.navigate('ChannelInfo', { channelId: item.id });
    } else {
      navigation.navigate('Chat', { chatId: item.id });
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  chatItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatName: { fontSize: 18, fontWeight: 'bold' },
  lastMessage: { fontSize: 14, color: '#888' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ChatListScreen; 