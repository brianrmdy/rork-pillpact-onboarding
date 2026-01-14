import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface SignUpSlideProps {
  isActive: boolean;
  onGooglePress: () => void;
  onApplePress: () => void;
  onEmailPress: () => void;
}

export default function SignUpSlide({
  isActive,
  onGooglePress,
  onApplePress,
  onEmailPress,
}: SignUpSlideProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const buttonSlide1 = useRef(new Animated.Value(60)).current;
  const buttonSlide2 = useRef(new Animated.Value(60)).current;
  const buttonSlide3 = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const sparkleRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.stagger(100, [
        Animated.spring(buttonSlide1, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlide2, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlide3, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.timing(sparkleRotate, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
      buttonSlide1.setValue(60);
      buttonSlide2.setValue(60);
      buttonSlide3.setValue(60);
      scaleAnim.setValue(0.9);
      sparkleRotate.setValue(0);
    }
  }, [isActive, fadeAnim, slideAnim, scaleAnim, buttonSlide1, buttonSlide2, buttonSlide3, sparkleRotate]);

  const handlePress = (callback: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    callback();
  };

  const rotation = sparkleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={[styles.iconWrapper, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[Colors.accent, '#059669']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Sparkles size={48} color={Colors.white} strokeWidth={1.5} />
              </Animated.View>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Start your journey to better medication adherence in seconds
          </Text>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ translateY: buttonSlide1 }], opacity: fadeAnim }}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handlePress(onGooglePress)}
              activeOpacity={0.8}
            >
              <View style={styles.socialIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateY: buttonSlide2 }], opacity: fadeAnim }}>
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handlePress(onApplePress)}
              activeOpacity={0.8}
            >
              <View style={[styles.socialIconContainer, styles.appleIconContainer]}>
                <Text style={styles.appleIcon}></Text>
              </View>
              <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Animated.View style={{ transform: [{ translateY: buttonSlide3 }], opacity: fadeAnim }}>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => handlePress(onEmailPress)}
              activeOpacity={0.8}
            >
              <Mail size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.emailButtonText}>Sign up with Email</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View style={[styles.termsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: width - 48,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  iconContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  iconGradient: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  appleButton: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  socialIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  appleIconContainer: {
    backgroundColor: Colors.white,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 18,
    color: Colors.text,
    marginTop: -2,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginRight: 42,
  },
  appleButtonText: {
    color: Colors.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500' as const,
    marginHorizontal: 16,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  termsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
});
