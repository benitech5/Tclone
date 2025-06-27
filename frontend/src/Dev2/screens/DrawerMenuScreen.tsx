import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DrawerMenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  menuItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 18 },
});

export default DrawerMenuScreen; 