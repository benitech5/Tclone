import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../ThemeContext';
import axios from 'axios';

interface JoinRequest {
  id: string;
  userName: string;
  phoneNumber: string;
  requestedAt: string;
}

const API_URL = 'http://192.168.96.216:8082/api/group/join-requests'; // Update as needed

const JoinRequestsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
    } catch (err: any) {
      setError('Failed to load join requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'deny') => {
    setProcessingId(id);
    try {
      await axios.post(`${API_URL}/${id}/${action}`);
      setRequests(prev => prev.filter(r => r.id !== id));
      Alert.alert('Success', `Request ${action}d.`);
    } catch (err) {
      Alert.alert('Error', `Failed to ${action} request.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.primary} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity onPress={fetchRequests} style={styles.retryButton}>
          <Text style={{ color: theme.primary }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.text }}>No join requests.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={[styles.requestCard, { backgroundColor: theme.card }]}> 
          <Text style={[styles.userName, { color: theme.text }]}>{item.userName}</Text>
          <Text style={[styles.phone, { color: theme.subtext }]}>{item.phoneNumber}</Text>
          <Text style={[styles.date, { color: theme.subtext }]}>Requested: {new Date(item.requestedAt).toLocaleString()}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary + 'CC' }]}
              onPress={() => handleAction(item.id, 'approve')}
              disabled={processingId === item.id}
            >
              <Text style={styles.actionText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.error || '#e74c3c' }]}
              onPress={() => handleAction(item.id, 'deny')}
              disabled={processingId === item.id}
            >
              <Text style={styles.actionText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryButton: { marginTop: 12, padding: 8 },
  requestCard: { borderRadius: 10, padding: 16, marginBottom: 16, elevation: 2 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  phone: { fontSize: 16, marginTop: 4 },
  date: { fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 12 },
  actionButton: { flex: 1, marginHorizontal: 4, padding: 10, borderRadius: 6, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' },
});

export default JoinRequestsScreen; 