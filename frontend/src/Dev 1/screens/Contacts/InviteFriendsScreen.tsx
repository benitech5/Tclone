import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InviteFriendsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Invite Friends Screen (Placeholder)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default InviteFriendsScreen; 