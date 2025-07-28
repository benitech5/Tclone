import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch } from '../../store/store';
import { login } from '../../store/authSlice';
import { verifyOtp, checkUserExists } from '../../api/AuthService';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

const OtpScreen = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { phoneNumber } = route.params;
    const dispatch = useAppDispatch();

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (index: number) => {
        if (index > 0 && !otp[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const setInputRef = (index: number) => (el: TextInput | null) => {
        inputRefs.current[index] = el;
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const data = await verifyOtp(phoneNumber, otpValue);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            dispatch(login(data.user));
            const exists = await checkUserExists(phoneNumber);
            setLoading(false);
            if (exists) {
                navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Main', params: { screen: 'Home' } }],
                });
            } else {
                navigation.navigate('ProfileSetup', { phoneNumber });
            }
        } catch (err: any) {
            setLoading(false);
            if (err.response?.status === 400) {
                setError('Invalid OTP. Please try again.');
            } else if (err.response?.status === 404) {
                navigation.navigate('ProfileSetup', { phoneNumber });
            } else {
                setError(err.response?.data?.message || err.message || 'Invalid OTP. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>A 6-digit code was sent to {phoneNumber}</Text>
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={setInputRef(index)}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                                handleBackspace(index);
                            }
                        }}
                    />
                ))}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading ? <ActivityIndicator size="large" color="#dc1432ff" style={{ marginBottom: 10 }} /> : null}
            <View style={[styles.verifyButtonWrapper,{width: '70%', alignSelf: 'center'}]}>
                <Button
                    title="Verify OTP"
                    onPress={handleVerify}
                    color="#dc1432ff"
                    disabled={loading}
                />
            </View>
            <View style={[styles.backButtonWrapper,{width: '70%', alignSelf: 'center'}]}>
                <Button
                    title="Back to Login"
                    onPress={() => navigation.goBack()}
                    color="#5A646F"
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 ,},
    title: { fontSize: 22, marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        textAlign: 'center',
        fontSize: 25,
        marginHorizontal: 5,
    },
    error: { color: 'red', marginBottom: 1, textAlign: 'center' },
    verifyButtonWrapper: {
        borderRadius: 35,
        overflow: 'hidden',
        marginBottom: 5,
    },
    backButtonWrapper: {
        borderRadius: 35,
        overflow: 'hidden',
        marginTop: 5,
    },
});

export default OtpScreen;
