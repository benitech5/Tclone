import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const PowerSavingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // State management for all switches and slider
  const [powerSavingMode, setPowerSavingMode] = useState(false);
  const [batteryThreshold, setBatteryThreshold] = useState(10);
  const [animatedStickers, setAnimatedStickers] = useState(true);
  const [animatedEmoji, setAnimatedEmoji] = useState(true);
  const [animationsInChats, setAnimationsInChats] = useState(true);
  const [animationsInCalls, setAnimationsInCalls] = useState(true);
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [autoplayGifs, setAutoplayGifs] = useState(true);
  const [smoothTransitions, setSmoothTransitions] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Power Saving" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Power Saving Mode */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>
          Power Saving Mode <Text style={{ color: theme.subtext, fontWeight: 'normal' }}>
            {powerSavingMode ? 'ON' : 'OFF'}
          </Text>
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Off when below {batteryThreshold}%</Text>
          <Switch 
            value={powerSavingMode} 
            onValueChange={setPowerSavingMode}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
          <Text style={[styles.label, { color: theme.text }]}>On</Text>
        </View>
        <Slider 
          style={{width: '100%', marginTop: 10}} 
          minimumValue={15} 
          maximumValue={50} 
          value={batteryThreshold} 
          onValueChange={value => setBatteryThreshold(Math.round(value))}
          minimumTrackTintColor={theme.accent} 
          thumbTintColor={theme.accent} 
        />
        <Text style={[styles.infoText, { color: theme.subtext }]}>Automatically reduce power usage and animations when your battery is below {batteryThreshold}%.</Text>

        {/* Power saving options */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Power saving options</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons name="sticker-emoji" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animated Stickers 2/2</Text>
          <Switch 
            value={animatedStickers} 
            onValueChange={setAnimatedStickers}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <View style={styles.row}>
          <Ionicons name="happy-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animated Emoji 1/3</Text>
          <Switch 
            value={animatedEmoji} 
            onValueChange={setAnimatedEmoji}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="message-processing-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animations in Chats 2/6</Text>
          <Switch 
            value={animationsInChats} 
            onValueChange={setAnimationsInChats}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animations in Calls</Text>
          <Switch 
            value={animationsInCalls} 
            onValueChange={setAnimationsInCalls}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <View style={styles.row}>
          <MaterialIcons name="play-circle-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Autoplay Videos</Text>
          <Switch 
            value={autoplayVideos} 
            onValueChange={setAutoplayVideos}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="file-video" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Autoplay GIFs</Text>
          <Switch 
            value={autoplayGifs} 
            onValueChange={setAutoplayGifs}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <View style={styles.row}>
          <FontAwesome name="exchange" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Enable Smooth Transitions</Text>
          <Switch 
            value={smoothTransitions} 
            onValueChange={setSmoothTransitions}
            thumbColor={theme.accent} 
            trackColor={{ true: '#ffd6d6', false: '#ccc' }} 
          />
        </View>
        <Text style={[styles.infoText, { color: theme.subtext }]}>You can disable animated transitions between different sections of the app.</Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 16 },
  label: { fontSize: 15 },
  infoText: { fontSize: 13, marginVertical: 10 },
});

export default PowerSavingScreen; 