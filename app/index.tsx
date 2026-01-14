import React, { useState, useRef, useCallback } from 'react';
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
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import OnboardingSlide from '@/components/OnboardingSlide';
import OnboardingPagination from '@/components/OnboardingPagination';

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

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, []);

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#FFFFFF', '#F8FAFC']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Pill size={20} color={Colors.white} strokeWidth={2} />
          </View>
          <Text style={styles.logoText}>PillPact</Text>
        </View>
        
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

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

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <OnboardingPagination
          total={SLIDES.length}
          currentIndex={currentIndex}
          scrollX={scrollX}
          width={width}
        />

        <TouchableOpacity
          style={[styles.button, isLastSlide && styles.buttonFinal]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isLastSlide ? (
              <>
                <CheckCircle size={20} color={Colors.white} strokeWidth={2} />
                <Text style={styles.buttonText}>Get Started Free</Text>
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>Continue</Text>
                <ArrowRight size={20} color={Colors.white} strokeWidth={2} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {isLastSlide && (
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Star size={14} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.trustText}>4.9 Rating</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustBadge}>
              <Shield size={14} color={Colors.accent} />
              <Text style={styles.trustText}>HIPAA Compliant</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  scrollContent: {
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonFinal: {
    shadowOpacity: 0.4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
  },
});
