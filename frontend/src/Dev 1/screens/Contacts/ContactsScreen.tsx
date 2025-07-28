import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AddContactScreen from "./AddContactScreen";

// Mock data for contacts based on the Figma design
const mockContacts = [
  {
    id: "1",
    name: "Humphrey Oddo",
    lastSeen: "last seen 3 minutes ago",
    avatar: require("../../../../assets/avatars/everything/extema.jpeg"),
  },
  {
    id: "2",
    name: "Nasim Davids",
    lastSeen: "last seen an hour ago",
    avatar: require("../../../../assets/avatars/everything/fierycar.jpeg"),
  },
  {
    id: "3",
    name: "Edgar K. White",
    lastSeen: "last seen 3 hours ago",
    avatar: require("../../../../assets/avatars/everything/roro.jpeg"),
  },
  {
    id: "4",
    name: "Angella Reece",
    lastSeen: "last seen yesterday at 19:16",
    avatar: require("../../../../assets/avatars/everything/purpleroom.jpeg"),
  },
  {
    id: "5",
    name: "Christine Rudolph",
    lastSeen: "last seen yesterday at 20:24",
    avatar: require("../../../../assets/avatars/everything/Madara Uchiha.jpeg"),
  },
  {
    id: "6",
    name: "Maximillian Akuffo Saah",
    lastSeen: "last seen within 1 month",
    avatar: require("../../../../assets/avatars/everything/tennisballs.jpeg"),
  },
  {
    id: "7",
    name: "Emmanuel Amsterdam",
    lastSeen: "last seen Jul 05 at 12:12",
    avatar: require("../../../../assets/avatars/everything/lapee.jpeg"),
  },
  {
    id: "8",
    name: "Jordan Ambrosini",
    lastSeen: "last seen recently",
    avatar: require("../../../../assets/avatars/everything/wow.jpeg"),
  },
  {
    id: "9",
    name: "Victor Nacho Hernandez",
    lastSeen: "last seen Feb 21 at 09:24",
    avatar: require("../../../../assets/avatars/everything/jordan.jpeg"),
  },
  {
    id: "10",
    name: "Julio Gomez",
    lastSeen: "last seen 3 hours ago",
    avatar: require("../../../../assets/avatars/everything/O.jpeg"),
  },
  {
    id: "11",
    name: "Abdul Russel",
    lastSeen: "last seen a long time ago",
    avatar: require("../../../../assets/avatars/everything/gojo.jpeg"),
  },
  {
    id: "12",
    name: "~Michael Tyron",
    lastSeen: "last seen within a year",
    avatar: require("../../../../assets/avatars/everything/juliameme.jpeg"),
  },
  {
    id: "13",
    name: "Kurosaki Ichigo",
    lastSeen: "last seen recently",
    avatar: require("../../../../assets/avatars/everything/techrrt.jpeg"),
  },
];

// Special entries for New Group and New Contacts
const specialEntries = [
  { id: "new-group", name: "New Group", icon: "people", type: "special" },
  {
    id: "new-contacts",
    name: "New Contacts",
    icon: "person-add",
    type: "special",
  },
];

const ContactsScreen = () => {
  const navigation = useNavigation();
  const [showAddContact, setShowAddContact] = useState(false);

  const handleAddContact = () => {
    setShowAddContact(true);
  };

  const handleCloseAddContact = () => {
    setShowAddContact(false);
  };

  const handleSpecialEntry = (item: any) => {
    if (item.id === "new-group") {
      navigation.navigate("NewGroup" as never);
    } else if (item.id === "new-contacts") {
      console.log("Add new contacts");
    }
  };

  const handleContactPress = (contact: any) => {
    // Handle contact selection
    console.log("Selected contact:", contact.name);
  };

  const renderSpecialEntry = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.specialEntry}
      onPress={() => handleSpecialEntry(item)}
    >
      <View style={styles.specialIcon}>
        <Ionicons name={item.icon as any} size={24} color="#666" />
      </View>
      <Text style={styles.specialText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderContact = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.lastSeen}>{item.lastSeen}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "special") {
      return renderSpecialEntry({ item });
    }
    return renderContact({ item });
  };

  const allData = [...specialEntries, ...mockContacts];

  return (
    <SafeAreaView style={styles.container}>
      {/* Contact List */}
      <FlatList
        data={allData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddContact}>
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Contact Modal */}
      {showAddContact && <AddContactScreen onClose={handleCloseAddContact} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  listContainer: {
    paddingTop: 8,
  },
  specialEntry: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  specialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  specialText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  lastSeen: {
    fontSize: 14,
    color: "#666",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#dc143c",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default ContactsScreen;
