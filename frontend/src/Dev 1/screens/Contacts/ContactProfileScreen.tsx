import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Modal,
  Share,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type ContactProfileNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'ContactProfile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ContactProfileScreenProps {
  navigation: ContactProfileNavigationProp;
  route: {
    params: {
      contactId: string;
    };
  };
}

interface ContactInfo {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  email?: string;
  bio?: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isVerified: boolean;
  isBlocked: boolean;
  isFavorite: boolean;
  mutualContacts: number;
  joinedAt: Date;
  status: 'online' | 'offline' | 'away' | 'busy';
}

const mockContactInfo: ContactInfo = {
  id: '1',
  name: 'Jane Smith',
  username: 'janesmith',
  phoneNumber: '+1234567891',
  email: 'jane.smith@example.com',
  bio: 'Product designer and coffee enthusiast. Always exploring new ways to create beautiful user experiences.',
  avatar: undefined,
  isOnline: true,
  lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
  isVerified: true,
  isBlocked: false,
  isFavorite: true,
  mutualContacts: 12,
  joinedAt: new Date(Date.now() - 86400000 * 365), // 1 year ago
  status: 'online',
};

const ContactProfileScreen: React.FC<ContactProfileScreenProps> = ({ navigation, route }) => {
  const { contactId } = route.params;
  const { theme } = useTheme();
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>(mockContactInfo);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStartChat = () => {
    navigation.navigate('ChatDetails', {
      chatId: contactId,
      chatName: contactInfo.name,
    });
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    navigation.navigate('CallScreen', {
      callId: Date.now().toString(),
      callerName: contactInfo.name,
      callType: type,
      isIncoming: false,
    });
  };

  const handleShareContact = async () => {
    try {
      await Share.share({
        message: `Check out ${contactInfo.name}'s profile!\nPhone: ${contactInfo.phoneNumber}${contactInfo.email ? `\nEmail: ${contactInfo.email}` : ''}`,
        title: `${contactInfo.name}'s Contact Info`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share contact');
    }
  };

  const handleToggleFavorite = () => {
    setContactInfo(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    Alert.alert(
      'Success',
      `${contactInfo.name} has been ${contactInfo.isFavorite ? 'removed from' : 'added to'} favorites`
    );
  };

  const handleBlockContact = () => {
    setShowBlockModal(false);
    setContactInfo(prev => ({ ...prev, isBlocked: true }));
    Alert.alert(
      'Contact Blocked',
      `${contactInfo.name} has been blocked. You won't receive messages or calls from them.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleUnblockContact = () => {
    Alert.alert(
      'Unblock Contact',
      `Are you sure you want to unblock ${contactInfo.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => {
            setContactInfo(prev => ({ ...prev, isBlocked: false }));
            Alert.alert('Success', `${contactInfo.name} has been unblocked`);
          }
        },
      ]
    );
  };

  const handleDeleteContact = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contactInfo.name} from your contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            Alert.alert('Success', `${contactInfo.name} has been deleted from your contacts`);
          }
        },
      ]
    );
  };

  const renderActionButton = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    color?: string
  ) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: (color || theme.primary) + '20' }]}>
        <Icon name={icon} size={24} color={color || theme.primary} />
      </View>
      
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.actionSubtitle, { color: theme.subtext }]}>
          {subtitle}
        </Text>
      </View>
      
      <Icon name="chevron-forward" size={20} color={theme.subtext} />
    </TouchableOpacity>
  );

  const renderInfoItem = (label: string, value: string, icon?: string) => (
    <View style={[styles.infoItem, { backgroundColor: theme.card }]}>
      {icon && (
        <Icon name={icon} size={20} color={theme.subtext} style={styles.infoIcon} />
      )}
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: theme.subtext }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  const getStatusColor = (status: ContactInfo['status']) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'busy': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: ContactInfo['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            {contactInfo.avatar ? (
              <Image source={{ uri: contactInfo.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarPlaceholderText}>
                  {contactInfo.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(contactInfo.status) }
            ]} />
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.contactName, { color: theme.text }]}>
                {contactInfo.name}
              </Text>
              {contactInfo.isVerified && (
                <Icon name="checkmark-circle" size={20} color={theme.primary} />
              )}
            </View>
            
            <Text style={[styles.username, { color: theme.primary }]}>
              @{contactInfo.username}
            </Text>
            
            <View style={styles.statusRow}>
              <View style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(contactInfo.status) }
              ]} />
              <Text style={[styles.statusText, { color: theme.subtext }]}>
                {getStatusText(contactInfo.status)}
              </Text>
              {contactInfo.lastSeen && (
                <Text style={[styles.lastSeen, { color: theme.subtext }]}>
                  • Last seen {contactInfo.lastSeen.toLocaleTimeString()}
                </Text>
              )}
            </View>
            
            {contactInfo.bio && (
              <Text style={[styles.bio, { color: theme.subtext }]}>
                {contactInfo.bio}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={handleStartChat}
          >
            <Icon name="chatbubble" size={24} color={theme.primary} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Message
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={() => handleStartCall('audio')}
          >
            <Icon name="call" size={24} color="#4CAF50" />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Call
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={() => handleStartCall('video')}
          >
            <Icon name="videocam" size={24} color="#2196F3" />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Video
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={handleToggleFavorite}
          >
            <Icon 
              name={contactInfo.isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={contactInfo.isFavorite ? "#f44336" : theme.subtext} 
            />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              {contactInfo.isFavorite ? 'Favorited' : 'Favorite'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Contact Information
          </Text>
          
          {renderInfoItem('Phone', contactInfo.phoneNumber, 'call')}
          {contactInfo.email && renderInfoItem('Email', contactInfo.email, 'mail')}
          {renderInfoItem('Username', `@${contactInfo.username}`, 'at')}
          {renderInfoItem('Joined', contactInfo.joinedAt.toLocaleDateString(), 'calendar')}
          {renderInfoItem('Mutual Contacts', `${contactInfo.mutualContacts} contacts`, 'people')}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions
          </Text>
          
          {renderActionButton(
            'share',
            'Share Contact',
            'Share contact information',
            handleShareContact,
            '#4CAF50'
          )}
          
          {renderActionButton(
            'search',
            'Search in Chat',
            'Search for messages from this contact',
            () => navigation.navigate('Search', { contactId }),
            '#FF9800'
          )}
          
          {renderActionButton(
            'images',
            'Shared Media',
            'View photos and files shared with this contact',
            () => navigation.navigate('MediaShared', { contactId }),
            '#9C27B0'
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Danger Zone
          </Text>
          
          {contactInfo.isBlocked ? (
            renderActionButton(
              'lock-open',
              'Unblock Contact',
              'Allow messages and calls from this contact',
              handleUnblockContact,
              '#4CAF50'
            )
          ) : (
            renderActionButton(
              'lock-closed',
              'Block Contact',
              'Block messages and calls from this contact',
              () => setShowBlockModal(true),
              '#f44336'
            )
          )}
          
          {renderActionButton(
            'trash',
            'Delete Contact',
            'Remove this contact from your contacts list',
            () => setShowDeleteModal(true),
            '#f44336'
          )}
        </View>
      </ScrollView>

      {/* Block Contact Modal */}
      <Modal
        visible={showBlockModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Block Contact
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to block {contactInfo.name}? You won't receive messages or calls from them.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setShowBlockModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={handleBlockContact}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Block
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Contact Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Delete Contact
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to delete {contactInfo.name} from your contacts? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={handleDeleteContact}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    marginRight: 4,
  },
  lastSeen: {
    fontSize: 14,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  dangerSection: {
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ContactProfileScreen; 