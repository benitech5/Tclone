import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/avatars/konvo-logo.png')} // Make sure you have this image
                style={styles.logo}
            />
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
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
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