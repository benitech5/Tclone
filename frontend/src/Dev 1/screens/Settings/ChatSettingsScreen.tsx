import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "../../ThemeContext";
import { useSettings } from "../../SettingsContext";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ChatSettingsScreen = () => {
  const { theme } = useTheme();
  const { chatSettings, updateMessageSize } = useSettings();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [textSize, setTextSize] = useState(chatSettings?.textSize || 16);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Message Text Size Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message text size</Text>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={30}
              value={textSize}
              onValueChange={(val) => setTextSize(val)}
              onSlidingComplete={(val) => updateMessageSize(Math.round(val))}
              minimumTrackTintColor="#b30032"
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor="#b30032"
            />
            <Text style={styles.sliderValue}>{Math.round(textSize)}</Text>
          </View>

          {/* Chat Preview */}
          <View style={styles.chatPreview}>
            <View style={styles.previewBubble}>
              <Text style={[styles.previewText, { fontSize: textSize }]}>
                hello
              </Text>
            </View>
            <View style={styles.previewBubble}>
              <Text style={[styles.previewText, { fontSize: textSize }]}>
                how are you doing
              </Text>
            </View>
            <View style={styles.previewBubbleRight}>
              <Text style={[styles.previewTextRight, { fontSize: textSize }]}>
                yeah
              </Text>
            </View>
          </View>
        </View>

        {/* Chat Customization Options */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.customizationItem}>
            <MaterialIcons name="wallpaper" size={24} color="#b30032" />
            <Text style={styles.customizationText}>Change Chat Wallpaper</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.customizationItem}>
            <MaterialIcons name="palette" size={24} color="#b30032" />
            <Text style={styles.customizationText}>Change Name Color</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Color Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color theme</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.themeScroll}
          >
            {[...Array(6)].map((_, index) => (
              <TouchableOpacity key={index} style={styles.themeOption}>
                <View style={styles.themePreview}>
                  <View style={styles.themeBubble1} />
                  <View style={styles.themeBubble2} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mode and Theme Options */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.customizationItem}>
            <Ionicons name="moon" size={24} color="#b30032" />
            <Text style={styles.customizationText}>Switch to night mode</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.customizationItem}>
            <MaterialIcons name="format-paint" size={24} color="#b30032" />
            <Text style={styles.customizationText}>Browse themes</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* App Icon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App icon</Text>
          <View style={styles.appIconContainer}>
            <View style={styles.appIconOption}>
              <View style={styles.appIcon1}>
                <View style={styles.appIcon1Inner}>
                  <MaterialIcons name="send" size={20} color="#fff" />
                </View>
              </View>
              <Text style={styles.appIconText}>ORBIXA</Text>
            </View>

            <View style={styles.appIconOption}>
              <View style={styles.appIcon2}>
                <View style={styles.appIcon2Bubble1} />
                <View style={styles.appIcon2Bubble2}>
                  <MaterialIcons name="send" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.appIconText}>ORBIXA</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#b30032",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    color: "#b30032",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    marginRight: 16,
  },
  sliderValue: {
    color: "#b30032",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
  },
  chatPreview: {
    backgroundColor: "rgba(135, 206, 250, 0.1)",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  previewBubble: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  previewText: {
    color: "#333",
  },
  previewBubbleRight: {
    backgroundColor: "#b30032",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  previewTextRight: {
    color: "#fff",
  },
  customizationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  customizationText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  themeScroll: {
    marginTop: 8,
  },
  themeOption: {
    marginRight: 12,
    alignItems: "center",
  },
  themePreview: {
    width: 50,
    height: 50,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  themeBubble1: {
    width: 20,
    height: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 4,
  },
  themeBubble2: {
    width: 16,
    height: 10,
    backgroundColor: "#e8f5e8",
    borderRadius: 5,
  },
  appIconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  appIconOption: {
    alignItems: "center",
  },
  appIcon1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  appIcon1Inner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#b30032",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  appIcon2Bubble1: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#b30032",
    top: 5,
    left: 5,
  },
  appIcon2Bubble2: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#b30032",
    top: 15,
    left: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  appIconText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ChatSettingsScreen;
