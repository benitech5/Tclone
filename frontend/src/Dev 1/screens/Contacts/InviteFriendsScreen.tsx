import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';

const InviteFriendsScreen = () => {
  const { theme } = useTheme();

  const inviteOptions = [
    {
      id: '1',
      title: 'Invite via WhatsApp',
      subtitle: 'Share with your WhatsApp contacts',
      icon: 'logo-whatsapp',
      color: '#25D366',
    },
    {
      id: '2',
      title: 'Invite via Telegram',
      subtitle: 'Share with your Telegram contacts',
      icon: 'paper-plane',
      color: '#0088cc',
    },
    {
      id: '3',
      title: 'Invite via Email',
      subtitle: 'Send invitation via email',
      icon: 'mail',
      color: '#EA4335',
    },
    {
      id: '4',
      title: 'Copy Link',
      subtitle: 'Copy invitation link to clipboard',
      icon: 'link',
      color: '#FF9500',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Invite Friends</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Share Orbixa with your friends and family
      </Text>
      
      <ScrollView style={styles.optionsContainer}>
        {inviteOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionItem, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
              <Ionicons name={option.icon as any} size={24} color="#fff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>{option.title}</Text>
              <Text style={[styles.optionSubtitle, { color: theme.subtext }]}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.subtext }]}>
          Your friends will receive an invitation to join Orbixa
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 4,
    borderRadius: 25,
    borderWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  footerText: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default InviteFriendsScreen; 