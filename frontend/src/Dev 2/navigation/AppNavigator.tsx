// src/navigation/AppNavigator.ts

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './Types';
import HomeScreen from '../screens/homeScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Home" component={HomeScreen} />
        </AppStack.Navigator>
    );
}
