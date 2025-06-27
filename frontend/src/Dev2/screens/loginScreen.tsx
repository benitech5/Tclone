import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { useAuth } from '../store/AuthContext';

// Mock logo (replace with actual asset if available)
const LOGO_URL = 'https://via.placeholder.com/80x80.png?text=Logo';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { requestOtp } = useAuth();
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await requestOtp(phone);
            navigation.navigate('Otp', { phone });
        } catch (e) {
            setError('Failed to send OTP.');
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
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

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
        marginBottom: 32,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
});

export default LoginScreen;
