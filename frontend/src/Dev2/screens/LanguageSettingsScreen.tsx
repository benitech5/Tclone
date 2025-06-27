import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const languages = ['English', 'French', 'Spanish', 'German', 'Chinese'];

const LanguageSettingsScreen = () => {
  const [selected, setSelected] = useState('English');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Language</Text>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang}
          style={[styles.langRow, selected === lang && styles.selectedRow]}
          onPress={() => setSelected(lang)}
        >
          <Text style={selected === lang ? styles.selectedText : styles.langText}>{lang}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  langRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  langText: { fontSize: 16 },
  selectedRow: { backgroundColor: '#e53935' },
  selectedText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default LanguageSettingsScreen; 