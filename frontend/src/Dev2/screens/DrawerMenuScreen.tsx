import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProfile } from '../api/UserService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';
import { useAuth } from '../store/AuthContext';

const menu = [
  { label: 'My Profile', icon: 'person-outline' },
  { label: 'New Group', icon: 'people-outline', badge: 1 },
  { label: 'Contacts', icon: 'call-outline' },
  { label: 'Calls', icon: 'call-outline', badge: 23426 },
  { label: 'Saved Messages', icon: 'bookmark-outline' },
  { label: 'Settings', icon: 'settings-outline', badge: 300 },
  { label: 'Invite Friends', icon: 'person-add-outline', isBottom: true },
];

export default function DrawerMenuScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { logout, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleMenuPress = (label: string) => {
    switch (label) {
      case 'My Profile':
        navigation.navigate('Profile');
        break;
      case 'Contacts':
        navigation.navigate('Contacts' as never);
        break;
      case 'Settings':
        navigation.navigate('Profile'); // Placeholder for settings
        break;
      // Add more cases as needed
      default:
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#d0021b" style={{ marginTop: 40 }} />;
  }
  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user?.avatar || '' }} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.phone}>{user?.phone}</Text>
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto' }}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.menuList}>
        {menu.map((item, idx) => (
          <TouchableOpacity key={item.label} style={[styles.menuItem, item.isBottom && styles.menuItemBottom]} onPress={() => handleMenuPress(item.label)}>
            <Ionicons name={item.icon as any} size={22} color="#d0021b" style={{ marginRight: 16 }} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.badge && (
              <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.menuItem, { marginTop: 32 }]} onPress={handleLogout} disabled={authLoading}>
          <Ionicons name="log-out-outline" size={22} color="#d0021b" style={{ marginRight: 16 }} />
          <Text style={styles.menuLabel}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#d0021b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 18,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#eee' },
  name: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  phone: { color: '#fff', fontSize: 14 },
  menuList: { flex: 1, marginTop: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  menuItemBottom: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menuLabel: { fontSize: 16, color: '#222', fontWeight: '500', flex: 1 },
  badge: { backgroundColor: '#d0021b', borderRadius: 10, paddingHorizontal: 8, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
}); 