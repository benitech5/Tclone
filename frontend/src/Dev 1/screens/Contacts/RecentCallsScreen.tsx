import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecentCallsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recent Calls Screen (Placeholder)</Text>
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

export default RecentCallsScreen; 