import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

type EditProfileNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'EditProfile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface EditProfileScreenProps {
  navigation: EditProfileNavigationProp;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
  privacy: {
    showPhoneNumber: boolean;
    showEmail: boolean;
    showLastSeen: boolean;
    showReadReceipts: boolean;
    allowGroupInvites: boolean;
    allowChannelInvites: boolean;
  };
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    bio: 'Software developer passionate about creating amazing mobile apps. Love coding, coffee, and good conversations!',
    phoneNumber: '+1234567890',
    email: 'john.doe@example.com',
    avatar: undefined,
    privacy: {
      showPhoneNumber: true,
      showEmail: false,
      showLastSeen: true,
      showReadReceipts: true,
      allowGroupInvites: true,
      allowChannelInvites: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const handleAvatarPick = async (type: 'camera' | 'gallery') => {
    try {
      let result;
      
      if (type === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Camera permission is required to take a photo');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Gallery permission is required to select a photo');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setProfileData(prev => ({
          ...prev,
          avatar: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveAvatar = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileData(prev => ({ ...prev, avatar: undefined }));
          }
        },
      ]
    );
  };

  const handlePrivacyToggle = (key: keyof ProfileData['privacy']) => {
    setProfileData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      }
    }));
  };

  const handleSaveProfile = async () => {
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    if (profileData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(profileData.username)) {
      Alert.alert('Error', 'Username must be 3-20 characters, letters, numbers, and underscores only');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Send to backend
      console.log('Saving profile:', profileData);

      Alert.alert(
        'Success', 
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderAvatarSection = () => (
    <View style={[styles.avatarSection, { backgroundColor: theme.card }]}>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => setShowAvatarOptions(true)}
      >
        {profileData.avatar ? (
          <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarPlaceholderText}>
              {profileData.firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={[styles.avatarEditButton, { backgroundColor: theme.primary }]}>
          <Icon name="camera" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.avatarActions}>
        <TouchableOpacity
          style={[styles.avatarAction, { backgroundColor: theme.background }]}
          onPress={() => setShowAvatarOptions(true)}
        >
          <Icon name="camera" size={16} color={theme.primary} />
          <Text style={[styles.avatarActionText, { color: theme.primary }]}>
            Change Photo
          </Text>
        </TouchableOpacity>
        
        {profileData.avatar && (
          <TouchableOpacity
            style={[styles.avatarAction, { backgroundColor: theme.background }]}
            onPress={handleRemoveAvatar}
          >
            <Icon name="trash" size={16} color="#ff4444" />
            <Text style={[styles.avatarActionText, { color: '#ff4444' }]}>
              Remove
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    maxLength?: number,
    multiline = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: theme.text }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          { 
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border
          },
          multiline && styles.multilineInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.subtext}
        maxLength={maxLength}
        multiline={multiline}
      />
    </View>
  );

  const renderPrivacySetting = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={[styles.privacyItem, { backgroundColor: theme.card }]}>
      <View style={styles.privacyInfo}>
        <View style={[styles.privacyIcon, { backgroundColor: theme.primary + '20' }]}>
          <Icon name={icon} size={20} color={theme.primary} />
        </View>
        
        <View style={styles.privacyContent}>
          <Text style={[styles.privacyTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.privacySubtitle, { color: theme.subtext }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary + '40' }}
        thumbColor={value ? theme.primary : theme.subtext}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelButton, { color: theme.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Edit Profile
        </Text>
        
        <TouchableOpacity 
          onPress={handleSaveProfile}
          disabled={isSaving}
        >
          <Text style={[
            styles.saveButton,
            { 
              color: !isSaving ? theme.primary : theme.subtext
            }
          ]}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        {renderAvatarSection()}

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Personal Information
          </Text>
          
          {renderInputField(
            'First Name',
            profileData.firstName,
            (text) => setProfileData(prev => ({ ...prev, firstName: text })),
            'Enter your first name',
            50
          )}
          
          {renderInputField(
            'Last Name',
            profileData.lastName,
            (text) => setProfileData(prev => ({ ...prev, lastName: text })),
            'Enter your last name',
            50
          )}
          
          {renderInputField(
            'Username',
            profileData.username,
            (text) => setProfileData(prev => ({ ...prev, username: text })),
            'Enter username (optional)',
            20
          )}
          
          {renderInputField(
            'Bio',
            profileData.bio,
            (text) => setProfileData(prev => ({ ...prev, bio: text })),
            'Tell us about yourself...',
            200,
            true
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Contact Information
          </Text>
          
          {renderInputField(
            'Phone Number',
            profileData.phoneNumber,
            (text) => setProfileData(prev => ({ ...prev, phoneNumber: text })),
            'Enter your phone number'
          )}
          
          {renderInputField(
            'Email',
            profileData.email,
            (text) => setProfileData(prev => ({ ...prev, email: text })),
            'Enter your email address'
          )}
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Privacy Settings
          </Text>
          
          {renderPrivacySetting(
            'call',
            'Show Phone Number',
            'Allow others to see your phone number',
            profileData.privacy.showPhoneNumber,
            () => handlePrivacyToggle('showPhoneNumber')
          )}
          
          {renderPrivacySetting(
            'mail',
            'Show Email',
            'Allow others to see your email address',
            profileData.privacy.showEmail,
            () => handlePrivacyToggle('showEmail')
          )}
          
          {renderPrivacySetting(
            'time',
            'Show Last Seen',
            'Show when you were last online',
            profileData.privacy.showLastSeen,
            () => handlePrivacyToggle('showLastSeen')
          )}
          
          {renderPrivacySetting(
            'checkmark-done',
            'Read Receipts',
            'Show when you have read messages',
            profileData.privacy.showReadReceipts,
            () => handlePrivacyToggle('showReadReceipts')
          )}
          
          {renderPrivacySetting(
            'people',
            'Group Invites',
            'Allow others to invite you to groups',
            profileData.privacy.allowGroupInvites,
            () => handlePrivacyToggle('allowGroupInvites')
          )}
          
          {renderPrivacySetting(
            'radio',
            'Channel Invites',
            'Allow others to invite you to channels',
            profileData.privacy.allowChannelInvites,
            () => handlePrivacyToggle('allowChannelInvites')
          )}
        </View>
      </ScrollView>

      {/* Avatar Options Modal */}
      <Modal
        visible={showAvatarOptions}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Change Profile Photo
              </Text>
              <TouchableOpacity onPress={() => setShowAvatarOptions(false)}>
                <Icon name="close" size={24} color={theme.subtext} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={() => {
                setShowAvatarOptions(false);
                handleAvatarPick('camera');
              }}
            >
              <Icon name="camera" size={24} color={theme.primary} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>
                Take Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={() => {
                setShowAvatarOptions(false);
                handleAvatarPick('gallery');
              }}
            >
              <Icon name="images" size={24} color={theme.primary} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            
            {profileData.avatar && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowAvatarOptions(false);
                  handleRemoveAvatar();
                }}
              >
                <Icon name="trash" size={24} color="#ff4444" />
                <Text style={[styles.modalOptionText, { color: '#ff4444' }]}>
                  Remove Current Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  avatarActionText: {
    fontSize: 14,
    fontWeight: '500',
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
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    gap: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditProfileScreen; 