import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type MediaGalleryNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'MediaGallery'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface MediaGalleryScreenProps {
  navigation: MediaGalleryNavigationProp;
  route: {
    params: {
      chatId: string;
      chatName: string;
    };
  };
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file' | 'audio';
  url: string;
  thumbnail?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  timestamp: Date;
  senderName: string;
}

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = (screenWidth - 48) / 3; // 3 columns with margins

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://picsum.photos/300/300?random=1',
    thumbnail: 'https://picsum.photos/100/100?random=1',
    timestamp: new Date(Date.now() - 3600000),
    senderName: 'John Doe',
  },
  {
    id: '2',
    type: 'image',
    url: 'https://picsum.photos/300/300?random=2',
    thumbnail: 'https://picsum.photos/100/100?random=2',
    timestamp: new Date(Date.now() - 7200000),
    senderName: 'Jane Smith',
  },
  {
    id: '3',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://picsum.photos/100/100?random=3',
    duration: '0:45',
    timestamp: new Date(Date.now() - 10800000),
    senderName: 'Mike Johnson',
  },
  {
    id: '4',
    type: 'file',
    fileName: 'Project_Report.pdf',
    fileSize: '2.5 MB',
    timestamp: new Date(Date.now() - 14400000),
    senderName: 'Sarah Wilson',
  },
  {
    id: '5',
    type: 'image',
    url: 'https://picsum.photos/300/300?random=4',
    thumbnail: 'https://picsum.photos/100/100?random=4',
    timestamp: new Date(Date.now() - 18000000),
    senderName: 'Alex Brown',
  },
  {
    id: '6',
    type: 'audio',
    fileName: 'Voice_Message.m4a',
    fileSize: '1.2 MB',
    duration: '2:30',
    timestamp: new Date(Date.now() - 21600000),
    senderName: 'John Doe',
  },
  {
    id: '7',
    type: 'image',
    url: 'https://picsum.photos/300/300?random=5',
    thumbnail: 'https://picsum.photos/100/100?random=5',
    timestamp: new Date(Date.now() - 25200000),
    senderName: 'Jane Smith',
  },
  {
    id: '8',
    type: 'file',
    fileName: 'Meeting_Notes.docx',
    fileSize: '856 KB',
    timestamp: new Date(Date.now() - 28800000),
    senderName: 'Mike Johnson',
  },
];

const MediaGalleryScreen: React.FC<MediaGalleryScreenProps> = ({ navigation, route }) => {
  const { chatId, chatName } = route.params;
  const { theme } = useTheme();
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'file' | 'audio'>('all');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `Media - ${chatName}`,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Icon 
              name={viewMode === 'grid' ? 'list' : 'grid'} 
              size={24} 
              color={theme.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={showFilterOptions}
          >
            <Icon name="filter" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chatName, theme, viewMode]);

  const showFilterOptions = () => {
    Alert.alert(
      'Filter Media',
      'Select media type to filter',
      [
        { text: 'All', onPress: () => setFilterType('all') },
        { text: 'Images', onPress: () => setFilterType('image') },
        { text: 'Videos', onPress: () => setFilterType('video') },
        { text: 'Files', onPress: () => setFilterType('file') },
        { text: 'Audio', onPress: () => setFilterType('audio') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredItems = mediaItems.filter(item => 
    filterType === 'all' || item.type === filterType
  );

  const handleMediaPress = (item: MediaItem) => {
    if (item.type === 'image' || item.type === 'video') {
      setSelectedItem(item);
    } else {
      // Handle file/audio download or preview
      Alert.alert(
        'File Action',
        `What would you like to do with ${item.fileName}?`,
        [
          { text: 'Download', onPress: () => downloadFile(item) },
          { text: 'Share', onPress: () => shareFile(item) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const downloadFile = (item: MediaItem) => {
    // TODO: Implement file download
    Alert.alert('Download', `Downloading ${item.fileName}...`);
  };

  const shareFile = async (item: MediaItem) => {
    try {
      await Share.share({
        message: `Check out this file: ${item.fileName}`,
        title: item.fileName,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share file');
    }
  };

  const renderGridItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleMediaPress(item)}
      onLongPress={() => showItemOptions(item)}
    >
      {item.type === 'image' && item.thumbnail && (
        <Image source={{ uri: item.thumbnail }} style={styles.gridImage} />
      )}
      
      {item.type === 'video' && item.thumbnail && (
        <View style={styles.videoContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.gridImage} />
          <View style={styles.videoOverlay}>
            <Icon name="play" size={20} color="#fff" />
          </View>
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </View>
      )}
      
      {item.type === 'file' && (
        <View style={[styles.fileContainer, { backgroundColor: theme.card }]}>
          <Icon name="document" size={32} color={theme.primary} />
          <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={2}>
            {item.fileName}
          </Text>
          <Text style={[styles.fileSize, { color: theme.subtext }]}>
            {item.fileSize}
          </Text>
        </View>
      )}
      
      {item.type === 'audio' && (
        <View style={[styles.audioContainer, { backgroundColor: theme.card }]}>
          <Icon name="musical-notes" size={32} color={theme.primary} />
          <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={2}>
            {item.fileName}
          </Text>
          <Text style={[styles.fileSize, { color: theme.subtext }]}>
            {item.duration} • {item.fileSize}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: theme.card }]}
      onPress={() => handleMediaPress(item)}
      onLongPress={() => showItemOptions(item)}
    >
      <View style={styles.listItemLeft}>
        {item.type === 'image' && item.thumbnail && (
          <Image source={{ uri: item.thumbnail }} style={styles.listThumbnail} />
        )}
        
        {item.type === 'video' && item.thumbnail && (
          <View style={styles.listVideoContainer}>
            <Image source={{ uri: item.thumbnail }} style={styles.listThumbnail} />
            <View style={styles.listVideoOverlay}>
              <Icon name="play" size={16} color="#fff" />
            </View>
          </View>
        )}
        
        {(item.type === 'file' || item.type === 'audio') && (
          <View style={[styles.listIconContainer, { backgroundColor: theme.primary }]}>
            <Icon 
              name={item.type === 'file' ? 'document' : 'musical-notes'} 
              size={24} 
              color="#fff" 
            />
          </View>
        )}
      </View>
      
      <View style={styles.listItemContent}>
        <Text style={[styles.listItemName, { color: theme.text }]}>
          {item.fileName || `${item.type.toUpperCase()} File`}
        </Text>
        <Text style={[styles.listItemMeta, { color: theme.subtext }]}>
          {item.senderName} • {item.timestamp.toLocaleDateString()}
          {item.fileSize && ` • ${item.fileSize}`}
          {item.duration && ` • ${item.duration}`}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.listItemAction}>
        <Icon name="ellipsis-vertical" size={20} color={theme.subtext} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const showItemOptions = (item: MediaItem) => {
    Alert.alert(
      'Media Options',
      'What would you like to do?',
      [
        { text: 'View', onPress: () => handleMediaPress(item) },
        { text: 'Share', onPress: () => shareFile(item) },
        { text: 'Delete', onPress: () => deleteItem(item.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const deleteItem = (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
  };

  const renderFullScreenModal = () => (
    <Modal
      visible={!!selectedItem}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      <View style={[styles.modalContainer, { backgroundColor: '#000' }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setSelectedItem(null)}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {selectedItem?.senderName}
          </Text>
          <TouchableOpacity onPress={() => shareFile(selectedItem!)}>
            <Icon name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {selectedItem?.type === 'image' && (
          <Image 
            source={{ uri: selectedItem.url }} 
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        )}
        
        {selectedItem?.type === 'video' && (
          <View style={styles.fullScreenVideo}>
            <Text style={styles.videoPlaceholder}>Video Player</Text>
            <Text style={styles.videoInfo}>
              {selectedItem.duration} • {selectedItem.senderName}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredItems}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 3 : 1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {renderFullScreenModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  listContent: {
    padding: 16,
  },
  gridItem: {
    width: itemWidth,
    height: itemWidth,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  fileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  fileName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  listItemLeft: {
    marginRight: 12,
  },
  listThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  listVideoContainer: {
    position: 'relative',
  },
  listVideoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  listItemMeta: {
    fontSize: 14,
  },
  listItemAction: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
  },
  fullScreenVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoInfo: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});

export default MediaGalleryScreen; 