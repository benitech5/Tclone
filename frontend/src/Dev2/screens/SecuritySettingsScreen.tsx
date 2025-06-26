import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SwitchRow from '../component/SwitchRow';
import SettingsRow from '../component/SettingsRow';

const SecuritySettingsScreen = () => {
  const [isPasscodeLockEnabled, setPasscodeLockEnabled] = useState(false);
  const [isTwoStepEnabled, setTwoStepEnabled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SwitchRow
          icon="finger-print-outline"
          label="Passcode & Face ID"
          value={isPasscodeLockEnabled}
          onValueChange={setPasscodeLockEnabled}
        />
      </View>
      <Text style={styles.description}>
        When enabled, you'll need to use Face ID or your passcode to unlock Konvo. You can still reply to messages from notifications and answer calls if Konvo is locked.
      </Text>

      <View style={styles.section}>
         <SettingsRow
          icon="keypad-outline"
          label="Two-Step Verification"
          onPress={() => {
            // Navigate to Two-Step setup flow
          }}
        />
      </View>
       <Text style={styles.description}>
        For added security, enable two-step verification, which will require a PIN when registering your phone number with Konvo again.
      </Text>
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
  description: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 14,
    color: '#666',
  },
});

export default SecuritySettingsScreen; 