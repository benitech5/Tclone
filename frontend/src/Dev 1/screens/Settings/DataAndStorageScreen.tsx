import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const DataAndStorageScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Data and Storage" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Automatic media download */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Automatic media download</Text>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>When using mobile data</Text><Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>When connected to Wi-Fi</Text><Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>When roaming</Text><Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
        <TouchableOpacity><Text style={[styles.reset, { color: theme.accent }]}>Reset Auto-Download Settings</Text></TouchableOpacity>
        {/* Save to Gallery */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Save to Gallery</Text>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>Private Chats</Text><Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>Groups</Text><Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>Channels</Text><Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
        {/* Streaming */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Streaming</Text>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>Stream Videos and Audio Files</Text><Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} /></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  label: { fontSize: 15 },
  reset: { marginTop: 12, marginBottom: 8 },
});

export default DataAndStorageScreen; 