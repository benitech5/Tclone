import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { requestOtp } from '../api/AuthService';
import { NameInput } from '../component/nameInput';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';

export default function PhoneNumberScreen() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Otp'>>();

  const handleRequestOtp = async () => {
    if (!phone || !name) return;
    setLoading(true);
    setError('');
    try {
      await requestOtp(phone, name);
      navigation.navigate('Otp', { phoneNumber: phone });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Phone</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#fff" style={{ marginRight: 16 }} />
          <Ionicons name="globe-outline" size={22} color="#fff" />
        </View>
      </View>
      <View style={styles.body}>
        <NameInput onValidName={setName} />
        <Text style={styles.label}>Country</Text>
        <Text style={styles.country}>USA</Text>
        <View style={styles.phoneRow}>
          <Text style={styles.countryCode}>+ 1</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#aaa"
          />
        </View>
        <Text style={styles.infoText}>
          An SMS would be sent with a confirmation code to your phone number shortly.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={handleRequestOtp}
        disabled={!phone || !name || loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="arrow-forward" size={28} color="#fff" />}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#d0021b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    padding: 24,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  country: {
    fontSize: 18,
    color: '#222',
    marginBottom: 18,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  countryCode: {
    fontSize: 18,
    color: '#d0021b',
    marginRight: 8,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#d0021b',
    fontSize: 18,
    color: '#222',
    paddingVertical: 4,
  },
  infoText: {
    color: '#888',
    fontSize: 13,
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#d0021b',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
}); 