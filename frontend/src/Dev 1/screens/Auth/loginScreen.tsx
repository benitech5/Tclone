import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { NameInput } from '../../component/nameInput';
import { PhoneNumberInput } from '../../component/phoneNumberInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { requestOtp } from '../../api/AuthService';

// Use Auth stack navigation type

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isValid, setIsValid] = useState(false);
    const navigation = useNavigation<LoginScreenNavigationProp>();

    // Validation logic: both name and phone must be valid
    const handleName = (n: string) => {
        setName(n);
        setIsValid(n.length >= 2 && /^[0-9]{10,15}$/.test(phone));
    };
    const handlePhone = (p: string) => {
        setPhone(p);
        setIsValid(name.length >= 2 && /^[0-9]{10,15}$/.test(p));
    };

    const handleContinue = async () => {
        if (!isValid) {
            Alert.alert('Validation Failed', 'Both name and phone number are required and must be valid.');
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
            <NameInput onValidName={handleName} />
            <PhoneNumberInput onValidPhone={handlePhone} />
            <Button title="Continue" onPress={handleContinue} disabled={!isValid} />
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