import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';

const { width } = Dimensions.get('window');

const slides = [
  {
    image: require('../../assets/konvo-logo.png'), // Replace with your logo asset
    title: 'KONVO Messaging App',
    description: 'A convenient and effective messaging platform.\nIt is free and reliable.',
  },
  {
    image: require('../../assets/fast.png'), // Replace with your icon asset
    title: 'FAST',
    description: 'Konvo delivers messages at lightning speed, ensuring your chats and media reach their destination instantly without any lag.',
  },
  {
    image: require('../../assets/secure.png'), // Replace with your icon asset
    title: 'SECURE',
    description: 'Konvo ensures that your chats are safe from malicious intruders and parties.',
  },
  {
    image: require('../../assets/free.png'), // Replace with your icon asset
    title: 'FREE',
    description: 'Konvo is completely free to download and use with unlimited storage for chats and media.',
  },
  {
    image: require('../../assets/efficiency.png'), // Replace with your icon asset
    title: 'EFFICIENCY',
    description: 'TeleClone is a high-performance messaging app that delivers your messages instantly and optimizes data usage.\nEnjoy a seamless, uninterrupted experience—communicate quickly and reliably every time.',
  },
  {
    image: require('../../assets/robust.png'), // Replace with your icon asset
    title: 'Robust',
    description: 'Stay connected effortlessly with a strong and reliable messaging app—built to last.',
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>();

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigation.navigate('Login'); // Use correct route name
    }
  };

  return (
    <View style={styles.container}>
      <Image source={slides[current].image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{slides[current].title}</Text>
      <Text style={styles.description}>{slides[current].description}</Text>
      <View style={styles.dotsContainer}>
        {slides.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, current === idx && styles.activeDot]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Start Messaging</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#d0021b',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: '#222',
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#d0021b',
  },
  button: {
    backgroundColor: '#d0021b',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 