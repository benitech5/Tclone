import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import SettingsRow from '../component/SettingsRow';
import { version as appVersion } from '../../../package.json'; // Adjust path if needed

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SettingsRow icon="mail-outline" label="Contact Us" onPress={() => {}} />
        <SettingsRow
          icon="document-text-outline"
          label="Terms and Privacy Policy"
          onPress={() => {}}
        />
        <SettingsRow
          icon="information-circle-outline"
          label="App Info"
          onPress={() => {}}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Konvo Messenger</Text>
        <Text style={styles.footerVersion}>Version {appVersion}</Text>
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
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  footerVersion: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default HelpScreen; 