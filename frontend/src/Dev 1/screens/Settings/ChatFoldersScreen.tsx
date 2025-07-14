import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const ChatFoldersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Chat Folders" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Folder Icon and Description */}
        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <Ionicons name="folder-open" size={72} color={theme.accent} />
          <Text style={[styles.description, { color: theme.subtext }]}>Create folders for different groups of chats and quickly switch between them.</Text>
        </View>
        {/* Recommended Folders */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Recommended Folders</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.folderTitle, { color: theme.text }]}>Unread</Text>
            <Text style={[styles.folderDesc, { color: theme.subtext }]}>New messages from all chats.</Text>
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]}> <Text style={styles.addButtonText}>Add</Text> </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.folderTitle, { color: theme.text }]}>Personal</Text>
            <Text style={[styles.folderDesc, { color: theme.subtext }]}>Only messages from personal chats.</Text>
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]}> <Text style={styles.addButtonText}>Add</Text> </TouchableOpacity>
        </View>
        {/* Chat Folders */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Chat Folders</Text>
        <View style={styles.row}>
          <MaterialIcons name="drag-handle" size={22} color={theme.subtext} style={styles.icon} />
          <Text style={[styles.folderTitle, { color: theme.text, flex: 1 }]}>All Chats</Text>
        </View>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="add-circle-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.folderTitle, { color: theme.accent }]}>Create New Folder</Text>
        </TouchableOpacity>
        {/* Show Folder Tags */}
        <View style={[styles.row, { justifyContent: 'space-between' }]}> 
          <Text style={[styles.folderTitle, { color: theme.text }]}>Show Folder Tags</Text>
          <Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        {/* Premium Note */}
        <Text style={[styles.premiumNote, { color: theme.subtext }]}>Subscribe to <Text style={{ color: theme.accent, textDecorationLine: 'underline' }}>Orbixa Premium</Text> to display folder names for each chat in the chat list.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  description: { fontSize: 15, textAlign: 'center', marginTop: 16 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 12 },
  folderTitle: { fontSize: 15 },
  folderDesc: { fontSize: 13 },
  addButton: { borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  premiumNote: { fontSize: 13, marginTop: 24, textAlign: 'center' },
});

export default ChatFoldersScreen; 