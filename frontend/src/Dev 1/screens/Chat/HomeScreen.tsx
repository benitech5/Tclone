// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';
import { useTheme } from '../../ThemeContext';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'Chats'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
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

const mockStories = [
  {
    id: 'my-story',
    name: 'My Story',
  },
  {
    id: '1',
    name: 'Bobee Jnr',
  },
  {
    id: '2',
    name: 'Mirabelle',
  },
  {
    id: '3',
    name: 'Nikano Miku',
  },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

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
        { backgroundColor: theme.card },
        item.unread > 0 && { backgroundColor: theme.mode === 'dark' ? '#2a2d3a' : '#e6f3ff' }
      ]}
      onPress={() => navigation.navigate('ChatRoom', { chatId: item.id, chatName: item.name })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
          {item.isImportant && <Text style={styles.important}>🌟</Text>}
          <Text style={[styles.time, { color: theme.subtext }]}>{item.time}</Text>
        </View>
        <Text 
          style={[
            styles.lastMessage,
            { color: theme.subtext },
            item.unread > 0 && { color: theme.text }
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

  const renderStory = (story: typeof mockStories[0]) => (
    <View key={story.id} style={styles.storyItem}>
      <View style={styles.storyAvatarNoImg}>
        <Text style={styles.storyAvatarLetter}>
          {story.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.storyName, { color: theme.text }]} numberOfLines={1}>{story.name}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {/* Remove this static welcome message:
        <Text style={styles.title}>Welcome, {user?.name || 'User'}! 🎉</Text> */}
      </View>
      {/* Stories Section */}
      <View style={styles.storiesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesList}>
          {mockStories.map(renderStory)}
        </ScrollView>
      </View>
      {/* Chat List */}
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
  },
  listContent: {
    paddingBottom: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
    fontWeight: 'bold',
    flex: 1,
  },
  important: {
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: '#e53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  storiesContainer: {
    paddingVertical: 10,
  },
  storiesList: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyAvatarNoImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyAvatarLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0088cc',
  },
  storyName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;