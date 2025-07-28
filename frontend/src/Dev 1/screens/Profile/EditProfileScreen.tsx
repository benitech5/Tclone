import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialData = route.params as any;

  const [name, setName] = useState(initialData?.name || "Justin Phillips");
  const [lastName, setLastName] = useState("");
  const [channel, setChannel] = useState(
    initialData?.channel || "Personal channel"
  );
  const [bio, setBio] = useState(initialData?.bio || "");
  const [birthday, setBirthday] = useState(
    initialData?.birthday || "Date of Birth"
  );
  const [isLoading, setIsLoading] = useState(false); // NEW

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    console.log("Saving profile changes...");
    setIsLoading(true);

    const updatedProfile = {
      name,
      lastName,
      channel,
      bio,
      birthday,
    };

    try {
      await AsyncStorage.setItem(
        "@profileInfo",
        JSON.stringify(updatedProfile)
      );
      console.log("Profile saved!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChannel = () => {
    console.log("Add channel");
  };

  const handleAddBirthday = () => {
    console.log("Add birthday");
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc143c" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Info</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your channel</Text>
          <View style={styles.channelRow}>
            <TextInput
              style={[styles.input, styles.channelInput]}
              value={channel}
              onChangeText={setChannel}
              placeholder="Channel name"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={handleAddChannel}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Write about yourself..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.infoText}>
            You can add a few lines about yourself. Choose who can see it your
            bio in{" "}
            <Text style={styles.linkText} onPress={handleSettings}>
              Settings
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your birthday</Text>
          <View style={styles.birthdayRow}>
            <TextInput
              style={[styles.input, styles.birthdayInput]}
              value={birthday}
              onChangeText={setBirthday}
              placeholder="Date of Birth"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={handleAddBirthday}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.infoText}>
            Only your contacts can see your birthday.{" "}
            <Text style={styles.linkText} onPress={handleSettings}>
              Settings &gt;
            </Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#dc143c",
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
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionLabel: {
    color: "#dc143c",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: "#000",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 8,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  channelInput: {
    flex: 1,
    marginBottom: 0,
  },
  birthdayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  birthdayInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#dc143c",
    fontSize: 16,
    fontWeight: "500",
  },
  bioInput: {
    height: 80,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginTop: 8,
  },
  linkText: {
    color: "#dc143c",
    fontWeight: "500",
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#dc143c",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
