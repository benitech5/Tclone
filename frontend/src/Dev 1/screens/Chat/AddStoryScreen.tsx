import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../ThemeContext";
import { addUserStory } from "../../Data/storiesData";

const AddStoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [storyText, setStoryText] = useState("");

  // Check if we have a captured image from camera
  useEffect(() => {
    const { capturedImage, capturedVideo, storyText: cameraText, fromCamera, textOnly, mediaType } = route.params as any;
    if (capturedImage && fromCamera) {
      setSelectedImage(capturedImage);
      if (cameraText) {
        setStoryText(cameraText);
      }
    }
    if (capturedVideo && fromCamera) {
      setSelectedImage(capturedVideo); // Use selectedImage state for video too
      if (cameraText) {
        setStoryText(cameraText);
      }
    }
    // Handle text-only stories
    if (textOnly) {
      setSelectedImage(null); // No image for text-only stories
    }
  }, [route.params]);

  const handleCreateStory = () => {
    const { textOnly, mediaType } = route.params as any;
    
    // For text-only stories, we don't need an image
    if (!textOnly && !selectedImage) {
      Alert.alert("Error", "Please select an image or video for your story");
      return;
    }

    // For text-only stories, we need some text content
    if (textOnly && !storyText.trim()) {
      Alert.alert("Error", "Please enter some text for your story");
      return;
    }

    // Create the story object with proper format
    const newStory = {
      id: `user-${Date.now()}`,
      type: textOnly ? "text" : (mediaType === "video" ? "video" : "image") as "text" | "image" | "video",
      content: storyText || undefined,
      url: selectedImage ? { uri: selectedImage } as any : undefined, // Works for both images and videos
      timestamp: "Just now",
    };

    // Add the story to user's stories
    addUserStory(newStory);

    const currentMediaType = (route.params as any)?.mediaType;
    const successMessage = currentMediaType === "video" 
      ? "Video story posted successfully!" 
      : "Story posted successfully!";

    Alert.alert("Success", successMessage, [
      {
        text: "OK",
        onPress: () => {
          // Navigate back to chat screen after posting story
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Story Settings</Text>
        <TouchableOpacity onPress={handleCreateStory} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Story Media Display */}
        {selectedImage && (
          <View style={styles.imageSection}>
            <Image source={{ uri: selectedImage }} style={styles.storyImage} />
            {(route.params as any)?.mediaType === "video" && (
              <View style={styles.videoOverlay}>
                <Ionicons name="play-circle" size={60} color="#fff" />
              </View>
            )}
            {storyText && (
              <View style={styles.textOverlay}>
                <Text style={styles.storyText}>{storyText}</Text>
              </View>
            )}
          </View>
        )}

        {/* Text Input for Text-Only Stories */}
        {(route.params as any)?.textOnly && (
          <View style={styles.textInputSection}>
            <Text style={styles.textInputLabel}>Your Story Text</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your story here..."
              placeholderTextColor="#999"
              value={storyText}
              onChangeText={setStoryText}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{storyText.length}/500</Text>
          </View>
        )}

        {/* Story Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Story Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="eye-outline" size={24} color="#333" />
            <Text style={styles.settingText}>Who can see this story?</Text>
            <Text style={styles.settingValue}>Everyone</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="time-outline" size={24} color="#333" />
            <Text style={styles.settingText}>Story duration</Text>
            <Text style={styles.settingValue}>24 hours</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#b30032",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  imageSection: {
    padding: 16,
    alignItems: "center",
    position: "relative",
  },
  storyImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    resizeMode: "cover",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  textOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 12,
    borderRadius: 8,
  },
  storyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  textInputSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  textInputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
});

export default AddStoryScreen;
