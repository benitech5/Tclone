import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CallScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'CallScreen'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface CallScreenProps {
  navigation: CallScreenNavigationProp;
  route: {
    params: {
      callId: string;
      callerName: string;
      callType: 'audio' | 'video';
      isIncoming: boolean;
    };
  };
}

const { width, height } = Dimensions.get('window');

const CallScreen: React.FC<CallScreenProps> = ({ navigation, route }) => {
  const { callId, callerName, callType, isIncoming } = route.params;
  const { theme } = useTheme();
  
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>(
    isIncoming ? 'connecting' : 'connecting'
  );

  useEffect(() => {
    // Hide status bar for full-screen call experience
    StatusBar.setHidden(true);
    
    // Simulate call connection
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    // Call duration timer
    const durationTimer = setInterval(() => {
      if (callStatus === 'connected') {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(durationTimer);
      StatusBar.setHidden(false);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    setCallStatus('ended');
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/calls/${callId}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleAnswerCall = () => {
    setCallStatus('connected');
  };

  const handleRejectCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const toggleMute = async () => {
    setIsMuted(!isMuted);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/calls/${callId}/mute`, null, {
        params: { muted: !isMuted },
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // TODO: Implement actual speaker functionality
  };

  const toggleVideo = () => {
    if (callType === 'video') {
      setIsVideoEnabled(!isVideoEnabled);
      // TODO: Implement actual video toggle
    }
  };

  const renderCallStatus = () => {
    switch (callStatus) {
      case 'connecting':
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.text }]}>
              {isIncoming ? 'Incoming call...' : 'Calling...'}
            </Text>
            <View style={styles.connectingAnimation}>
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            </View>
          </View>
        );
      case 'connected':
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.text }]}>
              {formatDuration(callDuration)}
            </Text>
          </View>
        );
      case 'ended':
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.text }]}>
              Call ended
            </Text>
          </View>
        );
    }
  };

  const renderCallControls = () => {
    if (callStatus === 'connecting' && isIncoming) {
      return (
        <View style={styles.incomingCallControls}>
          <TouchableOpacity
            style={[styles.callButton, styles.rejectButton]}
            onPress={handleRejectCall}
          >
            <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.callButton, styles.answerButton]}
            onPress={handleAnswerCall}
          >
            <Icon name="call" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    if (callStatus === 'connected') {
      return (
        <View style={styles.callControls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={toggleMute}
          >
            <Icon 
              name={isMuted ? "mic-off" : "mic"} 
              size={24} 
              color={isMuted ? '#ff4444' : theme.text} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={toggleSpeaker}
          >
            <Icon 
              name={isSpeakerOn ? "volume-high" : "volume-low"} 
              size={24} 
              color={isSpeakerOn ? theme.primary : theme.text} 
            />
          </TouchableOpacity>

          {callType === 'video' && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.card }]}
              onPress={toggleVideo}
            >
              <Icon 
                name={isVideoEnabled ? "videocam" : "videocam-off"} 
                size={24} 
                color={isVideoEnabled ? theme.primary : '#ff4444'} 
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.callButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Caller Info */}
      <View style={styles.callerInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {callerName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.callerName, { color: theme.text }]}>
          {callerName}
        </Text>
        {renderCallStatus()}
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        {renderCallControls()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 10,
  },
  connectingAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.6,
  },
  controlsContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  incomingCallControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  endCallButton: {
    backgroundColor: '#f44336',
  },
});

export default CallScreen; 