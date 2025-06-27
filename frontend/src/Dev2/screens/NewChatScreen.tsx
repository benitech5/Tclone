import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';

const mockContacts = [
  { id: '1', name: 'John Doe', avatar: 'https://via.placeholder.com/48x48.png?text=JD' },
  { id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/48x48.png?text=JS' },
  { id: '3', name: 'Alex Brown', avatar: 'https://via.placeholder.com/48x48.png?text=AB' },
];

export default function NewChatScreen() {
  const [search, setSearch] = useState('');
  const filteredContacts = mockContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start New Chat</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search contacts..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#aaa"
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  searchBar: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
}); 