import React, { useState, useRef } from 'react';
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
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../SettingsContext';
import { useTheme } from '../../ThemeContext';

const mockMessages = [
    { id: '1', text: 'Hey there!', time: '12:30 PM', isMe: false },
    { id: '2', text: 'Hi! How are you?', time: '12:32 PM', isMe: true },
];

export default function ChatDetailsScreen() {
    const [message, setMessage] = useState('');
    const route = useRoute();
    const { chatSettings } = useSettings();
    const { theme } = useTheme();
    // @ts-ignore
    const chatId = route.params?.chatId;
    const [messages, setMessages] = useState(mockMessages);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (message.trim() === '') return;
        const newMsg = {
            id: Date.now().toString(),
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        };
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.messageBubble, 
            item.isMe ? styles.myMessage : styles.theirMessage,
            { borderRadius: chatSettings.messageCorner },
            item.isMe ? { backgroundColor: theme.accent } : { backgroundColor: theme.card }
        ]}>
            <Text style={[
                item.isMe ? styles.myMessageText : styles.messageText,
                { fontSize: chatSettings.messageSize },
                item.isMe ? { color: '#fff' } : { color: theme.text }
            ]}>
                {item.text}
            </Text>
            <Text style={[styles.messageTime, { color: theme.subtext }]}>{item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Show chatId for debugging */}
                <Text style={{ textAlign: 'center', color: theme.subtext, marginTop: 10 }}>Chat ID: {chatId}</Text>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
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