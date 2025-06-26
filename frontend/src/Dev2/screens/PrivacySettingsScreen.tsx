import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchRow from '../component/SwitchRow';
import SettingsRow from '../component/SettingsRow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/Types';

// Keys for storing settings in AsyncStorage
const PRIVACY_SETTINGS_KEYS = {
  lastSeen: 'privacy_last_seen_enabled',
  readReceipts: 'privacy_read_receipts_enabled',
  profilePhoto: 'privacy_profile_photo_public',
};

const PrivacySettingsScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  // State for each privacy setting, with defaults
  const [isLastSeenEnabled, setLastSeenEnabled] = useState(true);
  const [isReadReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [isProfilePhotoPublic, setProfilePhotoPublic] = useState(true);

  // Load settings from storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const lastSeen = await AsyncStorage.getItem(PRIVACY_SETTINGS_KEYS.lastSeen);
        if (lastSeen !== null) setLastSeenEnabled(JSON.parse(lastSeen));

        const readReceipts = await AsyncStorage.getItem(PRIVACY_SETTINGS_KEYS.readReceipts);
        if (readReceipts !== null) setReadReceiptsEnabled(JSON.parse(readReceipts));

        const profilePhoto = await AsyncStorage.getItem(PRIVACY_SETTINGS_KEYS.profilePhoto);
        if (profilePhoto !== null) setProfilePhotoPublic(JSON.parse(profilePhoto));
      } catch (e) {
        console.error('Failed to load privacy settings.', e);
      }
    };
    loadSettings();
  }, []);

  // Generic handler to update state and save to AsyncStorage
  const handleSettingChange = (key: string, value: boolean, setter: (value: boolean) => void) => {
    setter(value);
    AsyncStorage.setItem(key, JSON.stringify(value));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Who can see my personal info</Text>
      
      <View style={styles.section}>
        <SwitchRow
          icon="eye-outline"
          label="Last Seen & Online"
          description="If you don't share your Last Seen, you won't be able to see other people's Last Seen."
          value={isLastSeenEnabled}
          onValueChange={(value) => handleSettingChange(PRIVACY_SETTINGS_KEYS.lastSeen, value, setLastSeenEnabled)}
        />
        <SwitchRow
          icon="person-circle-outline"
          label="Profile Photo"
          description="Everyone" // This could be changed to a picker later (Everyone, My Contacts, Nobody)
          value={isProfilePhotoPublic}
          onValueChange={(value) => handleSettingChange(PRIVACY_SETTINGS_KEYS.profilePhoto, value, setProfilePhotoPublic)}
        />
        <SwitchRow
          icon="checkmark-done-outline"
          label="Read Receipts"
          description="If turned off, you won't send or receive Read Receipts. Read receipts are always sent for group chats."
          value={isReadReceiptsEnabled}
          onValueChange={(value) => handleSettingChange(PRIVACY_SETTINGS_KEYS.readReceipts, value, setReadReceiptsEnabled)}
        />
      </View>

      <Text style={styles.sectionHeader}>Other</Text>
      <View style={styles.section}>
        <SettingsRow
            icon="people-circle-outline"
            label="Blocked Contacts"
            onPress={() => console.log("Navigate to Blocked Contacts")} // This would navigate to a new screen
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  section: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8e8e93',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    textTransform: 'uppercase',
  },
});

export default PrivacySettingsScreen; 