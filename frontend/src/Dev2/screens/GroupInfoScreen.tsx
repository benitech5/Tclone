import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const group = {
  avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
  name: 'Mobile App Dev',
  status: 'Last seen recently',
  members: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dionysus' },
  ],
};

const tabs = ['Members', 'Media', 'Files', 'Voice', 'Links', 'GIFs'];

const GroupInfoScreen = () => {
  const [activeTab, setActiveTab] = useState('Members');
  const [notifications, setNotifications] = useState(true);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: group.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.status}>{group.status}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Notification</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <TouchableOpacity style={styles.addMembersBtn}>
        <Text style={styles.addMembersText}>+ Add Members</Text>
      </TouchableOpacity>
      <View style={styles.tabsRow}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Members' && (
        <FlatList
          data={group.members}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.memberRow} onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
              <View style={styles.memberAvatar} />
              <Text style={styles.memberName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {/* Other tabs can be implemented similarly, e.g., navigation to media viewer */}
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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 8 },
  label: { fontSize: 16 },
  addMembersBtn: { paddingHorizontal: 24, paddingVertical: 12 },
  addMembersText: { color: '#e53935', fontWeight: 'bold' },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#e53935' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#e53935', fontWeight: 'bold' },
  memberRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  memberAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', marginRight: 12 },
  memberName: { fontSize: 16 },
});

export default GroupInfoScreen; 