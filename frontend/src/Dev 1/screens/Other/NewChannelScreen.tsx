import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NewChannelNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'NewChannel'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface NewChannelScreenProps {
  navigation: NewChannelNavigationProp;
}

interface ChannelSettings {
  isPublic: boolean;
  isPrivate: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  requireApproval: boolean;
  autoDelete: boolean;
  autoDeleteDays: number;
}

const NewChannelScreen: React.FC<NewChannelScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelUsername, setChannelUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [settings, setSettings] = useState<ChannelSettings>({
    isPublic: true,
    isPrivate: false,
    allowComments: true,
    allowReactions: true,
    requireApproval: false,
    autoDelete: false,
    autoDeleteDays: 7,
  });

  const handleSettingToggle = (key: keyof ChannelSettings, value?: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      Alert.alert('Error', 'Please enter a channel name');
      return;
    }

    if (channelUsername && !/^[a-zA-Z0-9_]{5,32}$/.test(channelUsername)) {
      Alert.alert('Error', 'Username must be 5-32 characters, letters, numbers, and underscores only');
      return;
    }

    setIsCreating(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const channelData = {
        title: channelName.trim(),
        description: channelDescription.trim(),
        username: channelUsername.trim(),
        type: 'CHANNEL',
        createdAt: new Date().toISOString(),
        settings,
      };
      const response = await axios.post('http://192.168.96.216:8082/api/chats', channelData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newChannel = response.data;
      Alert.alert('Success', `Channel "${channelName}" created successfully!`);
      navigation.navigate('ChannelInfo', {
        channelId: newChannel.id,
        channelName: newChannel.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create channel. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void,
    color?: string
  ) => (
    <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
      <View style={styles.settingInfo}>
        <View style={[styles.settingIcon, { backgroundColor: (color || theme.primary) + '20' }]}>
          <Icon name={icon} size={20} color={color || theme.primary} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary + '40' }}
        thumbColor={value ? theme.primary : theme.subtext}
      />
    </View>
  );

  const renderPrivacyOption = (
    title: string,
    subtitle: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.privacyOption,
        { backgroundColor: theme.card },
        isSelected && { backgroundColor: theme.primary + '20' }
      ]}
      onPress={onPress}
    >
      <View style={styles.privacyContent}>
        <Text style={[styles.privacyTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.privacySubtitle, { color: theme.subtext }]}>
          {subtitle}
        </Text>
      </View>
      
      <View style={[
        styles.radioButton,
        { 
          backgroundColor: isSelected ? theme.primary : 'transparent',
          borderColor: isSelected ? theme.primary : theme.border
        }
      ]}>
        {isSelected && (
          <View style={[styles.radioInner, { backgroundColor: '#fff' }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelButton, { color: theme.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          New Channel
        </Text>
        
        <TouchableOpacity 
          onPress={handleCreateChannel}
          disabled={!channelName.trim() || isCreating}
        >
          <Text style={[
            styles.createButton,
            { 
              color: (channelName.trim() && !isCreating) 
                ? theme.primary 
                : theme.subtext 
            }
          ]}>
            {isCreating ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Channel Info Section */}
        <View style={[styles.channelInfoSection, { backgroundColor: theme.card }]}>
          <View style={styles.channelAvatar}>
            <Icon name="radio" size={32} color={theme.primary} />
          </View>
          
          <View style={styles.channelInfo}>
            <TextInput
              style={[styles.channelNameInput, { color: theme.text }]}
              value={channelName}
              onChangeText={setChannelName}
              placeholder="Channel name"
              placeholderTextColor={theme.subtext}
              maxLength={100}
            />
            
            <TextInput
              style={[styles.channelDescriptionInput, { color: theme.text }]}
              value={channelDescription}
              onChangeText={setChannelDescription}
              placeholder="Channel description (optional)"
              placeholderTextColor={theme.subtext}
              multiline
              maxLength={500}
            />
          </View>
        </View>

        {/* Username Section */}
        <View style={[styles.usernameSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Channel Username
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>
            Optional. Choose a unique username for your channel
          </Text>
          
          <View style={styles.usernameInputContainer}>
            <Text style={[styles.usernamePrefix, { color: theme.subtext }]}>
              @
            </Text>
            <TextInput
              style={[styles.usernameInput, { color: theme.text }]}
              value={channelUsername}
              onChangeText={setChannelUsername}
              placeholder="username"
              placeholderTextColor={theme.subtext}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          {channelUsername && (
            <Text style={[
              styles.usernameValidation,
              { 
                color: /^[a-zA-Z0-9_]{5,32}$/.test(channelUsername) 
                  ? '#4CAF50' 
                  : '#f44336' 
              }
            ]}>
              {/^[a-zA-Z0-9_]{5,32}$/.test(channelUsername) 
                ? 'Username is available' 
                : 'Username must be 5-32 characters, letters, numbers, and underscores only'
              }
            </Text>
          )}
        </View>

        {/* Privacy Settings */}
        <View style={styles.privacySection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Privacy
          </Text>
          {renderPrivacyOption(
            'Public Channel',
            'Anyone can find and join your channel',
            settings.isPublic,
            () => handleSettingToggle('isPublic', true)
          )}
          
          {renderPrivacyOption(
            'Private Channel',
            'Only invited users can join your channel',
            settings.isPrivate,
            () => handleSettingToggle('isPrivate', true)
          )}
        </View>

        {/* Channel Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Channel Settings
          </Text>
          
          {renderSettingItem(
            'chatbubble',
            'Allow Comments',
            'Users can comment on your posts',
            settings.allowComments,
            () => handleSettingToggle('allowComments')
          )}
          
          {renderSettingItem(
            'heart',
            'Allow Reactions',
            'Users can react to your posts',
            settings.allowReactions,
            () => handleSettingToggle('allowReactions')
          )}
          
          {renderSettingItem(
            'shield-checkmark',
            'Require Approval',
            'Approve comments before they appear',
            settings.requireApproval,
            () => handleSettingToggle('requireApproval')
          )}
          
          {renderSettingItem(
            'trash',
            'Auto-Delete Posts',
            'Automatically delete posts after a period',
            settings.autoDelete,
            () => handleSettingToggle('autoDelete')
          )}
        </View>

        {/* Auto-Delete Days */}
        {settings.autoDelete && (
          <View style={[styles.autoDeleteSection, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Auto-Delete After
            </Text>
            
            <View style={styles.daysContainer}>
              {[1, 7, 30, 90].map(days => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dayButton,
                    { 
                      backgroundColor: settings.autoDeleteDays === days 
                        ? theme.primary 
                        : theme.background,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => handleSettingToggle('autoDeleteDays', days)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    { 
                      color: settings.autoDeleteDays === days 
                        ? '#fff' 
                        : theme.text 
                    }
                  ]}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  channelInfoSection: {
    flexDirection: 'row',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  channelAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,136,204,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  channelInfo: {
    flex: 1,
  },
  channelNameInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  channelDescriptionInput: {
    fontSize: 14,
    lineHeight: 20,
  },
  usernameSection: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  usernamePrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  usernameValidation: {
    fontSize: 12,
  },
  privacySection: {
    marginBottom: 16,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  settingsSection: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  autoDeleteSection: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default NewChannelScreen; 