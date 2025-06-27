import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const slides = [
  { key: 'slide1', title: 'Welcome to Konvo', description: 'Connect, chat, and share stories with friends.', image: require('../../../assets/icon.png') },
  { key: 'slide2', title: 'Private & Secure', description: 'Your conversations are always protected.', image: require('../../../assets/chat-bg.png') },
  { key: 'slide3', title: 'Get Started', description: 'Sign up and join the conversation!', image: require('../../../assets/splash-icon.png') },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={slides[index].image} style={styles.image} />
      <Text style={styles.title}>{slides[index].title}</Text>
      <Text style={styles.description}>{slides[index].description}</Text>
      <TouchableOpacity style={styles.button} onPress={nextSlide}>
        <Text style={styles.buttonText}>{index === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  image: { width: 120, height: 120, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  description: { fontSize: 18, color: '#555', textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default OnboardingScreen; 