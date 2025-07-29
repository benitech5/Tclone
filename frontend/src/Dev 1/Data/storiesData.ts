import { ImageSourcePropType } from "react-native";

export interface StoryItem {
  id: string;
  type: "image" | "text";
  url?: ImageSourcePropType;
  content?: string;
  timestamp: string;
}

export interface Story {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  stories: StoryItem[];
}

// Basic story info for HomeScreen
export const storiesData = [
  {
    id: "1",
    name: "My Story",
    avatar: require("../../../assets/avatars/everything/bballGyal.jpeg"),
  },
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
];

// User's own stories (will be updated when user posts stories)
export let userStories: StoryItem[] = [
  {
    id: "user-1",
    type: "text",
    content: "Just posted my first story! 🎉",
    timestamp: "Just now",
  },
];

// Function to add new story to user's stories
export const addUserStory = (story: StoryItem) => {
  userStories.unshift(story); // Add to beginning
};

// Function to get user's stories
export const getUserStories = (): StoryItem[] => {
  return userStories;
};

// Function to delete all user stories
export const deleteAllUserStories = () => {
  userStories.length = 0;
};

// Detailed story content for StoryShowScreen
export const detailedStoriesData: Story[] = [
  {
    id: "1",
    name: "My Story",
    avatar: require("../../../assets/avatars/everything/bballGyal.jpeg"),
    stories: userStories, // Use dynamic user stories
  },
  {
    id: "2",
    name: "Bobee Jnr",
    avatar: require("../../../assets/avatars/user2.png"),
    stories: [
      {
        id: "2-1",
        type: "text",
        content: "Working on something exciting! 💻",
        timestamp: "3 hours ago",
      },
      {
        id: "2-2",
        type: "image",
        url: require("../../../assets/avatars/user2.png"),
        timestamp: "2 hours ago",
      },
      {
        id: "2-3",
        type: "text",
        content: "Just finished a great workout! 💪",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: "3",
    name: "Mirabelle",
    avatar: require("../../../assets/avatars/user3.png"),
    stories: [
      {
        id: "3-1",
        type: "image",
        url: require("../../../assets/avatars/user3.png"),
        timestamp: "4 hours ago",
      },
      {
        id: "3-2",
        type: "text",
        content: "Beautiful sunset today! 🌅",
        timestamp: "2 hours ago",
      },
    ],
  },
  {
    id: "4",
    name: "Nikano Miku",
    avatar: require("../../../assets/avatars/everything/randommer.jpeg"),
    stories: [
      {
        id: "4-1",
        type: "text",
        content: "New project coming soon! 🚀",
        timestamp: "5 hours ago",
      },
      {
        id: "4-2",
        type: "image",
        url: require("../../../assets/avatars/everything/randommer.jpeg"),
        timestamp: "3 hours ago",
      },
      {
        id: "4-3",
        type: "text",
        content: "Coffee time! ☕",
        timestamp: "1 hour ago",
      },
      {
        id: "4-4",
        type: "image",
        url: require("../../../assets/avatars/everything/randommer.jpeg"),
        timestamp: "30 minutes ago",
      },
    ],
  },
];
