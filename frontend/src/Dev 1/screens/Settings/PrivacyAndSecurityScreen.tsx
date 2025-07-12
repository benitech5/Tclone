import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const PrivacyAndSecurityScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Privacy and Security" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Security Section */}
        <Text style={[styles.sectionHeader, { color: '#000' }]}>Security</Text>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="key-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Two-Step Verification</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Off</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <MaterialIcons name="autorenew" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Auto-Delete Messages</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Off</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="lock-closed-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Passcode Lock</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Off</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <MaterialCommunityIcons name="block-helper" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Blocked Users</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>None</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <MaterialIcons name="devices" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Devices</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>2</Text>
        </TouchableOpacity>
        <Text style={[styles.infoText, { color: theme.subtext }]}>Review the list of devices where you are logged in to your account.</Text>

        {/* Privacy Section */}
        <Text style={[styles.sectionHeader, { color: '#000' }]}>Privacy</Text>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="call-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Phone Number</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>My Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="time-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Last Seen & Online</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Everybody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="image-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Profile Photos</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Everybody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <MaterialIcons name="forward-to-inbox" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Forwarded Messages</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Everybody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="call" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Calls</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Everybody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <MaterialCommunityIcons name="microphone-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Voice Messages</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Everybody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <MaterialIcons name="message" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Messages</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Everybody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="location-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Live Location</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>Nobody</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="add-circle-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000' }]}>Groups & Channels</Text>
          <Text style={[styles.value, { color: theme.subtext }]}>My Contacts</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  icon: { marginRight: 16 },
  label: { fontSize: 15, flex: 1 },
  value: { fontSize: 15 },
  infoText: { fontSize: 13, marginVertical: 10 },
});

export default PrivacyAndSecurityScreen; 