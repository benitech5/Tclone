import React, { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { onboardingData } from '../../Data/OnboardingData';

const { width } = Dimensions.get('window');

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef<FlatList>(null);

    const handleGetStarted = () => {
        navigation.navigate('Auth', { screen: 'PhoneLogin' });
    };

    const updateCurrentSlideIndex = (e: any) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentSlideIndex = Math.round(contentOffsetX / width);
        setCurrentIndex(currentSlideIndex);
    };

    const renderSlide = ({ item }: { item: typeof onboardingData[0] }) => (
        <View style={[styles.slide, { width }]}> 
            <View style={styles.iconContainer}>
                <LinearGradient
                    colors={["#C94FCF", "#1E4DB7"]}
                    style={styles.gradientCircle}
                >
                    <MaterialCommunityIcons name="timer-sand" size={80} color="#fff" />
                </LinearGradient>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title.toUpperCase()}</Text>
                <Text style={styles.description}>
                    <Text style={{ fontWeight: 'bold' }}>Orbixa</Text> delivers messages at lightning speed, ensuring your chats and media reach their destination instantly without any lag.
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={onboardingData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onScroll={updateCurrentSlideIndex}
                ref={slidesRef}
                renderItem={renderSlide}
            />

            <View style={styles.indicatorContainer}>
                {onboardingData.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentIndex === index ? styles.activeIndicator : null,
                        ]}
                    />
                ))}
            </View>

            {/* Show Start Messaging only on last slide */}
            {currentIndex === onboardingData.length - 1 && (
                <View style={styles.footer}>
                    <Pressable style={styles.startButton} onPress={handleGetStarted}>
                        <Text style={styles.startButtonText}>Start Messaging</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 80,
        width: '100%',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    gradientCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#C94FCF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    textContainer: {
        marginTop: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 1.5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#222',
        marginBottom: 40,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        marginTop: 0,
    },
    indicator: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#A9A9A9',
        marginHorizontal: 4,
        // transition removed; not supported in React Native
    },
    activeIndicator: {
        backgroundColor: '#E53935',
        width: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#E53935',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignSelf: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

export default OnboardingScreen;

