// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Animated,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList, RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { logout } from "../../store/authSlice";
import { useTheme } from "../../ThemeContext";
import { getUserGroups } from "../../api/ChatService";
import { Ionicons } from "@expo/vector-icons";
import { storiesData, getNonExpiredUserStories } from "../../Data/storiesData";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, "Chats">,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storyUpdateTrigger, setStoryUpdateTrigger] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserGroups();
        // Add some mock data for demonstration
        const groupsWithMockData = res.data.map((group: any) => ({
          ...group,
          isImportant: Math.random() > 0.7, // Randomly mark some as important
          isPinned: Math.random() > 0.8, // Randomly mark some as pinned
          unreadCount: Math.floor(Math.random() * 5), // Random unread count
        }));
        setGroups(groupsWithMockData);
        setFilteredGroups(groupsWithMockData);
      } catch (err: any) {
        setError("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // Filter groups based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.lastMessage && group.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, groups]);

  useFocusEffect(
    React.useCallback(() => {
      setStoryUpdateTrigger((prev) => prev + 1);
    }, [])
  );

  const shouldShowPlusIcon = (storyName: string) => {
    return storyName === "My Story";
  };

  const handleUploadStory = async () => {
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

      // Show picker options
      Alert.alert("Upload Story", "Choose media type", [
        {
          text: "Photo",
          onPress: () => pickImage(),
        },
        {
          text: "Video",
          onPress: () => pickVideo(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to access media library");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16], // Story aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Navigate to AddStory with the selected image
        navigation.navigate("AddStory", {
          mediaUri: asset.uri,
          mediaType: "image",
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16], // Story aspect ratio
        quality: 0.8,
        videoMaxDuration: 15, // 15 seconds max for stories
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Navigate to AddStory with the selected video
        navigation.navigate("AddStory", {
          mediaUri: asset.uri,
          mediaType: "video",
        });
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const handleSearchPress = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery("");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: theme.background }]}
      onPress={() => navigation.navigate("ChatRoom", { chatId: item.id, chatName: item.name })}
    >
      <Image
        source={{ uri: item.avatar || "https://via.placeholder.com/50" }}
        style={styles.avatarImage}
      />
      <View style={styles.chatTextContainer}>
        <View style={styles.chatHeader}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.time, { color: "#999" }]}>09:00</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text
            style={[styles.lastMessage, { color: theme.subtext }]}
            numberOfLines={1}
          >
            {item.lastMessage || "No message yet"}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        {/* Show important/pinned indicators */}
        {(item.isImportant || item.isPinned) && (
          <View style={styles.indicatorContainer}>
            {item.isPinned && (
              <Ionicons name="pin" size={12} color="#ffc107" style={styles.indicator} />
            )}
            {item.isImportant && (
              <Ionicons name="star" size={12} color="#ffc107" style={styles.indicator} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={searchQuery ? "search" : "chatbubbles"}
        size={48} 
        color="#999" 
      />
      <Text style={[styles.emptyStateText, { color: theme.subtext }]}>
        {searchQuery ? "No chats found" : "No chats available"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        {isSearchActive ? (
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity onPress={handleSearchPress} style={styles.closeSearchButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stories */}
      <View style={styles.storiesArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScroll}
        >
          {storiesData.map((story) => (
            <TouchableOpacity
              key={story.id}
              activeOpacity={0.8}
              onPress={() => {
                if (story.name === "My Story") {
                  const userStories = getNonExpiredUserStories();
                  if (userStories.length > 0) {
                    navigation.navigate("StoryShow", { storyId: story.id });
                  } else {
                    handleUploadStory();
                  }
                } else {
                  navigation.navigate("StoryShow", { storyId: story.id });
                }
              }}
              style={styles.storyCircleContainer}
            >
              <View style={styles.storyAvatarContainer}>
                <LinearGradient
                  colors={["#00FFFF", "#00FF00"]}
                  style={styles.storyGradientBorder}
                >
                  <Image source={story.avatar} style={styles.storyAvatar} />
                </LinearGradient>
                {shouldShowPlusIcon(story.name) && (
                  <TouchableOpacity
                    style={styles.plusIconContainer}
                    key={storyUpdateTrigger}
                    onPress={handleUploadStory}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {story.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat list */}
      <View style={styles.chatListContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#dc143c" />
            <Text style={[styles.loadingText, { color: theme.subtext }]}>Loading chats...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredGroups}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>

      {/* Camera Button */}
      <TouchableOpacity 
        style={styles.cameraButton}
        onPress={() => {
          // Navigate to camera screen or open camera functionality
          navigation.navigate("Camera", {
            onImageCaptured: (imageUri: string) => {
              // Handle captured image
              console.log("Image captured:", imageUri);
              // You can navigate to a story creation screen or handle the image
              navigation.navigate("AddStory", { capturedImage: imageUri });
            }
          });
        }}
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Edit Button for Text Stories */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => {
          // Navigate to AddStory screen for text-only stories
          navigation.navigate("AddStory", { 
            textOnly: true 
          });
        }}
      >
        <Ionicons name="create" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc143c",
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    justifyContent: "flex-start",
  },
  searchButton: {
    marginLeft: 290,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 16,
  },
  closeSearchButton: {
    marginLeft: 8,
    padding: 4,
  },
  storiesArea: {
    backgroundColor: "#dc143c",
    paddingBottom: 8,
    paddingTop: 8,
  },
  storiesScroll: {
    flexDirection: "row",
    paddingHorizontal: 12,
    backgroundColor: "#dc143c",
    paddingBottom: 12,
  },
  storyCircleContainer: {
    marginRight: 16,
  },
  storyGradientBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyAvatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  plusIconContainer: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#dc143c",
    borderRadius: 12,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",  
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storyName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    width: 60,
  },
  chatListContainer: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc143c",
    paddingHorizontal: 12,
    paddingBottom: 12,
    justifyContent: "space-evenly",
    position: "relative",
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    opacity: 0.6,
  },
  tabTray: {
    position: "absolute",
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
    bottom: 0,
  },
  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#999",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#ffc107",
    borderRadius: 12,
    minWidth: 24,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  unreadBadgeText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 2,
  },
  indicator: {
    marginRight: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#dc143c",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  editButton: {
    position: "absolute",
    bottom: 70, // Adjust position to be above the camera button
    right: 20,
    backgroundColor: "#dc143c",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default HomeScreen;
