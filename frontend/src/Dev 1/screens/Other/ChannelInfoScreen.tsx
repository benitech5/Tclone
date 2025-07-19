import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type ChannelInfoNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'ChannelInfo'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ChannelInfoScreenProps {
  navigation: ChannelInfoNavigationProp;
  route: {
    params: {
      channelId: string;
      channelName?: string;
    };
  };
}

interface ChannelSubscriber {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isAdmin: boolean;
  isOwner: boolean;
  joinedAt: Date;
  isOnline: boolean;
  isVerified: boolean;
}

interface ChannelInfo {
  id: string;
  name: string;
  description: string;
  username?: string;
  avatar?: string;
  createdAt: Date;
  subscriberCount: number;
  postCount: number;
  isAdmin: boolean;
  isOwner: boolean;
  isSubscribed: boolean;
  isMuted: boolean;
  isPinned: boolean;
  settings: {
    isPublic: boolean;
    allowComments: boolean;
    allowReactions: boolean;
    requireApproval: boolean;
    autoDelete: boolean;
    autoDeleteDays: number;
  };
}

const mockChannelInfo: ChannelInfo = {
  id: '1',
  name: 'Tech News Daily',
  description: 'Stay updated with the latest technology news, trends, and insights from around the world. Breaking tech news, product launches, and industry analysis.',
  username: 'technewsdaily',
  createdAt: new Date(Date.now() - 86400000 * 90), // 90 days ago
  subscriberCount: 15420,
  postCount: 342,
  isAdmin: true,
  isOwner: false,
  isSubscribed: true,
  isMuted: false,
  isPinned: true,
  settings: {
    isPublic: true,
    allowComments: true,
    allowReactions: true,
    requireApproval: false,
    autoDelete: false,
    autoDeleteDays: 7,
  },
};

const mockSubscribers: ChannelSubscriber[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    isAdmin: true,
    isOwner: true,
    joinedAt: new Date(Date.now() - 86400000 * 90),
    isOnline: true,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    isAdmin: true,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 80),
    isOnline: false,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    username: 'mikejohnson',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 70),
    isOnline: true,
    isVerified: false,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    username: 'sarahwilson',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 60),
    isOnline: false,
    isVerified: false,
  },
  {
    id: '5',
    name: 'Alex Brown',
    username: 'alexbrown',
    isAdmin: false,
    isOwner: false,
    joinedAt: new Date(Date.now() - 86400000 * 50),
    isOnline: true,
    isVerified: false,
  },
];

const ChannelInfoScreen: React.FC<ChannelInfoScreenProps> = ({ navigation, route }) => {
  const { channelId } = route.params;
  const { theme } = useTheme();
  
  const [channelInfo, setChannelInfo] = useState<ChannelInfo>(mockChannelInfo);
  const [subscribers, setSubscribers] = useState<ChannelSubscriber[]>(mockSubscribers);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleEditChannel = () => {
    // TODO: Navigate to edit channel screen
    Alert.alert('Edit Channel', 'Edit channel functionality would open here');
  };

  const handleInviteSubscribers = () => {
    navigation.navigate('InviteFriends', { 
      groupId: channelId, 
      groupName: channelInfo.name 
    });
  };

  const handleSubscriberPress = (subscriber: ChannelSubscriber) => {
    if (subscriber.id === '1') return; // Don't show options for self
    
    const options = ['View Profile'];
    
    if (channelInfo.isAdmin && !subscriber.isOwner) {
      options.push(subscriber.isAdmin ? 'Remove Admin' : 'Make Admin');
    }
    
    if (channelInfo.isOwner && subscriber.id !== '1') {
      options.push('Remove from Channel');
    }
    
    options.push('Cancel');
    
    Alert.alert(
      subscriber.name,
      'What would you like to do?',
      options.map(option => ({
        text: option,
        onPress: () => handleSubscriberAction(subscriber, option),
        style: option === 'Remove from Channel' ? 'destructive' : 'default',
      }))
    );
  };

  const handleSubscriberAction = (subscriber: ChannelSubscriber, action: string) => {
    switch (action) {
      case 'View Profile':
        navigation.navigate('ContactProfile', { contactId: subscriber.id });
        break;
      case 'Make Admin':
        setSubscribers(prev => prev.map(s => 
          s.id === subscriber.id ? { ...s, isAdmin: true } : s
        ));
        Alert.alert('Success', `${subscriber.name} is now an admin`);
        break;
      case 'Remove Admin':
        setSubscribers(prev => prev.map(s => 
          s.id === subscriber.id ? { ...s, isAdmin: false } : s
        ));
        Alert.alert('Success', `${subscriber.name} is no longer an admin`);
        break;
      case 'Remove from Channel':
        Alert.alert(
          'Remove Subscriber',
          `Are you sure you want to remove ${subscriber.name} from the channel?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                setSubscribers(prev => prev.filter(s => s.id !== subscriber.id));
                setChannelInfo(prev => ({ ...prev, subscriberCount: prev.subscriberCount - 1 }));
                Alert.alert('Success', `${subscriber.name} has been removed from the channel`);
              }
            },
          ]
        );
        break;
    }
  };

  const handleLeaveChannel = () => {
    setShowLeaveModal(false);
    Alert.alert(
      'Leave Channel',
      'Are you sure you want to leave this channel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            Alert.alert('Success', 'You have left the channel');
          }
        },
      ]
    );
  };

  const handleDeleteChannel = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Delete Channel',
      'Are you sure you want to delete this channel? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            Alert.alert('Success', 'Channel has been deleted');
          }
        },
      ]
    );
  };

  const handleSettingToggle = (key: keyof ChannelInfo['settings']) => {
    setChannelInfo(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key],
      }
    }));
  };

  const renderChannelHeader = () => (
    <View style={[styles.channelHeader, { backgroundColor: theme.card }]}>
      <View style={[styles.channelAvatar, { backgroundColor: theme.primary }]}>
        <Icon name="radio" size={40} color="#fff" />
      </View>
      
      <View style={styles.channelInfo}>
        <View style={styles.channelNameRow}>
          <Text style={[styles.channelName, { color: theme.text }]}>
            {channelInfo.name}
          </Text>
          {channelInfo.username && (
            <Text style={[styles.channelUsername, { color: theme.primary }]}>
              @{channelInfo.username}
            </Text>
          )}
        </View>
        <Text style={[styles.channelDescription, { color: theme.subtext }]}>
          {channelInfo.description}
        </Text>
        <Text style={[styles.channelMeta, { color: theme.subtext }]}>
          {channelInfo.subscriberCount.toLocaleString()} subscribers • {channelInfo.postCount} posts • Created {channelInfo.createdAt.toLocaleDateString()}
        </Text>
      </View>
      
      {channelInfo.isAdmin && (
        <TouchableOpacity style={styles.editButton} onPress={handleEditChannel}>
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

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
      <View style={styles.settingInfo}>
        <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
          <Icon name={icon} size={20} color={theme.primary} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary + '40' }}
        thumbColor={value ? theme.primary : theme.subtext}
      />
    </View>
  );

  const renderSubscriber = ({ item }: { item: ChannelSubscriber }) => (
    <TouchableOpacity
      style={[styles.subscriberItem, { backgroundColor: theme.card }]}
      onPress={() => handleSubscriberPress(item)}
    >
      <View style={styles.subscriberInfo}>
        <View style={[styles.subscriberAvatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.subscriberAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
          {item.isOnline && (
            <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
          )}
        </View>
        
        <View style={styles.subscriberDetails}>
          <View style={styles.subscriberNameRow}>
            <Text style={[styles.subscriberName, { color: theme.text }]}>
              {item.name}
            </Text>
            {item.isVerified && (
              <Icon name="checkmark-circle" size={16} color={theme.primary} />
            )}
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
          <Text style={[styles.subscriberUsername, { color: theme.subtext }]}>
            @{item.username}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.subscriberJoined, { color: theme.subtext }]}>
        {item.joinedAt.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderChannelHeader()}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {renderActionButton(
            'people-add',
            'Invite Subscribers',
            'Invite people to join the channel',
            handleInviteSubscribers
          )}
          
          {renderActionButton(
            'notifications',
            channelInfo.isMuted ? 'Unmute Notifications' : 'Mute Notifications',
            channelInfo.isMuted ? 'Receive notifications from this channel' : 'Stop receiving notifications',
            () => setChannelInfo(prev => ({ ...prev, isMuted: !prev.isMuted }))
          )}
          
          {renderActionButton(
            'pin',
            channelInfo.isPinned ? 'Unpin Channel' : 'Pin Channel',
            channelInfo.isPinned ? 'Remove from pinned channels' : 'Pin to top of channel list',
            () => setChannelInfo(prev => ({ ...prev, isPinned: !prev.isPinned }))
          )}
          
          {renderActionButton(
            'share',
            'Share Channel',
            'Share channel link',
            () => Alert.alert('Share', 'Share functionality would open here')
          )}
        </View>

        {/* Channel Settings */}
        {channelInfo.isAdmin && (
          <View style={styles.settingsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Channel Settings
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
                <Icon 
                  name={showSettings ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.primary} 
                />
              </TouchableOpacity>
            </View>
            
            {showSettings && (
              <>
                {renderSettingItem(
                  'chatbubble',
                  'Allow Comments',
                  'Subscribers can comment on posts',
                  channelInfo.settings.allowComments,
                  () => handleSettingToggle('allowComments')
                )}
                
                {renderSettingItem(
                  'heart',
                  'Allow Reactions',
                  'Subscribers can react to posts',
                  channelInfo.settings.allowReactions,
                  () => handleSettingToggle('allowReactions')
                )}
                
                {renderSettingItem(
                  'shield-checkmark',
                  'Require Approval',
                  'Approve comments before they appear',
                  channelInfo.settings.requireApproval,
                  () => handleSettingToggle('requireApproval')
                )}
                
                {renderSettingItem(
                  'trash',
                  'Auto-Delete Posts',
                  'Automatically delete posts after a period',
                  channelInfo.settings.autoDelete,
                  () => handleSettingToggle('autoDelete')
                )}
              </>
            )}
          </View>
        )}

        {/* Subscribers Section */}
        <View style={styles.subscribersSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Subscribers ({subscribers.length})
            </Text>
          </View>
          
          <FlatList
            data={subscribers}
            renderItem={renderSubscriber}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.subscribersList}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Danger Zone
          </Text>
          
          {renderActionButton(
            'log-out',
            'Leave Channel',
            'Leave this channel',
            () => setShowLeaveModal(true),
            true
          )}
          
          {channelInfo.isOwner && renderActionButton(
            'trash',
            'Delete Channel',
            'Permanently delete this channel',
            () => setShowDeleteModal(true),
            true
          )}
        </View>
      </ScrollView>

      {/* Leave Channel Modal */}
      <Modal
        visible={showLeaveModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Leave Channel
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to leave "{channelInfo.name}"? You won't be able to see posts from this channel anymore.
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
                onPress={handleLeaveChannel}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Leave
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Channel Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Delete Channel
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to delete "{channelInfo.name}"? This action cannot be undone and all subscribers will be removed.
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
                onPress={handleDeleteChannel}
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
  channelHeader: {
    flexDirection: 'row',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  channelAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  channelInfo: {
    flex: 1,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  channelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  channelUsername: {
    fontSize: 14,
    fontWeight: '500',
  },
  channelDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  channelMeta: {
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
  settingsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  subscribersSection: {
    marginBottom: 24,
  },
  subscribersList: {
    paddingHorizontal: 16,
  },
  subscriberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  subscriberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  subscriberAvatarText: {
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
  subscriberDetails: {
    flex: 1,
  },
  subscriberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  subscriberName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  ownerBadge: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,136,204,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  adminBadge: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,136,204,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  subscriberUsername: {
    fontSize: 14,
  },
  subscriberJoined: {
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

export default ChannelInfoScreen; 