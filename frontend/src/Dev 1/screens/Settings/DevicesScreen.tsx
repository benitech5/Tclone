import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const DevicesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Devices" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* QR/Link Desktop Device section */}
        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <MaterialIcons name="devices" size={72} color={theme.subtext} />
          <Text style={[styles.description, { color: theme.subtext, marginTop: 12 }]}>Link <Text style={{ color: theme.accent, textDecorationLine: 'underline' }}>Telegram Desktop</Text> or <Text style={{ color: theme.accent, textDecorationLine: 'underline' }}>Telegram Web</Text> by scanning a QR code.</Text>
          <TouchableOpacity style={[styles.linkButton, { backgroundColor: '#2196f3' }]}> <Text style={styles.linkButtonText}>🔗 Link Desktop Device</Text> </TouchableOpacity>
        </View>
        {/* This device */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>This device</Text>
        <View style={styles.deviceRow}>
          <FontAwesome name="android" size={28} color="#4caf50" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.deviceTitle, { color: theme.text }]}>Samsung Galaxy A05</Text>
            <Text style={[styles.deviceDesc, { color: theme.subtext }]}>Telegram Android 11.12.0{"\n"}Kumasi, Ghana • online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.terminateButton}>
          <Text style={styles.terminateButtonText}>Terminate All Other Sessions</Text>
        </TouchableOpacity>
        <Text style={[styles.terminateInfo, { color: theme.subtext }]}>Logs out all devices except for this one.</Text>
        {/* Active sessions */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Active sessions</Text>
        <View style={styles.deviceRow}>
          <Ionicons name="laptop-outline" size={28} color="#2196f3" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.deviceTitle, { color: theme.text }]}>HP EliteBook 840 G3</Text>
            <Text style={[styles.deviceDesc, { color: theme.subtext }]}>Telegram Desktop 5.0.1 x64 Microsoft Store{"\n"}Kumasi, Ghana • Thu</Text>
          </View>
        </View>
        <Text style={[styles.infoText, { color: theme.subtext }]}>The official Telegram app is available for Android, iPhone, iPad, Windows, macOS and Linux.</Text>
        {/* Automatically terminate old sessions */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Automatically terminate old sessions</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>If inactive for</Text>
          <Text style={[styles.value, { color: theme.accent, fontWeight: 'bold' }]}>6 months</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  description: { fontSize: 15, textAlign: 'center' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  deviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 16 },
  deviceTitle: { fontSize: 15, fontWeight: 'bold' },
  deviceDesc: { fontSize: 13 },
  terminateButton: { backgroundColor: '#ffeaea', borderRadius: 6, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  terminateButtonText: { color: '#e53935', fontWeight: 'bold', fontSize: 15 },
  terminateInfo: { fontSize: 13, marginBottom: 8 },
  linkButton: { borderRadius: 6, paddingVertical: 12, paddingHorizontal: 24, marginTop: 18 },
  linkButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  infoText: { fontSize: 13, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  label: { fontSize: 15 },
  value: { fontSize: 15 },
});

export default DevicesScreen; 