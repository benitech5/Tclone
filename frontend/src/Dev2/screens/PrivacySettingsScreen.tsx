import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';

const PrivacySettingsScreen = () => {
  const [lastSeen, setLastSeen] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy and Security</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Last Seen & Online</Text>
        <Switch value={lastSeen} onValueChange={setLastSeen} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Profile Photo</Text>
        <Switch value={profilePhoto} onValueChange={setProfilePhoto} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Read Receipts</Text>
        <Switch value={readReceipts} onValueChange={setReadReceipts} />
      </View>
      <TouchableOpacity style={styles.blockedBtn}>
        <Text style={styles.blockedText}>Blocked Contacts</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16 },
  blockedBtn: { marginTop: 24, padding: 16, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center' },
  blockedText: { color: '#e53935', fontWeight: 'bold' },
});

export default PrivacySettingsScreen; 