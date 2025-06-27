// components/NameInput.tsx
import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
interface Props {
    onValidName: (name: string) => void;
}

export const NameInput: React.FC<Props> = ({ onValidName }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleChange = (text: string) => {
        // Remove invalid characters
        const filtered = text.replace(/[^a-zA-Z\s'-]/g, '');

        // Reject leading space
        if (filtered.startsWith(' ')) return;

        setName(filtered);

        // Check if valid
        if (filtered.length >= 2) {
            setError('');
            onValidName(filtered);
        } else {
            setError('Name must be at least 2 characters');
        }
    };

    return (
        <View style={styles.container}>
        <TextInput
            placeholder="Enter your name"
    value={name}
    onChangeText={handleChange}
    style={styles.input}
    />
    {error !== '' && <Text style={styles.error}>{error}</Text>}
        </View>
    );
    };

    const styles = StyleSheet.create({
        container: { marginVertical: 10 },
        input: {
            borderWidth: 1,
            borderColor: '#aaa',
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
        },
        error: {
            color: 'red',
            fontSize: 12,
            marginTop: 4,
        },
    });
