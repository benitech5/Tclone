import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type BlockedUsersNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'BlockedUsers'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface BlockedUsersScreenProps {
  navigation: BlockedUsersNavigationProp;
}

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  avatar?: string;
  blockedAt: Date;
  blockedReason?: string;
  isVerified: boolean;
  mutualContacts: number;
}

const mockBlockedUsers: BlockedUser[] = [
  {
    id: '1',
    name: 'John Spam',
    username: 'johnspam',
    phoneNumber: '+1234567890',
    blockedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    blockedReason: 'Spam messages',
    isVerified: false,
    mutualContacts: 2,
  },
  {
    id: '2',
    name: 'Sarah Harass',
    username: 'sarahharass',
    phoneNumber: '+1234567891',
    blockedAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
    blockedReason: 'Harassment',
    isVerified: true,
    mutualContacts: 5,
  },
  {
    id: '3',
    name: 'Mike Unwanted',
    username: 'mikeunwanted',
    phoneNumber: '+1234567892',
    blockedAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
    isVerified: false,
    mutualContacts: 0,
  },
  {
    id: '4',
    name: 'Lisa Fake',
    username: 'lisafake',
    phoneNumber: '+1234567893',
    blockedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    blockedReason: 'Fake account',
    isVerified: false,
    mutualContacts: 1,
  },
];

const BlockedUsersScreen: React.FC<BlockedUsersScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(mockBlockedUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)
  );

  const handleUnblockUser = (user: BlockedUser) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.name}? You will be able to receive messages and calls from them again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => {
            setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
            Alert.alert('Success', `${user.name} has been unblocked`);
          }
        },
      ]
    );
  };

  const handleViewProfile = (user: BlockedUser) => {
    // Navigate to a read-only profile view
    Alert.alert('View Profile', `Viewing ${user.name}'s profile (read-only mode)`);
  };

  const handleReportUser = (user: BlockedUser) => {
    Alert.alert(
      'Report User',
      `Report ${user.name} for inappropriate behavior?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.');
          }
        },
      ]
    );
  };

  const handleBlockAll = () => {
    Alert.alert(
      'Block All',
      'Are you sure you want to block all users in this list? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block All',
          style: 'destructive',
          onPress: () => {
            // This would typically block all users in the list
            Alert.alert('Success', 'All users have been blocked');
          }
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (blockedUsers.length === 0) {
      Alert.alert('No Users', 'There are no blocked users to clear');
      return;
    }

    Alert.alert(
      'Clear All',
      `Are you sure you want to unblock all ${blockedUsers.length} users?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          onPress: () => {
            setBlockedUsers([]);
            Alert.alert('Success', 'All users have been unblocked');
          }
        },
      ]
    );
  };

  const renderBlockedUser = ({ item }: { item: BlockedUser }) => (
    <View style={[styles.userItem, { backgroundColor: theme.card }]}>
      <View style={styles.userInfo}>
        <View style={[styles.userAvatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.userAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.userDetails}>
          <View style={styles.userNameRow}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {item.name}
            </Text>
            {item.isVerified && (
              <Icon name="checkmark-circle" size={16} color={theme.primary} />
            )}
          </View>
          
          <Text style={[styles.userUsername, { color: theme.subtext }]}>
            @{item.username}
          </Text>
          
          <Text style={[styles.userPhone, { color: theme.subtext }]}>
            {item.phoneNumber}
          </Text>
          
          <View style={styles.userMeta}>
            <Text style={[styles.blockedDate, { color: theme.subtext }]}>
              Blocked {item.blockedAt.toLocaleDateString()}
            </Text>
            {item.blockedReason && (
              <Text style={[styles.blockedReason, { color: '#f44336' }]}>
                • {item.blockedReason}
              </Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
          onPress={() => handleViewProfile(item)}
        >
          <Icon name="eye" size={16} color={theme.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' + '20' }]}
          onPress={() => handleUnblockUser(item)}
        >
          <Icon name="lock-open" size={16} color="#4CAF50" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' + '20' }]}
          onPress={() => handleReportUser(item)}
        >
          <Icon name="flag" size={16} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="shield-checkmark" size={64} color={theme.subtext} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Blocked Users
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
        You haven't blocked any users yet. Blocked users will appear here.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Blocked Users
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBlockAll}>
            <Icon name="lock-closed" size={20} color={theme.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleClearAll} style={{ marginLeft: 16 }}>
            <Icon name="trash" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search blocked users..."
          placeholderTextColor={theme.subtext}
        />
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {blockedUsers.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Blocked Users
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {blockedUsers.filter(u => u.blockedReason).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            With Reasons
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {blockedUsers.filter(u => u.isVerified).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Verified
          </Text>
        </View>
      </View>

      {/* Users List */}
      {blockedUsers.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderBlockedUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.usersList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Info Section */}
      <View style={[styles.infoSection, { backgroundColor: theme.card }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>
          About Blocked Users
        </Text>
        <Text style={[styles.infoText, { color: theme.subtext }]}>
          • Blocked users cannot send you messages or call you{'\n'}
          • You can unblock users at any time{'\n'}
          • Blocked users won't know they're blocked{'\n'}
          • You can report users for inappropriate behavior
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  usersList: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  userUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockedDate: {
    fontSize: 12,
  },
  blockedReason: {
    fontSize: 12,
    marginLeft: 4,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default BlockedUsersScreen; 