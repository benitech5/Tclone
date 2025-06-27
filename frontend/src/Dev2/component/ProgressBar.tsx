import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ProgressBarProps {
  duration: number; // in milliseconds
  onComplete: () => void;
  isActive: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, onComplete, isActive }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Start the animation
      Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false, // width animation doesn't support native driver
      }).start(({ finished }) => {
        if (finished) {
          onComplete();
        }
      });
    } else {
      // Reset or pause the animation
      progress.setValue(0);
    }
  }, [isActive, duration]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.background}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: 3,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  fill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});

export default ProgressBar; 