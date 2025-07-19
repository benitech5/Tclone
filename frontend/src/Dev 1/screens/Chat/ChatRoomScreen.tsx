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
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import { useAppSelector } from '../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const user = useAppSelector((state) => state.auth.user);
  
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

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
            onPress={() => navigation.navigate('ChatDetails', { chatId })}
          >
            <Icon name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chatName, theme]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        senderId: 'me',
        senderName: user?.name || 'Me',
        timestamp: new Date(),
        type: 'text',
        isMine: true,
      };

      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      
      // TODO: Send message to backend
      // sendMessageToBackend(message);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isMine ? styles.myMessage : styles.otherMessage
    ]}>
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
        <Text style={[
          styles.messageTime,
          { color: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }
        ]}>
          {item.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
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
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
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
});

export default ChatRoomScreen; 