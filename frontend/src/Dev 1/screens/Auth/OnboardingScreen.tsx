import React, { useState, useRef } from 'react';
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
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
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
                            currentIndex === index && styles.activeIndicator,
                        ]}
                    />
                ))}
            </View>

            {/* Always show Next and Skip buttons for debugging */}
            <View style={styles.buttonRow}>
                <Pressable
                    style={[styles.button, styles.skipButton]}
                    onPress={() => {
                        setCurrentIndex(onboardingData.length - 1);
                        slidesRef.current?.scrollToIndex({ index: onboardingData.length - 1 });
                    }}
                >
                    <Text style={styles.buttonText}>Skip</Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        const nextIndex = currentIndex + 1;
                        setCurrentIndex(nextIndex);
                        slidesRef.current?.scrollToIndex({ index: nextIndex });
                    }}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </Pressable>
            </View>

            {currentIndex === onboardingData.length - 1 && (
                <View style={styles.footer}>
                    <Pressable style={styles.button} onPress={handleGetStarted}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCDD2', // light red
    },
    slide: {
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    textContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    indicator: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#000',
        width: 16,
    },
    footer: {
        paddingVertical: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        marginBottom: 20,
        zIndex: 2,
        borderWidth: 2,
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.1)',
    },
    skipButton: {
        backgroundColor: '#aaa',
        marginRight: 10,
    },
});

export default OnboardingScreen;
