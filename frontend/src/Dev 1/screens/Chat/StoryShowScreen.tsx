import React, { useEffect, useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import {
  detailedStoriesData,
  deleteUserStory,
  getNonExpiredUserStories,
} from "../../Data/storiesData";
import { trackStatusView, getStatusViewCount } from "../../api/StatusService";

const { width, height } = Dimensions.get("window");

const AUTO_ADVANCE_DURATION = 5000; // 5 seconds

const StoryShowScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  // --- New state for story index ---
  const params = route.params as { storyId: string } | undefined;
  const storyId = params?.storyId;
  // Find the index of the tapped story
  const initialStoryIndex = detailedStoriesData.findIndex(
    (story) => story.id === storyId
  );
  // If not found, fallback to 0
  const [currentStoryIndex, setCurrentStoryIndex] = useState(
    initialStoryIndex >= 0 ? initialStoryIndex : 0
  );
  const [currentStoryItemIndex, setCurrentStoryItemIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState<Record<string, boolean>>({});
  const [viewerCount, setViewerCount] = useState(0);
  const [showViewerPopup, setShowViewerPopup] = useState(false);
  const [storyUpdateTrigger, setStoryUpdateTrigger] = useState(0);
  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;

  // Get the current story and item
  const getCurrentStory = () => {
    if (currentStoryIndex === 0) {
      // "My Story" - use dynamic data
      const userStories = getNonExpiredUserStories();
      return {
        id: "1",
        name: "My Story",
        avatar: require("../../../../assets/avatars/everything/bballGyal.jpeg"),
        stories: userStories,
      };
    } else {
      // Other stories - use static data
      return detailedStoriesData[currentStoryIndex];
    }
  };

  const currentStory = getCurrentStory();
  const currentStoryItem = currentStory?.stories[currentStoryItemIndex];

  // Force re-render when storyUpdateTrigger changes
  useEffect(() => {
    // This will trigger a re-render when storyUpdateTrigger changes
  }, [storyUpdateTrigger]);

  // Create unique key for current story item
  const currentReactionKey = `${currentStory?.id}-${currentStoryItem?.id}`;
  const hasReacted = reactions[currentReactionKey] || false;

  const startProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: AUTO_ADVANCE_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) handleNext();
    });
  };

  // --- Updated handleNext logic ---
  const handleNext = () => {
    const currentStoryData = getCurrentStory();
    if (
      currentStoryData &&
      currentStoryItemIndex < currentStoryData.stories.length - 1
    ) {
      setCurrentStoryItemIndex(currentStoryItemIndex + 1);
    } else {
      // At the end of this story, check for next story
      if (currentStoryIndex < detailedStoriesData.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
        setCurrentStoryItemIndex(0);
      } else {
        // All stories viewed, exit
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.dispatch(StackActions.replace("Home"));
        }
      }
    }
  };

  // --- Updated handlePrevious logic ---
  const handlePrevious = () => {
    if (currentStoryItemIndex > 0) {
      setCurrentStoryItemIndex(currentStoryItemIndex - 1);
    } else if (currentStoryIndex > 0) {
      // Go to last item of previous story
      const prevStory =
        currentStoryIndex === 1
          ? {
              id: "1",
              name: "My Story",
              avatar: require("../../../../assets/avatars/everything/bballGyal.jpeg"),
              stories: getNonExpiredUserStories(),
            }
          : detailedStoriesData[currentStoryIndex - 1];
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentStoryItemIndex(prevStory.stories.length - 1);
    }
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(StackActions.replace("Home"));
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleReaction = () => {
    setReactions((prev) => ({
      ...prev,
      [currentReactionKey]: !prev[currentReactionKey],
    }));

    // Instagram-like pop animation
    heartScale.setValue(1);
    heartOpacity.setValue(0.7);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heartScale, {
          toValue: 1.4,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(heartScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDeleteStory = () => {
    if (currentStory && currentStoryItem) {
      Alert.alert(
        "Delete Story",
        "Are you sure you want to delete this story?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteUserStory(currentStoryItem.id);
              console.log("Story deleted:", currentStoryItem.id);

              // Check if there are more stories in "My Story"
              const remainingStories = getNonExpiredUserStories();
              if (remainingStories.length === 0) {
                // No more stories, go back to home
                handleClose();
              } else {
                // Reset to first story or go to next available story
                setCurrentStoryItemIndex(0);
                setStoryUpdateTrigger((prev) => prev + 1);
              }
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    if (!isPaused) startProgress();
    else progressAnim.stopAnimation();

    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [currentStoryIndex, currentStoryItemIndex, isPaused]);

  // Track story view when story is first displayed
  useEffect(() => {
    if (currentStory && currentStoryItem) {
      // Only track view for other people's stories (not your own)
      if (currentStory.id !== "1") {
        // Use the story owner's ID as the viewer (simulating someone viewing your story)
        const viewerId = currentStory.id; // This will be "2", "3", "4" etc.
        trackStatusView(
          currentStoryItem.id,
          viewerId,
          currentStory.name,
          "avatar" // Just pass a string since the service will use the contact's avatar
        );
      }
    }
  }, [currentStoryIndex, currentStoryItemIndex]);

  // Load viewer count for user's own stories
  useEffect(() => {
    const loadViewerCount = async () => {
      if (currentStory && currentStory.id === "1" && currentStoryItem) {
        try {
          const count = await getStatusViewCount(currentStoryItem.id);
          setViewerCount(count);
        } catch (error) {
          console.error("Error loading viewer count:", error);
        }
      }
    };

    loadViewerCount();
  }, [currentStoryIndex, currentStoryItemIndex]);

  // Refresh story data when screen is focused (for "My Story")
  useEffect(() => {
    if (currentStory && currentStory.id === "1") {
      // Force re-render by updating a state
      setStoryUpdateTrigger((prev) => prev + 1);
    }
  }, [currentStoryIndex]);

  // --- Error handling for missing story or item ---
  if (!storyId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          No story ID provided
        </Text>
      </View>
    );
  }

  if (!currentStory) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Story not found
        </Text>
      </View>
    );
  }

  if (!currentStoryItem) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          No story content available
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={currentStory.avatar} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{currentStory.name}</Text>
            <Text style={styles.headerTime}>{currentStoryItem.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Menu Dropdown - Moved outside header */}
      {showMenu && (
        <>
          {/* Background overlay to close menu when tapping outside */}
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                (navigation as any).navigate("AddStory");
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>Add Story</Text>
            </TouchableOpacity>
            {currentStory.id === "1" && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    (navigation as any).navigate("StatusViewers");
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuItemText}>View Story Viewers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    handleDeleteStory();
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuItemText}>Delete Story</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      )}

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {currentStory?.stories.map((_, index) => (
          <View key={index} style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  flex:
                    index < currentStoryItemIndex
                      ? 1
                      : index === currentStoryItemIndex
                      ? progressAnim
                      : 0,
                  backgroundColor:
                    index <= currentStoryItemIndex
                      ? "#fff"
                      : "rgba(255,255,255,0.3)",
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Story Content with pause support */}
      <Pressable
        style={styles.contentContainer}
        onPress={(e) => {
          // Close menu if open
          if (showMenu) {
            setShowMenu(false);
            return;
          }

          // Prevent pause if tapping near top-right (menu) or other UI
          const { locationX, locationY } = e.nativeEvent;
          if (locationY < 100 && locationX > width - 80) return;
          togglePause();
        }}
      >
        {currentStoryItem.type === "image" ? (
          <Image
            source={
              typeof currentStoryItem.url === "string"
                ? { uri: currentStoryItem.url }
                : currentStoryItem.url
            }
            style={styles.storyImage}
            resizeMode="cover"
          />
        ) : currentStoryItem.type === "video" ? (
          <View style={styles.videoStoryContainer}>
            <MaterialIcons name="video-library" size={64} color="#fff" />
            <Text style={styles.videoStoryText}>Video Story</Text>
          </View>
        ) : (
          <View style={styles.textStoryContainer}>
            <Text style={styles.textStoryContent}>
              {currentStoryItem.content}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Navigation Areas */}
      <TouchableOpacity style={styles.navButton} onPress={handlePrevious} />
      <TouchableOpacity
        style={[styles.navButton, styles.navButtonRight]}
        onPress={handleNext}
      />

      {/* Reaction Bar - only for other people's stories */}
      {currentStory && currentStory.id !== "1" && (
        <View style={styles.reactionBar} pointerEvents="box-none">
          <TouchableOpacity onPress={handleReaction}>
            <Animated.View
              style={{
                transform: [{ scale: heartScale }],
                opacity: heartOpacity,
              }}
            >
              <Ionicons
                name={hasReacted ? "heart" : "heart-outline"}
                size={32}
                color={hasReacted ? "#ff3040" : "#fff"}
                style={styles.reactionIcon}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}

      {/* Viewer Count Icon - only for user's own stories */}
      {currentStory && currentStory.id === "1" && (
        <View style={styles.viewerCountContainer} pointerEvents="box-none">
          <TouchableOpacity
            onPress={() => setShowViewerPopup(true)}
            style={styles.viewerCountButton}
          >
            <Ionicons name="eye" size={24} color="#fff" />
            {viewerCount > 0 && (
              <View style={styles.viewerCountBadge}>
                <Text style={styles.viewerCountText}>{viewerCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Viewer Count Popup */}
      {showViewerPopup && (
        <TouchableOpacity
          style={styles.popupOverlay}
          onPress={() => setShowViewerPopup(false)}
          activeOpacity={1}
        >
          <View style={styles.viewerPopup}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Story Views</Text>
              <TouchableOpacity
                onPress={() => setShowViewerPopup(false)}
                style={styles.popupCloseButton}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.popupContent}>
              <Ionicons name="eye" size={48} color="#fff" />
              <Text style={styles.popupCount}>{viewerCount}</Text>
              <Text style={styles.popupSubtitle}>
                {viewerCount === 1 ? "person viewed" : "people viewed"} your
                story
              </Text>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => {
                  setShowViewerPopup(false);
                  (navigation as any).navigate("StatusViewers");
                }}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  closeButton: {
    padding: 8,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 16,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  headerName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  headerTime: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  moreButton: {
    padding: 8,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 9998,
  },
  menuDropdown: {
    position: "absolute",
    right: 16,
    top: 120, // Adjusted to be below header
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    zIndex: 9999, // Higher z-index to ensure it's on top
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10, // Higher elevation for Android
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  menuItemText: {
    color: "#fff",
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  storyImage: {
    width: width,
    height: height * 0.7,
  },
  textStoryContainer: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textStoryContent: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  videoStoryContainer: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  videoStoryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  navButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.3,
  },
  navButtonRight: {
    right: 0,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  reactionBar: {
    position: "absolute",
    right: 24,
    bottom: 80,
    //backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 24,
    padding: 8,
    zIndex: 10,
  },
  reactionEmoji: {
    fontSize: 24,
    marginHorizontal: 12,
  },
  reactionIcon: {
    marginHorizontal: 0,
  },
  // Viewer Count Styles
  viewerCountContainer: {
    position: "absolute",
    left: 24,
    bottom: 80,
  },
  viewerCountButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  viewerCountBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff3040",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  viewerCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Popup Styles
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  viewerPopup: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
    minWidth: 200,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  popupTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  popupCloseButton: {
    padding: 4,
  },
  popupContent: {
    alignItems: "center",
  },
  popupCount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  popupSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  viewDetailsButton: {
    backgroundColor: "#ff3040",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewDetailsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default StoryShowScreen;
