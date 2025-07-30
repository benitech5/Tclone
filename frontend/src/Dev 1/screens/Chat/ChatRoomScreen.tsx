import React, { useState, useRef, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    Keyboard,
    ActivityIndicator,
    Modal,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../SettingsContext';
import { useTheme } from '../../ThemeContext';
import { getMessages, sendMessage } from '../../api/ChatService';
import { useAppSelector } from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    type: 'text' | 'image' | 'file' | 'voice';
    isMine: boolean;
}

export default function ChatRoomScreen() {
    const [message, setMessage] = useState('');
    const route = useRoute();
    const navigation = useNavigation();
    const { chatSettings } = useSettings();
    const { theme } = useTheme();
    const user = useAppSelector((state) => state.auth.user);
    // @ts-ignore
    const chatId = route.params?.chatId;
    // @ts-ignore
    const chatName = route.params?.chatName;
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const flatListRef = useRef<FlatList>(null);
    
    // New states for features
    const [pinnedMessage, setPinnedMessage] = useState<any>(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [reactions, setReactions] = useState<{[key: string]: string}>({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);

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
            setLoading(true);
            setError('');
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`http://10.132.219.185:8082/api/messages/chat/${chatId}`,
                    { headers: { Authorization: `Bearer ${token}` } });
                // Convert timestamp strings to Date objects
                const messagesWithStatus = response.data.map((msg: any) => ({
                    ...msg,
                    timestamp: msg.timestamp && !isNaN(Date.parse(msg.timestamp)) ? new Date(msg.timestamp) : null,
                    isMine: msg.senderId === user?.email,
                    senderId: msg.senderId,
                    senderName: msg.senderName || msg.sender,
                    type: msg.type || 'text'
                }));
                setMessages(messagesWithStatus);
            } catch (err: any) {
                // fallback to mock data for demonstration
                const mockMessages: Message[] = [
                    {
                        id: '1',
                        content: 'Hey! How are you doing?',
                        senderId: 'other@example.com',
                        senderName: 'John Doe',
                        timestamp: new Date(Date.now() - 3600000),
                        type: 'text',
                        isMine: false,
                    },
                    {
                        id: '2',
                        content: 'I\'m doing great! Thanks for asking. How about you?',
                        senderId: user?.email || 'me@example.com',
                        senderName: user?.name || 'Me',
                        timestamp: new Date(Date.now() - 3000000),
                        type: 'text',
                        isMine: true,
                    },
                    {
                        id: '3',
                        content: 'Pretty good! Working on some exciting projects.',
                        senderId: 'other@example.com',
                        senderName: 'John Doe',
                        timestamp: new Date(Date.now() - 2400000),
                        type: 'text',
                        isMine: false,
                    },
                    {
                        id: '4',
                        content: 'That sounds interesting! What kind of projects?',
                        senderId: user?.email || 'me@example.com',
                        senderName: user?.name || 'Me',
                        timestamp: new Date(Date.now() - 1800000),
                        type: 'text',
                        isMine: true,
                    },
                ];
                setMessages(mockMessages);
            } finally {
                setLoading(false);
            }
        };
        if (chatId) fetchMessages();
    }, [chatId, user?.email]);

    const handleSend = async () => {
        if (message.trim() === '') return;
        
        const messageObj = {
            content: message.trim(),
            senderId: user?.email || 'unknown',
            senderName: user?.name || 'Me',
            timestamp: new Date().toISOString(),
            type: 'text' as const,
        };

        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`http://10.132.219.185:8082/api/messages/chat/${chatId}`, messageObj, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newMessage: Message = {
                ...messageObj,
                id: Date.now().toString(),
                isMine: true,
                timestamp: new Date(),
                type: 'text' as const
            };
            setMessages(prev => [newMessage, ...prev]);
            setMessage('');
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 100);
        } catch (err) {
            Alert.alert('Error', 'Failed to send message to backend. Message will be saved locally.');
            const newMessage: Message = {
                ...messageObj,
                id: Date.now().toString(),
                isMine: true,
                timestamp: new Date(),
                type: 'text' as const
            };
            setMessages(prev => [newMessage, ...prev]);
            setMessage('');
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 100);
        }
    };

    const reactToMessage = async (messageId: string, reaction: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`http://192.168.96.216:8082/api/messages/${messageId}/react`, null, {
                params: { reaction },
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local reactions
            setReactions(prev => ({
                ...prev,
                [messageId]: reaction
            }));
        } catch (e) {
            // Fallback to local only
            setReactions(prev => ({
                ...prev,
                [messageId]: reaction
            }));
        }
    };

    const editMessage = async (messageId: string, updatedContent: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.put(`http://192.168.96.216:8082/api/messages/${messageId}`, { content: updatedContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local message
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, content: updatedContent } : msg
            ));
        } catch (e) {
            Alert.alert('Error', 'Failed to edit message on server');
        }
    };

    const deleteMessage = async (messageId: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`http://192.168.96.216:8082/api/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove from local messages
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
        } catch (e) {
            Alert.alert('Error', 'Failed to delete message on server');
        }
    };

    const handleLongPress = (message: Message) => {
        Alert.alert(
            'Message Options',
            'Choose an action',
            [
                {
                    text: 'Pin Message',
                    onPress: () => setPinnedMessage(message)
                },
                {
                    text: 'Add Reaction',
                    onPress: () => {
                        setSelectedMessageId(message.id);
                        setShowReactionPicker(true);
                    }
                },
                {
                    text: 'Edit Message',
                    onPress: () => {
                        Alert.prompt(
                            'Edit Message',
                            'Enter new message content:',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                    text: 'Save', 
                                    onPress: (newContent) => {
                                        if (newContent && newContent.trim()) {
                                            editMessage(message.id, newContent.trim());
                                        }
                                    }
                                }
                            ],
                            'plain-text',
                            message.content
                        );
                    }
                },
                {
                    text: 'Delete Message',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Delete Message',
                            'Are you sure you want to delete this message?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                    text: 'Delete', 
                                    style: 'destructive',
                                    onPress: () => deleteMessage(message.id)
                                }
                            ]
                        );
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const addReaction = (emoji: string) => {
        if (selectedMessageId) {
            reactToMessage(selectedMessageId, emoji);
            setShowReactionPicker(false);
            setSelectedMessageId(null);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isSentByMe = item.isMine;
        const messageReaction = reactions[item.id];

        return (
            <TouchableOpacity 
                onLongPress={() => handleLongPress(item)}
                style={[
                    styles.messageRow,
                    isSentByMe ? styles.myMessageRow : styles.theirMessageRow
                ]}
            >
                <View style={[
                    styles.messageBubble,
                    { borderRadius: chatSettings.messageCorner },
                    isSentByMe
                        ? { backgroundColor: '#e53935' } // red for sent
                        : { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border } // white/gray for received
                ]}>
                    <Text style={[
                        styles.messageText,
                        { fontSize: chatSettings.messageSize },
                        isSentByMe ? { color: '#fff' } : { color: theme.text }
                    ]}>
                        {item.content}
                    </Text>
                    
                    {/* Message timestamp and seen indicator */}
                    <View style={styles.messageFooter}>
                        <Text style={[styles.messageTime, { color: isSentByMe ? 'rgba(255,255,255,0.7)' : theme.subtext }]}>
                            {item.timestamp ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                        {isSentByMe && (
                            <Text style={[styles.seenIndicator, { color: 'rgba(255,255,255,0.7)' }]}>
                                ✓ Seen
                            </Text>
                        )}
                    </View>

                    {/* Reaction display */}
                    {messageReaction && (
                        <View style={styles.reactionContainer}>
                            <Text style={styles.reactionEmoji}>{messageReaction}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderReactionPicker = () => (
        <Modal
            visible={showReactionPicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowReactionPicker(false)}
        >
            <TouchableOpacity 
                style={styles.modalOverlay}
                onPress={() => setShowReactionPicker(false)}
            >
                <View style={[styles.reactionPicker, { backgroundColor: theme.card }]}>
                    <Text style={[styles.reactionPickerTitle, { color: theme.text }]}>Add Reaction</Text>
                    <View style={styles.emojiGrid}>
                        {['❤️', '😂', '👍', '😍', '😮', '😢', '😡', '👏'].map((emoji) => (
                            <TouchableOpacity
                                key={emoji}
                                style={styles.emojiButton}
                                onPress={() => addReaction(emoji)}
                            >
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderInputBar = () => (
        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>  
            <TouchableOpacity 
                style={styles.attachButton}
                onPress={() => setShowMediaPicker(!showMediaPicker)}
            >
                <Ionicons name={showMediaPicker ? "close" : "add"} size={24} color={theme.text} />
            </TouchableOpacity>
            <TextInput
                style={[styles.input, { 
                    borderColor: theme.border, 
                    backgroundColor: theme.background,
                    color: theme.text 
                }]}
                placeholder="Type a message..."
                placeholderTextColor={theme.subtext}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                multiline={false}
                onFocus={() => {
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                }}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={24} color={theme.accent} />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={theme.accent} /></View>;
    }
    if (error) {
        return <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: theme.text }}>{error}</Text></View>;
    }

    return (
        <>
            <KeyboardAvoidingView 
                style={[styles.container, { backgroundColor: theme.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>  
                    <View style={[styles.container, { backgroundColor: theme.background }]}>  
                        {/* Chat Header */}
                        <View style={[styles.chatHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                            <View style={styles.chatHeaderInfo}>
                                <Text style={[styles.chatName, { color: theme.text }]}>
                                    {chatName || `Chat ${chatId}`}
                                </Text>
                                <Text style={[styles.chatStatus, { color: theme.subtext }]}>
                                    {messages.length} messages • Online
                                </Text>
                            </View>
                            <View style={styles.chatHeaderActions}>
                                <TouchableOpacity style={styles.headerActionButton}>
                                    <Ionicons name="call" size={20} color={theme.text} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.headerActionButton}
                                    onPress={() => setMenuVisible(true)}
                                >
                                    <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {/* Pinned Message Display */}
                        {pinnedMessage && (
                            <View style={[styles.pinnedMessageContainer, { backgroundColor: theme.accent + '20' }]}>
                                <View style={styles.pinnedHeader}>
                                    <Ionicons name="pin" size={16} color={theme.accent} />
                                    <Text style={[styles.pinnedTitle, { color: theme.accent }]}>Pinned Message</Text>
                                    <TouchableOpacity onPress={() => setPinnedMessage(null)}>
                                        <Ionicons name="close" size={16} color={theme.accent} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.pinnedText, { color: theme.text }]} numberOfLines={2}>
                                    {pinnedMessage.content}
                                </Text>
                            </View>
                        )}

                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            inverted
                            contentContainerStyle={styles.messagesContainer}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            onEndReached={() => {
                                // TODO: Load older messages
                            }}
                            onEndReachedThreshold={0.1}
                        />
                        
                        {showMediaPicker && (
                            <View style={styles.mediaPickerContainer}>
                                <Text style={[styles.mediaPickerTitle, { color: theme.text }]}>Media Options</Text>
                                <View style={styles.mediaOptions}>
                                    <TouchableOpacity style={styles.mediaOption}>
                                        <Ionicons name="camera" size={24} color={theme.text} />
                                        <Text style={[styles.mediaOptionText, { color: theme.text }]}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.mediaOption}>
                                        <Ionicons name="images" size={24} color={theme.text} />
                                        <Text style={[styles.mediaOptionText, { color: theme.text }]}>Gallery</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.mediaOption}>
                                        <Ionicons name="document" size={24} color={theme.text} />
                                        <Text style={[styles.mediaOptionText, { color: theme.text }]}>Document</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        
                        {renderInputBar()}
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
            
            {/* Reaction Picker Modal */}
            {renderReactionPicker()}

            {/* Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', top: 60, right: 20, backgroundColor: '#fff', borderRadius: 8, elevation: 5, minWidth: 200 }}>
                    {[
                        { label: 'View contact', screen: 'ContactProfile' },
                        { label: 'Search', screen: 'SearchScreen' },
                        { label: 'New group', screen: 'NewGroupScreen' },
                        { label: 'Media, links, and docs', screen: 'MediaSharedScreen' },
                        { label: 'Chat theme', screen: 'ChatSettingsScreen' },
                    ].map((item, idx) => (
                        <TouchableOpacity
                            key={item.label}
                            style={{ padding: 16, borderBottomWidth: idx < 4 ? 1 : 0, borderBottomColor: '#eee' }}
                            onPress={() => {
                                setMenuVisible(false);
                                // navigation.navigate(item.screen as never);
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
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: { 
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    chatHeaderInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    chatStatus: {
        fontSize: 12,
    },
    chatHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerActionButton: {
        padding: 8,
        marginLeft: 8,
    },
    messagesContainer: { 
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexGrow: 1,
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
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    messageTime: { 
        fontSize: 10,
    },
    seenIndicator: {
        fontSize: 10,
        marginLeft: 5,
    },
    reactionContainer: {
        position: 'absolute',
        top: -8,
        right: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    reactionEmoji: {
        fontSize: 12,
    },
    pinnedMessageContainer: {
        margin: 10,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
    },
    pinnedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    pinnedTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        flex: 1,
    },
    pinnedText: {
        fontSize: 14,
        lineHeight: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactionPicker: {
        padding: 20,
        borderRadius: 12,
        minWidth: 250,
    },
    reactionPickerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    emojiButton: {
        padding: 10,
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    emojiText: {
        fontSize: 20,
    },
    mediaPickerContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    mediaPickerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    mediaOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    mediaOption: {
        alignItems: 'center',
        padding: 12,
    },
    mediaOptionText: {
        fontSize: 12,
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        paddingBottom: 15,
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 20 : 0,
    },
    attachButton: {
        padding: 8,
        marginRight: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: { 
        marginLeft: 10, 
        alignSelf: 'center',
        padding: 8,
    },
}); 