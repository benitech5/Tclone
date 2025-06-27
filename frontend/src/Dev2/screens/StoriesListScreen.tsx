import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const mockStories = [
  { id: '1', user: 'Alice', image: require('../../assets/icon.png') },
  { id: '2', user: 'Bob', image: require('../../assets/chat-bg.png') },
  { id: '3', user: 'Charlie', image: require('../../assets/splash-icon.png') },
];

const StoriesListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stories</Text>
      <FlatList
        data={mockStories}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.storyItem}>
            <Image source={item.image} style={styles.storyImage} />
            <Text style={styles.storyUser}>{item.user}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  storyItem: { alignItems: 'center', marginRight: 16 },
  storyImage: { width: 64, height: 64, borderRadius: 32, marginBottom: 8 },
  storyUser: { fontSize: 14 },
});

export default StoriesListScreen; 