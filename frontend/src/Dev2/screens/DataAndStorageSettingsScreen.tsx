import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';

const DataAndStorageSettingsScreen = () => {
  const [autoDownload, setAutoDownload] = useState(true);
  const [lowDataMode, setLowDataMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Data and Storage</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Auto-download Media</Text>
        <Switch value={autoDownload} onValueChange={setAutoDownload} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Low Data Mode</Text>
        <Switch value={lowDataMode} onValueChange={setLowDataMode} />
      </View>
      <TouchableOpacity style={styles.manageBtn}>
        <Text style={styles.manageText}>Manage Storage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16 },
  manageBtn: { marginTop: 24, padding: 16, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center' },
  manageText: { color: '#e53935', fontWeight: 'bold' },
});

export default DataAndStorageSettingsScreen; 