import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';

type SettingsNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'Settings'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface SettingsScreenProps {
  navigation: SettingsNavigationProp;
}

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigate' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  route?: keyof MainStackParamList;
  routeParams?: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoDownloadMedia, setAutoDownloadMedia] = useState(false);
  const [saveToGallery, setSaveToGallery] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' as never }],
            });
          }
        },
      ]
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: user?.name || 'Set up your profile',
          icon: 'person',
          type: 'navigate',
          route: 'Profile',
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Last seen, profile photo, blocks',
          icon: 'shield-checkmark',
          type: 'navigate',
          route: 'Privacy',
        },
        {
          id: 'devices',
          title: 'Devices',
          subtitle: 'Manage active sessions',
          icon: 'phone-portrait',
          type: 'navigate',
          route: 'Devices',
        },
        {
          id: 'storage',
          title: 'Data & Storage',
          subtitle: 'Manage storage and data usage',
          icon: 'cloud-download',
          type: 'navigate',
          route: 'DataAndStorage',
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      items: [
        {
          id: 'notifications-toggle',
          title: 'Notifications',
          subtitle: 'Enable push notifications',
          icon: 'notifications',
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'sound',
          title: 'Sound',
          subtitle: 'Play sound for notifications',
          icon: 'volume-high',
          type: 'toggle',
          value: soundEnabled,
          onToggle: setSoundEnabled,
        },
        {
          id: 'vibration',
          title: 'Vibration',
          subtitle: 'Vibrate for notifications',
          icon: 'phone-portrait',
          type: 'toggle',
          value: vibrationEnabled,
          onToggle: setVibrationEnabled,
        },
        {
          id: 'notification-settings',
          title: 'Notification Settings',
          subtitle: 'Customize notification preferences',
          icon: 'settings',
          type: 'navigate',
          route: 'Notifications',
        },
      ],
    },
    {
      id: 'chats',
      title: 'Chats',
      items: [
        {
          id: 'chat-settings',
          title: 'Chat Settings',
          subtitle: 'Dark mode, message font, and more',
          icon: 'chatbubble-ellipses',
          type: 'navigate',
          route: 'ChatSettings',
        },
        {
          id: 'theme',
          title: 'Theme',
          subtitle: 'Light, Dark, or System',
          icon: 'color-palette',
          type: 'navigate',
          route: 'Theme',
        },
        {
          id: 'chat-folders',
          title: 'Chat Folders',
          subtitle: 'Organize your chats',
          icon: 'folder',
          type: 'navigate',
          route: 'ChatFolders',
        },
        {
          id: 'auto-download',
          title: 'Auto-Download Media',
          subtitle: 'Automatically download photos and videos',
          icon: 'download',
          type: 'toggle',
          value: autoDownloadMedia,
          onToggle: setAutoDownloadMedia,
        },
        {
          id: 'save-to-gallery',
          title: 'Save to Gallery',
          subtitle: 'Save media to device gallery',
          icon: 'images',
          type: 'toggle',
          value: saveToGallery,
          onToggle: setSaveToGallery,
        },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get help and support',
          icon: 'help-circle',
          type: 'action',
          onPress: () => Alert.alert('Help', 'Help center would open here'),
        },
        {
          id: 'contact',
          title: 'Contact Us',
          subtitle: 'Get in touch with support',
          icon: 'mail',
          type: 'action',
          onPress: () => Alert.alert('Contact', 'Contact form would open here'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          icon: 'document-text',
          type: 'action',
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy would open here'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          icon: 'document',
          type: 'action',
          onPress: () => Alert.alert('Terms', 'Terms of service would open here'),
        },
      ],
    },
    {
      id: 'account-actions',
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Logout',
          subtitle: 'Sign out of your account',
          icon: 'log-out',
          type: 'action',
          onPress: handleLogout,
        },
      ],
    },
  ];

  const renderSectionHeader = ({ item }: { item: SettingsSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>
        {item.title}
      </Text>
    </View>
  );

  const renderSettingsItem = ({ item }: { item: SettingsItem }) => (
    <TouchableOpacity
      style={[styles.settingsItem, { backgroundColor: theme.card }]}
      onPress={() => {
        if (item.type === 'navigate' && item.route) {
          navigation.navigate(item.route, item.routeParams || {});
        } else if (item.type === 'action' && item.onPress) {
          item.onPress();
        }
      }}
      disabled={item.type === 'toggle'}
    >
      <View style={[styles.itemIcon, { backgroundColor: theme.background }]}>
        <Icon name={item.icon} size={20} color={theme.primary} />
      </View>
      
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      
      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={item.value ? '#fff' : theme.subtext}
        />
      ) : (
        <Icon name="chevron-forward" size={20} color={theme.subtext} />
      )}
    </TouchableOpacity>
  );

  const renderSection = ({ item }: { item: SettingsSection }) => (
    <View style={styles.section}>
      {renderSectionHeader({ item })}
      {item.items.map((settingsItem) => (
        <View key={settingsItem.id}>
          {renderSettingsItem({ item: settingsItem })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <View style={[styles.profileAvatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.profileAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.profilePhone, { color: theme.subtext }]}>
              {user?.phoneNumber || '+1234567890'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="pencil" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.id} style={styles.section}>
            {renderSectionHeader({ item: section })}
            {section.items.map((settingsItem) => (
              <View key={settingsItem.id}>
                {renderSettingsItem({ item: settingsItem })}
              </View>
            ))}
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.subtext }]}>
            App Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen;