import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    FlatList,
    Dimensions // Add this import
} from 'react-native';
import { OnboardingData } from '../Data/OnboardingData';

const { width } = Dimensions.get('window'); // Get screen width

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < OnboardingData.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.navigate('PhoneLogin');
        }
    };

    const updateCurrentSlideIndex = (e: any) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentIndex(currentIndex);
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={slidesRef}
                data={OnboardingData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width }]}> {/* Use width here */}
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {OnboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentIndex === index && styles.activeIndicator
                            ]}
                        />
                    ))}
                </View>
                <Pressable style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {currentIndex === OnboardingData.length - 1 ? "Get Started" : "Next"}
                    </Text>
                </Pressable>
            </View>
        </  View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        height: '60%',
        width: '100%',
        resizeMode: 'contain',
        marginTop: 50,
    },
    textContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 30,
    },
    footer: {
        marginBottom: 50,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    indicator: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#000',
        width: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;