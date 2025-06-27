import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const NewContactScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phones, setPhones] = useState(['']);

  const addPhone = () => setPhones([...phones, '']);
  const updatePhone = (idx, value) => {
    const updated = [...phones];
    updated[idx] = value;
    setPhones(updated);
  };
  const removePhone = (idx) => setPhones(phones.filter((_, i) => i !== idx));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}><Text style={styles.avatarLetter}>N</Text></View>
      </View>
      <Text style={styles.title}>New Contact</Text>
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />
      </View>
      {phones.map((phone, idx) => (
        <View key={idx} style={styles.phoneRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={phone}
            onChangeText={v => updatePhone(idx, v)}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          {phones.length > 1 && (
            <TouchableOpacity onPress={() => removePhone(idx)} style={styles.removeBtn}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addPhone} style={styles.addPhoneBtn}>
        <Text style={styles.addPhoneText}>+ Add Phone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 16 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#b2f7ef', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarLetter: { fontSize: 36, color: '#888', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  formRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginRight: 8, marginBottom: 8 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  removeBtn: { marginLeft: 8, backgroundColor: '#eee', borderRadius: 16, padding: 4 },
  removeText: { color: '#e53935', fontWeight: 'bold', fontSize: 16 },
  addPhoneBtn: { marginBottom: 16 },
  addPhoneText: { color: '#e53935', fontWeight: 'bold' },
  createBtn: { backgroundColor: '#e53935', borderRadius: 8, padding: 16, alignItems: 'center' },
  createText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default NewContactScreen; 