import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useTheme } from '../../ThemeContext';

// Mock data for contacts
const mockContacts = [
  { id: '1', name: 'Alice Johnson', phone: '+233 123456789', avatar: null },
  { id: '2', name: 'Bob Smith', phone: '+233 987654321', avatar: null },
  { id: '3', name: 'Carol Davis', phone: '+233 555666777', avatar: null },
  { id: '4', name: 'David Wilson', phone: '+233 111222333', avatar: null },
  { id: '5', name: 'Eva Brown', phone: '+233 444555666', avatar: null },
];

const ContactsScreen = () => {
  const { theme } = useTheme();

  const renderContact = ({ item }: { item: typeof mockContacts[0] }) => (
    <TouchableOpacity style={[styles.contactItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.avatar}>
        <Text style={[styles.avatarText, { color: theme.accent }]}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.contactPhone, { color: theme.subtext }]}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={mockContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Stylesheet with proper typing
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 2,
    borderRadius: 25,
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 15,
  },
});

export default ContactsScreen;