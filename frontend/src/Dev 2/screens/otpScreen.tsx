import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { useAppDispatch } from '../store/store';
import { login } from '../store/authSlice';
import { verifyOtp } from '../api/AuthService';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

const OtpScreen = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { phoneNumber } = route.params;
    const dispatch = useAppDispatch();

    const handleVerify = async () => {
        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }
        try {
            const { token, user } = await verifyOtp(phoneNumber, otp);

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            dispatch(login(user));

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }],
            });
        } catch (err) {
            setError('Invalid OTP. Please try again.');
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>A 6-digit code was sent to {phoneNumber}</Text>
            <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Verify OTP" onPress={handleVerify} />
            <Button title="Back to Login" onPress={() => navigation.goBack()} color="#999" />
        </View>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 18,
        textAlign: 'center',
    },
    error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});
