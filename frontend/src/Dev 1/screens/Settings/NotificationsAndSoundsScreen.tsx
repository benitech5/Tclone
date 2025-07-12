import React from 'react';
import { View, ScrollView, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';

const NotificationsAndSoundsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // State for toggles
  const [allAccounts, setAllAccounts] = React.useState(true);
  const [privateChats, setPrivateChats] = React.useState(true);
  const [groups, setGroups] = React.useState(true);
  const [channels, setChannels] = React.useState(true);
  const [stories, setStories] = React.useState(false);
  const [reactions, setReactions] = React.useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Notifications and Sounds" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Show notifications from */}
        <Text style={[styles.sectionHeader, { color: '#000' }]}>Show notifications from</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: '#000' }]}>All Accounts</Text>
          <Switch value={allAccounts} onValueChange={setAllAccounts} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </View>
        <Text style={[styles.infoText, { color: theme.subtext }]}>Turn this off if you want to receive notifications only from the account you are currently using.</Text>

        {/* Notifications for chats */}
        <Text style={[styles.sectionHeader, { color: '#000' }]}>Notifications for chats</Text>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#000" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#000' }]}>Private Chats</Text>
            <Text style={[styles.sublabel, { color: theme.subtext }]}>Tap to change</Text>
          </View>
          <Switch value={privateChats} onValueChange={setPrivateChats} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="people-outline" size={22} color="#000" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#000' }]}>Groups</Text>
            <Text style={[styles.sublabel, { color: theme.subtext }]}>On, 7 exceptions</Text>
          </View>
          <Switch value={groups} onValueChange={setGroups} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="campaign" size={22} color="#000" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#000' }]}>Channels</Text>
            <Text style={[styles.sublabel, { color: theme.subtext }]}>On, 2 exceptions</Text>
          </View>
          <Switch value={channels} onValueChange={setChannels} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <MaterialCommunityIcons name="movie-open-outline" size={22} color="#000" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#000' }]}>Stories</Text>
            <Text style={[styles.sublabel, { color: theme.subtext }]}>Off, 5 automatic exceptions</Text>
          </View>
          <Switch value={stories} onValueChange={setStories} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <FontAwesome name="heart-o" size={22} color="#000" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#000' }]}>Reactions</Text>
            <Text style={[styles.sublabel, { color: theme.subtext }]}>Messages, Stories</Text>
          </View>
          <Switch value={reactions} onValueChange={setReactions} thumbColor={theme.accent} trackColor={{ true: '#ffd6d6', false: '#ccc' }} />
        </TouchableOpacity>

        {/* Calls */}
        <Text style={[styles.sectionHeader, { color: '#000' }]}>Calls</Text>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="notifications-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000', flex: 1 }]}>Vibrate</Text>
          <Text style={[styles.value, { color: theme.accent }]}>Default</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="musical-notes-outline" size={22} color="#000" style={styles.icon} />
          <Text style={[styles.label, { color: '#000', flex: 1 }]}>Ringtone</Text>
          <Text style={[styles.value, { color: theme.accent }]}>Default</Text>
        </TouchableOpacity>
        {/* Badge Counter */}
        <Text style={[styles.sectionHeader, { color: '#000' }]}>Badge Counter</Text>
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
  sublabel: { fontSize: 12 },
  value: { fontSize: 15 },
  infoText: { fontSize: 13, marginVertical: 10 },
});

export default NotificationsAndSoundsScreen; 