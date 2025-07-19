// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import LoginScreen from '../screens/Auth/loginScreen';
import PhoneLoginScreen from '../screens/Auth/PhoneLoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import ProfileSetupScreen from '../screens/Auth/ProfileSetupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Otp" component={OTPScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  </Stack.Navigator>
);