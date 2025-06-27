import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const user = {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  name: 'Numeria Neveda',
  phone: '+233 00 000 0000',
  username: '@numerveda5000',
};

const otherAccounts = [
  { id: 1, name: 'Eros', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { id: 2, name: 'Dionysus', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
];

const settings = [
  { icon: '📞', label: 'Recent Calls', screen: null },
  { icon: '💻', label: 'Devices', screen: null },
  { icon: '📁', label: 'Chat Folder', screen: null },
  { icon: '🔔', label: 'Notifications and Sounds', screen: 'NotificationSettings' },
  { icon: '🔒', label: 'Privacy and Security', screen: 'PrivacySettings' },
  { icon: '💾', label: 'Data and Storage', screen: 'DataAndStorageSettings' },
  { icon: '🎨', label: 'Appearance', screen: 'AppearanceSettings' },
  { icon: '🌐', label: 'Language', screen: 'LanguageSettings' },
];

const ProfileSettingsScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Accounts</Text>
        <View style={styles.accountsRow}>
          {otherAccounts.map(acc => (
            <View key={acc.id} style={styles.accountItem}>
              <Image source={{ uri: acc.avatar }} style={styles.accountAvatar} />
              <Text style={styles.accountName}>{acc.name}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addAccountBtn}>
            <Text style={styles.addAccountText}>+ Add Account</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.storiesBtn}>
        <Text style={styles.storiesText}>My Stories</Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settings.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.settingRow}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            disabled={!item.screen}
          >
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, backgroundColor: '#b2f7ef' },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold' },
  phone: { fontSize: 14, color: '#555' },
  username: { fontSize: 14, color: '#888' },
  editBtn: { padding: 8 },
  editText: { color: '#e53935', fontWeight: 'bold' },
  section: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  accountsRow: { flexDirection: 'row', alignItems: 'center' },
  accountItem: { alignItems: 'center', marginRight: 16 },
  accountAvatar: { width: 40, height: 40, borderRadius: 20, marginBottom: 4 },
  accountName: { fontSize: 12 },
  addAccountBtn: { justifyContent: 'center', alignItems: 'center', padding: 8 },
  addAccountText: { color: '#e53935', fontWeight: 'bold' },
  storiesBtn: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#eee' },
  storiesText: { color: '#e53935', fontWeight: 'bold', fontSize: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  settingIcon: { fontSize: 18, width: 32 },
  settingLabel: { fontSize: 16 },
});

export default ProfileSettingsScreen; 