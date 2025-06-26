import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  hasBeenViewed?: boolean;
}

interface StoryListItemProps {
  story: Story;
  onPress: () => void;
}

const StoryListItem: React.FC<StoryListItemProps> = ({ story, onPress }) => {
  const gradientColors = story.hasBeenViewed
    ? ['#dbdbdb', '#e0e0e0'] // Grey for viewed stories
    : ['#d0021b', '#ff7e5f']; // Brand colors for new stories

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradientBorder}>
        <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
      </LinearGradient>
      <Text style={styles.name} numberOfLines={1}>{story.user.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 70,
  },
  gradientBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
});

export default StoryListItem; 