import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stories = [
  { id: '1', name: 'My Story', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Bobee Jnr', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '3', name: 'Mirabelle', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '4', name: 'Nikano Miku', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
];

const chats = [
  { id: '1', name: 'Yung Zeus', lastMessage: 'Oh then nawa for you bro...', time: '09:00', unread: 1, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '2', name: 'Jay 💯', lastMessage: 'Where is the meeting place', time: 'Sat', unread: 1, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: '3', name: 'Udemy Free Coupons', lastMessage: '✨AI in science mastery ...', time: '09:00', unread: 23426, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: '4', name: 'Python Tutorials for B...', lastMessage: '🔥An intuitive online session', time: 'Mar 04', unread: 300, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: '5', name: 'Forex Signals Indica...', lastMessage: '‼️HERE ARE SOME  INTER...', time: '09:50', unread: 20, avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: '6', name: 'Figma Plugins Hub C...', lastMessage: '🔴Get all your figma plugi...', time: 'Sat', unread: 9, avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
  { id: '7', name: 'Saved Messages', lastMessage: 'https://t.me/bg/4fz0fzg1CFYVIJ...', time: 'Wed', unread: 0, avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
];

const tabs = [
  { label: 'All', count: 336 },
  { label: 'Important', count: 0 },
  { label: 'Unread', count: 4 },
];

export default function MainChatListScreen() {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KONVO</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesRow}>
        {stories.map(story => (
          <View key={story.id} style={styles.storyAvatarContainer}>
            <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
            <Text style={styles.storyName}>{story.name}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.tabsRow}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity key={tab.label} style={styles.tab} onPress={() => setActiveTab(idx)}>
            <Text style={[styles.tabLabel, activeTab === idx && styles.activeTabLabel]}>{tab.label}</Text>
            {tab.count > 0 && (
              <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{tab.count}</Text></View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.time}>{item.time}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>
              )}
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#d0021b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  storiesRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
  storyAvatarContainer: { alignItems: 'center', marginRight: 16 },
  storyAvatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#d0021b' },
  storyName: { fontSize: 12, color: '#222', marginTop: 4, maxWidth: 60, textAlign: 'center' },
  tabsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  tabLabel: { fontSize: 16, color: '#888', fontWeight: 'bold' },
  activeTabLabel: { color: '#d0021b' },
  tabBadge: { backgroundColor: '#d0021b', borderRadius: 10, paddingHorizontal: 6, marginLeft: 6 },
  tabBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  list: { flex: 1 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f2f2f7' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  lastMessage: { fontSize: 15, color: '#888', marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  time: { fontSize: 13, color: '#aaa' },
  unreadBadge: { backgroundColor: '#d0021b', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  unreadText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
}); 