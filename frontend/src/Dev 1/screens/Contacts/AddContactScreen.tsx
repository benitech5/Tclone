import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type AddContactNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'AddContact'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface AddContactScreenProps {
  navigation: AddContactNavigationProp;
}

interface ContactForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  company: string;
  jobTitle: string;
  notes: string;
  isFavorite: boolean;
  shareMyContact: boolean;
}

const AddContactScreen: React.FC<AddContactScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    company: '',
    jobTitle: '',
    notes: '',
    isFavorite: false,
    shareMyContact: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!contactForm.firstName.trim() && !contactForm.lastName.trim()) {
      Alert.alert('Error', 'Please enter at least a first name or last name');
      return false;
    }

    if (!contactForm.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return false;
    }

    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = contactForm.phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    // Email validation if provided
    if (contactForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSaveContact = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const contactData = {
        id: Date.now().toString(),
        ...contactForm,
        createdAt: new Date(),
      };

      // TODO: Send to backend
      console.log('Saving contact:', contactData);

      Alert.alert(
        'Success', 
        `${contactForm.firstName || contactForm.lastName} has been added to your contacts!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanQR = () => {
    // TODO: Implement QR code scanning
    Alert.alert('QR Scanner', 'QR code scanning functionality would open here');
  };

  const handleImportContacts = () => {
    // TODO: Implement contact import
    Alert.alert('Import Contacts', 'Contact import functionality would open here');
  };

  const handleInviteContact = () => {
    if (!contactForm.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number first');
      return;
    }

    Alert.alert(
      'Invite Contact',
      `Send an invitation to ${contactForm.phoneNumber} to join the app?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Invite',
          onPress: () => {
            // TODO: Send invitation
            Alert.alert('Success', 'Invitation sent successfully!');
          }
        },
      ]
    );
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'default' | 'phone-pad' | 'email-address' = 'default',
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
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
      />
    </View>
  );

  const renderSwitchItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={[styles.switchItem, { backgroundColor: theme.card }]}>
      <View style={styles.switchInfo}>
        <View style={[styles.switchIcon, { backgroundColor: theme.primary + '20' }]}>
          <Icon name={icon} size={20} color={theme.primary} />
        </View>
        
        <View style={styles.switchContent}>
          <Text style={[styles.switchTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.switchSubtitle, { color: theme.subtext }]}>
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
          Add Contact
        </Text>
        
        <TouchableOpacity 
          onPress={handleSaveContact}
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
        {/* Quick Add Methods */}
        <View style={styles.quickAddSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Add
          </Text>
          
          {renderActionButton(
            'qr-code',
            'Scan QR Code',
            'Scan a contact\'s QR code to add them',
            handleScanQR,
            '#4CAF50'
          )}
          
          {renderActionButton(
            'people',
            'Import Contacts',
            'Import contacts from your phone',
            handleImportContacts,
            '#2196F3'
          )}
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Contact Information
          </Text>
          
          {renderInputField(
            'First Name',
            contactForm.firstName,
            (text) => handleInputChange('firstName', text),
            'Enter first name',
            'default',
            50
          )}
          
          {renderInputField(
            'Last Name',
            contactForm.lastName,
            (text) => handleInputChange('lastName', text),
            'Enter last name',
            'default',
            50
          )}
          
          {renderInputField(
            'Phone Number *',
            contactForm.phoneNumber,
            (text) => handleInputChange('phoneNumber', text),
            'Enter phone number',
            'phone-pad'
          )}
          
          {renderInputField(
            'Email',
            contactForm.email,
            (text) => handleInputChange('email', text),
            'Enter email address',
            'email-address'
          )}
          
          {/* Advanced Fields */}
          <TouchableOpacity
            style={styles.advancedToggle}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={[styles.advancedToggleText, { color: theme.primary }]}>
              {showAdvanced ? 'Hide' : 'Show'} Advanced Fields
            </Text>
            <Icon 
              name={showAdvanced ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={theme.primary} 
            />
          </TouchableOpacity>
          
          {showAdvanced && (
            <>
              {renderInputField(
                'Company',
                contactForm.company,
                (text) => handleInputChange('company', text),
                'Enter company name',
                'default',
                100
              )}
              
              {renderInputField(
                'Job Title',
                contactForm.jobTitle,
                (text) => handleInputChange('jobTitle', text),
                'Enter job title',
                'default',
                100
              )}
              
              {renderInputField(
                'Notes',
                contactForm.notes,
                (text) => handleInputChange('notes', text),
                'Add notes about this contact...',
                'default',
                500,
                true
              )}
            </>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Options
          </Text>
          
          {renderSwitchItem(
            'heart',
            'Add to Favorites',
            'Quick access to this contact',
            contactForm.isFavorite,
            () => handleInputChange('isFavorite', !contactForm.isFavorite)
          )}
          
          {renderSwitchItem(
            'share',
            'Share My Contact',
            'Share your contact info with this person',
            contactForm.shareMyContact,
            () => handleInputChange('shareMyContact', !contactForm.shareMyContact)
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions
          </Text>
          
          {renderActionButton(
            'paper-plane',
            'Send Invitation',
            'Invite this contact to join the app',
            handleInviteContact,
            '#FF9800'
          )}
        </View>
      </ScrollView>
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
  quickAddSection: {
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
  formSection: {
    marginBottom: 24,
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
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  optionsSection: {
    marginBottom: 24,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  switchContent: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 14,
  },
  actionsSection: {
    marginBottom: 24,
  },
});

export default AddContactScreen; 