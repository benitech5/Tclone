import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InChatSearchScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.header}>In-Chat Search</Text>
    <Text style={styles.placeholder}>Feature coming soon...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  placeholder: { fontSize: 16, color: '#888' },
});

export default InChatSearchScreen; 