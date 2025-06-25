import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getContacts } from '../api/ContactsService';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.actionRow}>
          <Ionicons name="people-outline" size={22} color="#d0021b" style={{ marginRight: 12 }} />
          <Text style={styles.actionText}>New Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <Ionicons name="person-add-outline" size={22} color="#d0021b" style={{ marginRight: 12 }} />
          <Text style={styles.actionText}>New Contacts</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#d0021b" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.lastSeen}>{item.lastSeen}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="person-add" size={28} color="#fff" />
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
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 12, marginBottom: 8 },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  actionText: { color: '#d0021b', fontWeight: 'bold', fontSize: 15 },
  list: { flex: 1 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f2f2f7' },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  lastSeen: { fontSize: 13, color: '#888', marginTop: 2 },
  fab: { position: 'absolute', right: 24, bottom: 32, backgroundColor: '#d0021b', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
}); 