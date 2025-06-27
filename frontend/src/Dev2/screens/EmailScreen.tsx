import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const EmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (email.includes('@')) {
      navigation.navigate('ConfirmationCode');
    } else {
      setError('Please enter a valid email address.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginBottom: 8 },
});

export default EmailScreen; 