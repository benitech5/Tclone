import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StatusView {
  id: string;
  viewerId: string;
  viewerName: string;
  viewerAvatar: string;
  storyId: string;
  viewedAt: Date;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface StatusViewer {
  id: string;
  name: string;
  avatar: any;
  viewedAt: string;
  storyId: string;
  storyContent: string;
  isOnline: boolean;
  lastSeen?: string;
}

// Real viewer data - will be populated when stories are actually viewed
let realViewers: StatusViewer[] = [];

// Contact data for real tracking
const contacts = [
  {
    id: "2",
    name: "Bobee Jnr",
    avatar: require("../../../assets/avatars/user2.png"),
  },
  {
    id: "3",
    name: "Mirabelle",
    avatar: require("../../../assets/avatars/user3.png"),
  },
  {
    id: "4",
    name: "Nikano Miku",
    avatar: require("../../../assets/avatars/everything/randommer.jpeg"),
  },
  {
    id: "5",
    name: "John Doe",
    avatar: require("../../../assets/avatars/everything/bballGyal.jpeg"),
  },
  {
    id: "6",
    name: "Jane Smith",
    avatar: require("../../../assets/avatars/everything/acer.jpeg"),
  },
];

// Track when someone views a status
export const trackStatusView = async (
  storyId: string,
  viewerId: string,
  viewerName: string,
  viewerAvatar: string
): Promise<void> => {
  try {
    // Find the contact for this viewer
    const contact = contacts.find((c) => c.id === viewerId);
    if (!contact) {
      console.log(`Contact not found for viewer ID: ${viewerId}`);
      return;
    }

    const view: StatusView = {
      id: `${storyId}-${viewerId}-${Date.now()}`,
      viewerId,
      viewerName: contact.name,
      viewerAvatar: contact.avatar,
      storyId,
      viewedAt: new Date(),
      isOnline: Math.random() > 0.5, // Random online status for demo
    };

    // Get existing views
    const existingViewsJson = await AsyncStorage.getItem(
      `status_views_${storyId}`
    );
    const existingViews: StatusView[] = existingViewsJson
      ? JSON.parse(existingViewsJson)
      : [];

    // Check if this viewer already viewed this story
    const existingViewIndex = existingViews.findIndex(
      (view) => view.viewerId === viewerId && view.storyId === storyId
    );

    if (existingViewIndex >= 0) {
      // Update existing view timestamp
      existingViews[existingViewIndex].viewedAt = new Date();
    } else {
      // Add new view
      existingViews.push(view);
    }

    // Save updated views
    await AsyncStorage.setItem(
      `status_views_${storyId}`,
      JSON.stringify(existingViews)
    );

    console.log(`Status view tracked: ${contact.name} viewed story ${storyId}`);
  } catch (error) {
    console.error("Error tracking status view:", error);
  }
};

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${diffInDays} days ago`;
};

// Get all viewers for a specific story
export const getStatusViewers = async (
  storyId: string
): Promise<StatusViewer[]> => {
  try {
    // Get from AsyncStorage first, then fallback to real viewers
    const storedViewsJson = await AsyncStorage.getItem(
      `status_views_${storyId}`
    );
    if (storedViewsJson) {
      const storedViews: StatusView[] = JSON.parse(storedViewsJson);
      return storedViews.map((view) => ({
        id: view.viewerId,
        name: view.viewerName,
        avatar:
          contacts.find((c) => c.id === view.viewerId)?.avatar ||
          require("../../../assets/avatars/user2.png"),
        viewedAt: formatTimeAgo(view.viewedAt),
        storyId: view.storyId,
        storyContent: "Story content", // You can store this separately if needed
        isOnline: view.isOnline,
        lastSeen: view.lastSeen ? formatTimeAgo(view.lastSeen) : undefined,
      }));
    }
    return realViewers.filter((viewer) => viewer.storyId === storyId);
  } catch (error) {
    console.error("Error getting status viewers:", error);
    return [];
  }
};

// Get all viewers for user's stories
export const getAllStatusViewers = async (): Promise<StatusViewer[]> => {
  try {
    // Get all stored views from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const statusKeys = keys.filter((key) => key.startsWith("status_views_"));
    const allViewers: StatusViewer[] = [];

    for (const key of statusKeys) {
      const storedViewsJson = await AsyncStorage.getItem(key);
      if (storedViewsJson) {
        const storedViews: StatusView[] = JSON.parse(storedViewsJson);
        const viewers = storedViews.map((view) => ({
          id: view.viewerId,
          name: view.viewerName,
          avatar:
            contacts.find((c) => c.id === view.viewerId)?.avatar ||
            require("../../../assets/avatars/user2.png"),
          viewedAt: formatTimeAgo(view.viewedAt),
          storyId: view.storyId,
          storyContent: "Story content",
          isOnline: view.isOnline,
          lastSeen: view.lastSeen ? formatTimeAgo(view.lastSeen) : undefined,
        }));
        allViewers.push(...viewers);
      }
    }

    return allViewers;
  } catch (error) {
    console.error("Error getting all status viewers:", error);
    return realViewers;
  }
};

// Get viewer count for a story
export const getStatusViewCount = async (storyId: string): Promise<number> => {
  try {
    const viewers = await getStatusViewers(storyId);
    return viewers.length;
  } catch (error) {
    console.error("Error getting status view count:", error);
    return 0;
  }
};

// Mark user as online/offline
export const updateUserOnlineStatus = async (
  userId: string,
  isOnline: boolean,
  lastSeen?: Date
): Promise<void> => {
  try {
    const statusData = {
      userId,
      isOnline,
      lastSeen: lastSeen || new Date(),
      updatedAt: new Date(),
    };

    await AsyncStorage.setItem(
      `user_status_${userId}`,
      JSON.stringify(statusData)
    );
  } catch (error) {
    console.error("Error updating user online status:", error);
  }
};

// Get user's online status
export const getUserOnlineStatus = async (
  userId: string
): Promise<{
  isOnline: boolean;
  lastSeen?: Date;
}> => {
  try {
    const statusJson = await AsyncStorage.getItem(`user_status_${userId}`);
    if (statusJson) {
      const status = JSON.parse(statusJson);
      return {
        isOnline: status.isOnline,
        lastSeen: status.lastSeen ? new Date(status.lastSeen) : undefined,
      };
    }
    return { isOnline: false };
  } catch (error) {
    console.error("Error getting user online status:", error);
    return { isOnline: false };
  }
};

// Clear all status views (for testing or cleanup)
export const clearAllStatusViews = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const statusKeys = keys.filter((key) => key.startsWith("status_views_"));
    await AsyncStorage.multiRemove(statusKeys);
    console.log("All status views cleared");
  } catch (error) {
    console.error("Error clearing status views:", error);
  }
};

// Get recent status views (last 24 hours)
export const getRecentStatusViews = async (
  hours: number = 24
): Promise<StatusViewer[]> => {
  try {
    const allViewers = await getAllStatusViewers();
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    return allViewers.filter((viewer) => {
      // Parse the viewedAt string to check if it's recent
      const viewedTime = new Date();
      const timeAgo = viewer.viewedAt;

      // Simple parsing for demo purposes
      if (timeAgo.includes("minutes ago")) {
        const minutes = parseInt(timeAgo.split(" ")[0]);
        return minutes <= hours * 60;
      } else if (timeAgo.includes("hours ago")) {
        const hoursAgo = parseInt(timeAgo.split(" ")[0]);
        return hoursAgo <= hours;
      }

      return false;
    });
  } catch (error) {
    console.error("Error getting recent status views:", error);
    return [];
  }
};
