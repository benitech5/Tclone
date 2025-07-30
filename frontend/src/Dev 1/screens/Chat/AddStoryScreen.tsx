import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../ThemeContext";
import { addUserStory } from "../../Data/storiesData";
import * as ImagePicker from "expo-image-picker";

const AddStoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [storyType, setStoryType] = useState<"text" | "image" | "video">(
    "text"
  );
  const [storyContent, setStoryContent] = useState("");
  const [storyText, setStoryText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);

  // Check if media was passed from HomeScreen
  useEffect(() => {
    const params = route.params as
      | { mediaUri?: string; mediaType?: "image" | "video" }
      | undefined;
    if (params?.mediaUri && params?.mediaType) {
      setSelectedMedia({ uri: params.mediaUri, type: params.mediaType });
      setStoryType(params.mediaType);
    }
  }, [route.params]);

  const handleCreateStory = () => {
    if (storyType === "text" && !storyText.trim()) {
      Alert.alert("Error", "Please enter some text for your story");
      return;
    }

    if (storyType === "image" && !selectedMedia) {
      Alert.alert("Error", "Please select an image for your story");
      return;
    }

    if (storyType === "video" && !selectedMedia) {
      Alert.alert("Error", "Please select a video for your story");
      return;
    }

    // Create the story object with 24-hour expiration
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const newStory = {
      id: `user-${Date.now()}`,
      type: storyType as "text" | "image" | "video",
      content: storyType === "text" ? storyText : undefined,
      url: selectedMedia?.uri || undefined,
      timestamp: "Just now",
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Add the story to user's stories
    addUserStory(newStory);

    Alert.alert(
      "Success",
      "Story posted successfully! It will expire in 24 hours.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleSelectMedia = async (mediaType: "image" | "video") => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your media library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          mediaType === "image"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16], // Story aspect ratio
        quality: 0.8,
        videoMaxDuration: mediaType === "video" ? 15 : undefined, // 15 seconds max for videos
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedMedia({ uri: asset.uri, type: mediaType });
        setStoryType(mediaType);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Error", `Failed to pick ${mediaType}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Story</Text>
        <TouchableOpacity onPress={handleCreateStory} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Story Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Story Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                storyType === "text" && styles.typeButtonActive,
              ]}
              onPress={() => setStoryType("text")}
            >
              <Ionicons
                name="text"
                size={24}
                color={storyType === "text" ? "#fff" : "#b30032"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  storyType === "text" && styles.typeButtonTextActive,
                ]}
              >
                Text Story
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                storyType === "image" && styles.typeButtonActive,
              ]}
              onPress={() => setStoryType("image")}
            >
              <Ionicons
                name="image"
                size={24}
                color={storyType === "image" ? "#fff" : "#b30032"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  storyType === "image" && styles.typeButtonTextActive,
                ]}
              >
                Image Story
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Story Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {storyType === "text" ? "Story Text" : "Story Image"}
          </Text>

          {storyType === "text" ? (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="What's on your mind?"
                placeholderTextColor="#999"
                value={storyText}
                onChangeText={setStoryText}
                multiline
                textAlignVertical="top"
              />
            </View>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => handleSelectMedia("image")}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={48}
                  color="#b30032"
                />
                <Text style={styles.imagePickerText}>Select Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imagePickerButton, { marginTop: 12 }]}
                onPress={() => handleSelectMedia("video")}
              >
                <MaterialIcons name="video-library" size={48} color="#b30032" />
                <Text style={styles.imagePickerText}>Select Video</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Story Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewContainer}>
            {storyType === "text" && storyText ? (
              <View style={styles.textPreview}>
                <Text style={styles.previewText}>{storyText}</Text>
              </View>
            ) : storyType === "image" && selectedMedia ? (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: selectedMedia.uri }}
                  style={styles.previewImage}
                />
              </View>
            ) : storyType === "video" && selectedMedia ? (
              <View style={styles.videoPreview}>
                <MaterialIcons name="video-library" size={48} color="#ccc" />
                <Text style={styles.previewPlaceholder}>
                  Video selected: {selectedMedia.uri.split("/").pop()}
                </Text>
              </View>
            ) : (
              <View style={styles.emptyPreview}>
                <Text style={styles.previewPlaceholder}>
                  Your story preview will appear here
                </Text>
              </View>
            )}
          </View>
        </View>

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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    padding: 8,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    color: "#b30032",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#b30032",
    backgroundColor: "#fff",
  },
  typeButtonActive: {
    backgroundColor: "#b30032",
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#b30032",
    fontWeight: "bold",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    minHeight: 120,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: "#b30032",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: "#b30032",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
  },
  previewContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  textPreview: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    width: "100%",
  },
  previewText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  imagePreview: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  videoPreview: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyPreview: {
    alignItems: "center",
  },
  previewPlaceholder: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
