import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import SwitchRow from '../component/SwitchRow';

const NotificationSettingsScreen = () => {
  const [showPreviews, setShowPreviews] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Message Notifications</Text>
      <View style={styles.section}>
        <SwitchRow
          icon="notifications-outline"
          label="Show Previews"
          value={showPreviews}
          onValueChange={setShowPreviews}
        />
      </View>

      <Text style={styles.header}>Group Notifications</Text>
      <View style={styles.section}>
        <SwitchRow
          icon="people-outline"
          label="Group Alerts"
          value={groupNotifications}
          onValueChange={setGroupNotifications}
        />
      </View>

      <Text style={styles.header}>In-App Notifications</Text>
      <View style={styles.section}>
        <SwitchRow
          icon="musical-notes-outline"
          label="In-App Sounds"
          value={inAppSounds}
          onValueChange={setInAppSounds}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    paddingTop: 30,
  },
  section: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    fontSize: 14,
    color: '#6d6d72',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: '600',
  }
});

export default NotificationSettingsScreen; 