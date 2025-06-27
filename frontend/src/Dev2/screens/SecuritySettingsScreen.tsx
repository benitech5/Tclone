import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';

const SecuritySettingsScreen = () => {
  const [passcodeLock, setPasscodeLock] = useState(false);
  const [twoStep, setTwoStep] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Security</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Passcode & Face ID</Text>
        <Switch value={passcodeLock} onValueChange={setPasscodeLock} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Two-Step Verification</Text>
        <Switch value={twoStep} onValueChange={setTwoStep} />
      </View>
      <TouchableOpacity style={styles.infoBtn}>
        <Text style={styles.infoText}>Learn more about security</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16 },
  infoBtn: { marginTop: 24, padding: 16, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center' },
  infoText: { color: '#e53935', fontWeight: 'bold' },
});

export default SecuritySettingsScreen; 