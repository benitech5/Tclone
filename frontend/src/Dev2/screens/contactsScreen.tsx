import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactsService from '../api/ContactsService';

const ContactsScreen = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await ContactsService.getContacts();
        setContacts(data);
      } catch (e) {
        setError('Failed to load contacts.');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('NewContact')}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem} onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  contactItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  contactName: { fontSize: 18 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ContactsScreen; 