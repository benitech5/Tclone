import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { verifyOtp } from '../api/AuthService';
import { useAuth } from '../store/AuthContext';
import { useAppDispatch } from '../store/store';
import { login as reduxLogin } from '../store/authSlice';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

export default function OtpScreen() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { login } = useAuth();
    const phoneNumber = route.params?.phoneNumber;
    const dispatch = useAppDispatch();

    const handleVerify = async () => {
        console.log('handleVerify called');
        if (!otp) {
            setError('Please enter the OTP.');
            console.log('OTP input is empty, exiting handleVerify');
            return;
        }
        console.log('Setting loading to true');
        setLoading(true);
        try {
            console.log('Verifying OTP with:', { phoneNumber, otp });
            const response = await verifyOtp(phoneNumber, otp);
            console.log('OTP verification response:', response);
            // Assume response contains { user, token }
            if (response && response.token && response.user) {
                await login(response.user, response.token);
                dispatch(reduxLogin({
                  name: response.user.firstName || '',
                  email: response.user.phoneNumber || '',
                }));
            } else {
                setError('Invalid OTP or server error.');
            }
        } catch (err) {
            setError('OTP verification failed.');
            console.log('Error during OTP verification:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>We sent a code to {phoneNumber}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    placeholderTextColor="#aaa"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleVerify} disabled={loading || !otp}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>Back</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fafafa',
        color: '#222',
    },
    button: {
        width: '100%',
        height: 48,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        color: '#007AFF',
        fontSize: 16,
        marginTop: 8,
    },
    error: {
        color: 'red',
        marginBottom: 8,
        fontSize: 14,
    },
});
