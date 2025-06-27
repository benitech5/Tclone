// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';
import { useAppSelector, useAppDispatch } from '../store/store';
import { logout } from '../store/authSlice';

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await AsyncStorage.clear();
        dispatch(logout());
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' as never }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {user?.name || 'User'}! 🎉</Text>
            <Text style={styles.subtitle}>You're now logged in.</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
});
