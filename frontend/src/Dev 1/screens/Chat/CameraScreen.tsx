// src/screens/Chat/CameraScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { addUserStory } from "../../Data/storiesData";

interface CameraScreenProps {
  navigation: any;
  route: any;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const { onImageCaptured } = route.params || {};

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Remove cropping
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        setCapturedVideo(null);
        setShowUploadOptions(true);
        setShowTextInput(true);
        setMediaType("photo");
        
        // Call the callback function passed from HomeScreen
        if (onImageCaptured) {
          onImageCaptured(imageUri);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const recordVideo = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        setCapturedVideo(videoUri);
        setCapturedImage(null);
        setShowUploadOptions(true);
        setShowTextInput(true);
        setMediaType("video");
        
        // Call the callback function passed from HomeScreen
        if (onImageCaptured) {
          onImageCaptured(videoUri);
        }
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Failed to record video. Please try again.");
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false, // Remove cropping
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const mediaUri = result.assets[0].uri;
        const mediaType = result.assets[0].type;
        
        if (mediaType === "video") {
          setCapturedVideo(mediaUri);
          setCapturedImage(null);
          setMediaType("video");
        } else {
          setCapturedImage(mediaUri);
          setCapturedVideo(null);
          setMediaType("photo");
        }
        
        setShowUploadOptions(true);
        setShowTextInput(true);
        
        // Call the callback function passed from HomeScreen
        if (onImageCaptured) {
          onImageCaptured(mediaUri);
        }
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Error", "Failed to pick media. Please try again.");
    }
  };

  const postToStory = () => {
    if (capturedImage || capturedVideo) {
      // Create the story object with proper media format
      const newStory = {
        id: `user-${Date.now()}`,
        type: mediaType === "video" ? "video" : "image" as "text" | "image" | "video",
        content: undefined,
        url: mediaType === "video" 
          ? { uri: capturedVideo } as any 
          : { uri: capturedImage } as any,
        timestamp: "Just now",
      };

      // Add the story to user's stories
      addUserStory(newStory);

      Alert.alert("Success", "Story posted successfully!", [
        {
          text: "OK",
          onPress: () => {
            setCapturedImage(null);
            setCapturedVideo(null);
            setShowUploadOptions(false);
          },
        },
      ]);
    }
  };

  const goToStorySettings = () => {
    if (capturedImage || capturedVideo) {
      // Navigate to AddStory screen with the captured media and text
      navigation.navigate("AddStory", {
        capturedImage: capturedImage,
        capturedVideo: capturedVideo,
        storyText: storyText,
        mediaType: mediaType,
        fromCamera: true
      });
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedVideo(null);
    setShowUploadOptions(false);
    setShowTextInput(false);
    setStoryText("");
    setMediaType("photo");
  };

  const goBack = () => {
    setCapturedImage(null);
    setCapturedVideo(null);
    setShowUploadOptions(false);
    setShowTextInput(false);
    setStoryText("");
    setMediaType("photo");
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera Preview Area */}
      <View style={styles.cameraPreview}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        ) : capturedVideo ? (
          <View style={styles.videoPreview}>
            <Ionicons name="videocam" size={80} color="#ccc" />
            <Text style={[styles.placeholderText, { color: theme.subtext }]}>
              Video Captured
            </Text>
          </View>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Ionicons name="camera" size={80} color="#ccc" />
            <Text style={[styles.placeholderText, { color: theme.subtext }]}>
              Camera Preview
            </Text>
          </View>
        )}
      </View>

      {/* Upload Options (shown after capturing media) */}
      {showUploadOptions && (capturedImage || capturedVideo) && (
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton} onPress={goToStorySettings}>
            <Ionicons name="settings" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Story Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Camera Controls (always visible) */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
          <Ionicons name="images" size={24} color="#fff" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>

        {/* Media Type Toggle */}
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setMediaType(mediaType === "photo" ? "video" : "photo")}
        >
          <Ionicons 
            name={mediaType === "photo" ? "camera" : "videocam"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.toggleText}>
            {mediaType === "photo" ? "Photo" : "Video"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={mediaType === "photo" ? takePhoto : recordVideo}
        >
          <View style={styles.captureButtonInner}>
            <Ionicons 
              name={mediaType === "photo" ? "camera" : "videocam"} 
              size={32} 
              color="#fff" 
            />
          </View>
        </TouchableOpacity>

        <View style={styles.placeholderButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoPreview: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
  },
  textInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 16,
    minHeight: 40,
    textAlignVertical: "top",
  },
  uploadOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc143c",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retakeButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  galleryButton: {
    alignItems: "center",
    padding: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  toggleButton: {
    alignItems: "center",
    padding: 16,
  },
  toggleText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  captureButton: {
    alignItems: "center",
    padding: 16,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dc143c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  placeholderButton: {
    width: 40,
  },
});

export default CameraScreen; 