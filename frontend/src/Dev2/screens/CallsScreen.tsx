import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const mockCalls = [
  { id: '1', name: 'John Doe', type: 'Voice', time: 'Today, 10:30 AM', avatar: 'https://via.placeholder.com/48x48.png?text=JD' },
  { id: '2', name: 'Jane Smith', type: 'Video', time: 'Yesterday, 8:15 PM', avatar: 'https://via.placeholder.com/48x48.png?text=JS' },
  { id: '3', name: 'Alex Brown', type: 'Voice', time: 'Yesterday, 2:45 PM', avatar: 'https://via.placeholder.com/48x48.png?text=AB' },
];

export default function CallsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Calls</Text>
      <FlatList
        data={mockCalls}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.callItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>{item.type} • {item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  details: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
}); 