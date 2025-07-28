import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { contactsData, Contact } from "../../Data/contactsData";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NewGroupScreen: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const navigation = useNavigation();

  const filteredContacts = contactsData.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleLongPress = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onLongPress={() => handleLongPress(item.id)}
      onPress={() => handleLongPress(item.id)}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      {selected.includes(item.id) && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color="#b30032"
          style={styles.selectedIcon}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc143c" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Who would you like to add"
        placeholderTextColor="#bfa3b3"
        value={search}
        onChangeText={setSearch}
        selectionColor="crimson"
      />

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, selected.length === 0 && styles.fabDisabled]}
        onPress={() =>
          (navigation as any).navigate("GroupInfo", {
            selectedContacts: selected,
          })
        }
        disabled={selected.length === 0}
        activeOpacity={selected.length === 0 ? 1 : 0.7}
        accessibilityLabel="Proceed to group details"
      >
        <Ionicons name="arrow-forward" size={30} color="#fff" />
      </TouchableOpacity>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f2e6e9",
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "crimson",
    fontSize: 17,
    paddingVertical: 10,
    color: "black",
  },
  listContainer: {
    paddingBottom: 100,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    borderBottomColor: "#fff",
    backgroundColor: "#fff",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  infoContainer: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#222",
  },
  status: { fontSize: 12, color: "#bfa3b3", fontFamily: "Roboto" },
  selectedIcon: { marginLeft: 8 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 60,
    backgroundColor: "#b30032",
    width: 50,
    height: 50,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fabDisabled: {
    backgroundColor: "#e0bfc7",
  },
});

export default NewGroupScreen;
