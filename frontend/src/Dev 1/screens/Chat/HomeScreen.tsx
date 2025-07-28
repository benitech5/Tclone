// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';
import { useTheme } from '../../ThemeContext';
import { getUserGroups } from '../../api/ChatService';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'Chats'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getUserGroups();
        setGroups(res.data);
      } catch (err: any) {
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        { backgroundColor: theme.card }
      ]}
      onPress={() => navigation.navigate('ChatRoom', { chatId: item.id, chatName: item.name })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map((n: string) => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.time, { color: theme.subtext }]}> </Text>
        </View>
        <Text style={[styles.lastMessage, { color: theme.subtext }]} numberOfLines={1}>
          {/* Optionally show last message if available */}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={theme.accent} /></View>;
  }
  if (error) {
    return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: theme.text }}>{error}</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  time: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
  },
});

export default HomeScreen;