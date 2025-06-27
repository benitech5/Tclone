import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SettingsRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
};

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, onPress, color = '#222' }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingRow}>
      <Ionicons name={icon} size={22} color="#d0021b" style={styles.icon} />
      <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="#c7c7cc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 18,
  },
  settingLabel: {
    flex: 1,
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsRow; 