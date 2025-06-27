// src/navigation/authStack.ts

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './Types';
import LoginScreen from '../screens/loginScreen';
import OtpScreen from '../screens/otpScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Otp" component={OtpScreen} />
        </AuthStack.Navigator>
    );
}
