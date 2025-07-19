import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
  Animated,
  PanGestureHandler,
  State,
  FlatList,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type VoiceMessageNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'VoiceMessage'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface VoiceMessageScreenProps {
  navigation: VoiceMessageNavigationProp;
  route: {
    params: {
      chatId: string;
      chatName: string;
    };
  };
}

interface VoiceMessage {
  id: string;
  duration: number; // in seconds
  timestamp: Date;
  senderName: string;
  isMine: boolean;
  isPlaying: boolean;
  progress: number; // 0-1
}

const { width: screenWidth } = Dimensions.get('window');

const VoiceMessageScreen: React.FC<VoiceMessageScreenProps> = ({ navigation, route }) => {
  const { chatId, chatName } = route.params;
  const { theme } = useTheme();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingAmplitude, setRecordingAmplitude] = useState(0);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const amplitudeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Voice Messages',
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowRecordingModal(true)}
        >
          <Icon name="mic" size={24} color={theme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    if (isRecording) {
      startRecordingAnimation();
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      stopRecordingAnimation();
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    }

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [isRecording]);

  const startRecordingAnimation = () => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(amplitudeAnimation, {
          toValue: Math.random() * 0.8 + 0.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(amplitudeAnimation, {
          toValue: 0.1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (isRecording) {
          animate();
        }
      });
    };
    animate();
  };

  const stopRecordingAnimation = () => {
    amplitudeAnimation.setValue(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setRecordingAmplitude(0);
    
    // Simulate amplitude changes
    const amplitudeInterval = setInterval(() => {
      setRecordingAmplitude(Math.random() * 100);
    }, 100);

    // Store interval for cleanup
    (recordingTimer as any).amplitudeInterval = amplitudeInterval;
  };

  const stopRecording = () => {
    setIsRecording(false);
    setShowRecordingModal(false);
    
    if ((recordingTimer as any).amplitudeInterval) {
      clearInterval((recordingTimer as any).amplitudeInterval);
    }

    if (recordingDuration > 1) {
      // Save the voice message
      const newMessage: VoiceMessage = {
        id: Date.now().toString(),
        duration: recordingDuration,
        timestamp: new Date(),
        senderName: 'Me',
        isMine: true,
        isPlaying: false,
        progress: 0,
      };
      
      setVoiceMessages(prev => [newMessage, ...prev]);
      Alert.alert('Success', 'Voice message recorded!');
    } else {
      Alert.alert('Too Short', 'Recording must be at least 1 second long');
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setShowRecordingModal(false);
    setRecordingDuration(0);
    
    if ((recordingTimer as any).amplitudeInterval) {
      clearInterval((recordingTimer as any).amplitudeInterval);
    }
  };

  const playVoiceMessage = (messageId: string) => {
    // Stop currently playing message
    if (currentlyPlaying && currentlyPlaying !== messageId) {
      setVoiceMessages(prev => prev.map(msg => 
        msg.id === currentlyPlaying 
          ? { ...msg, isPlaying: false, progress: 0 }
          : msg
      ));
    }

    const message = voiceMessages.find(msg => msg.id === messageId);
    if (!message) return;

    setCurrentlyPlaying(messageId);
    
    // Simulate playback
    setVoiceMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isPlaying: true, progress: 0 }
        : msg
    ));

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 0.01;
      
      if (currentProgress >= 1) {
        clearInterval(progressInterval);
        setCurrentlyPlaying(null);
        setVoiceMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isPlaying: false, progress: 0 }
            : msg
        ));
      } else {
        setVoiceMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, progress: currentProgress }
            : msg
        ));
      }
    }, (message.duration * 1000) / 100); // Divide duration by 100 for smooth progress
  };

  const pauseVoiceMessage = (messageId: string) => {
    setCurrentlyPlaying(null);
    setVoiceMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isPlaying: false }
        : msg
    ));
  };

  const deleteVoiceMessage = (messageId: string) => {
    Alert.alert(
      'Delete Voice Message',
      'Are you sure you want to delete this voice message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setVoiceMessages(prev => prev.filter(msg => msg.id !== messageId));
            if (currentlyPlaying === messageId) {
              setCurrentlyPlaying(null);
            }
          }
        },
      ]
    );
  };

  const renderRecordingModal = () => (
    <Modal
      visible={showRecordingModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={cancelRecording}>
            <Text style={[styles.cancelButton, { color: theme.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {isRecording ? 'Recording...' : 'Record Voice Message'}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.recordingContainer}>
          {isRecording ? (
            <>
              <View style={styles.amplitudeContainer}>
                <Animated.View 
                  style={[
                    styles.amplitudeBar,
                    { 
                      backgroundColor: theme.primary,
                      height: amplitudeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 200],
                      }),
                    }
                  ]} 
                />
              </View>
              
              <Text style={[styles.recordingDuration, { color: theme.text }]}>
                {formatDuration(recordingDuration)}
              </Text>
              
              <Text style={[styles.recordingTip, { color: theme.subtext }]}>
                Slide up to cancel
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.recordButton, { backgroundColor: theme.primary }]}>
                <Icon name="mic" size={40} color="#fff" />
              </View>
              
              <Text style={[styles.recordTip, { color: theme.subtext }]}>
                Tap to start recording
              </Text>
            </>
          )}
        </View>

        <View style={styles.modalFooter}>
          {isRecording ? (
            <TouchableOpacity
              style={[styles.stopButton, { backgroundColor: '#ff4444' }]}
              onPress={stopRecording}
            >
              <Icon name="stop" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: theme.primary }]}
              onPress={startRecording}
            >
              <Icon name="mic" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderVoiceMessage = (message: VoiceMessage) => (
    <View style={[
      styles.messageContainer,
      { backgroundColor: theme.card },
      message.isMine && styles.myMessage
    ]}>
      <View style={styles.messageHeader}>
        <Text style={[styles.senderName, { color: theme.text }]}>
          {message.senderName}
        </Text>
        <Text style={[styles.messageTime, { color: theme.subtext }]}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>

      <View style={styles.voicePlayer}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: theme.primary }]}
          onPress={() => message.isPlaying 
            ? pauseVoiceMessage(message.id)
            : playVoiceMessage(message.id)
          }
        >
          <Icon 
            name={message.isPlaying ? 'pause' : 'play'} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: theme.primary,
                  width: `${message.progress * 100}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.duration, { color: theme.subtext }]}>
            {formatDuration(message.duration)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteVoiceMessage(message.id)}
        >
          <Icon name="trash" size={16} color={theme.subtext} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {voiceMessages.length > 0 ? (
        <FlatList
          data={voiceMessages}
          renderItem={({ item }) => renderVoiceMessage(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="mic" size={64} color={theme.subtext} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Voice Messages
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
            Record your first voice message by tapping the mic button
          </Text>
        </View>
      )}

      {renderRecordingModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
  },
  voicePlayer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  duration: {
    fontSize: 12,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  amplitudeContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  amplitudeBar: {
    width: 8,
    borderRadius: 4,
  },
  recordingDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recordingTip: {
    fontSize: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordTip: {
    fontSize: 16,
  },
  modalFooter: {
    padding: 20,
    alignItems: 'center',
  },
  startButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoiceMessageScreen; 