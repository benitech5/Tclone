import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StoryListItem, { Story } from '../component/StoryListItem';
import { RootStackNavigationProp } from '../navigation/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock Data
const MY_AVATAR = 'https://randomuser.me/api/portraits/women/44.jpg';

const mockStories: Story[] = [
  { id: '1', user: { name: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, hasBeenViewed: false },
  { id: '2', user: { name: 'Brenda', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }, hasBeenViewed: false },
  { id: '3', user: { name: 'Carl', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }, hasBeenViewed: false },
  { id: '4', user: { name: 'Diana', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }, hasBeenViewed: true },
  { id: '5', user: { name: 'Ethan', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' }, hasBeenViewed: true },
  { id: '6', user: { name: 'Fiona', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' }, hasBeenViewed: true },
];

const MyStory = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.myStoryContainer}>
    <Image source={{ uri: MY_AVATAR }} style={styles.myAvatar} />
    <View style={styles.plusIcon}>
      <Ionicons name="add" size={18} color="#fff" />
    </View>
    <Text style={styles.myName}>My Status</Text>
  </TouchableOpacity>
);

const StoriesListScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [stories, setStories] = useState(mockStories);

  const handleStoryPress = (story: Story) => {
    // Navigate to StoryViewer, passing story data
    // @ts-ignore
    navigation.navigate('StoryViewer', { userId: story.id });

    // Mark story as viewed
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, hasBeenViewed: true } : s));
  };
  
  const recentUpdates = stories.filter(s => !s.hasBeenViewed);
  const viewedUpdates = stories.filter(s => s.hasBeenViewed);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
      </View>
      <View style={styles.myStoryRow}>
        <MyStory onPress={() => console.log('Add new story')} />
      </View>
      
      {recentUpdates.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent updates</Text>
          {recentUpdates.map(story => (
              <TouchableOpacity key={story.id} onPress={() => handleStoryPress(story)} style={styles.viewedRow}>
                  <StoryListItem story={story} onPress={() => handleStoryPress(story)} />
                  <View style={styles.viewedTextContainer}>
                      <Text style={styles.viewedName}>{story.user.name}</Text>
                      <Text style={styles.viewedTimestamp}>Just now</Text>
                  </View>
              </TouchableOpacity>
          ))}
        </View>
      )}

      {viewedUpdates.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viewed updates</Text>
           {viewedUpdates.map(story => (
              <TouchableOpacity key={story.id} onPress={() => handleStoryPress(story)} style={styles.viewedRow}>
                  <StoryListItem story={story} onPress={() => handleStoryPress(story)} />
                  <View style={styles.viewedTextContainer}>
                      <Text style={styles.viewedName}>{story.user.name}</Text>
                      <Text style={styles.viewedTimestamp}>23 minutes ago</Text>
                  </View>
              </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    myStoryRow: { padding: 20 },
    section: { marginTop: 10 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#888', paddingHorizontal: 20, marginBottom: 10, textTransform: 'uppercase' },
    myStoryContainer: { flexDirection: 'row', alignItems: 'center' },
    myAvatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#eee' },
    plusIcon: { position: 'absolute', bottom: 0, right: -5, backgroundColor: '#d0021b', borderRadius: 12, padding: 2, borderWidth: 2, borderColor: '#fff' },
    myName: { marginLeft: 15, fontSize: 16, fontWeight: 'bold' },
    viewedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10 },
    viewedTextContainer: { marginLeft: -5, justifyContent: 'center' },
    viewedName: { fontSize: 16, fontWeight: '500' },
    viewedTimestamp: { fontSize: 14, color: '#666' }
});

export default StoriesListScreen; 