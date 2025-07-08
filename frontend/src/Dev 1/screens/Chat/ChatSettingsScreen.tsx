// src/screens/ChatSettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Settings</Text>
      {/* Add your chat settings UI here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ChatSettingsScreen;