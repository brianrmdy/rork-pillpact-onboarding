import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Pill, Heart, Shield, Bell, Check, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface FloatingElement {
  icon: React.ReactNode;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

const ELEMENTS: FloatingElement[] = [
  { icon: 'pill', startX: width * 0.1, startY: height * 0.15, size: 24, duration: 3000, delay: 0, color: Colors.primary, opacity: 0.15 },
  { icon: 'heart', startX: width * 0.85, startY: height * 0.12, size: 20, duration: 3500, delay: 200, color: '#FF6B8A', opacity: 0.2 },
  { icon: 'shield', startX: width * 0.08, startY: height * 0.55, size: 22, duration: 4000, delay: 400, color: Colors.accent, opacity: 0.15 },
  { icon: 'bell', startX: width * 0.88, startY: height * 0.45, size: 18, duration: 3200, delay: 600, color: Colors.warning, opacity: 0.2 },
  { icon: 'check', startX: width * 0.15, startY: height * 0.75, size: 16, duration: 2800, delay: 800, color: Colors.success, opacity: 0.18 },
  { icon: 'sparkles', startX: width * 0.82, startY: height * 0.7, size: 20, duration: 3600, delay: 1000, color: '#FFD700', opacity: 0.22 },
  { icon: 'pill', startX: width * 0.92, startY: height * 0.28, size: 16, duration: 3400, delay: 300, color: Colors.primaryDark, opacity: 0.12 },
  { icon: 'heart', startX: width * 0.05, startY: height * 0.35, size: 14, duration: 3800, delay: 500, color: '#FF8FAB', opacity: 0.16 },
];

function FloatingIcon({ element }: { element: FloatingElement }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = element.duration;
    const delay = element.delay;

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: delay,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: duration * 1.5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: duration * 1.5,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [element.delay, element.duration, floatAnim, rotateAnim, scaleAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const translateX = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 8, 0],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const renderIcon = () => {
    const props = { size: element.size, color: element.color, strokeWidth: 2 };
    switch (element.icon) {
      case 'pill': return <Pill {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'shield': return <Shield {...props} />;
      case 'bell': return <Bell {...props} />;
      case 'check': return <Check {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      default: return <Pill {...props} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          left: element.startX,
          top: element.startY,
          opacity: element.opacity,
          transform: [
            { translateY },
            { translateX },
            { rotate },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {renderIcon()}
    </Animated.View>
  );
}

export default function FloatingElements() {
  return (
    <View style={styles.container} pointerEvents="none">
      {ELEMENTS.map((element, index) => (
        <FloatingIcon key={index} element={element} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingElement: {
    position: 'absolute',
  },
});
