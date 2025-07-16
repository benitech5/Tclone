import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const routeMap: Record<string, string> = {
    'Chat Settings': 'ChatSettings',
    'Privacy and Security': 'Privacy',
    'Notifications and Sounds': 'Notifications',
    'Data and Storage': 'DataAndStorage',
    'Devices': 'Devices',
    'Language': 'Language',
    'Chat folders': 'ChatFolders',
    'Power Saving': 'PowerSaving',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Account Section */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#0088cc" />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: theme.text }]}>Justin Philips</Text>
            <Text style={[styles.profilePhone, { color: theme.subtext }]}>+233 725089765</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
        </TouchableOpacity>
      </View>

      {/* Main Settings Section */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {[
          'Chat Settings',
          'Privacy and Security',
          'Notifications and Sounds',
          'Data and Storage',
          'Devices',
          'Language',
          'Chat folders',
          'Power Saving'
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.menuItem, { borderColor: theme.border }]}
            onPress={() => navigation.navigate(routeMap[item] as any)}
          >
            <Text style={[styles.menuItemText, { color: theme.text }]}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Help Section */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Help</Text>
        {[
          'Ask a Question',
          'Orbixa FAQ',
          'Privacy Policy'
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.menuItem, { borderColor: theme.border }]}
            onPress={() => navigation.navigate(item.replace(/\s+/g, '') as any)}
          >
            <Text style={[styles.menuItemText, { color: theme.text }]}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    padding: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePhone: {
    fontSize: 14,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default SettingsScreen;