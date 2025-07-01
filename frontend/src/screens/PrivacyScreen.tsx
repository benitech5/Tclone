// src/screens/PrivacyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivacyScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Privacy Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrivacyScreen;