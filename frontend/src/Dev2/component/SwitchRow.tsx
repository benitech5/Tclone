import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SwitchRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
};

const SwitchRow: React.FC<SwitchRowProps> = ({ icon, label, value, onValueChange, description }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={22} color="#d0021b" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        trackColor={{ false: '#767577', true: '#e57373' }}
        thumbColor={value ? '#d0021b' : '#f4f3f4'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  icon: {
    marginRight: 18,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  description: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 2,
  },
});

export default SwitchRow; 