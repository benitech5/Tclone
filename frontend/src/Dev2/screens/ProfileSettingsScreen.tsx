import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProfile, updateProfile, uploadAvatar } from '../api/UserService';
import * as ImagePicker from 'expo-image-picker';

const settings = [
  { label: 'Chat Settings', icon: 'chatbubble-outline' },
  { label: 'Privacy and Security', icon: 'lock-closed-outline' },
  { label: 'Notifications and Sounds', icon: 'notifications-outline' },
  { label: 'Data and Storage', icon: 'bar-chart-outline' },
  { label: 'Language', icon: 'globe-outline' },
  { label: 'Chat folders', icon: 'folder-outline' },
  { label: 'Power Saving', icon: 'battery-half-outline' },
];

const help = [
  { label: 'Ask a Question', icon: 'help-circle-outline' },
  { label: 'Convo FAQ', icon: 'help-buoy-outline' },
  { label: 'Privacy Policy', icon: 'document-text-outline' },
];

export default function ProfileSettingsScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
        setEditProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(editProfile);
      setUser(updated);
      setEditing(false);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePickAvatar = async () => {
    setAvatarError('');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUploading(true);
      try {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || 'avatar.jpg',
          type: asset.type || 'image/jpeg',
        };
        const { avatarUrl } = await uploadAvatar(file);
        setEditProfile((prev: any) => ({ ...prev, avatar: avatarUrl }));
        // Optionally auto-save after upload
        const updated = await updateProfile({ ...editProfile, avatar: avatarUrl });
        setUser(updated);
      } catch (err) {
        setAvatarError('Failed to upload avatar.');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#d0021b" style={{ marginTop: 40 }} />;
  }
  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickAvatar} disabled={avatarUploading}>
          <Image source={{ uri: editProfile.avatar || user?.avatar || '' }} style={styles.avatar} />
          {avatarUploading && <ActivityIndicator style={styles.avatarLoader} color="#d0021b" />}
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={editProfile.name}
              onChangeText={name => setEditProfile({ ...editProfile, name })}
            />
          ) : (
            <Text style={styles.name}>{user?.name}</Text>
          )}
          <Text style={styles.status}>{user?.status || 'Online'}</Text>
          {avatarError ? <Text style={{ color: 'red', marginTop: 4 }}>{avatarError}</Text> : null}
        </View>
        {editing ? (
          <TouchableOpacity onPress={handleSave} disabled={saving} style={{ marginLeft: 'auto' }}>
            <Ionicons name="checkmark" size={24} color="#d0021b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={{ marginLeft: 'auto' }}>
            <Ionicons name="create-outline" size={24} color="#d0021b" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <Text style={styles.fieldValue}>{user?.phone}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Username</Text>
          {editing ? (
            <TextInput
              style={styles.fieldValue}
              value={editProfile.username}
              onChangeText={username => setEditProfile({ ...editProfile, username })}
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.username}</Text>
          )}
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Bio</Text>
          {editing ? (
            <TextInput
              style={styles.fieldValue}
              value={editProfile.bio}
              onChangeText={bio => setEditProfile({ ...editProfile, bio })}
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.bio}</Text>
          )}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settings.map(item => (
          <TouchableOpacity key={item.label} style={styles.settingRow}>
            <Ionicons name={item.icon as any} size={20} color="#d0021b" style={{ marginRight: 16 }} />
            <Text style={styles.settingLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help</Text>
        {help.map(item => (
          <TouchableOpacity key={item.label} style={styles.settingRow}>
            <Ionicons name={item.icon as any} size={20} color="#d0021b" style={{ marginRight: 16 }} />
            <Text style={styles.settingLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#eee' },
  name: { color: '#222', fontWeight: 'bold', fontSize: 18 },
  nameInput: { color: '#222', fontWeight: 'bold', fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#d0021b', minWidth: 120 },
  status: { color: '#d0021b', fontSize: 14 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { color: '#d0021b', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f2f2f7' },
  fieldLabel: { color: '#888', fontSize: 15 },
  fieldValue: { color: '#222', fontSize: 15, fontWeight: '500', minWidth: 80 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f2f2f7' },
  settingLabel: { color: '#222', fontSize: 15, fontWeight: '500' },
  avatarLoader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
}); 