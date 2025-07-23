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
  Image,
  Modal,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import { useAppSelector } from '../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type GroupChatNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'GroupChat'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface GroupChatScreenProps {
  navigation: GroupChatNavigationProp;
  route: {
    params: {
      groupId: string;
      groupName: string;
    };
  };
}

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  isOnline: boolean;
}

interface GroupMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice';
  isMine: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
}

const mockGroupMembers: GroupMember[] = [
  { id: '1', name: 'John Doe', isAdmin: true, isOnline: true },
  { id: '2', name: 'Jane Smith', isAdmin: false, isOnline: false },
  { id: '3', name: 'Mike Johnson', isAdmin: false, isOnline: true },
  { id: '4', name: 'Sarah Wilson', isAdmin: false, isOnline: false },
  { id: '5', name: 'Alex Brown', isAdmin: false, isOnline: true },
];

const mockGroupMessages: GroupMessage[] = [
  {
    id: '1',
    content: 'Hey everyone! How\'s the project going?',
    senderId: '1',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text',
    isMine: false,
    reactions: [{ emoji: '👍', count: 2, users: ['2', '3'] }],
  },
  {
    id: '2',
    content: 'Great progress! I finished the backend API',
    senderId: '2',
    senderName: 'Jane Smith',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text',
    isMine: false,
    reactions: [{ emoji: '🎉', count: 3, users: ['1', '3', '4'] }],
  },
  {
    id: '3',
    content: 'Awesome! I\'m working on the frontend now',
    senderId: 'me',
    senderName: 'Me',
    timestamp: new Date(Date.now() - 2400000),
    type: 'text',
    isMine: true,
    reactions: [],
  },
  {
    id: '4',
    content: 'When should we have our next meeting?',
    senderId: '3',
    senderName: 'Mike Johnson',
    timestamp: new Date(Date.now() - 1800000),
    type: 'text',
    isMine: false,
    reactions: [],
  },
];

const GroupChatScreen: React.FC<GroupChatScreenProps> = ({ navigation, route }) => {
  const { groupId, groupName } = route.params;
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState<GroupMember[]>(mockGroupMembers);
  const flatListRef = useRef<FlatList>(null);

  // Load messages from AsyncStorage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`group_messages_${groupId}`);
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
  }, [groupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://192.168.96.216:8082/api/messages/chat/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessages(response.data.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp), isMine: msg.senderId === user?.id })));
      } catch (e) {
        // fallback to local
        const stored = await AsyncStorage.getItem(`group_messages_${groupId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([]);
        }
      }
    };
    fetchMessages();
  }, [groupId]);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(`group_messages_${groupId}`,
        JSON.stringify(messages.map(msg => ({ ...msg, timestamp: msg.timestamp.toISOString() })))
      );
    }
  }, [messages, groupId]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: groupName,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowMembersModal(true)}
          >
            <Icon name="people" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('GroupInfo', { groupId })}
          >
            <Icon name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, groupName, theme]);

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
        await axios.post(`http://192.168.96.216:8082/api/messages/chat/${groupId}`, message, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date(), reactions: [] },
          ...prev
        ]);
        setNewMessage('');
      } catch (e) {
        Alert.alert('Error', 'Failed to send message to backend. Message will be saved locally.');
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date(), reactions: [] },
          ...prev
        ]);
        setNewMessage('');
      }
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, 'me'] }
                : r
            ),
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, users: ['me'] }],
          };
        }
      }
      return msg;
    }));
  };

  const renderMessage = ({ item }: { item: GroupMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isMine ? styles.myMessage : styles.otherMessage
    ]}>
      {!item.isMine && (
        <Text style={[styles.senderName, { color: theme.primary }]}>
          {item.senderName}
        </Text>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isMine 
          ? [styles.myBubble, { backgroundColor: theme.primary }]
          : [styles.otherBubble, { backgroundColor: theme.card }]
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.isMine ? '#fff' : theme.text }
        ]}>
          {item.content}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.messageTime,
            { color: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }
          ]}>
            {item.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          
          {item.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {item.reactions.map((reaction, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.reaction, { backgroundColor: theme.background }]}
                  onPress={() => addReaction(item.id, reaction.emoji)}
                >
                  <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                  <Text style={[styles.reactionCount, { color: theme.text }]}>
                    {reaction.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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

  const renderMembersModal = () => (
    <Modal
      visible={showMembersModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Group Members ({members.length})
          </Text>
          <TouchableOpacity onPress={() => setShowMembersModal(false)}>
            <Icon name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={members}
          renderItem={({ item }) => (
            <View style={[styles.memberItem, { backgroundColor: theme.card }]}>
              <View style={styles.memberInfo}>
                <View style={[styles.memberAvatar, { backgroundColor: theme.primary }]}>
                  <Text style={styles.memberAvatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={[styles.memberName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <View style={styles.memberStatus}>
                    {item.isAdmin && (
                      <Text style={[styles.adminBadge, { color: theme.primary }]}>
                        Admin
                      </Text>
                    )}
                    <View style={[
                      styles.onlineIndicator,
                      { backgroundColor: item.isOnline ? '#4CAF50' : theme.subtext }
                    ]} />
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.membersList}
        />
      </View>
    </Modal>
  );

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
      />
      
      {renderInputBar()}
      {renderMembersModal()}
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
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  reactionEmoji: {
    fontSize: 12,
    marginRight: 2,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: '600',
  },
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  membersList: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default GroupChatScreen; 