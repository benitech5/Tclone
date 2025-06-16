import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { useAppDispatch } from '../store/store';
import { login } from '../store/authSlice';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;

const OtpScreen = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const dispatch = useAppDispatch(); // ✅ should be inside the component

    const handleVerify = async () => {
        if (otp === '1234') {
            const user = { name: 'Benjamin', email: 'starblade1111@gmail.com' };

            await AsyncStorage.setItem('token', 'fake-jwt-token');
            await AsyncStorage.setItem('user', JSON.stringify(user));

            dispatch(login(user)); // ✅ update Redux

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }],
            });
        } else {
            setError('Invalid OTP. Try 1234.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="1234"
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
    title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
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
