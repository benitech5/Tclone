import React, { useState, useRef, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
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
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../SettingsContext';
import { useTheme } from '../../ThemeContext';
import { getMessages, sendMessage } from '../../api/ChatService';

export default function ChatDetailsScreen() {
    const [message, setMessage] = useState('');
    const route = useRoute();
    const { chatSettings } = useSettings();
    const { theme } = useTheme();
    // @ts-ignore
    const chatId = route.params?.chatId;
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getMessages(chatId);
                setMessages(res.data);
            } catch (err: any) {
                setError('Failed to load messages');
            } finally {
                setLoading(false);
            }
        };
        if (chatId) fetchMessages();
    }, [chatId]);

    const handleSend = async () => {
        if (message.trim() === '') return;
        try {
            await sendMessage({ groupId: chatId, content: message, type: 'TEXT' });
            // Re-fetch messages after sending
            const res = await getMessages(chatId);
            setMessages(res.data);
            setMessage('');
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (err) {
            setError('Failed to send message');
        }
    };

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.messageBubble, 
            item.isPinned ? styles.myMessage : styles.theirMessage,
            { borderRadius: chatSettings.messageCorner },
            item.isPinned ? { backgroundColor: theme.accent } : { backgroundColor: theme.card }
        ]}>
            <Text style={[
                item.isPinned ? styles.myMessageText : styles.messageText,
                { fontSize: chatSettings.messageSize },
                item.isPinned ? { color: '#fff' } : { color: theme.text }
            ]}>
                {item.content}
            </Text>
            <Text style={[styles.messageTime, { color: theme.subtext }]}>{item.sentAt ? new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
        </View>
    );

    if (loading) {
        return <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={theme.accent} /></View>;
    }
    if (error) {
        return <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: theme.text }}>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>  
            <View style={[styles.container, { backgroundColor: theme.background }]}>  
                <Text style={{ textAlign: 'center', color: theme.subtext, marginTop: 10 }}>Chat ID: {chatId}</Text>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.messagesContainer}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
                <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>  
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: { 
        flex: 1,
    },
    messagesContainer: { 
        padding: 15, 
        paddingBottom: 20,
        flexGrow: 1,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        marginBottom: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    theirMessage: {
        alignSelf: 'flex-start',
    },
    messageText: {},
    myMessageText: {},
    messageTime: { fontSize: 10, marginTop: 5 },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        paddingBottom: 15, // Increased padding to move input up and avoid nav buttons
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 20 : 0, // Extra margin for Android
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
    },
    sendButton: { 
        marginLeft: 10, 
        alignSelf: 'center',
        padding: 8,
    },
});