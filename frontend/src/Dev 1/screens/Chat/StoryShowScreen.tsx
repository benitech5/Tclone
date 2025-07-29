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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import { detailedStoriesData } from "../../Data/storiesData";

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
  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;

  // Get the current story and item
  const currentStory = detailedStoriesData[currentStoryIndex];
  const currentStoryItem = currentStory?.stories[currentStoryItemIndex];

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
    if (
      currentStory &&
      currentStoryItemIndex < currentStory.stories.length - 1
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
      const prevStory = detailedStoriesData[currentStoryIndex - 1];
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
    console.log("Story deleted");
    setShowMenu(false);
    handleClose();
  };

  useEffect(() => {
    if (!isPaused) startProgress();
    else progressAnim.stopAnimation();

    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [currentStoryIndex, currentStoryItemIndex, isPaused]);

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
        {showMenu && currentStory.id === "1" && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              onPress={handleDeleteStory}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>Delete Story</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
          // Prevent pause if tapping near top-right (menu) or other UI
          const { locationX, locationY } = e.nativeEvent;
          if (locationY < 100 && locationX > width - 80) return;
          togglePause();
        }}
      >
        {currentStoryItem.type === "image" ? (
          <Image
            source={currentStoryItem.url}
            style={styles.storyImage}
            resizeMode="cover"
          />
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

      {/* Reaction Bar - moved to be last child */}
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
  menuDropdown: {
    position: "absolute",
    right: 16,
    top: 80,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 8,
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
});

export default StoryShowScreen;
