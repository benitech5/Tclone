import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import SettingsRow from '../component/SettingsRow';

const AccountSettingsScreen = () => {

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Account deletion requested") }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SettingsRow
          icon="at-outline"
          label="Change Email"
          onPress={() => {
            // Navigate to change email screen
          }}
        />
        <SettingsRow
          icon="call-outline"
          label="Change Phone Number"
          onPress={() => {
            // Navigate to change phone number screen
          }}
        />
      </View>
      <View style={styles.section}>
        <SettingsRow
          icon="trash-outline"
          label="Delete My Account"
          onPress={handleDeleteAccount}
          color="#ff3b30"
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
    marginBottom: 30,
  },
});

export default AccountSettingsScreen; 