import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const NewGroupScreen: React.FC = () => {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState(null);

  // Placeholder for picking image
  const handlePickImage = () => {
    // TODO: Implement image picker
  };

  // Placeholder for emoji picker
  const handlePickEmoji = () => {
    // TODO: Implement emoji picker
  };

  // Placeholder for submit
  const handleSubmit = () => {
    // TODO: Implement group creation logic
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#b30032" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerIcon}>
          <Icon name="checkmark" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Group Avatar and Name */}
      <View style={styles.groupInfoRow}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage}>
          <View style={styles.avatarCircle}>
            <Icon name="camera" size={32} color="#b30032" />
          </View>
        </TouchableOpacity>
        <View style={styles.groupNameInputContainer}>
          <View style={styles.groupNameRow}>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Enter a group name"
              placeholderTextColor="#888"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TouchableOpacity onPress={handlePickEmoji}>
              <Icon name="happy-outline" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <View style={styles.underline} />
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionLabel}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="You can provide an optional description for your channel"
          placeholderTextColor="#bbb"
          value={groupDescription}
          onChangeText={setGroupDescription}
          multiline
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleSubmit}>
        <Icon name="checkmark" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#b30032',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingBottom: 12,
    height: 70,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  groupInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#b30032',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupNameInputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  groupNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupNameInput: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    paddingVertical: 0,
    paddingRight: 8,
  },
  underline: {
    height: 2,
    backgroundColor: '#b30032',
    marginTop: 2,
    borderRadius: 2,
  },
  descriptionSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  descriptionLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  descriptionInput: {
    fontSize: 15,
    color: '#444',
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    backgroundColor: '#b30032',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default NewGroupScreen;