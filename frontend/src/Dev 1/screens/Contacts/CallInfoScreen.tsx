import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Share,
  Modal,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type CallInfoNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'CallInfo'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface CallInfoScreenProps {
  navigation: CallInfoNavigationProp;
  route: {
    params: {
      callId: string;
    };
  };
}

interface CallInfo {
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
  callQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  networkType?: 'wifi' | 'cellular' | 'unknown';
  signalStrength?: number; // 0-5
  recordingUrl?: string;
  isRecorded: boolean;
}

const mockCallInfo: CallInfo = {
  id: '1',
  contactId: '1',
  contactName: 'John Doe',
  phoneNumber: '+1234567890',
  callType: 'video',
  callDirection: 'outgoing',
  callStatus: 'completed',
  duration: 1247, // 20 minutes 47 seconds
  startTime: new Date(Date.now() - 7200000), // 2 hours ago
  endTime: new Date(Date.now() - 7200000 + 1247000),
  isFavorite: true,
  notes: 'Discussed project timeline and next steps. Need to follow up on the design review.',
  callQuality: 'excellent',
  networkType: 'wifi',
  signalStrength: 5,
  isRecorded: true,
};

const CallInfoScreen: React.FC<CallInfoScreenProps> = ({ navigation, route }) => {
  const { callId } = route.params;
  const { theme } = useTheme();
  
  const [callInfo, setCallInfo] = useState<CallInfo>(mockCallInfo);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStartCall = (type: 'audio' | 'video') => {
    navigation.navigate('CallScreen', {
      callId: Date.now().toString(),
      callerName: callInfo.contactName,
      callType: type,
      isIncoming: false,
    });
  };

  const handleContactPress = () => {
    navigation.navigate('ContactProfile', { contactId: callInfo.contactId });
  };

  const handleShareCall = async () => {
    try {
      const callDetails = `Call with ${callInfo.contactName}\n` +
        `Type: ${callInfo.callType === 'video' ? 'Video' : 'Audio'}\n` +
        `Duration: ${formatDuration(callInfo.duration)}\n` +
        `Date: ${callInfo.startTime.toLocaleDateString()}\n` +
        `Time: ${callInfo.startTime.toLocaleTimeString()}`;

      await Share.share({
        message: callDetails,
        title: `Call with ${callInfo.contactName}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share call details');
    }
  };

  const handleToggleFavorite = () => {
    setCallInfo(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    Alert.alert(
      'Success',
      `Call has been ${callInfo.isFavorite ? 'removed from' : 'added to'} favorites`
    );
  };

  const handleDeleteCall = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Call Deleted',
      'Call record has been deleted',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handlePlayRecording = () => {
    if (!callInfo.isRecorded) {
      Alert.alert('No Recording', 'This call was not recorded');
      return;
    }
    // TODO: Implement audio playback
    Alert.alert('Play Recording', 'Audio playback would start here');
  };

  const handleEditNotes = () => {
    // TODO: Navigate to edit notes screen
    Alert.alert('Edit Notes', 'Notes editing functionality would open here');
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0 seconds';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs} seconds`;
    }
  };

  const getCallIcon = (): string => {
    if (callInfo.callDirection === 'missed') {
      return callInfo.callType === 'video' ? 'videocam-off' : 'call-outline';
    }
    return callInfo.callType === 'video' ? 'videocam' : 'call';
  };

  const getCallColor = (): string => {
    if (callInfo.callDirection === 'missed' || callInfo.callStatus === 'declined') {
      return '#f44336';
    } else if (callInfo.callStatus === 'busy') {
      return '#ff9800';
    } else if (callInfo.callDirection === 'incoming') {
      return '#4CAF50';
    } else {
      return theme.primary;
    }
  };

  const getCallStatusText = (): string => {
    switch (callInfo.callStatus) {
      case 'completed': return 'Completed';
      case 'missed': return 'Missed';
      case 'declined': return 'Declined';
      case 'busy': return 'Busy';
      default: return 'Unknown';
    }
  };

  const getCallDirectionText = (): string => {
    switch (callInfo.callDirection) {
      case 'incoming': return 'Incoming';
      case 'outgoing': return 'Outgoing';
      case 'missed': return 'Missed';
      default: return 'Unknown';
    }
  };

  const renderInfoItem = (label: string, value: string, icon?: string) => (
    <View style={[styles.infoItem, { backgroundColor: theme.card }]}>
      {icon && (
        <Icon name={icon} size={20} color={theme.subtext} style={styles.infoIcon} />
      )}
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: theme.subtext }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {value}
        </Text>
      </View>
    </View>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Call Header */}
        <View style={[styles.callHeader, { backgroundColor: theme.card }]}>
          <View style={styles.callIconContainer}>
            <View style={[styles.callIcon, { backgroundColor: getCallColor() + '20' }]}>
              <Icon name={getCallIcon()} size={40} color={getCallColor()} />
            </View>
          </View>
          
          <View style={styles.callInfo}>
            <Text style={[styles.contactName, { color: theme.text }]}>
              {callInfo.contactName}
            </Text>
            <Text style={[styles.phoneNumber, { color: theme.subtext }]}>
              {callInfo.phoneNumber}
            </Text>
            <Text style={[styles.callStatus, { color: getCallColor() }]}>
              {getCallStatusText()} • {getCallDirectionText()} • {callInfo.callType === 'video' ? 'Video' : 'Audio'}
            </Text>
          </View>
          
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Icon 
              name={callInfo.isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={callInfo.isFavorite ? "#f44336" : theme.subtext} 
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={() => handleStartCall('audio')}
          >
            <Icon name="call" size={24} color={theme.primary} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Call
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={() => handleStartCall('video')}
          >
            <Icon name="videocam" size={24} color="#2196F3" />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Video
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={handleContactPress}
          >
            <Icon name="person" size={24} color="#4CAF50" />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={handleShareCall}
          >
            <Icon name="share" size={24} color="#FF9800" />
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        {/* Call Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Call Details
          </Text>
          
          {renderInfoItem('Duration', formatDuration(callInfo.duration), 'time')}
          {renderInfoItem('Start Time', callInfo.startTime.toLocaleString(), 'calendar')}
          {callInfo.endTime && renderInfoItem('End Time', callInfo.endTime.toLocaleString(), 'time')}
          {renderInfoItem('Call Type', callInfo.callType === 'video' ? 'Video Call' : 'Audio Call', 'call')}
          {renderInfoItem('Direction', getCallDirectionText(), 'arrow-forward')}
          {renderInfoItem('Status', getCallStatusText(), 'checkmark-circle')}
        </View>

        {/* Call Quality */}
        {callInfo.callQuality && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Call Quality
            </Text>
            
            {renderInfoItem('Quality', callInfo.callQuality.charAt(0).toUpperCase() + callInfo.callQuality.slice(1), 'cellular')}
            {callInfo.networkType && renderInfoItem('Network', callInfo.networkType.toUpperCase(), 'wifi')}
            {callInfo.signalStrength && renderInfoItem('Signal', `${callInfo.signalStrength}/5`, 'radio')}
          </View>
        )}

        {/* Notes */}
        {callInfo.notes && (
          <View style={styles.section}>
            <View style={styles.notesHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Notes
              </Text>
              <TouchableOpacity onPress={handleEditNotes}>
                <Icon name="pencil" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.notesContainer, { backgroundColor: theme.card }]}>
              <Text style={[styles.notesText, { color: theme.text }]}>
                {callInfo.notes}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions
          </Text>
          
          {callInfo.isRecorded && renderActionButton(
            'play',
            'Play Recording',
            'Listen to call recording',
            handlePlayRecording,
            '#4CAF50'
          )}
          
          {renderActionButton(
            'chatbubble',
            'Send Message',
            'Send a message to this contact',
            () => navigation.navigate('ChatRoom', { chatId: callInfo.contactId, chatName: callInfo.contactName }),
            '#2196F3'
          )}
          
          {renderActionButton(
            'share',
            'Share Call Details',
            'Share call information',
            handleShareCall,
            '#FF9800'
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Danger Zone
          </Text>
          
          {renderActionButton(
            'trash',
            'Delete Call Record',
            'Permanently delete this call record',
            () => setShowDeleteModal(true),
            '#f44336'
          )}
        </View>
      </ScrollView>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Delete Call Record
            </Text>
            <Text style={[styles.modalMessage, { color: theme.subtext }]}>
              Are you sure you want to delete this call record? This action cannot be undone.
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
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={handleDeleteCall}
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
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  callIconContainer: {
    marginRight: 16,
  },
  callIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  notesContainer: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
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

export default CallInfoScreen; 