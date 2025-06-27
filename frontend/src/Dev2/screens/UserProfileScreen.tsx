import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, FlatList } from 'react-native';

const user = {
  avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
  name: 'Amos',
  status: 'Last seen recently',
  bio: 'Product Designer',
  username: 'Shaddy Amos',
  media: [
    { id: 1, image: 'https://via.placeholder.com/80' },
    { id: 2, image: 'https://via.placeholder.com/80' },
    { id: 3, image: 'https://via.placeholder.com/80' },
  ],
};

const tabs = ['Posts', 'Media', 'Files', 'Voice', 'Links', 'GIFs'];

const UserProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.status}>{user.status}</Text>
        </View>
      </View>
      <Text style={styles.bio}>{user.bio}</Text>
      <Text style={styles.username}>{user.username}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <View style={styles.tabsRow}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Media' && (
        <FlatList
          data={user.media}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.mediaItem} />
          )}
        />
      )}
      {/* Other tabs can be implemented similarly */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#888' },
  bio: { fontSize: 14, color: '#888', paddingHorizontal: 24, marginBottom: 4 },
  username: { fontSize: 14, color: '#e53935', paddingHorizontal: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 8 },
  label: { fontSize: 16 },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#e53935' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#e53935', fontWeight: 'bold' },
  mediaItem: { width: 80, height: 80, margin: 4, borderRadius: 8 },
});

export default UserProfileScreen; 