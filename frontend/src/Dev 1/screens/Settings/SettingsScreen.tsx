import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#0088cc" />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>Justin Philips</Text>
            <Text style={styles.profilePhone}>+233 725089765</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Main Settings Section */}
      <View style={styles.section}>
        {[
          'Chat Settings',
          'Privacy and Security',
          'Notifications and Sounds',
          'Data and Storage',
          'Language',
          'Chat folders',
          'Power Saving'
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.replace(/\s+/g, '') as any)}
          >
            <Text style={styles.menuItemText}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Help</Text>
        {[
          'Ask a Question',
          'Convo FAQ',
          'Privacy Policy'
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.replace(/\s+/g, '') as any)}
          >
            <Text style={styles.menuItemText}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeader: {
    padding: 16,
    color: '#0088cc',
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
    color: '#000',
  },
  profilePhone: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },
});

export default SettingsScreen;