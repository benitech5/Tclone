import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const NewStoryScreen = () => {
  const [caption, setCaption] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.storyArea}>
        {/* Placeholder for media preview */}
      </View>
      <TextInput
        style={styles.captionInput}
        placeholder="Add a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarBtn}><Text>📎</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn}><Text>😊</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn}><Text>T</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn}><Text>≡</Text></TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn}><Text style={styles.nextText}>NEXT ➔</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222' },
  storyArea: { flex: 1, backgroundColor: '#888', margin: 16, borderRadius: 12 },
  captionInput: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 12, margin: 16, minHeight: 48 },
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#111' },
  toolbarBtn: { padding: 8 },
  nextBtn: { backgroundColor: '#e53935', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  nextText: { color: '#fff', fontWeight: 'bold' },
});

export default NewStoryScreen; 