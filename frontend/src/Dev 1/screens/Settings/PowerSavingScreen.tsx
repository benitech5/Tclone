import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const PowerSavingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Power Saving" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Power Saving Mode */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Power Saving Mode <Text style={{ color: theme.subtext, fontWeight: 'normal' }}>OFF</Text></Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Off</Text>
          <Text style={[styles.label, { color: theme.text }]}>When below 10%</Text>
          <Switch value={false} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
          <Text style={[styles.label, { color: theme.text }]}>On</Text>
        </View>
        <Slider style={{width: '100%'}} minimumValue={0} maximumValue={100} value={10} minimumTrackTintColor={theme.accent} thumbTintColor={theme.accent} />
        <Text style={[styles.infoText, { color: theme.subtext }]}>Automatically reduce power usage and animations when your battery is below 10%.</Text>

        {/* Power saving options */}
        <Text style={[styles.sectionHeader, { color: theme.accent }]}>Power saving options</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons name="sticker-emoji" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animated Stickers 2/2</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <View style={styles.row}>
          <Ionicons name="happy-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animated Emoji 1/3</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="message-processing-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animations in Chats 2/6</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Animations in Calls</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <View style={styles.row}>
          <MaterialIcons name="play-circle-outline" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Autoplay Videos</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="file-video" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Autoplay GIFs</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <View style={styles.row}>
          <FontAwesome name="exchange" size={22} color={theme.accent} style={styles.icon} />
          <Text style={[styles.label, { color: theme.text, flex: 1 }]}>Enable Smooth Transitions</Text>
          <Switch value={true} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
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