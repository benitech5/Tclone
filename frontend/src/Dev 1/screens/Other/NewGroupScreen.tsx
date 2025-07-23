import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsHeader from '../Settings/SettingsHeader';

type NewGroupNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'NewGroup'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface NewGroupScreenProps {
  navigation: NewGroupNavigationProp;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isSelected: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'John Doe', phoneNumber: '+1234567890', isSelected: false },
  { id: '2', name: 'Jane Smith', phoneNumber: '+1234567891', isSelected: false },
  { id: '3', name: 'Mike Johnson', phoneNumber: '+1234567892', isSelected: false },
  { id: '4', name: 'Sarah Wilson', phoneNumber: '+1234567893', isSelected: false },
  { id: '5', name: 'Alex Brown', phoneNumber: '+1234567894', isSelected: false },
  { id: '6', name: 'Emily Davis', phoneNumber: '+1234567895', isSelected: false },
  { id: '7', name: 'David Miller', phoneNumber: '+1234567896', isSelected: false },
  { id: '8', name: 'Lisa Garcia', phoneNumber: '+1234567897', isSelected: false },
];

const NewGroupScreen: React.FC<NewGroupScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedContacts = contacts.filter(contact => contact.isSelected);

  const handleContactToggle = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isSelected: !contact.isSelected }
        : contact
    ));
  };

  const handleRemoveContact = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isSelected: false }
        : contact
    ));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedContacts.length === 0) {
      Alert.alert('Error', 'Please select at least one contact');
      return;
    }

    setIsCreating(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const groupData = {
        title: groupName.trim(),
        description: groupDescription.trim(),
        members: selectedContacts.map(c => c.id),
        type: 'GROUP',
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post('http://192.168.96.216:8082/api/chats', groupData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newGroup = response.data;
      Alert.alert('Success', `Group "${groupName}" created successfully!`);
      navigation.navigate('GroupChat', {
        groupId: newGroup.id,
        groupName: newGroup.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderSelectedContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.selectedContact}
      onPress={() => handleRemoveContact(item.id)}
    >
      <View style={[styles.selectedAvatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.selectedAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.selectedName, { color: theme.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Icon name="close-circle" size={16} color={theme.subtext} />
    </TouchableOpacity>
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { backgroundColor: theme.card },
        item.isSelected && { backgroundColor: theme.primary + '20' }
      ]}
      onPress={() => handleContactToggle(item.id)}
    >
      <View style={[styles.contactAvatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.contactAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.contactPhone, { color: theme.subtext }]}>
          {item.phoneNumber}
        </Text>
      </View>
      
      <View style={[
        styles.checkbox,
        { 
          backgroundColor: item.isSelected ? theme.primary : 'transparent',
          borderColor: item.isSelected ? theme.primary : theme.border
        }
      ]}>
        {item.isSelected && (
          <Icon name="checkmark" size={16} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SettingsHeader title="New Group" onBack={() => navigation.goBack()} />

      {/* Group Info Section */}
      <View style={[styles.groupInfoSection, { backgroundColor: theme.card }]}>
        <View style={styles.groupAvatar}>
          <Icon name="people" size={32} color={theme.primary} />
        </View>
        
        <View style={styles.groupInfo}>
          <TextInput
            style={[styles.groupNameInput, { color: theme.text }]}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Group name"
            placeholderTextColor={theme.subtext}
            maxLength={50}
          />
          
          <TextInput
            style={[styles.groupDescriptionInput, { color: theme.text }]}
            value={groupDescription}
            onChangeText={setGroupDescription}
            placeholder="Group description (optional)"
            placeholderTextColor={theme.subtext}
            multiline
            maxLength={200}
          />
        </View>
      </View>

      {/* Selected Contacts */}
      {selectedContacts.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Selected ({selectedContacts.length})
          </Text>
          <FlatList
            data={selectedContacts}
            renderItem={renderSelectedContact}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedList}
          />
        </View>
      )}

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search contacts..."
          placeholderTextColor={theme.subtext}
        />
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactsList}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupInfoSection: {
    flexDirection: 'row',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,136,204,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupNameInput: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  groupDescriptionInput: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectedSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedList: {
    paddingRight: 16,
  },
  selectedContact: {
    alignItems: 'center',
    marginRight: 16,
    maxWidth: 80,
  },
  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectedName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  contactsList: {
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewGroupScreen;