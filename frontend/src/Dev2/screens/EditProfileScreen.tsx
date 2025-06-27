import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const user = {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  firstName: 'Numeria',
  lastName: 'Navade',
  bio: 'Visual and UI Designer ✌️',
  phone: '+233 00 000 0000',
  username: '@numevade4389',
};

const EditProfileScreen = () => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [bio, setBio] = useState(user.bio);
  const [phone, setPhone] = useState(user.phone);
  const [username, setUsername] = useState(user.username);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TouchableOpacity>
          <Text style={styles.addPhoto}>Add New Photo</Text>
        </TouchableOpacity>
      </View>
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
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        multiline
      />
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone number</Text>
        <Text style={styles.infoValue}>{phone}</Text>
        <TouchableOpacity><Text style={styles.changeBtn}>Change</Text></TouchableOpacity>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Username</Text>
        <Text style={styles.infoValue}>{username}</Text>
        <TouchableOpacity><Text style={styles.changeBtn}>Change</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  addPhoto: { color: '#e53935', fontWeight: 'bold', marginBottom: 16 },
  formRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginRight: 8, marginBottom: 8 },
  bioInput: { minHeight: 48, marginRight: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoLabel: { flex: 1, fontSize: 16, color: '#888' },
  infoValue: { flex: 2, fontSize: 16 },
  changeBtn: { color: '#e53935', fontWeight: 'bold', marginLeft: 8 },
  logoutBtn: { marginTop: 32, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e53935', borderRadius: 8, padding: 16, alignItems: 'center' },
  logoutText: { color: '#e53935', fontWeight: 'bold', fontSize: 16 },
});

export default EditProfileScreen; 