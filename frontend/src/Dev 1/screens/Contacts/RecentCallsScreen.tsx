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

type RecentCallsNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'RecentCalls'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface RecentCallsScreenProps {
  navigation: RecentCallsNavigationProp;
}

interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  phoneNumber: string;
  callType: 'audio' | 'video';
  callDirection: 'incoming' | 'outgoing' | 'missed';
  callStatus: 'completed' | 'missed' | 'declined' | 'busy';
  duration: number; // in seconds
  startTime: Date;
  endTime?: Date;
  isFavorite: boolean;
  notes?: string;
}

const mockCallRecords: CallRecord[] = [
  {
    id: '1',
    contactId: '1',
    contactName: 'John Doe',
    phoneNumber: '+1234567890',
    callType: 'audio',
    callDirection: 'outgoing',
    callStatus: 'completed',
    duration: 325, // 5 minutes 25 seconds
    startTime: new Date(Date.now() - 3600000), // 1 hour ago
    endTime: new Date(Date.now() - 3600000 + 325000),
    isFavorite: true,
  },
  {
    id: '2',
    contactId: '2',
    contactName: 'Jane Smith',
    phoneNumber: '+1234567891',
    callType: 'video',
    callDirection: 'incoming',
    callStatus: 'completed',
    duration: 1247, // 20 minutes 47 seconds
    startTime: new Date(Date.now() - 7200000), // 2 hours ago
    endTime: new Date(Date.now() - 7200000 + 1247000),
    isFavorite: false,
  },
  {
    id: '3',
    contactId: '3',
    contactName: 'Mike Johnson',
    phoneNumber: '+1234567892',
    callType: 'audio',
    callDirection: 'missed',
    callStatus: 'missed',
    duration: 0,
    startTime: new Date(Date.now() - 10800000), // 3 hours ago
    isFavorite: false,
  },
  {
    id: '4',
    contactId: '4',
    contactName: 'Sarah Wilson',
    phoneNumber: '+1234567893',
    callType: 'video',
    callDirection: 'incoming',
    callStatus: 'declined',
    duration: 0,
    startTime: new Date(Date.now() - 14400000), // 4 hours ago
    isFavorite: true,
  },
  {
    id: '5',
    contactId: '5',
    contactName: 'Alex Brown',
    phoneNumber: '+1234567894',
    callType: 'audio',
    callDirection: 'outgoing',
    callStatus: 'busy',
    duration: 0,
    startTime: new Date(Date.now() - 18000000), // 5 hours ago
    isFavorite: false,
  },
  {
    id: '6',
    contactId: '6',
    contactName: 'Emily Davis',
    phoneNumber: '+1234567895',
    callType: 'video',
    callDirection: 'outgoing',
    callStatus: 'completed',
    duration: 892, // 14 minutes 52 seconds
    startTime: new Date(Date.now() - 86400000), // 1 day ago
    endTime: new Date(Date.now() - 86400000 + 892000),
    isFavorite: false,
  },
  {
    id: '7',
    contactId: '7',
    contactName: 'David Miller',
    phoneNumber: '+1234567896',
    callType: 'audio',
    callDirection: 'incoming',
    callStatus: 'completed',
    duration: 156, // 2 minutes 36 seconds
    startTime: new Date(Date.now() - 172800000), // 2 days ago
    endTime: new Date(Date.now() - 172800000 + 156000),
    isFavorite: true,
  },
  {
    id: '8',
    contactId: '8',
    contactName: 'Lisa Garcia',
    phoneNumber: '+1234567897',
    callType: 'video',
    callDirection: 'missed',
    callStatus: 'missed',
    duration: 0,
    startTime: new Date(Date.now() - 259200000), // 3 days ago
    isFavorite: false,
  },
];

const RecentCallsScreen: React.FC<RecentCallsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [callRecords, setCallRecords] = useState<CallRecord[]>(mockCallRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'audio' | 'video'>('all');
  const [filterDirection, setFilterDirection] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');

  const filteredCalls = callRecords.filter(call => {
    const matchesSearch = call.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.phoneNumber.includes(searchQuery);
    const matchesType = filterType === 'all' || call.callType === filterType;
    const matchesDirection = filterDirection === 'all' || call.callDirection === filterDirection;
    
    return matchesSearch && matchesType && matchesDirection;
  });

  const handleCallPress = (call: CallRecord) => {
    navigation.navigate('CallInfo', { callId: call.id });
  };

  const handleStartCall = (call: CallRecord, type: 'audio' | 'video') => {
    navigation.navigate('CallScreen', {
      callId: Date.now().toString(),
      callerName: call.contactName,
      callType: type,
      isIncoming: false,
    });
  };

  const handleToggleFavorite = (call: CallRecord) => {
    setCallRecords(prev => prev.map(c => 
      c.id === call.id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const handleDeleteCall = (call: CallRecord) => {
    Alert.alert(
      'Delete Call Record',
      `Are you sure you want to delete this call record?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCallRecords(prev => prev.filter(c => c.id !== call.id));
            Alert.alert('Success', 'Call record deleted');
          }
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (callRecords.length === 0) {
      Alert.alert('No Calls', 'There are no call records to clear');
      return;
    }

    Alert.alert(
      'Clear All Calls',
      `Are you sure you want to delete all ${callRecords.length} call records?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setCallRecords([]);
            Alert.alert('Success', 'All call records have been deleted');
          }
        },
      ]
    );
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
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

  const getCallIcon = (call: CallRecord): string => {
    if (call.callDirection === 'missed') {
      return call.callType === 'video' ? 'videocam-off' : 'call-outline';
    }
    return call.callType === 'video' ? 'videocam' : 'call';
  };

  const getCallColor = (call: CallRecord): string => {
    if (call.callDirection === 'missed' || call.callStatus === 'declined') {
      return '#f44336';
    } else if (call.callStatus === 'busy') {
      return '#ff9800';
    } else if (call.callDirection === 'incoming') {
      return '#4CAF50';
    } else {
      return theme.primary;
    }
  };

  const renderCallRecord = ({ item }: { item: CallRecord }) => (
    <TouchableOpacity
      style={[styles.callItem, { backgroundColor: theme.card }]}
      onPress={() => handleCallPress(item)}
    >
      <View style={styles.callInfo}>
        <View style={[styles.callIcon, { backgroundColor: getCallColor(item) + '20' }]}>
          <Icon name={getCallIcon(item)} size={20} color={getCallColor(item)} />
        </View>
        
        <View style={styles.callDetails}>
          <View style={styles.callHeader}>
            <Text style={[styles.contactName, { color: theme.text }]}>
              {item.contactName}
            </Text>
            {item.isFavorite && (
              <Icon name="heart" size={16} color="#f44336" />
            )}
          </View>
          
          <Text style={[styles.phoneNumber, { color: theme.subtext }]}>
            {item.phoneNumber}
          </Text>
          
          <View style={styles.callMeta}>
            <Text style={[styles.callTime, { color: theme.subtext }]}>
              {formatTime(item.startTime)}
            </Text>
            {item.duration > 0 && (
              <Text style={[styles.callDuration, { color: theme.subtext }]}>
                • {formatDuration(item.duration)}
              </Text>
            )}
            <Text style={[styles.callType, { color: theme.subtext }]}>
              • {item.callType === 'video' ? 'Video' : 'Audio'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.callActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
          onPress={() => handleStartCall(item, 'audio')}
        >
          <Icon name="call" size={16} color={theme.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2196F3' + '20' }]}
          onPress={() => handleStartCall(item, 'video')}
        >
          <Icon name="videocam" size={16} color="#2196F3" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: (item.isFavorite ? '#f44336' : theme.subtext) + '20' }]}
          onPress={() => handleToggleFavorite(item)}
        >
          <Icon 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={16} 
            color={item.isFavorite ? "#f44336" : theme.subtext} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' + '20' }]}
          onPress={() => handleDeleteCall(item)}
        >
          <Icon name="trash" size={16} color="#f44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (
    title: string,
    isActive: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: isActive ? theme.primary : theme.card,
          borderColor: theme.border
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterButtonText,
        { color: isActive ? '#fff' : theme.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="call-outline" size={64} color={theme.subtext} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Recent Calls
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
        Your call history will appear here once you make or receive calls.
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
          Recent Calls
        </Text>
        
        <TouchableOpacity onPress={handleClearAll}>
          <Icon name="trash" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search calls..."
          placeholderTextColor={theme.subtext}
        />
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <Text style={[styles.filterLabel, { color: theme.text }]}>Type:</Text>
        {renderFilterButton('All', filterType === 'all', () => setFilterType('all'))}
        {renderFilterButton('Audio', filterType === 'audio', () => setFilterType('audio'))}
        {renderFilterButton('Video', filterType === 'video', () => setFilterType('video'))}
        
        <Text style={[styles.filterLabel, { color: theme.text }]}>Direction:</Text>
        {renderFilterButton('All', filterDirection === 'all', () => setFilterDirection('all'))}
        {renderFilterButton('Incoming', filterDirection === 'incoming', () => setFilterDirection('incoming'))}
        {renderFilterButton('Outgoing', filterDirection === 'outgoing', () => setFilterDirection('outgoing'))}
        {renderFilterButton('Missed', filterDirection === 'missed', () => setFilterDirection('missed'))}
      </ScrollView>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {callRecords.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Total Calls
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {callRecords.filter(c => c.callType === 'video').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Video Calls
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {callRecords.filter(c => c.callDirection === 'missed').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Missed Calls
          </Text>
        </View>
      </View>

      {/* Calls List */}
      {callRecords.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredCalls}
          renderItem={renderCallRecord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.callsList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    marginLeft: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  callsList: {
    paddingHorizontal: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  callDetails: {
    flex: 1,
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  phoneNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callTime: {
    fontSize: 12,
  },
  callDuration: {
    fontSize: 12,
    marginLeft: 4,
  },
  callType: {
    fontSize: 12,
    marginLeft: 4,
  },
  callActions: {
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
});

export default RecentCallsScreen; 