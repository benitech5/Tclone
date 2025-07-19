import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type GroupInfoNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'GroupInfo'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface GroupInfoScreenProps {
  navigation: GroupInfoNavigationProp;
  route: {
    params: {
      groupId: string;
    };
  };
}

interface GroupMember {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isAdmin: boolean;
  isOwner: boolean;
  joinedAt: Date;
  isOnline: boolean;
}

interface GroupInfo {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  createdAt: Date;
  memberCount: number;
  isAdmin: boolean;
  isOwner: boolean;
  isMuted: boolean;
  isPinned: boolean;
}

const mockGroupInfo: GroupInfo = {
  id: '1',
  name: 'Team Project Alpha',
  description: 'Working on the new mobile app project. Let\'s collaborate and build something amazing together!',
  createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
  memberCount: 8,
  isAdmin: true,
  isOwner: false,
  isMuted: false,
  isPinned: true,
};

const mockGroupMembers: GroupMember[] = [
  {
    id: '1',
    name: 'John Doe',
    phoneNumber: '+1234567890',
    isAdmin: true,
    isOwner: true,
    joinedAt: new Date(Date.now() - 86400000 * 30),
    isOnline: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    phoneNumber: '+1234567891',
    isAdmin: true,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 25),
    isOnline: false,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phoneNumber: '+1234567892',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 20),
    isOnline: true,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    phoneNumber: '+1234567893',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 15),
    isOnline: false,
  },
  {
    id: '5',
    name: 'Alex Brown',
    phoneNumber: '+1234567894',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 10),
    isOnline: true,
  },
  {
    id: '6',
    name: 'Emily Davis',
    phoneNumber: '+1234567895',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 5),
    isOnline: false,
  },
  {
    id: '7',
    name: 'David Miller',
    phoneNumber: '+1234567896',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 3),
    isOnline: true,
  },
  {
    id: '8',
    name: 'Lisa Garcia',
    phoneNumber: '+1234567897',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 1),
    isOnline: false,
  },
];

const GroupInfoScreen: React.FC<GroupInfoScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { theme } = useTheme();
  
  const [groupInfo, setGroupInfo] = useState<GroupInfo>(mockGroupInfo);
  const [members, setMembers] = useState<GroupMember[]>(mockGroupMembers);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditGroup = () => {
    // TODO: Navigate to edit group screen
    Alert.alert('Edit Group', 'Edit group functionality would open here');
  };

  const handleInviteMembers = () => {
    navigation.navigate('InviteToGroup', { groupId });
  };

  const handleMemberPress = (member: GroupMember) => {
    if (member.id === '1') return; // Don't show options for self
    
    const options = ['View Profile'];
    
    if (groupInfo.isAdmin && !member.isOwner) {
      options.push(member.isAdmin ? 'Remove Admin' : 'Make Admin');
    }
    
    if (groupInfo.isOwner && member.id !== '1') {
      options.push('Remove from Group');
    }
    
    options.push('Cancel');
    
    Alert.alert(
      member.name,
      'What would you like to do?',
      options.map(option => ({
        text: option,
        onPress: () => handleMemberAction(member, option),
        style: option === 'Remove from Group' ? 'destructive' : 'default',
      }))
    );
  };

  const handleMemberAction = (member: GroupMember, action: string) => {
    switch (action) {
      case 'View Profile':
        navigation.navigate('ContactProfile', { contactId: member.id });
        break;
      case 'Make Admin':
        setMembers(prev => prev.map(m => 
          m.id === member.id ? { ...m, isAdmin: true } : m
        ));
        Alert.alert('Success', `${member.name} is now an admin`);
        break;
      case 'Remove Admin':
        setMembers(prev => prev.map(m => 
          m.id === member.id ? { ...m, isAdmin: false } : m
        ));
        Alert.alert('Success', `${member.name} is no longer an admin`);
        break;
      case 'Remove from Group':
        Alert.alert(
          'Remove Member',
          `Are you sure you want to remove ${member.name} from the group?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                setMembers(prev => prev.filter(m => m.id !== member.id));
                setGroupInfo(prev => ({ ...prev, memberCount: prev.memberCount - 1 }));
                Alert.alert('Success', `${member.name} has been removed from the group`);
              }
            },
          ]
        );
        break;
    }
  };

  const handleLeaveGroup = () => {
    setShowLeaveModal(false);
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            Alert.alert('Success', 'You have left the group');
          }
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            Alert.alert('Success', 'Group has been deleted');
          }
        },
      ]
    );
  };

  const renderGroupHeader = () => (
    <View style={[styles.groupHeader, { backgroundColor: theme.card }]}>
      <View style={[styles.groupAvatar, { backgroundColor: theme.primary }]}>
        <Icon name="people" size={40} color="#fff" />
      </View>
      
      <View style={styles.groupInfo}>
        <Text style={[styles.groupName, { color: theme.text }]}>
          {groupInfo.name}
        </Text>
        <Text style={[styles.groupDescription, { color: theme.subtext }]}>
          {groupInfo.description}
        </Text>
        <Text style={[styles.groupMeta, { color: theme.subtext }]}>
          {groupInfo.memberCount} members • Created {groupInfo.createdAt.toLocaleDateString()}
        </Text>
      </View>
      
      {groupInfo.isAdmin && (
        <TouchableOpacity style={styles.editButton} onPress={handleEditGroup}>
          <Icon name="pencil" size={20} color={theme.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderActionButton = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    isDestructive = false
  ) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.background }]}>
        <Icon 
          name={icon} 
          size={20} 
          color={isDestructive ? '#ff4444' : theme.primary} 
        />
      </View>
      
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.actionSubtitle, { color: theme.subtext }]}>
          {subtitle}
        </Text>
      </View>
      
      <Icon name="chevron-forward" size={20} color={theme.subtext} />
    </TouchableOpacity>
  );

  const renderMember = ({ item }: { item: GroupMember }) => (
    <TouchableOpacity
      style={[styles.memberItem, { backgroundColor: theme.card }]}
      onPress={() => handleMemberPress(item)}
    >
      <View style={styles.memberInfo}>
        <View style={[styles.memberAvatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.memberAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
          {item.isOnline && (
            <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
          )}
        </View>
        
        <View style={styles.memberDetails}>
          <View style={styles.memberNameRow}>
            <Text style={[styles.memberName, { color: theme.text }]}>
              {item.name}
            </Text>
            {item.isOwner && (
              <Text style={[styles.ownerBadge, { color: theme.primary }]}>
                Owner
              </Text>
            )}
            {item.isAdmin && !item.isOwner && (
              <Text style={[styles.adminBadge, { color: theme.primary }]}>
                Admin
              </Text>
            )}
          </View>
          <Text style={[styles.memberPhone, { color: theme.subtext }]}>
            {item.phoneNumber}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.memberJoined, { color: theme.subtext }]}>
        {item.joinedAt.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderGroupHeader()}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {renderActionButton(
            'people-add',
            'Add Members',
            'Invite people to join the group',
            handleInviteMembers
          )}
          
          {renderActionButton(
            'notifications',
            groupInfo.isMuted ? 'Unmute Notifications' : 'Mute Notifications',
            groupInfo.isMuted ? 'Receive notifications from this group' : 'Stop receiving notifications',
            () => setGroupInfo(prev => ({ ...prev, isMuted: !prev.isMuted }))
          )}
          
          {renderActionButton(
            'pin',
            groupInfo.isPinned ? 'Unpin Chat' : 'Pin Chat',
            groupInfo.isPinned ? 'Remove from pinned chats' : 'Pin to top of chat list',
            () => setGroupInfo(prev => ({ ...prev, isPinned: !prev.isPinned }))
          )}
          
          {renderActionButton(
            'share',
            'Share Group',
            'Share group invite link',
            () => Alert.alert('Share', 'Share functionality would open here')
          )}
        </View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Members ({members.length})
            </Text>
          </View>
          
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.membersList}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Danger Zone
          </Text>
          
          {renderActionButton(
            'log-out',
            'Leave Group',
            'Leave this group chat',
            () => setShowLeaveModal(true),
            true
          )}
          
          {groupInfo.isOwner && renderActionButton(
            'trash',
            'Delete Group',
            'Permanently delete this group',
            () => setShowDeleteModal(true),
            true
          )}
        </View>
      </ScrollView>

      {/* Leave Group Modal */}
      <Modal
        visible={showLeaveModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Leave Group
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to leave "{groupInfo.name}"? You won't be able to see messages from this group anymore.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setShowLeaveModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff4444' }]}
                onPress={handleLeaveGroup}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Leave
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Group Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Delete Group
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to delete "{groupInfo.name}"? This action cannot be undone and all members will be removed.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff4444' }]}
                onPress={handleDeleteGroup}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  groupMeta: {
    fontSize: 12,
  },
  editButton: {
    padding: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  membersSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  membersList: {
    paddingHorizontal: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  memberAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  memberDetails: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  ownerBadge: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,136,204,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadge: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,136,204,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberPhone: {
    fontSize: 14,
  },
  memberJoined: {
    fontSize: 12,
  },
  dangerSection: {
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GroupInfoScreen; 