import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SettingsHeader title="Language" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.placeholder}>Feature coming soon...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: 16, color: '#888' },
});

export default LanguageScreen; 