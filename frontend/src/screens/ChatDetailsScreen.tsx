import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockMessages = [
    { id: '1', text: 'Hey there!', time: '12:30 PM', isMe: false },
    { id: '2', text: 'Hi! How are you?', time: '12:32 PM', isMe: true },
];

export default function ChatDetailsScreen() {
    const [message, setMessage] = useState('');

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.theirMessage]}>
            <Text style={item.isMe ? styles.myMessageText : styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <FlatList
                data={mockMessages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#0088cc" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    messagesContainer: { padding: 15 },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0088cc',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: { color: '#000' },
    myMessageText: { color: '#fff' },
    messageTime: { fontSize: 10, color: '#666', marginTop: 5 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    sendButton: { marginLeft: 10, alignSelf: 'center' },
});