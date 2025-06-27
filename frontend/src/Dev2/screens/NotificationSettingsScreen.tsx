import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';

const NotificationSettingsScreen = () => {
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notifications and Sounds</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Message Notifications</Text>
        <Switch value={messageNotifications} onValueChange={setMessageNotifications} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Group Notifications</Text>
        <Switch value={groupNotifications} onValueChange={setGroupNotifications} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>In-App Sounds</Text>
        <Switch value={inAppSounds} onValueChange={setInAppSounds} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16 },
});

export default NotificationSettingsScreen; 