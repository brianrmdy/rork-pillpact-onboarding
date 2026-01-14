import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Pill,
  Shield,
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import OnboardingSlide from '@/components/OnboardingSlide';
import OnboardingPagination from '@/components/OnboardingPagination';
import FloatingElements from '@/components/FloatingElements';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 'welcome',
    icon: <Pill size={56} color={Colors.primary} strokeWidth={1.5} />,
    badge: 'TRUSTED BY 50,000+ USERS',
    title: 'Never Miss a Dose Again',
    subtitle: 'Join thousands who have transformed their medication routine with smart, reliable reminders.',
    stats: [
      { value: '98%', label: 'Adherence' },
      { value: '4.9', label: 'App Rating' },
      { value: '50K+', label: 'Users' },
    ],
  },
  {
    id: 'reminders',
    icon: <Bell size={56} color={Colors.primary} strokeWidth={1.5} />,
    title: 'Smart Reminders That Work',
    highlight: 'Personalized for you',
    subtitle: 'Set flexible schedules that adapt to your life. Get gentle nudges at the perfect time—never intrusive, always helpful.',
  },
  {
    id: 'tracking',
    icon: <Heart size={56} color={Colors.primary} strokeWidth={1.5} />,
    title: 'Track Your Progress',
    highlight: 'Visual insights',
    subtitle: 'See your adherence history at a glance. Celebrate streaks and stay motivated with clear, beautiful reports.',
  },
  {
    id: 'family',
    icon: <Users size={56} color={Colors.primary} strokeWidth={1.5} />,
    title: 'Peace of Mind for Loved Ones',
    subtitle: 'Optionally share updates with family or caregivers. They can check in without being intrusive.',
    testimonial: {
      text: "PillPact helped my mother stay on track with her heart medication. I get peace of mind knowing she's taken care of.",
      author: 'Sarah M.',
      role: 'Family Caregiver',
    },
  },
  {
    id: 'security',
    icon: <Shield size={56} color={Colors.primary} strokeWidth={1.5} />,
    badge: 'HIPAA COMPLIANT',
    title: 'Your Privacy, Protected',
    subtitle: 'Bank-level encryption keeps your health data safe. We never sell your information. Your health journey stays yours.',
    stats: [
      { value: '256-bit', label: 'Encryption' },
      { value: '100%', label: 'Private' },
    ],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const footerSlide = useRef(new Animated.Value(50)).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(footerSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonGlow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [headerOpacity, footerSlide, buttonGlow]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const handleNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isLastSlide) {
      console.log('Onboarding completed - navigate to main app');
    } else {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, isLastSlide]);

  const handleSkip = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Skipped onboarding - navigate to main app');
  }, []);

  const glowOpacity = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0F9FF', '#FFFFFF', '#F8FAFC', '#F0FDF4']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
      />

      <FloatingElements />

      <View style={styles.backgroundShapes}>
        <View style={[styles.backgroundCircle, styles.circleTopRight]} />
        <View style={[styles.backgroundCircle, styles.circleBottomLeft]} />
      </View>

      <Animated.View style={[styles.header, { paddingTop: insets.top + 16, opacity: headerOpacity }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Pill size={18} color={Colors.white} strokeWidth={2.5} />
            </LinearGradient>
          </View>
          <Text style={styles.logoText}>PillPact</Text>
        </View>
        
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
            <ArrowRight size={14} color={Colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide
            key={slide.id}
            icon={slide.icon}
            title={slide.title}
            subtitle={slide.subtitle}
            highlight={slide.highlight}
            badge={slide.badge}
            stats={slide.stats}
            testimonial={slide.testimonial}
            isActive={currentIndex === index}
          />
        ))}
      </Animated.ScrollView>

      <Animated.View 
        style={[
          styles.footer, 
          { 
            paddingBottom: insets.bottom + 24,
            transform: [{ translateY: footerSlide }],
          }
        ]}
      >
        <OnboardingPagination
          total={SLIDES.length}
          currentIndex={currentIndex}
          scrollX={scrollX}
          width={width}
        />

        <View style={styles.buttonContainer}>
          <Animated.View
            style={[
              styles.buttonGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: buttonScale }],
              },
            ]}
          />
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, isLastSlide && styles.buttonFinal]}
              onPress={handleNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <LinearGradient
                colors={isLastSlide ? [Colors.accent, '#059669'] : [Colors.primary, Colors.primaryDark]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLastSlide ? (
                  <>
                    <Sparkles size={20} color={Colors.white} strokeWidth={2} />
                    <Text style={styles.buttonText}>Get Started Free</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.buttonText}>Continue</Text>
                    <ArrowRight size={20} color={Colors.white} strokeWidth={2.5} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {isLastSlide && (
          <Animated.View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <View style={styles.trustIconContainer}>
                <Star size={12} color={Colors.warning} fill={Colors.warning} />
              </View>
              <Text style={styles.trustText}>4.9 Rating</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustBadge}>
              <View style={[styles.trustIconContainer, styles.trustIconShield]}>
                <Shield size={12} color={Colors.accent} />
              </View>
              <Text style={styles.trustText}>HIPAA Compliant</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustBadge}>
              <View style={[styles.trustIconContainer, styles.trustIconCheck]}>
                <CheckCircle size={12} color={Colors.primary} />
              </View>
              <Text style={styles.trustText}>No Payment</Text>
            </View>
          </Animated.View>
        )}

        {!isLastSlide && (
          <Text style={styles.swipeHint}>Swipe to explore</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundShapes: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  circleTopRight: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    backgroundColor: Colors.primaryLight,
    opacity: 0.4,
  },
  circleBottomLeft: {
    width: 250,
    height: 250,
    bottom: -80,
    left: -80,
    backgroundColor: Colors.accentLight,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoGradient: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  scrollContent: {
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  buttonContainer: {
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
    backgroundColor: Colors.primary,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonFinal: {
    shadowColor: Colors.accent,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trustIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustIconShield: {
    backgroundColor: Colors.accentLight,
  },
  trustIconCheck: {
    backgroundColor: Colors.primaryLight,
  },
  trustText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500' as const,
    marginTop: 4,
  },
});
