import React, { useEffect, useRef, useState } from 'react';
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
import {
  Crown,
  Check,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface PaywallSlideProps {
  isActive: boolean;
  onSelectPlan: (plan: 'monthly' | 'yearly') => void;
  onRestore: () => void;
}

const FEATURES = [
  { icon: <Zap size={18} color={Colors.primary} />, text: 'Unlimited medication tracking' },
  { icon: <Users size={18} color={Colors.accent} />, text: 'Family sharing (up to 5 members)' },
  { icon: <TrendingUp size={18} color={Colors.warning} />, text: 'Advanced analytics & insights' },
  { icon: <Shield size={18} color={Colors.trust} />, text: 'Priority support & cloud backup' },
];

export default function PaywallSlide({
  isActive,
  onSelectPlan,
  onRestore,
}: PaywallSlideProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const crownPulse = useRef(new Animated.Value(1)).current;
  const featureSlides = useRef(FEATURES.map(() => new Animated.Value(40))).current;
  const planSlide = useRef(new Animated.Value(60)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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

      Animated.stagger(
        80,
        featureSlides.map((anim) =>
          Animated.spring(anim, {
            toValue: 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          })
        )
      ).start();

      Animated.sequence([
        Animated.delay(300),
        Animated.spring(planSlide, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(crownPulse, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(crownPulse, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
      scaleAnim.setValue(0.9);
      crownPulse.setValue(1);
      planSlide.setValue(60);
      shimmerAnim.setValue(0);
      featureSlides.forEach((anim) => anim.setValue(40));
    }
  }, [isActive, fadeAnim, slideAnim, scaleAnim, crownPulse, planSlide, shimmerAnim, featureSlides]);

  const handlePlanSelect = (plan: 'monthly' | 'yearly') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSelectPlan(selectedPlan);
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
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
          <Animated.View style={{ transform: [{ scale: crownPulse }] }}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Crown size={44} color={Colors.white} strokeWidth={1.5} />
              </LinearGradient>
            </View>
          </Animated.View>
          <View style={styles.premiumBadge}>
            <Sparkles size={12} color={Colors.white} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Unlock PillPact Pro</Text>
          <Text style={styles.subtitle}>
            Get the most out of your medication journey with premium features
          </Text>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureRow,
                {
                  transform: [{ translateY: featureSlides[index] }],
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.featureIcon}>{feature.icon}</View>
              <Text style={styles.featureText}>{feature.text}</Text>
              <Check size={16} color={Colors.accent} strokeWidth={3} />
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={[
            styles.plansContainer,
            {
              transform: [{ translateY: planSlide }],
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
            onPress={() => handlePlanSelect('yearly')}
            activeOpacity={0.8}
          >
            {selectedPlan === 'yearly' && (
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View style={[styles.radioOuter, selectedPlan === 'yearly' && styles.radioOuterSelected]}>
                {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, selectedPlan === 'yearly' && styles.planNameSelected]}>
                  Yearly
                </Text>
                <Text style={styles.planSavings}>Save 58%</Text>
              </View>
            </View>
            <View style={styles.planPricing}>
              <Text style={[styles.planPrice, selectedPlan === 'yearly' && styles.planPriceSelected]}>
                $29.99
              </Text>
              <Text style={styles.planPeriod}>/year</Text>
            </View>
            <Text style={styles.planMonthly}>$2.50/month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
            onPress={() => handlePlanSelect('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <View style={[styles.radioOuter, selectedPlan === 'monthly' && styles.radioOuterSelected]}>
                {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, selectedPlan === 'monthly' && styles.planNameSelected]}>
                  Monthly
                </Text>
              </View>
            </View>
            <View style={styles.planPricing}>
              <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.planPriceSelected]}>
                $5.99
              </Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.ctaContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={[
                  styles.shimmer,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
              <Text style={styles.ctaText}>Start 7-Day Free Trial</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.trialInfo}>
            Cancel anytime. You won&apos;t be charged until the trial ends.
          </Text>

          <Text style={styles.noPaymentText}>No Payment Due Now</Text>

          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={onRestore}>
              <Text style={styles.linkText}>Restore Purchase</Text>
            </TouchableOpacity>
            <View style={styles.linkDivider} />
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms</Text>
            </TouchableOpacity>
            <View style={styles.linkDivider} />
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: width - 48,
  },
  iconWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  iconContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  iconGradient: {
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  premiumBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  featuresContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  plansContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  planCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.warning,
    backgroundColor: '#FFFBEB',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: Colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bestValueText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: Colors.warning,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.warning,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  planNameSelected: {
    color: '#92400E',
  },
  planSavings: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  planPriceSelected: {
    color: '#92400E',
  },
  planPeriod: {
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  planMonthly: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    width: 100,
    height: '200%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '25deg' }],
  },
  ctaText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  trialInfo: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  linkText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  linkDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
  },
  noPaymentText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.accent,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
});
