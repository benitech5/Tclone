// src/screens/ChatsScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';

type ChatsScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'Chats'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ChatsScreenProps {
  navigation: ChatsScreenNavigationProp;
}

const mockChats = [
  {
    id: '1',
    name: 'Yung Zeus',
    lastMessage: 'Oh, then nawa for you bro...',
    time: '00:00',
    unread: 1,
    isImportant: true
  },
  {
    id: '2',
    name: 'Jay 💶',
    lastMessage: 'Where is the meeting place',
    time: '00:00',
    unread: 0
  },
  {
    id: '3',
    name: 'Udemy Free Coupons',
    lastMessage: '+AI in science mastery...',
    time: '00:00',
    unread: 3
  },
];

const ChatsScreen: React.FC<ChatsScreenProps> = ({ navigation }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' as never }],
    });
  };

  const renderItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        item.unread > 0 && styles.unreadChatItem
      ]}
      onPress={() => navigation.navigate('ChatDetails', { chatId: item.id })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.isImportant && <Text style={styles.important}>🌟</Text>}
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text 
          style={[
            styles.lastMessage,
            item.unread > 0 && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}! 🎉</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <FlatList
        data={mockChats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  unreadChatItem: {
    backgroundColor: '#e6f3ff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0088cc',
    fontWeight: 'bold',
    fontSize: 18,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 5,
    flexShrink: 1,
  },
  important: {
    fontSize: 14,
    marginRight: 5,
  },
  time: {
    color: '#9e9e9e',
    fontSize: 12,
    marginLeft: 'auto',
  },
  lastMessage: {
    color: '#757575',
    fontSize: 14,
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#0088cc',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ChatsScreen;