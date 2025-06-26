import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SettingsRow from '../component/SettingsRow';
import { RootStackNavigationProp } from '../navigation/Types';

// Define a type for a section of settings
type SettingsSection = {
  title: string;
  items: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    screen: keyof RootStackNavigationProp['navigate']; // Type-safe navigation
    color?: string;
  }[];
};

const settingsSections: SettingsSection[] = [
  {
    title: 'General',
    items: [
      { label: 'Account', icon: 'person-outline', screen: 'AccountSettings' },
      { label: 'Chats', icon: 'chatbubble-outline', screen: 'ChatSettings' },
      { label: 'Notifications', icon: 'notifications-outline', screen: 'NotificationSettings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help', icon: 'help-circle-outline', screen: 'Help' },
      { label: 'Privacy Policy', icon: 'document-text-outline', screen: 'PrivacyPolicy' }, // Assuming a PrivacyPolicy screen exists
    ],
  },
  {
    title: 'Danger Zone',
    items: [
      { label: 'Logout', icon: 'log-out-outline', screen: 'Logout', color: '#ff3b30' },
    ],
  },
];

export default function ProfileSettingsScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const handlePress = (screen: keyof RootStackNavigationProp['navigate'] | 'Logout') => {
    if (screen === 'Logout') {
      // Handle logout logic, e.g., call auth context
      console.log('Logging out...');
    } else {
      // The type safety is handled by the data structure
      // @ts-ignore
      navigation.navigate(screen);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      {settingsSections.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map(item => (
            <SettingsRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              color={item.color}
              onPress={() => handlePress(item.screen)}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7', // Use a light grey background for settings screens
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8e8e93',
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
}); 