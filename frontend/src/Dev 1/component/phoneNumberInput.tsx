import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface Props {
    onValidPhone: (phone: string) => void;
}

export const PhoneNumberInput: React.FC<Props> = ({ onValidPhone }) => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleChange = (text: string) => {
        const filtered = text.replace(/[^0-9]/g, '');
        setPhone(filtered);

        if (/^[0-9]{10,15}$/.test(filtered)) {
            setError('');
            onValidPhone(filtered);
        } else {
            setError('Phone must be 10–15 digits');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter phone number"
                keyboardType="number-pad"
                value={phone}
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
