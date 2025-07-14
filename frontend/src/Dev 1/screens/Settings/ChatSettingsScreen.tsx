import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../ThemeContext';
import { useSettings } from '../../SettingsContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const ChatSettingsScreen = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { chatSettings, updateMessageSize, updateMessageCorner } = useSettings();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Chat Settings" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        <Text style={[styles.header, { color: theme.text }]}>Chat Settings</Text>
        
        {/* Dark Mode Switch - Moved to top */}
        <View style={[styles.darkModeContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.darkModeContent}>
            <View style={styles.darkModeLeft}>
              <Text style={[styles.darkModeTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.darkModeSubtitle, { color: theme.subtext }]}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme} 
              thumbColor={theme.accent} 
              trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
            />
          </View>
        </View>

        {/* Message text size */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Message text size</Text>
        <Slider 
          style={{width: '100%'}} 
          minimumValue={10} 
          maximumValue={30} 
          value={chatSettings.messageSize} 
          onValueChange={updateMessageSize}
          minimumTrackTintColor={theme.accent} 
          thumbTintColor={theme.accent} 
        />
        <Text style={[styles.sliderValue, { color: theme.subtext }]}>{Math.round(chatSettings.messageSize)}px</Text>
        
        {/* Chat preview */}
        <View style={[styles.chatPreview, { backgroundColor: theme.card }]}> 
          <Text style={[styles.previewSender, { color: theme.accent }]}>Benjamin 🔥🔥🔥</Text>
          <Text style={[styles.previewMsg, { color: theme.text, fontSize: chatSettings.messageSize }]}>Good morning! 🌅</Text>
          <Text style={[styles.previewMsg, { color: theme.text, fontSize: chatSettings.messageSize }]}>Do you know what time it is?</Text>
          <View style={[styles.previewReply, { borderRadius: chatSettings.messageCorner }]}>
            <Text style={[styles.previewReplyText, { fontSize: chatSettings.messageSize }]}>It's morning in Tokyo 😎</Text>
          </View>
        </View>
        {/* Wallpaper, name color, color theme */}
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBg }]}> <Text style={[styles.buttonText, { color: theme.buttonText }]}>Change Chat Wallpaper</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBg }]}> <Text style={[styles.buttonText, { color: theme.buttonText }]}>Change Name Color</Text></TouchableOpacity>
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Color theme</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity style={[styles.themeBox, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => {}} />
          <TouchableOpacity style={[styles.themeBox, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => {}} />
          <TouchableOpacity style={[styles.themeBox, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => {}} />
          <TouchableOpacity style={[styles.themeBox, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => {}} />
          <TouchableOpacity style={[styles.themeBox, styles.selectedTheme, { borderColor: theme.accent }]} onPress={() => {}} />
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBg }]}> <Text style={[styles.buttonText, { color: theme.buttonText }]}>Switch to Day Mode</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBg }]}> <Text style={[styles.buttonText, { color: theme.buttonText }]}>Browse Themes</Text></TouchableOpacity>
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Message corners</Text>
        <Slider 
          style={{width: '100%'}} 
          minimumValue={0} 
          maximumValue={30} 
          value={chatSettings.messageCorner} 
          onValueChange={updateMessageCorner}
          minimumTrackTintColor={theme.accent} 
          thumbTintColor={theme.accent} 
        />
        <Text style={[styles.sliderValue, { color: theme.subtext }]}>{Math.round(chatSettings.messageCorner)}px</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, marginTop: 24, marginBottom: 8 },
  darkModeContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  darkModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  darkModeLeft: {
    flex: 1,
  },
  darkModeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  darkModeSubtitle: {
    fontSize: 14,
  },
  chatPreview: { borderRadius: 12, padding: 12, marginVertical: 12 },
  previewSender: { fontWeight: 'bold' },
  previewMsg: {},
  previewReply: { 
    backgroundColor: '#b388ff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  previewReplyText: { 
    color: '#fff',
  },
  button: { borderRadius: 8, padding: 10, marginVertical: 6 },
  buttonText: { textAlign: 'center' },
  themeRow: { flexDirection: 'row', marginVertical: 10 },
  themeBox: { width: 40, height: 40, borderRadius: 10, marginHorizontal: 4, borderWidth: 1 },
  selectedTheme: { borderWidth: 2 },
  sliderValue: { 
    textAlign: 'center', 
    fontSize: 12, 
    marginTop: 4, 
    marginBottom: 8 
  },
});

export default ChatSettingsScreen; 