import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EmailScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Email</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Enter your email address</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.infoText}>
          Please be sure to enter a valid email address
        </Text>
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ConfirmationCode')}>
        <Ionicons name="arrow-forward" size={28} color="#fff" />
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
  body: {
    padding: 24,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#d0021b',
    fontSize: 18,
    color: '#222',
    paddingVertical: 4,
    marginBottom: 8,
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
}); 