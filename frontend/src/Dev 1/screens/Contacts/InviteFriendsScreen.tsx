import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  TextInput,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

type InviteFriendsNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'InviteFriends'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface InviteFriendsScreenProps {
  navigation: InviteFriendsNavigationProp;
  route: {
    params: {
      groupId?: string;
      groupName?: string;
    };
  };
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isSelected: boolean;
  isAlreadyMember?: boolean;
}

interface InviteMethod {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'John Doe', phoneNumber: '+1234567890', isSelected: false },
  { id: '2', name: 'Jane Smith', phoneNumber: '+1234567891', isSelected: false, isAlreadyMember: true },
  { id: '3', name: 'Mike Johnson', phoneNumber: '+1234567892', isSelected: false },
  { id: '4', name: 'Sarah Wilson', phoneNumber: '+1234567893', isSelected: false },
  { id: '5', name: 'Alex Brown', phoneNumber: '+1234567894', isSelected: false },
  { id: '6', name: 'Emily Davis', phoneNumber: '+1234567895', isSelected: false },
  { id: '7', name: 'David Miller', phoneNumber: '+1234567896', isSelected: false },
  { id: '8', name: 'Lisa Garcia', phoneNumber: '+1234567897', isSelected: false },
];

const inviteMethods: InviteMethod[] = [
  {
    id: 'share',
    title: 'Share Invite Link',
    subtitle: 'Share via message, email, or social media',
    icon: 'share-social',
    color: '#4CAF50',
  },
  {
    id: 'copy',
    title: 'Copy Invite Link',
    subtitle: 'Copy link to clipboard',
    icon: 'copy',
    color: '#2196F3',
  },
  {
    id: 'qr',
    title: 'QR Code',
    subtitle: 'Show QR code for easy joining',
    icon: 'qr-code',
    color: '#FF9800',
  },
  {
    id: 'contacts',
    title: 'Invite from Contacts',
    subtitle: 'Select contacts to invite directly',
    icon: 'people',
    color: '#9C27B0',
  },
];

const InviteFriendsScreen: React.FC<InviteFriendsScreenProps> = ({ navigation, route }) => {
  const { groupId, groupName } = route.params || {}; // <-- This prevents the crash
  const { theme } = useTheme();
  
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isInviting, setIsInviting] = useState(false);

  if (!groupId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No group selected. Please open this screen from a group context.</Text>
      </View>
    );
  }

  const availableContacts = contacts.filter(contact => !contact.isAlreadyMember);
  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  const handleContactToggle = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact || contact.isAlreadyMember) return;

    if (contact.isSelected) {
      setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
      setContacts(prev => prev.map(c => 
        c.id === contactId ? { ...c, isSelected: false } : c
      ));
    } else {
      setSelectedContacts(prev => [...prev, contact]);
      setContacts(prev => prev.map(c => 
        c.id === contactId ? { ...c, isSelected: true } : c
      ));
    }
  };

  const handleInviteMethod = async (method: InviteMethod) => {
    const inviteLink = `https://yourapp.com/invite/${groupId || 'general'}`;
    const inviteMessage = groupName 
      ? `Join "${groupName}" on our app! ${inviteLink}`
      : `Join our app! ${inviteLink}`;

    switch (method.id) {
      case 'share':
        try {
          await Share.share({
            message: inviteMessage,
            title: groupName ? `Invite to ${groupName}` : 'App Invite',
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to share invite');
        }
        break;
      
      case 'copy':
        // TODO: Implement clipboard functionality
        Alert.alert('Success', 'Invite link copied to clipboard!');
        break;
      
      case 'qr':
        // TODO: Navigate to QR code screen
        Alert.alert('QR Code', 'QR code screen would open here');
        break;
      
      case 'contacts':
        // This is handled by the contact selection below
        break;
    }
  };

  const handleInviteSelectedContacts = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert('No Contacts Selected', 'Please select contacts to invite');
      return;
    }

    setIsInviting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Invites Sent!',
        `Successfully sent invites to ${selectedContacts.length} contact(s)`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset selections
              setSelectedContacts([]);
              setContacts(prev => prev.map(c => ({ ...c, isSelected: false })));
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send invites. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const renderInviteMethod = ({ item }: { item: InviteMethod }) => (
    <TouchableOpacity
      style={[styles.inviteMethod, { backgroundColor: theme.card }]}
      onPress={() => handleInviteMethod(item)}
    >
      <View style={[styles.methodIcon, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      
      <View style={styles.methodContent}>
        <Text style={[styles.methodTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.methodSubtitle, { color: theme.subtext }]}>
          {item.subtitle}
        </Text>
      </View>
      
      <Icon name="chevron-forward" size={20} color={theme.subtext} />
    </TouchableOpacity>
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { backgroundColor: theme.card },
        item.isSelected && { backgroundColor: theme.primary + '20' },
        item.isAlreadyMember && { opacity: 0.5 }
      ]}
      onPress={() => handleContactToggle(item.id)}
      disabled={item.isAlreadyMember}
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
        {item.isAlreadyMember && (
          <Text style={[styles.alreadyMember, { color: theme.primary }]}>
            Already a member
          </Text>
        )}
      </View>
      
      {!item.isAlreadyMember && (
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
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Invite Friends</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Share Konvo with your friends and family
      </Text>
      
      <ScrollView style={styles.optionsContainer}>
        {inviteOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionItem, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
              <Ionicons name={option.icon as any} size={24} color="#fff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>{option.title}</Text>
              <Text style={[styles.optionSubtitle, { color: theme.subtext }]}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.subtext }]}>
          Your friends will receive an invitation to join Konvo
        </Text>
        <FlatList
          data={inviteMethods}
          renderItem={renderInviteMethod}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.inviteMethodsList}
        />
      </View>

      {/* Contacts Section */}
      <View style={styles.contactsSection}>
        <View style={styles.contactsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Invite from Contacts
          </Text>
          {selectedContacts.length > 0 && (
            <Text style={[styles.selectedCount, { color: theme.primary }]}>
              {selectedContacts.length} selected
            </Text>
          )}
        </View>

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
      </View>

      {/* Bottom Action */}
      {selectedContacts.length > 0 && (
        <View style={[styles.bottomAction, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[styles.inviteAllButton, { backgroundColor: theme.primary }]}
            onPress={handleInviteSelectedContacts}
            disabled={isInviting}
          >
            <Text style={styles.inviteAllButtonText}>
              {isInviting ? 'Sending Invites...' : `Invite ${selectedContacts.length} Contact(s)`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  inviteButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  inviteMethodsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inviteMethodsList: {
    paddingHorizontal: 16,
  },
  inviteMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
  },
  contactsSection: {
    flex: 1,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '500',
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
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default InviteFriendsScreen; 