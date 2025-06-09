// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { useAppDispatch, useAppSelector } from './src/store/store';
import { View, Text, Button } from 'react-native';
import { login, logout } from './src/store/authSlice';

function HomeScreen() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    return (
        <View style={{ padding: 20 }}>
            <Text>User: {auth.user ? auth.user.name : 'No one logged in'}</Text>
            <Button
                title="Login"
                onPress={() =>
                    dispatch(login({ name: 'Philip', email: 'philip@example.com' }))
                }
            />
            <Button title="Logout" onPress={() => dispatch(logout())} />
        </View>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <HomeScreen />
        </Provider>
    );
}