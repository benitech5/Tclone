import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { requestOtp } from '../api/AuthService';
import { useAuth } from '../store/AuthContext';

// Mock logo (replace with actual asset if available)
const LOGO_URL = 'https://via.placeholder.com/80x80.png?text=Logo';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!phone || !password) {
            setError('Please enter your phone and password.');
            return;
        }
        setLoading(true);
        try {
            // If you have a login endpoint, use it here. Otherwise, use requestOtp as a placeholder.
            await requestOtp(phone, password); // This should trigger OTP flow
            navigation.navigate('Otp', { phoneNumber: phone });
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Image source={{ uri: LOGO_URL }} style={styles.logo} />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Login to your account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#aaa"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Otp', { phoneNumber: phone })}>
                    <Text style={styles.link}>Forgot password?</Text>
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
    logo: {
        width: 80,
        height: 80,
        marginBottom: 24,
        borderRadius: 20,
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
