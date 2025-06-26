import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/Types';
import ProgressBar from '../component/ProgressBar';

// Mock data for a user's story segments
const userStories = {
  '1': {
    user: { name: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    stories: [
      { id: 's1-1', type: 'image', url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0' },
      { id: 's1-2', type: 'image', url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6' },
    ],
  },
  '2': {
      user: { name: 'Brenda', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      stories: [
        { id: 's2-1', type: 'image', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e' },
      ],
  },
  // Add other users' stories as needed
};

type StoryViewerRouteProp = RouteProp<RootStackParamList, 'StoryViewer'>;
const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<StoryViewerRouteProp>();
  const { userId } = route.params;

  const [storyGroup, setStoryGroup] = useState(userStories[userId as keyof typeof userStories]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is where you would fetch story data from a backend in a real app
    // For now, we just use the mock data
    const data = userStories[userId as keyof typeof userStories];
    if (data) {
      setStoryGroup(data);
    }
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, [userId]);

  const handleNextStory = useCallback(() => {
    if (currentIndex < storyGroup.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack(); // Go back after the last story
    }
  }, [currentIndex, storyGroup]);

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  if (!storyGroup || isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const currentStory = storyGroup.stories[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: currentStory.url }} style={styles.storyImage} />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {storyGroup.stories.map((_, index) => (
            <ProgressBar
              key={index}
              duration={STORY_DURATION}
              isActive={index === currentIndex}
              onComplete={handleNextStory}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
            <Image source={{ uri: storyGroup.user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{storyGroup.user.name}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 'auto' }}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tap areas for navigation */}
        <View style={styles.tapContainer}>
          <TouchableOpacity style={styles.tapArea} onPress={handlePrevStory} />
          <TouchableOpacity style={styles.tapArea} onPress={handleNextStory} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    storyImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: { flex: 1, paddingTop: 15 },
    progressContainer: { flexDirection: 'row', paddingTop: 10, paddingHorizontal: 10 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
    userName: { color: '#fff', fontWeight: 'bold' },
    tapContainer: { flex: 1, flexDirection: 'row' },
    tapArea: { flex: 1 },
});

export default StoryViewerScreen; 