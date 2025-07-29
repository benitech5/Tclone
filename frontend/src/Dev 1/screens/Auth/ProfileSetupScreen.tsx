import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { login } from '../../store/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_ENDPOINTS } from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileSetupNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, 'ProfileSetup'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupNavigationProp;
  route: {
    params: {
      phoneNumber: string;
    };
  };
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const generateUsername = () => {
    const base = firstName.toLowerCase().replace(/[^a-z]/g, '') + 
                 lastName.toLowerCase().replace(/[^a-z]/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    setUsername(`${base}${randomNum}`);
  };

  const validateName = (name: string) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    return /^[A-Za-z\s\-']{4,}$/.test(name);
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (!validateName(text)) {
      setFirstNameError('First name must be at least 4 letters and contain only valid characters');
    } else {
      setFirstNameError('');
    }
  };
  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (!validateName(text)) {
      setLastNameError('Last name must be at least 4 letters and contain only valid characters');
    } else {
      setLastNameError('');
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setIsLoading(true);

    try {
      // Get the token from AsyncStorage (saved during OTP verification)
      const token = await AsyncStorage.getItem('token');
      console.log('Retrieved token from AsyncStorage:', token ? 'Token exists' : 'No token found');
      
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        otherName: otherName.trim() || null,
        username: username.trim(),
        profilePictureUrl: profileImage || null,
        phoneNumber,
      };
      console.log('Profile data being sent:', profileData);
      
      let response;
      if (token && !token.includes('_')) {
        // If we have a valid token, use it for authenticated request
        response = await axios.post(`${API_ENDPOINTS.USER}`, profileData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // For new users without valid token, create profile without authentication
        response = await axios.post(`${API_ENDPOINTS.USER}`, profileData);
      }
      
      console.log('Profile save response:', response.data);
      // Update Redux with the user data
      dispatch(login(response.data));

      // Navigate to main app
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      });
    } catch (error) {
      console.log('Profile save error:', error.response || error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    firstName.trim().length >= 4 &&
    lastName.trim().length >= 4 &&
    !firstNameError &&
    !lastNameError &&
    username.trim();

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Set Up Your Profile
          </Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Add your details to complete your profile
          </Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={showImagePickerOptions}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: theme.card }]}>
                <Icon name="camera" size={40} color={theme.subtext} />
              </View>
            )}
            <View style={[styles.editButton, { backgroundColor: theme.primary }]}>
              <Icon name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>First Name *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={firstName}
              onChangeText={handleFirstNameChange}
              placeholder="Enter your first name"
              placeholderTextColor={theme.subtext}
              autoFocus
            />
            {firstNameError ? <Text style={{ color: 'red', fontSize: 12 }}>{firstNameError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Last Name *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={lastName}
              onChangeText={handleLastNameChange}
              placeholder="Enter your last name"
              placeholderTextColor={theme.subtext}
            />
            {lastNameError ? <Text style={{ color: 'red', fontSize: 12 }}>{lastNameError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Other Name (optional)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={otherName}
              onChangeText={setOtherName}
              placeholder="Enter your other name (optional)"
              placeholderTextColor={theme.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.usernameRow}>
              <Text style={[styles.label, { color: theme.text }]}>Username *</Text>
              <TouchableOpacity onPress={generateUsername} style={styles.generateButton}>
                <Text style={[styles.generateText, { color: theme.primary }]}>
                  Generate
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={theme.subtext}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={theme.subtext}
              multiline
              numberOfLines={3}
              maxLength={150}
            />
            <Text style={[styles.charCount, { color: theme.subtext }]}>
              {bio.length}/150
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <Button
          title={isLoading ? 'Saving...' : 'Save'}
          onPress={handleSave}
          disabled={!isFormValid || isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  usernameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  generateButton: {
    padding: 4,
  },
  generateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSetupScreen; 