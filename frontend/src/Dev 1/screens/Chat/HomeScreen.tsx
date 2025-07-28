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
} from "react-native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList, RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { logout } from "../../store/authSlice";
import { useTheme } from "../../ThemeContext";
import { getUserGroups } from "../../api/ChatService";
import { Ionicons } from "@expo/vector-icons";
import { storiesData, getUserStories } from "../../Data/storiesData";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [storyUpdateTrigger, setStoryUpdateTrigger] = useState(0);

  const tabList = [
    { label: "All", key: "All" },
    { label: "Important", key: "Important" },
    { label: "Unread", key: "Unread" },
  ];

  const tabAnim = useRef(new Animated.Value(0)).current;
  const [tabMeasurements, setTabMeasurements] = useState<
    { x: number; width: number }[]
  >([]);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserGroups();
        setGroups(res.data);
      } catch (err: any) {
        setError("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setStoryUpdateTrigger((prev) => prev + 1);
    }, [])
  );

  const shouldShowPlusIcon = (storyName: string) => {
    return storyName === "My Story" && getUserStories().length === 0;
  };

  useEffect(() => {
    const idx = tabList.findIndex((tab) => tab.key === activeTab);
    Animated.spring(tabAnim, {
      toValue: idx,
      useNativeDriver: false,
      friction: 7,
      tension: 80,
    }).start();
  }, [activeTab]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: theme.background }]}
      onPress={() => navigation.navigate("ChatDetails", { chatId: item.id })}
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orbixa</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
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
                  const userStories =
                    require("../../Data/storiesData").getUserStories();
                  if (userStories.length > 0) {
                    navigation.navigate("StoryShow", { storyId: story.id });
                  } else {
                    navigation.navigate("AddStory");
                  }
                } else {
                  navigation.navigate("StoryShow", { storyId: story.id });
                }
              }}
              style={styles.storyCircleContainer}
            >
              <View style={styles.storyAvatarContainer}>
                <Image source={story.avatar} style={styles.storyAvatar} />
                {shouldShowPlusIcon(story.name) && (
                  <View
                    style={styles.plusIconContainer}
                    key={storyUpdateTrigger}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {story.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabList.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tabButton}
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
                  activeTab === tab.key && { opacity: 1 },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Animated tray */}
          {tabMeasurements.length === tabList.length && (
            <Animated.View
              style={[
                styles.tabTray,
                {
                  width: tabAnim.interpolate({
                    inputRange: tabList.map((_, i) => i),
                    outputRange: tabMeasurements.map((m) => m.width),
                  }),
                  left: tabAnim.interpolate({
                    inputRange: tabList.map((_, i) => i),
                    outputRange: tabMeasurements.map((m) => m.x),
                  }),
                },
              ]}
            />
          )}
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
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
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
    marginLeft: 20,
  },
  menuButton: {
    marginRight: 8,
  },
  searchButton: {
    marginLeft: 8,
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
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  storyAvatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  plusIconContainer: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#b30032",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  storyName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    width: 60,
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
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
