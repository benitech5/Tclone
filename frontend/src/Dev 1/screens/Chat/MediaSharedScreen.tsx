import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { getMediaShared } from '../../api/ChatService';
import { useRoute } from '@react-navigation/native';

const MediaSharedScreen = () => {
  const { theme } = useTheme();
  const route = useRoute();
  // @ts-ignore
  const groupId = route.params?.groupId;
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getMediaShared(groupId);
        setMedia(res.data);
      } catch (err) {
        setError('Failed to load media');
      } finally {
        setLoading(false);
      }
    };
    if (groupId) fetchMedia();
  }, [groupId]);

  if (loading) {
    return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={theme.accent} /></View>;
  }
  if (error) {
    return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: theme.text }}>{error}</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <Text style={[styles.title, { color: theme.text }]}>Media Shared</Text>
      <ScrollView style={styles.messagesContainer}>
        {media.map((item) => (
          <View key={item.id} style={styles.messageContainer}>
            <Text style={[styles.messageText, { color: theme.text }]}> {item.mediaUrl || item.content} </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageText: {
    padding: 8,
  },
});

export default MediaSharedScreen; 