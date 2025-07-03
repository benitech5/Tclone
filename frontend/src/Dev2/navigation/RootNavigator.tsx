import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthStack';
import AppNavigator from './AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/store';
import { login } from '../store/authSlice';
export default function RootNavigator() {
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userStr = await AsyncStorage.getItem('user');

                if (token && userStr) {
                    const user = JSON.parse(userStr);
                    dispatch(login({ user, token }));
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, [dispatch]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
