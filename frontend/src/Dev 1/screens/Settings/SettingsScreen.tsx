import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types/navigation";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, "Settings">;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const routeMap: Record<string, string> = {
    "Chat Settings": "ChatSettings",
    "Privacy and Security": "Privacy",
    "Notifications and Sounds": "Notifications",
    "Data and Storage": "DataAndStorage",
    Devices: "Devices",
    Language: "Language",
    "Chat folders": "ChatFolders",
    "Power Saving": "PowerSaving",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image
            source={require("../../../../assets/avatars/everything/Madara Uchiha.jpeg")}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Yung Zeus</Text>
          <Text style={styles.userStatus}>Online</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Photo Action */}
        <View style={styles.profilePhotoSection}>
          <TouchableOpacity style={styles.profilePhotoAction}>
            <Ionicons name="camera" size={20} color="#b30032" />
            <Text style={styles.profilePhotoText}>Set Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemContent}>
              <Text style={styles.accountItemLabel}>Phone Number</Text>
              <Text style={styles.accountItemValue}>+233 725098765</Text>
            </View>
            <Text style={styles.accountItemHint}>
              Tap to change phone number.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemContent}>
              <Text style={styles.accountItemLabel}>Username</Text>
              <Text style={styles.accountItemValue}>None</Text>
            </View>
            <Text style={styles.accountItemHint}>Username</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemContent}>
              <Text style={styles.accountItemLabel}>Bio</Text>
              <Text style={styles.accountItemValue}>Bio</Text>
            </View>
            <Text style={styles.accountItemHint}>
              Add a few words about yourself.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("ChatSettings")}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
            <Text style={styles.settingsItemText}>Chat Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("Privacy")}
          >
            <Ionicons name="shield-checkmark" size={24} color="#333" />
            <Text style={styles.settingsItemText}>Privacy and Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <Text style={styles.settingsItemText}>
              Notifications and Sounds
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("DataAndStorage")}
          >
            <MaterialIcons name="storage" size={24} color="#333" />
            <Text style={styles.settingsItemText}>Data and Storage</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("Devices")}
          >
            <Ionicons name="laptop-outline" size={24} color="#333" />
            <Text style={styles.settingsItemText}>Devices</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("Language")}
          >
            <Ionicons name="language-outline" size={24} color="#333" />
            <Text style={styles.settingsItemText}>Language</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("ChatFolders")}
          >
            <Ionicons name="folder-outline" size={24} color="#333" />
            <Text style={styles.settingsItemText}>Chat folders</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate("PowerSaving")}
          >
            <MaterialCommunityIcons
              name="battery-sync"
              size={24}
              color="#333"
            />
            <Text style={styles.settingsItemText}>Power Saving</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help</Text>

          <TouchableOpacity style={styles.helpItem}>
            <Ionicons name="help-circle-outline" size={24} color="#333" />
            <Text style={styles.helpItemText}>Ask a Question</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Ionicons name="help-buoy-outline" size={24} color="#333" />
            <Text style={styles.helpItemText}>Convo FAQ</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Ionicons name="document-text-outline" size={24} color="#333" />
            <Text style={styles.helpItemText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
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
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  profilePhotoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 15,
    borderBottomColor: "#f0f0f0",
  },
  profilePhotoAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePhotoText: {
    color: "#b30032",
    fontSize: 16,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 15,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    color: "#dc143c",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  accountItem: {
    marginBottom: 16,
  },
  accountItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  accountItemLabel: {
    fontSize: 14,
    color: "#333",
  },
  accountItemValue: {
    fontSize: 16,
    color: "#333",
  },
  accountItemHint: {
    fontSize: 12,
    color: "#666",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingsItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  helpItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
});

export default SettingsScreen;
