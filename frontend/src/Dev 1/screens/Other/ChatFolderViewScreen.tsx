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
  Modal,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type ChatFolderViewNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'ChatFolderView'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ChatFolderViewScreenProps {
  navigation: ChatFolderViewNavigationProp;
  route: {
    params: {
      folderId: string;
      folderName?: string;
    };
  };
}

interface ChatInFolder {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  type: 'individual' | 'group' | 'channel';
  isOnline?: boolean;
  lastSeen?: Date;
}

interface FolderInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  chatCount: number;
  isDefault: boolean;
  isCustom: boolean;
  createdAt: Date;
  includeMuted: boolean;
  includeArchived: boolean;
}

const mockFolderInfo: FolderInfo = {
  id: '1',
  name: 'Work',
  description: 'All work-related conversations and project discussions',
  icon: 'briefcase',
  color: '#2196F3',
  chatCount: 8,
  isDefault: false,
  isCustom: true,
  createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
  includeMuted: false,
  includeArchived: false,
};

const mockChatsInFolder: ChatInFolder[] = [
  {
    id: '1',
    name: 'Project Alpha Team',
    lastMessage: 'Meeting scheduled for tomorrow at 10 AM',
    lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
    unreadCount: 3,
    isPinned: true,
    isMuted: false,
    type: 'group',
  },
  {
    id: '2',
    name: 'John Manager',
    lastMessage: 'Please review the latest design mockups',
    lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    type: 'individual',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Design Team',
    lastMessage: 'New assets uploaded to the shared drive',
    lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    type: 'group',
  },
  {
    id: '4',
    name: 'Sarah Developer',
    lastMessage: 'Code review completed, ready for merge',
    lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    type: 'individual',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000),
  },
  {
    id: '5',
    name: 'Product Updates',
    lastMessage: 'New feature release notes available',
    lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
    unreadCount: 5,
    isPinned: false,
    isMuted: false,
    type: 'channel',
  },
  {
    id: '6',
    name: 'Mike QA',
    lastMessage: 'Bug report submitted for review',
    lastMessageTime: new Date(Date.now() - 172800000), // 2 days ago
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    type: 'individual',
    isOnline: true,
  },
  {
    id: '7',
    name: 'Marketing Team',
    lastMessage: 'Campaign performance metrics updated',
    lastMessageTime: new Date(Date.now() - 259200000), // 3 days ago
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    type: 'group',
  },
  {
    id: '8',
    name: 'Client Support',
    lastMessage: 'Ticket #1234 has been resolved',
    lastMessageTime: new Date(Date.now() - 345600000), // 4 days ago
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    type: 'channel',
  },
];

const ChatFolderViewScreen: React.FC<ChatFolderViewScreenProps> = ({ navigation, route }) => {
  const { folderId, folderName } = route.params;
  const { theme } = useTheme();
  
  const [folderInfo, setFolderInfo] = useState<FolderInfo>(mockFolderInfo);
  const [chats, setChats] = useState<ChatInFolder[]>(mockChatsInFolder);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFolderOptions, setShowFolderOptions] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: ChatInFolder) => {
    if (chat.type === 'group') {
      navigation.navigate('GroupChat', {
        groupId: chat.id,
        groupName: chat.name,
      });
    } else if (chat.type === 'channel') {
      // TODO: Navigate to channel chat
      navigation.navigate('ChatRoom', {
        chatId: chat.id,
        chatName: chat.name,
      });
    } else {
      navigation.navigate('ChatRoom', {
        chatId: chat.id,
        chatName: chat.name,
      });
    }
  };

  const handleTogglePin = (chat: ChatInFolder) => {
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, isPinned: !c.isPinned } : c
    ));
  };

  const handleToggleMute = (chat: ChatInFolder) => {
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, isMuted: !c.isMuted } : c
    ));
  };

  const handleRemoveFromFolder = (chat: ChatInFolder) => {
    Alert.alert(
      'Remove from Folder',
      `Remove "${chat.name}" from "${folderInfo.name}" folder?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setChats(prev => prev.filter(c => c.id !== chat.id));
            setFolderInfo(prev => ({ ...prev, chatCount: prev.chatCount - 1 }));
            Alert.alert('Success', `${chat.name} has been removed from the folder`);
          }
        },
      ]
    );
  };

  const handleEditFolder = () => {
    // TODO: Navigate to edit folder screen
    Alert.alert('Edit Folder', 'Edit folder functionality would open here');
  };

  const handleDeleteFolder = () => {
    Alert.alert(
      'Delete Folder',
      `Are you sure you want to delete "${folderInfo.name}" folder? This will not delete the chats, only the folder organization.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            Alert.alert('Success', 'Folder has been deleted');
          }
        },
      ]
    );
  };

  const handleAddChatsToFolder = () => {
    // TODO: Navigate to chat selection screen
    Alert.alert('Add Chats', 'Chat selection functionality would open here');
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderChatItem = ({ item }: { item: ChatInFolder }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: theme.card }]}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.chatInfo}>
        <View style={[styles.chatAvatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.chatAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
          {item.isOnline && (
            <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
          )}
        </View>
        
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.chatTime, { color: theme.subtext }]}>
              {formatTime(item.lastMessageTime)}
            </Text>
          </View>
          
          <View style={styles.chatMeta}>
            <Text style={[styles.lastMessage, { color: theme.subtext }]} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.chatActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
          onPress={() => handleTogglePin(item)}
        >
          <Icon 
            name={item.isPinned ? "pin" : "pin-outline"} 
            size={16} 
            color={theme.primary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: (item.isMuted ? '#f44336' : theme.subtext) + '20' }]}
          onPress={() => handleToggleMute(item)}
        >
          <Icon 
            name={item.isMuted ? "notifications-off" : "notifications"} 
            size={16} 
            color={item.isMuted ? '#f44336' : theme.subtext} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' + '20' }]}
          onPress={() => handleRemoveFromFolder(item)}
        >
          <Icon name="remove-circle" size={16} color="#f44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderActionButton = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    color?: string
  ) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: (color || theme.primary) + '20' }]}>
        <Icon name={icon} size={24} color={color || theme.primary} />
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={[styles.folderIcon, { backgroundColor: folderInfo.color + '20' }]}>
            <Icon name={folderInfo.icon} size={20} color={folderInfo.color} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {folderInfo.name}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => setShowFolderOptions(true)}>
          <Icon name="ellipsis-vertical" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Folder Info */}
      <View style={[styles.folderInfo, { backgroundColor: theme.card }]}>
        <Text style={[styles.folderDescription, { color: theme.subtext }]}>
          {folderInfo.description}
        </Text>
        <Text style={[styles.folderMeta, { color: theme.subtext }]}>
          {folderInfo.chatCount} chats • Created {folderInfo.createdAt.toLocaleDateString()}
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search in folder..."
          placeholderTextColor={theme.subtext}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: theme.card }]}
          onPress={handleAddChatsToFolder}
        >
          <Icon name="add" size={20} color={theme.primary} />
          <Text style={[styles.quickActionText, { color: theme.text }]}>
            Add Chats
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: theme.card }]}
          onPress={handleEditFolder}
        >
          <Icon name="pencil" size={20} color="#4CAF50" />
          <Text style={[styles.quickActionText, { color: theme.text }]}>
            Edit Folder
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chats List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Folder Options Modal */}
      <Modal
        visible={showFolderOptions}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Folder Options
              </Text>
              <TouchableOpacity onPress={() => setShowFolderOptions(false)}>
                <Icon name="close" size={24} color={theme.subtext} />
              </TouchableOpacity>
            </View>
            
            {renderActionButton(
              'pencil',
              'Edit Folder',
              'Change folder name and settings',
              () => {
                setShowFolderOptions(false);
                handleEditFolder();
              },
              '#4CAF50'
            )}
            
            {renderActionButton(
              'add',
              'Add Chats',
              'Add more chats to this folder',
              () => {
                setShowFolderOptions(false);
                handleAddChatsToFolder();
              },
              '#2196F3'
            )}
            
            {renderActionButton(
              'share',
              'Share Folder',
              'Share folder with other users',
              () => {
                setShowFolderOptions(false);
                Alert.alert('Share Folder', 'Share functionality would open here');
              },
              '#FF9800'
            )}
            
            {folderInfo.isCustom && renderActionButton(
              'trash',
              'Delete Folder',
              'Delete this folder (chats will not be deleted)',
              () => {
                setShowFolderOptions(false);
                handleDeleteFolder();
              },
              '#f44336'
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  folderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  folderInfo: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  folderDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  folderMeta: {
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chatsList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  chatAvatarText: {
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
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
  },
  chatTime: {
    fontSize: 12,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatActions: {
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
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ChatFolderViewScreen; 