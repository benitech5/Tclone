import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const OTPScreen = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    // Define handleChange function
    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Define handleBackspace function
    const handleBackspace = (index: number) => {
        if (index > 0 && !otp[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const setInputRef = (index: number) => (el: TextInput | null) => {
        inputRefs.current[index] = el;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Verification Code</Text>

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

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Verify</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 60,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OTPScreen;