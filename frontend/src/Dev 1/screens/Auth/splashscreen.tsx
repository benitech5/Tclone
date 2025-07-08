import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Konvo</Text>
            <Text style={styles.subtitle}>Connecting people securely</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0088cc', // Telegram-like blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        marginTop: 10,
    },
});

export default SplashScreen;