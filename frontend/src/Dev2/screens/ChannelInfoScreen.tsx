import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const channel = {
  avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  name: 'Design Stuffs',
  status: 'Last seen recently',
  description: "I'm a product designer who is interested in sharing nice design stuff.",
  invite: 't.me/Design_Stuffs',
  subscribers: 3142,
  admins: 5,
  media: [
    { id: 1, image: 'https://via.placeholder.com/80' },
    { id: 2, image: 'https://via.placeholder.com/80' },
    { id: 3, image: 'https://via.placeholder.com/80' },
  ],
  subscriberList: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
  adminList: [
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dionysus' },
  ],
};

const tabs = ['Posts', 'Media', 'Files', 'Voice', 'Links', 'GIFs'];

const ChannelInfoScreen = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [notifications, setNotifications] = useState(true);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: channel.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{channel.name}</Text>
          <Text style={styles.status}>{channel.status}</Text>
        </View>
      </View>
      <Text style={styles.description}>{channel.description}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Invite Link</Text>
        <Text style={styles.invite}>{channel.invite}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Notification</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Subscribers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: channel.subscriberList[0].id })}>
          <Text>{channel.subscribers}</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 16 }}>Administrators</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: channel.adminList[0].id })}>
          <Text>{channel.admins}</Text>
        </TouchableOpacity>
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
          data={channel.media}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('MediaViewer', { mediaId: item.id })}>
              <Image source={{ uri: item.image }} style={styles.mediaItem} />
            </TouchableOpacity>
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
  description: { fontSize: 14, color: '#e53935', paddingHorizontal: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 8 },
  label: { fontSize: 16 },
  invite: { color: '#e53935', fontWeight: 'bold' },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#e53935' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#e53935', fontWeight: 'bold' },
  mediaItem: { width: 80, height: 80, margin: 4, borderRadius: 8 },
});

export default ChannelInfoScreen; 