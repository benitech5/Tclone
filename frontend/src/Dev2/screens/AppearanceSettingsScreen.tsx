import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const AppearanceSettingsScreen = () => {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Appearance</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Theme</Text>
        <View style={styles.optionsRow}>
          {['light', 'dark', 'system'].map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.optionBtn, theme === opt && styles.selectedOption]}
              onPress={() => setTheme(opt)}
            >
              <Text style={theme === opt ? styles.selectedText : styles.optionText}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Font Size</Text>
        <View style={styles.optionsRow}>
          {['small', 'medium', 'large'].map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.optionBtn, fontSize === opt && styles.selectedOption]}
              onPress={() => setFontSize(opt)}
            >
              <Text style={fontSize === opt ? styles.selectedText : styles.optionText}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  settingRow: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8 },
  optionsRow: { flexDirection: 'row' },
  optionBtn: { padding: 8, borderRadius: 8, backgroundColor: '#eee', marginRight: 8 },
  selectedOption: { backgroundColor: '#e53935' },
  optionText: { color: '#333' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
});

export default AppearanceSettingsScreen; 