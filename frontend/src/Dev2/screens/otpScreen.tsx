import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import { useAuth } from '../store/AuthContext';
import { useAppDispatch } from '../store/store';
import { login as reduxLogin } from '../store/authSlice';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

const OtpScreen = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { verifyOtp } = useAuth();
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { phone } = route.params || {};
    const dispatch = useAppDispatch();

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        try {
            await verifyOtp(phone, otp);
            navigation.navigate('Home');
        } catch (e) {
            setError('Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>We sent a code to {phone}</Text>
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
};

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

export default OtpScreen;
