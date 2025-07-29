import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";

const SplashScreen = ({ navigation }: any) => {
  const [showLogo, setShowLogo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Show black screen for 1 second
    const blackTimeout = setTimeout(() => {
      setShowLogo(true);
      // Fade in logo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Navigate to Onboarding after 2 seconds
    const navTimeout = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2000);

    return () => {
      clearTimeout(blackTimeout);
      clearTimeout(navTimeout);
    };
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      {!showLogo ? (
        <View style={styles.blackScreen} />
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={require("../../../../assets/test-assets/orbixa.png")}
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
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  blackScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
});

export default SplashScreen;
