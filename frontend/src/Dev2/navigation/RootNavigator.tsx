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
            const token = await AsyncStorage.getItem('token');
            const name = await AsyncStorage.getItem('name');
            const email = await AsyncStorage.getItem('email');

            if (token && name && email) {
                dispatch(login({ name, email }));
            }

            setLoading(false);
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
