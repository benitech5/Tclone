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
    <View style={styles.container}>
      {/* Main Header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainHeader: {
    backgroundColor: "#dc143c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    height: 50,
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
