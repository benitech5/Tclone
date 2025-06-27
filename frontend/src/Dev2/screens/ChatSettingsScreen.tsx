import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_WALLPAPER_URI_KEY = 'chat_wallpaper_uri';

const ChatSettingsScreen = () => {
  const [permission, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [feedback, setFeedback] = useState('');

  const handleChooseWallpaper = async () => {
    setFeedback('');
    // Check for permissions
    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const { status } = await requestPermission();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          'Permission required',
          'We need access to your photos to set a chat wallpaper.'
        );
        return;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        await AsyncStorage.setItem(CHAT_WALLPAPER_URI_KEY, uri);
        setFeedback('Wallpaper updated successfully!');
      } catch (error) {
        setFeedback('Could not save wallpaper.');
      }
    }
  };

  const handleResetWallpaper = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_WALLPAPER_URI_KEY);
      setFeedback('Wallpaper has been reset to default.');
    } catch (error) {
      setFeedback('Could not reset wallpaper.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat Wallpaper</Text>
      <View style={styles.buttonContainer}>
        <Button title="Choose from Photos" onPress={handleChooseWallpaper} color="#d0021b" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Reset to Default" onPress={handleResetWallpaper} color="#8e8e93" />
      </View>
      {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  feedbackText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#34c759',
    fontSize: 16,
  },
});

export default ChatSettingsScreen; 