import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const PhoneLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);

    const validatePhoneNumber = (number: string) => {
        const regex = /^[0-9]{10,15}$/;
        const valid = regex.test(number);
        setIsValid(valid);
        setPhoneNumber(number);
    };

    const handleSubmit = () => {
        if (isValid) {
            navigation.navigate('OTPScreen', { phoneNumber });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Enter Your Phone Number</Text>
                <Text style={styles.subtitle}>We'll send you a verification code</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.countryCode}>+1</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={validatePhoneNumber}
                        maxLength={15}
                    />
                </View>

                <Pressable
                    style={[styles.button, !isValid && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={!isValid}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    countryCode: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#A0C8FF',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PhoneLoginScreen;