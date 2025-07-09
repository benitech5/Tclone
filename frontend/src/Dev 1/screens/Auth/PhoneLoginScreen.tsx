import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';

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
        setCountryName(country.name || countryName);
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

    const handleSubmit = () => {
        if (isValid) {
            const fullPhone = `+${callingCode}${phoneNumber}`;
            navigation.navigate('Auth', { screen: 'Otp', params: { phoneNumber: fullPhone, name } });
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
                        <Text style={styles.title}>Select your country</Text>
                        <Pressable
                            style={styles.inputContainer}
                            onPress={() => setShowCountryPicker(true)}
                        >
                            <Text style={{ flex: 1 }}>{countryName || 'Select Country'}</Text>
                        </Pressable>
                        <CountryPicker
                            show={showCountryPicker}
                            lang="en"
                            pickerButtonOnPress={(item) => {
                                handleSelectCountry(item);
                            }}
                            style={{ modal: { height: 400 } }}
                        />
                        <Text style={styles.label}>{countryName}</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.countryCode}>+{callingCode}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone number"
                                keyboardType="number-pad"
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
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