import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

const orbixaLogo = require('../../../../assets/avatars/orbixa.png');

const SplashScreen = ({ navigation }: any) => {
    const [showLogo, setShowLogo] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Show black screen for 1 second
        const blackTimeout = setTimeout(() => {
            setShowLogo(true);
            // Fade in logo with scale and rotation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ]).start();
        }, 1000);

        // Navigate to Onboarding after 6 seconds
        const navTimeout = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 6000);

        return () => {
            clearTimeout(blackTimeout);
            clearTimeout(navTimeout);
        };
    }, [fadeAnim, scaleAnim, rotateAnim, navigation]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            {!showLogo ? (
                <View style={styles.blackScreen} />
            ) : (
                <Animated.View style={[
                    { 
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { rotate: spin }
                        ]
                    }
                ]}>
                    <Image
                        source={orbixaLogo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blackScreen: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    logo: {
        width: 280,
        height: 280,
        alignSelf: 'center',
    },
});

export default SplashScreen;