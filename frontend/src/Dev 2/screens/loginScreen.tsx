import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { NameInput } from '../component/nameInput';
import { PhoneNumberInput } from '../component/phoneNumberInput';

export default function LoginScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleContinue = () => {
        if (!name || !phone) {
            Alert.alert('Validation Failed', 'Both name and phone number are required.');
            return;
        }
        Alert.alert('Success', `Logging in with ${name} (${phone})`);
        // TODO: call auth API
    };

    return (
        <View style={styles.container}>
            <NameInput onValidName={setName} />
            <PhoneNumberInput onValidPhone={setPhone} />
            <Button title="Continue" onPress={handleContinue} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});
