import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

interface Post {
  id: string;
  type: "image" | "text";
  content: string;
  timestamp: string;
  imageUrl?: string;
}

interface ProfileData {
  name: string;
  lastName: string;
  channel: string;
  bio: string;
  birthday: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState("Posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [tabMeasurements, setTabMeasurements] = useState<
    { x: number; width: number }[]
  >([]);
  const tabAnim = useRef(new Animated.Value(0)).current;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Justin Phillips",
    lastName: "",
    channel: "Personal channel",
    bio: "",
    birthday: "Date of Birth",
  });

  // Listen for profile updates from EditProfileScreen
  useFocusEffect(
    React.useCallback(() => {
      const params = route.params as any;
      if (params?.updatedProfile) {
        setProfileData(params.updatedProfile);
        // Clear the params to avoid re-applying on subsequent visits
        (navigation as any).setParams({ updatedProfile: undefined });
      }
    }, [route.params])
  );

  const tabList = [
    { label: "Posts", key: "Posts" },
    { label: "Archived Posts", key: "Archived Posts" },
  ];

  // Animate tab indicator when activeTab changes
  useEffect(() => {
    const idx = tabList.findIndex((tab) => tab.key === activeTab);
    if (idx >= 0 && tabMeasurements.length === tabList.length) {
      Animated.spring(tabAnim, {
        toValue: idx,
        useNativeDriver: false,
        friction: 7,
        tension: 80,
      }).start();
    }
  }, [activeTab, tabMeasurements]);
  useEffect(() => {
    const loadProfile = async () => {
      const data = await AsyncStorage.getItem("@profileInfo");
      if (data) {
        const profile = JSON.parse(data);
        setProfileData(profile);
      }
    };
    loadProfile();
  }, []);

  const handleBack = () => {
    // Open the drawer instead of going back
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).openDrawer?.();
    }
  };

  const handleEdit = () => {
    // Pass current profile data to EditProfileScreen
    (navigation as any).navigate("EditProfile", profileData);
  };

  const handleMore = () => {
    // Handle more options
    console.log("More options");
  };

  const pickProfileImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to select profile picture."
      );
      return;
    }

    // Launch image picker for profile picture
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile picture
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to select images."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPost: Post = {
        id: Date.now().toString(),
        type: "image",
        content: "Shared an image",
        timestamp: "Just now",
        imageUrl: result.assets[0].uri,
      };
      setPosts([newPost, ...posts]);
    }
  };

  const handleAddPost = () => {
    pickImage();
  };

  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.postAvatarImage}
            />
          ) : (
            <Text style={styles.postAvatarText}>J</Text>
          )}
        </View>
        <View style={styles.postInfo}>
          <Text style={styles.postAuthor}>
            {profileData.name}
            {profileData.lastName && ` ${profileData.lastName}`}
          </Text>
          <Text style={styles.postTime}>{post.timestamp}</Text>
        </View>
      </View>
      <View style={styles.postContent}>
        <Text style={styles.postText}>{post.content}</Text>
        {post.type === "image" && post.imageUrl && (
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc143c" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>J</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickProfileImage}
            >
              <Ionicons name="camera" size={16} color="#dc143c" />
              <View style={styles.plusIcon}>
                <Ionicons name="add" size={8} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {profileData.name}
              {profileData.lastName && ` ${profileData.lastName}`}
            </Text>
            <Text style={styles.userStatus}>online</Text>
          </View>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Info</Text>
        {profileData.bio && (
          <View style={styles.bioInfo}>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>
        )}
        <View style={styles.phoneInfo}>
          <Text style={styles.phoneNumber}>+233 657481924</Text>
          <Text style={styles.phoneType}>Mobile</Text>
        </View>
        {profileData.birthday !== "Date of Birth" && (
          <View style={styles.birthdayInfo}>
            <Text style={styles.birthdayText}>{profileData.birthday}</Text>
            <Text style={styles.birthdayType}>Birthday</Text>
          </View>
        )}
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        <View
          style={styles.tabsRow}
          onLayout={(e) => {
            const containerWidth = e.nativeEvent.layout.width;
            const tabWidth = containerWidth / tabList.length;
            setTabMeasurements(
              tabList.map((_, index) => ({
                x: index * tabWidth,
                width: tabWidth,
              }))
            );
          }}
        >
          {tabList.map((tab, index) => (
          <TouchableOpacity 
              key={tab.key}
              style={styles.tab}
              onPress={() => setActiveTab(tab.key)}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                setTabMeasurements((prev) => {
                  const updated = [...prev];
                  updated[index] = { x, width };
                  return updated;
                });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
          </TouchableOpacity>
        ))}

          {/* Animated tab indicator */}
          {tabMeasurements.length === tabList.length && (
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  width: tabAnim.interpolate({
                    inputRange: tabList.map((_, i) => i),
                    outputRange: tabMeasurements.map((m) => m.width - 32), // Subtract padding
                  }),
                  left: tabAnim.interpolate({
                    inputRange: tabList.map((_, i) => i),
                    outputRange: tabMeasurements.map((m) => m.x + 16), // Add left padding
                  }),
                },
              ]}
            />
          )}
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {activeTab === "Posts" ? (
          posts.length > 0 ? (
            <ScrollView
              style={styles.postsScroll}
              contentContainerStyle={styles.postsContainer}
              showsVerticalScrollIndicator={false}
            >
              {posts.map(renderPost)}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                No posts has been made yet...
              </Text>
              <Text style={styles.emptySubtitle}>
                Publish photos/videos to be displayed on your profile page
              </Text>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No archived posts</Text>
            <Text style={styles.emptySubtitle}>
              Archived posts will appear here
            </Text>
          </View>
        )}
    </View>

      {/* Add Post Button */}
      <TouchableOpacity style={styles.addPostButton} onPress={handleAddPost}>
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.addPostText}>Add a post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#dc143c",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8b0000",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  avatarText: {
    color: "#90ee90",
    fontSize: 32,
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dc143c",
  },
  plusIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#dc143c",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userStatus: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  infoSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoLabel: {
    color: "#dc143c",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  phoneInfo: {
    marginBottom: 8,
  },
  phoneNumber: {
    color: "#000",
    fontSize: 16,
    marginBottom: 2,
  },
  phoneType: {
    color: "#666",
    fontSize: 14,
  },
  bioInfo: {
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  birthdayInfo: {
    marginTop: 12,
  },
  birthdayText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  birthdayType: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  tabsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "relative",
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#dc143c",
    fontWeight: "bold",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: "#dc143c",
    borderRadius: 2,
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postsScroll: {
    flex: 1,
  },
  postsContainer: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dc143c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  postAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  postAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  postInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  postContent: {
    marginTop: 8,
  },
  postText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  addPostButton: {
    backgroundColor: "#dc143c",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addPostText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
