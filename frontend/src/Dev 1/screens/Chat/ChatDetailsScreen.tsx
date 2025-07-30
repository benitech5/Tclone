import React, { useState, useRef, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../SettingsContext";
import { useTheme } from "../../ThemeContext";
import { getMessages, sendMessage } from "../../api/ChatService";
import EmojiSelector from "react-native-emoji-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatDetailsScreen() {
  const [message, setMessage] = useState("");
  const route = useRoute();
  const { chatSettings } = useSettings();
  const { theme } = useTheme();
  // @ts-ignore
  const chatId = route.params?.chatId;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Feature 1: Message Reactions
  const [messageReactions, setMessageReactions] = useState<
    Record<string, string>
  >({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  // Feature 2: Seen/Delivered Indicator
  const [seenMessages, setSeenMessages] = useState<Record<string, boolean>>({});

  // Feature 3: Pinned Message
  const [pinnedMessage, setPinnedMessage] = useState<any>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMessages(chatId);
        setMessages(res.data);

        // Load saved reactions and pinned message
        const savedReactions = await AsyncStorage.getItem(
          `reactions_${chatId}`
        );
        if (savedReactions) {
          setMessageReactions(JSON.parse(savedReactions));
        }

        const savedPinnedMessage = await AsyncStorage.getItem(
          `pinned_${chatId}`
        );
        if (savedPinnedMessage) {
          setPinnedMessage(JSON.parse(savedPinnedMessage));
        }

        // Mark messages as seen after loading
        const newSeenMessages: Record<string, boolean> = {};
        res.data.forEach((msg: any) => {
          if (msg.senderId !== "currentUser") {
            newSeenMessages[msg.id] = true;
          }
        });
        setSeenMessages(newSeenMessages);
      } catch (err: any) {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    if (chatId) fetchMessages();
  }, [chatId]);

  // Save reactions when they change
  useEffect(() => {
    if (chatId) {
      AsyncStorage.setItem(
        `reactions_${chatId}`,
        JSON.stringify(messageReactions)
      );
    }
  }, [messageReactions, chatId]);

  // Save pinned message when it changes
  useEffect(() => {
    if (chatId) {
      if (pinnedMessage) {
        AsyncStorage.setItem(`pinned_${chatId}`, JSON.stringify(pinnedMessage));
      } else {
        AsyncStorage.removeItem(`pinned_${chatId}`);
      }
    }
  }, [pinnedMessage, chatId]);

  const handleSend = async () => {
    if (message.trim() === "") return;
    try {
      await sendMessage(chatId, message);
      // Re-fetch messages after sending
      const res = await getMessages(chatId);
      setMessages(res.data);
      setMessage("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      setError("Failed to send message");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (selectedMessageId) {
      setMessageReactions((prev) => ({
        ...prev,
        [selectedMessageId]: emoji,
      }));
    }
    setShowEmojiPicker(false);
    setSelectedMessageId(null);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isSentByMe = item.senderId === "currentUser";
    const hasReaction = messageReactions[item.id];
    const isSeen = seenMessages[item.id];

    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedMessageId(item.id);
          setShowEmojiPicker(true);
        }}
        style={[
          styles.messageBubble,
          isSentByMe ? styles.myMessage : styles.theirMessage,
          { borderRadius: chatSettings.messageCorner },
          { backgroundColor: theme.card },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { fontSize: chatSettings.messageSize, color: theme.text },
          ]}
        >
          {item.content}
        </Text>

        {/* Message Footer with Time and Status */}
        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, { color: theme.subtext }]}>
            {item.sentAt
              ? new Date(item.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>

          {/* Seen Indicator for sent messages */}
          {isSentByMe && (
            <Text style={[styles.seenIndicator, { color: theme.subtext }]}>
              {isSeen ? "✓ Seen" : "✓ Delivered"}
            </Text>
          )}
        </View>

        {/* Reaction Display */}
        {hasReaction && (
          <View style={styles.reactionContainer}>
            <Text style={styles.reactionEmoji}>{hasReaction}</Text>
          </View>
        )}

        {/* Pin Button */}
        <TouchableOpacity
          style={styles.pinButton}
          onPress={() => {
            if (pinnedMessage?.id === item.id) {
              setPinnedMessage(null);
            } else {
              setPinnedMessage(item);
            }
          }}
        >
          <Ionicons
            name={pinnedMessage?.id === item.id ? "pin" : "pin-outline"}
            size={16}
            color={pinnedMessage?.id === item.id ? theme.accent : theme.subtext}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.safeArea,
          {
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }
  if (error) {
    return (
      <View
        style={[
          styles.safeArea,
          {
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text
          style={{ textAlign: "center", color: theme.subtext, marginTop: 10 }}
        >
          Chat ID: {chatId}
        </Text>

        {/* Pinned Message Display */}
        {pinnedMessage && (
          <View
            style={[
              styles.pinnedMessageContainer,
              { backgroundColor: theme.accent },
            ]}
          >
            <View style={styles.pinnedMessageHeader}>
              <Ionicons name="pin" size={16} color="#fff" />
              <Text style={styles.pinnedMessageLabel}>Pinned Message</Text>
              <TouchableOpacity
                onPress={() => setPinnedMessage(null)}
                style={styles.unpinButton}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.pinnedMessageText} numberOfLines={2}>
              {pinnedMessage.content}
            </Text>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.card, borderTopColor: theme.border },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text,
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={theme.subtext}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline={false}
            onFocus={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={24} color={theme.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Emoji Picker Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showEmojiPicker}
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.emojiPickerContainer}>
            <View style={styles.emojiPickerHeader}>
              <Text style={styles.emojiPickerTitle}>Add Reaction</Text>
              <TouchableOpacity
                onPress={() => setShowEmojiPicker(false)}
                style={styles.closeEmojiPicker}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <EmojiSelector
              onEmojiSelected={handleEmojiSelect}
              showSearchBar={false}
              showTabs={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  messageText: {},
  myMessageText: {},
  messageTime: { fontSize: 10, marginTop: 5 },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    paddingBottom: 15, // Increased padding to move input up and avoid nav buttons
    alignItems: "center",
    marginBottom: Platform.OS === "android" ? 20 : 0, // Extra margin for Android
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    alignSelf: "center",
    padding: 8,
  },
  // Message Footer Styles
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  seenIndicator: {
    fontSize: 10,
    marginLeft: 8,
  },
  // Reaction Styles
  reactionContainer: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  reactionEmoji: {
    fontSize: 16,
  },
  // Pin Button Styles
  pinButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 4,
  },
  // Pinned Message Styles
  pinnedMessageContainer: {
    margin: 10,
    padding: 12,
    borderRadius: 8,
  },
  pinnedMessageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pinnedMessageLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
    flex: 1,
  },
  pinnedMessageText: {
    color: "#fff",
    fontSize: 14,
  },
  unpinButton: {
    padding: 4,
  },
  // Emoji Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  emojiPickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  emojiPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeEmojiPicker: {
    padding: 4,
  },
});
