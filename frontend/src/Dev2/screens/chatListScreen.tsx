import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getConversations } from '../api/ChatService';

export default function ChatListScreen() {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getConversations();
        setChats(data);
      } catch (err) {
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.name && chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat' as never, { chatId: item.id, chatName: item.name } as never)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewChat' as never)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#222' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#222' },
  list: { flex: 1 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  lastMessage: { fontSize: 15, color: '#888', marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  time: { fontSize: 13, color: '#aaa' },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  unreadText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
}); 