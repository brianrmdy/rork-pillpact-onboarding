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
  Target,
  User,
  Calendar,
  Clock,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import OnboardingSlide from '@/components/OnboardingSlide';
import OnboardingPagination from '@/components/OnboardingPagination';
import FloatingElements from '@/components/FloatingElements';
import SignUpSlide from '@/components/SignUpSlide';
import PersonalizationSlide from '@/components/PersonalizationSlide';
import NotificationSlide from '@/components/NotificationSlide';
import PaywallSlide from '@/components/PaywallSlide';

const { width } = Dimensions.get('window');

const INTRO_SLIDES = [
  {
    id: 'welcome',
    icon: <Pill size={56} color={Colors.primary} strokeWidth={1.5} />,
    badge: 'JOIN 100K+ HAPPY USERS',
    title: 'Your Health, On Autopilot',
    subtitle: 'Smart medication tracking that fits your lifestyle. Effortless reminders that actually work.',
    stats: [
      { value: '97%', label: 'Success Rate' },
      { value: '4.8', label: 'Rating' },
      { value: '100K+', label: 'Active Users' },
    ],
  },
  {
    id: 'reminders',
    icon: <Bell size={56} color={Colors.primary} strokeWidth={1.5} />,
    title: 'Reminders That Feel Natural',
    highlight: 'Intelligent & Adaptive',
    subtitle: 'Smart scheduling learns your routine. Get timely nudges that integrate seamlessly into your day.',
  },
  {
    id: 'tracking',
    icon: <Heart size={56} color={Colors.primary} strokeWidth={1.5} />,
    title: 'See Your Wellness Journey',
    highlight: 'Beautiful Analytics',
    subtitle: 'Track patterns, build streaks, and celebrate wins. Beautifully designed insights that motivate.',
  },
  {
    id: 'family',
    icon: <Users size={56} color={Colors.primary} strokeWidth={1.5} />,
    title: 'Care for Those You Love',
    subtitle: 'Share progress with family seamlessly. Everyone stays informed, nobody feels monitored.',
    testimonial: {
      text: "MediFlow made it so easy to help my dad with his medications. The shared updates give me peace of mind every day.",
      author: 'Michael T.',
      role: 'Family Caregiver',
    },
  },
  {
    id: 'security',
    icon: <Shield size={56} color={Colors.primary} strokeWidth={1.5} />,
    badge: 'BANK-GRADE SECURITY',
    title: 'Your Data, Your Control',
    subtitle: 'Military-grade encryption. Zero data selling. Complete privacy. Your health information stays exclusively yours.',
    stats: [
      { value: 'AES-256', label: 'Encryption' },
      { value: 'Zero', label: 'Data Sharing' },
    ],
  },
];

const GOAL_OPTIONS = [
  { id: 'never_miss', label: 'Stay consistent with meds', icon: <Target size={22} color={Colors.primary} /> },
  { id: 'build_habit', label: 'Build healthy routines', icon: <Calendar size={22} color={Colors.accent} /> },
  { id: 'track_family', label: 'Support loved ones', icon: <Users size={22} color={Colors.trust} /> },
  { id: 'health_insights', label: 'Track my wellness', icon: <Heart size={22} color={Colors.error} /> },
];

const TRACKING_FOR_OPTIONS = [
  { id: 'myself', label: 'Just me', description: 'Personal health management', icon: <User size={22} color={Colors.primary} /> },
  { id: 'family', label: 'Me + family', description: 'Track for multiple people', icon: <Users size={22} color={Colors.accent} /> },
  { id: 'caregiving', label: 'Caregiver mode', description: 'Managing care for others', icon: <Heart size={22} color={Colors.trust} /> },
];

const MED_COUNT_OPTIONS = [
  { id: '1-2', label: '1-2 meds', icon: <Pill size={22} color={Colors.primary} /> },
  { id: '3-5', label: '3-5 meds', icon: <Pill size={22} color={Colors.accent} /> },
  { id: '6-10', label: '6-10 meds', icon: <Pill size={22} color={Colors.warning} /> },
  { id: '10+', label: '10+ meds', icon: <Pill size={22} color={Colors.trust} /> },
];

const SCHEDULE_OPTIONS = [
  { id: 'morning', label: 'Morning routine', icon: <Clock size={22} color={Colors.warning} /> },
  { id: 'afternoon', label: 'Afternoon', icon: <Clock size={22} color={Colors.primary} /> },
  { id: 'evening', label: 'Evening', icon: <Clock size={22} color={Colors.accent} /> },
  { id: 'multiple', label: 'Throughout the day', icon: <Clock size={22} color={Colors.trust} /> },
];

type SlideType = 'intro' | 'signup' | 'personalization' | 'notification' | 'paywall';

interface SlideConfig {
  type: SlideType;
  id: string;
}

const ALL_SLIDES: SlideConfig[] = [
  ...INTRO_SLIDES.map(s => ({ type: 'intro' as const, id: s.id })),
  { type: 'signup', id: 'signup' },
  { type: 'personalization', id: 'goals' },
  { type: 'personalization', id: 'tracking_for' },
  { type: 'personalization', id: 'med_count' },
  { type: 'personalization', id: 'schedule' },
  { type: 'notification', id: 'notification' },
  { type: 'paywall', id: 'paywall' },
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

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTrackingFor, setSelectedTrackingFor] = useState<string[]>([]);
  const [selectedMedCount, setSelectedMedCount] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);

  const currentSlide = ALL_SLIDES[currentIndex];
  const isLastSlide = currentIndex === ALL_SLIDES.length - 1;
  const isIntroSection = currentSlide?.type === 'intro';
  const isLastIntroSlide = currentIndex === INTRO_SLIDES.length - 1;

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

  const goToNextSlide = useCallback(() => {
    if (currentIndex < ALL_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isLastSlide) {
      console.log('Onboarding completed - navigate to main app');
    } else {
      goToNextSlide();
    }
  }, [isLastSlide, goToNextSlide]);

  const handleSkip = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const signupIndex = INTRO_SLIDES.length;
    scrollViewRef.current?.scrollTo({
      x: signupIndex * width,
      animated: true,
    });
    setCurrentIndex(signupIndex);
  }, []);

  const handleGoogleSignUp = useCallback(() => {
    console.log('Google sign up pressed');
    goToNextSlide();
  }, [goToNextSlide]);

  const handleAppleSignUp = useCallback(() => {
    console.log('Apple sign up pressed');
    goToNextSlide();
  }, [goToNextSlide]);

  const handleEmailSignUp = useCallback(() => {
    console.log('Email sign up pressed');
    goToNextSlide();
  }, [goToNextSlide]);

  const handleGoalSelect = useCallback((goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      }
      return [...prev, goalId];
    });
  }, []);

  const handleTrackingForSelect = useCallback((optionId: string) => {
    setSelectedTrackingFor([optionId]);
  }, []);

  const handleMedCountSelect = useCallback((optionId: string) => {
    setSelectedMedCount([optionId]);
  }, []);

  const handleScheduleSelect = useCallback((optionId: string) => {
    setSelectedSchedule(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      }
      return [...prev, optionId];
    });
  }, []);

  const handleEnableNotifications = useCallback(() => {
    console.log('Enable notifications pressed');
    goToNextSlide();
  }, [goToNextSlide]);

  const handleSkipNotifications = useCallback(() => {
    console.log('Skip notifications pressed');
    goToNextSlide();
  }, [goToNextSlide]);

  const handleSelectPlan = useCallback((plan: 'monthly' | 'yearly') => {
    console.log('Selected plan:', plan);
    console.log('Onboarding completed!');
  }, []);

  const handleRestorePurchase = useCallback(() => {
    console.log('Restore purchase pressed');
  }, []);

  const glowOpacity = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const canContinue = () => {
    if (!currentSlide) return true;
    
    if (currentSlide.type === 'personalization') {
      switch (currentSlide.id) {
        case 'goals':
          return selectedGoals.length > 0;
        case 'tracking_for':
          return selectedTrackingFor.length > 0;
        case 'med_count':
          return selectedMedCount.length > 0;
        case 'schedule':
          return selectedSchedule.length > 0;
        default:
          return true;
      }
    }
    return true;
  };

  const showContinueButton = currentSlide?.type === 'intro' || currentSlide?.type === 'personalization';
  const showSkipButton = isIntroSection && !isLastIntroSlide;

  const getButtonText = () => {
    if (isLastIntroSlide) return 'Get Started';
    if (currentSlide?.type === 'personalization') return 'Continue';
    return 'Continue';
  };

  const renderSlide = (slideConfig: SlideConfig, index: number) => {
    const isActive = currentIndex === index;

    switch (slideConfig.type) {
      case 'intro':
        const introSlide = INTRO_SLIDES.find(s => s.id === slideConfig.id);
        if (!introSlide) return null;
        return (
          <OnboardingSlide
            key={slideConfig.id}
            icon={introSlide.icon}
            title={introSlide.title}
            subtitle={introSlide.subtitle}
            highlight={introSlide.highlight}
            badge={introSlide.badge}
            stats={introSlide.stats}
            testimonial={introSlide.testimonial}
            isActive={isActive}
          />
        );

      case 'signup':
        return (
          <SignUpSlide
            key={slideConfig.id}
            isActive={isActive}
            onGooglePress={handleGoogleSignUp}
            onApplePress={handleAppleSignUp}
            onEmailPress={handleEmailSignUp}
          />
        );

      case 'personalization':
        if (slideConfig.id === 'goals') {
          return (
            <PersonalizationSlide
              key={slideConfig.id}
              isActive={isActive}
              icon={<Target size={44} color={Colors.primary} strokeWidth={1.5} />}
              title="What's your goal?"
              subtitle="We'll personalize MediFlow just for you"
              options={GOAL_OPTIONS}
              selectedOptions={selectedGoals}
              onOptionSelect={handleGoalSelect}
              multiSelect
            />
          );
        }
        if (slideConfig.id === 'tracking_for') {
          return (
            <PersonalizationSlide
              key={slideConfig.id}
              isActive={isActive}
              icon={<User size={44} color={Colors.primary} strokeWidth={1.5} />}
              title="Who's this for?"
              subtitle="Tailor the experience to your situation"
              options={TRACKING_FOR_OPTIONS}
              selectedOptions={selectedTrackingFor}
              onOptionSelect={handleTrackingForSelect}
            />
          );
        }
        if (slideConfig.id === 'med_count') {
          return (
            <PersonalizationSlide
              key={slideConfig.id}
              isActive={isActive}
              icon={<Pill size={44} color={Colors.primary} strokeWidth={1.5} />}
              title="How many meds?"
              subtitle="We'll optimize your dashboard layout"
              options={MED_COUNT_OPTIONS}
              selectedOptions={selectedMedCount}
              onOptionSelect={handleMedCountSelect}
            />
          );
        }
        if (slideConfig.id === 'schedule') {
          return (
            <PersonalizationSlide
              key={slideConfig.id}
              isActive={isActive}
              icon={<Clock size={44} color={Colors.primary} strokeWidth={1.5} />}
              title="What's your schedule?"
              subtitle="Choose all that apply to your routine"
              options={SCHEDULE_OPTIONS}
              selectedOptions={selectedSchedule}
              onOptionSelect={handleScheduleSelect}
              multiSelect
            />
          );
        }
        return null;

      case 'notification':
        return (
          <NotificationSlide
            key={slideConfig.id}
            isActive={isActive}
            onEnablePress={handleEnableNotifications}
            onSkipPress={handleSkipNotifications}
          />
        );

      case 'paywall':
        return (
          <PaywallSlide
            key={slideConfig.id}
            isActive={isActive}
            onSelectPlan={handleSelectPlan}
            onRestore={handleRestorePurchase}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F5', '#FFFFFF', '#F0FDFA', '#FFF5F5']}
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
          <Text style={styles.logoText}>MediFlow</Text>
        </View>
        
        {showSkipButton && (
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
        scrollEnabled={currentSlide?.type !== 'signup' && currentSlide?.type !== 'notification' && currentSlide?.type !== 'paywall'}
      >
        {ALL_SLIDES.map((slide, index) => renderSlide(slide, index))}
      </Animated.ScrollView>

      <Animated.View 
        style={[
          styles.footer, 
          { 
            paddingBottom: Math.max(insets.bottom, 16) + 24,
            transform: [{ translateY: footerSlide }],
          }
        ]}
      >
{currentSlide?.type !== 'paywall' && (
          <OnboardingPagination
            total={ALL_SLIDES.length}
            currentIndex={currentIndex}
            scrollX={scrollX}
            width={width}
          />
        )}

        {showContinueButton && (
          <>
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
                  style={[
                    styles.button, 
                    isLastIntroSlide && styles.buttonFinal,
                    !canContinue() && styles.buttonDisabled,
                  ]}
                  onPress={handleNext}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={1}
                  disabled={!canContinue()}
                >
                  <LinearGradient
                    colors={isLastIntroSlide ? [Colors.accent, '#3DBDB5'] : [Colors.primary, Colors.primaryDark]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isLastIntroSlide ? (
                      <>
                        <Sparkles size={20} color={Colors.white} strokeWidth={2} />
                        <Text style={styles.buttonText}>{getButtonText()}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.buttonText}>{getButtonText()}</Text>
                        <ArrowRight size={20} color={Colors.white} strokeWidth={2.5} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {isLastIntroSlide && (
              <Animated.View style={styles.trustBadges}>
                <View style={styles.trustBadge}>
                  <View style={styles.trustIconContainer}>
                    <Star size={10} color={Colors.warning} fill={Colors.warning} />
                  </View>
                  <Text style={styles.trustText}>4.8</Text>
                </View>
                <View style={styles.trustDivider} />
                <View style={styles.trustBadge}>
                  <View style={[styles.trustIconContainer, styles.trustIconShield]}>
                    <Shield size={10} color={Colors.accent} />
                  </View>
                  <Text style={styles.trustText}>Secure</Text>
                </View>
                <View style={styles.trustDivider} />
                <View style={styles.trustBadge}>
                  <View style={[styles.trustIconContainer, styles.trustIconCheck]}>
                    <CheckCircle size={10} color={Colors.primary} />
                  </View>
                  <Text style={styles.trustText}>Free</Text>
                </View>
              </Animated.View>
            )}

            {isIntroSection && !isLastIntroSlide && (
              <Text style={styles.swipeHint}>Swipe to explore</Text>
            )}
          </>
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
    flexGrow: 1,
    paddingTop: 0,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
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
  buttonDisabled: {
    opacity: 0.5,
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
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trustIconContainer: {
    width: 18,
    height: 18,
    borderRadius: 9,
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
    fontSize: 11,
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
    marginTop: 2,
    marginBottom: 4,
  },
});
