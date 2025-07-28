import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const GroupInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  // const { selectedContacts } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Group Avatar and Name */}
      <View style={styles.avatarRow}>
        <TouchableOpacity style={styles.avatarCircle}>
          <MaterialIcons name="photo-camera" size={36} color="#b30032" />
        </TouchableOpacity>
        <TextInput
          style={styles.groupNameInput}
          placeholder="Enter a group name"
          placeholderTextColor="#888"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity>
          <Ionicons name="happy-outline" size={28} color="#888" />
        </TouchableOpacity>
      </View>
      {/* Description */}
      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionLabel}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="You can provide an optional description for your channel"
          placeholderTextColor="#bbb"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>
      {/* Floating Check Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="checkmark" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b30032",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 16,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#b30032",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  groupNameInput: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#b30032",
    color: "#222",
    marginRight: 12,
    paddingVertical: 4,
  },
  descriptionBox: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: "#faf9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  descriptionLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
    fontWeight: "bold",
  },
  descriptionInput: {
    fontSize: 15,
    color: "#888",
    minHeight: 40,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 60,
    backgroundColor: "#b30032",
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default GroupInfoScreen;
