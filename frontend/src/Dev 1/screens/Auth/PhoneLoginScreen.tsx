import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { requestOtp } from '../../api/AuthService';

const PhoneLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [countryCode, setCountryCode] = useState('GH');
    const [callingCode, setCallingCode] = useState('233');
    const [countryName, setCountryName] = useState('Ghana');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryFlag, setCountryFlag] = useState('');
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState('');

    // Step 1: Name input
    const handleNameChange = (text: string) => {
        setName(text);
        if (text.length < 5) {
            setNameError('Name must be at least 5 characters');
        } else {
            setNameError('');
        }
    };
    const handleNameNext = () => {
        if (name.length >= 5) {
            setStep(2);
        } else {
            setNameError('Name must be at least 5 characters');
        }
    };

    // Step 2: Phone input
    const handleSelectCountry = (country: any) => {
        console.log('Selected country:', country);
        setCountryCode(country.code || countryCode);
        setCallingCode((country.dial_code && country.dial_code.replace('+', '')) || callingCode);
        setCountryName(
            typeof country.name === 'string'
                ? country.name
                : (country.name && country.name.en) || countryName
        );
        setCountryFlag(country.flag || '');
        setShowCountryPicker(false);
    };
    const handlePhoneChange = (text: string) => {
        // Remove non-numeric characters
        const filtered = text.replace(/[^0-9]/g, '');
        setPhoneNumber(filtered);
        // Validate phone number (excluding country code)
        if (filtered.length >= 7 && filtered.length <= 12) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    const handleSubmit = async () => {
        if (isValid) {
            setSending(true);
            setSendError('');
            const fullPhone = `+${callingCode}${phoneNumber}`;
            try {
                await requestOtp(fullPhone, name);
                setSending(false);
                navigation.navigate('Auth', { screen: 'Otp', params: { phoneNumber: fullPhone } });
            } catch (err: any) {
                setSending(false);
                setSendError(err.response?.data?.message || err.message || 'Failed to send OTP.');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                {step === 1 && (
                    <>
                        <Text style={styles.title}>Enter Your Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={handleNameChange}
                            />
                        </View>
                        {nameError !== '' && <Text style={styles.error}>{nameError}</Text>}
                        <Pressable
                            style={[styles.button, name.length < 5 && styles.disabledButton]}
                            onPress={handleNameNext}
                            disabled={name.length < 5}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </Pressable>
                    </>
                )}
                {step === 2 && (
                    <>
                        {/* Main header */}
                        <Text style={styles.title}>Phone number</Text>
                        {/* Subtext */}
                        <Text style={styles.subtitle}>Select your country and Enter your phone number</Text>
                        {/* Flag and country name */}
                        <Text style={styles.label}>
                            {countryFlag && <Text>{countryFlag} </Text>}
                            {countryName}
                        </Text>
                        <View style={styles.inputContainer}>
                            <Pressable onPress={() => setShowCountryPicker(true)}>
                                <Text style={styles.countryCode}>+{callingCode}</Text>
                            </Pressable>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone number"
                                keyboardType="number-pad"
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                maxLength={15}
                            />
                        </View>
                        <CountryPicker
                            show={showCountryPicker}
                            lang="en"
                            pickerButtonOnPress={(item) => {
                                handleSelectCountry(item);
                            }}
                            style={{ modal: { height: 400 } }}
                        />
                        {sendError ? <Text style={styles.error}>{sendError}</Text> : null}
                        <Pressable
                            style={[styles.button, (!isValid || sending) && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={!isValid || sending}
                        >
                            <Text style={styles.buttonText}>{sending ? 'Sending...' : 'Continue'}</Text>
                        </Pressable>
                        {/* Recaptcha container for web/Expo Go */}
                        {/* <div id="recaptcha-container"></div> */}
                    </>
                )}
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
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        color: '#333',
    },
    countryCode: {
        fontSize: 16,
        marginRight: 10,
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
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        marginLeft: 4,
    },
});

export default PhoneLoginScreen;