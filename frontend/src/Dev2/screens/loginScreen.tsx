import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { NameInput } from '../component/nameInput';
import { PhoneNumberInput } from '../component/phoneNumberInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { requestOtp } from '../api/AuthService';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleContinue = async () => {
        if (!name || !phone) {
            Alert.alert('Validation Failed', 'Both name and phone number are required.');
            return;
        }
        try {
            await requestOtp(phone, name);
            navigation.navigate('Otp', { phoneNumber: phone });
        } catch (error) {
            Alert.alert('Request Failed', 'Could not request OTP. Please try again.');
            console.error(error);
        }
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
