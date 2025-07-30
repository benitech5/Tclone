import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../ThemeContext";
import { getAllStatusViewers, StatusViewer } from "../../api/StatusService";

const StatusViewersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [viewers, setViewers] = useState<StatusViewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  useEffect(() => {
    const loadViewers = async () => {
      try {
        setLoading(true);
        const statusViewers = await getAllStatusViewers();
        setViewers(statusViewers);
      } catch (error) {
        console.error("Error loading status viewers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadViewers();
  }, []);

  const renderViewer = ({ item }: { item: StatusViewer }) => (
    <TouchableOpacity
      style={[styles.viewerItem, { backgroundColor: theme.card }]}
      onPress={() => {
        // Navigate to user profile or start chat
        console.log("Navigate to user profile:", item.name);
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.viewerInfo}>
        <Text style={[styles.viewerName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.viewedAt, { color: theme.subtext }]}>
          Viewed {item.viewedAt}
        </Text>
        {!item.isOnline && item.lastSeen && (
          <Text style={[styles.lastSeen, { color: theme.subtext }]}>
            Last seen {item.lastSeen}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Start chat with this user
            console.log("Start chat with:", item.name);
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color={theme.accent} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // View user profile
            console.log("View profile of:", item.name);
          }}
        >
          <Ionicons name="person-outline" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.card }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>
        Status Viewers
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>
        {viewers.length} people viewed your story
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.accent }]}>
            {viewers.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Total Views
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.accent }]}>
            {viewers.filter((v) => v.isOnline).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Online Now
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.accent }]}>
            {viewers.filter((v) => !v.isOnline).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Offline
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading viewers...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={[styles.navigationHeader, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.navigationTitle, { color: theme.text }]}>
          Story Viewers
        </Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={viewers}
        renderItem={renderViewer}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  viewerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  viewerInfo: {
    flex: 1,
  },
  viewerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  viewedAt: {
    fontSize: 14,
    marginBottom: 2,
  },
  lastSeen: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
});

export default StatusViewersScreen;
