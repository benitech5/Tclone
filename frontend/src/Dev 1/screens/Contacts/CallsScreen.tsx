import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';

const CallsScreen = () => {
  const { theme } = useTheme();

  const mockCalls = [
    { id: '1', name: 'Alice Johnson', time: '2 minutes ago', type: 'incoming', duration: '5:23' },
    { id: '2', name: 'Bob Smith', time: '1 hour ago', type: 'outgoing', duration: '12:45' },
    { id: '3', name: 'Carol Davis', time: 'Yesterday', type: 'missed', duration: '0:00' },
  ];

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <Ionicons name="call" size={20} color="#4CAF50" />;
      case 'outgoing':
        return <Ionicons name="call" size={20} color="#2196F3" />;
      case 'missed':
        return <Ionicons name="call" size={20} color="#F44336" />;
      default:
        return <Ionicons name="call" size={20} color={theme.subtext} />;
    }
  };

  const getCallTypeText = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'Incoming';
      case 'outgoing':
        return 'Outgoing';
      case 'missed':
        return 'Missed';
      default:
        return 'Call';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Recent Calls</Text>
      
      {mockCalls.map((call) => (
        <TouchableOpacity 
          key={call.id} 
          style={[styles.callItem, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: theme.accent }]}>
              {call.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.callInfo}>
            <Text style={[styles.callName, { color: theme.text }]}>{call.name}</Text>
            <View style={styles.callDetails}>
              {getCallIcon(call.type)}
              <Text style={[styles.callType, { color: theme.subtext }]}>
                {getCallTypeText(call.type)} • {call.duration}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.callTime, { color: theme.subtext }]}>{call.time}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 4,
    borderRadius: 25,
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callType: {
    fontSize: 15,
    marginLeft: 8,
  },
  callTime: {
    fontSize: 12,
  },
});

export default CallsScreen;