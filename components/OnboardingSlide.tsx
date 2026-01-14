import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: string;
  badge?: string;
  stats?: { value: string; label: string }[];
  testimonial?: { text: string; author: string; role: string };
  isActive: boolean;
  slideType?: 'welcome' | 'feature' | 'social' | 'trust';
}

export default function OnboardingSlide({
  icon,
  title,
  subtitle,
  highlight,
  badge,
  stats,
  testimonial,
  isActive,
  slideType = 'feature',
}: OnboardingSlideProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const statsSlide = useRef(new Animated.Value(40)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

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
      ]).start();

      Animated.sequence([
        Animated.delay(100),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.delay(200),
        Animated.spring(titleSlide, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.delay(350),
        Animated.spring(subtitleSlide, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.delay(500),
        Animated.spring(statsSlide, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(iconPulse, {
            toValue: 1.08,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(iconPulse, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(iconRotate, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(iconRotate, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ringScale, {
              toValue: 1.5,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(ringScale, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity, {
              toValue: 0.4,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
      scaleAnim.setValue(0.8);
      titleSlide.setValue(30);
      subtitleSlide.setValue(30);
      statsSlide.setValue(40);
      iconPulse.setValue(1);
      iconRotate.setValue(0);
      ringScale.setValue(0.8);
      ringOpacity.setValue(0);
    }
  }, [isActive, fadeAnim, slideAnim, scaleAnim, iconPulse, iconRotate, titleSlide, subtitleSlide, statsSlide, ringScale, ringOpacity]);

  const iconRotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
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
        {badge && (
          <Animated.View 
            style={[
              styles.badge,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <LinearGradient
              colors={[Colors.accentLight, '#E0FFF4']}
              style={styles.badgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>{badge}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [
                { translateY: slideAnim },
                { scale: iconPulse },
                { rotate: iconRotation },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.iconRing,
              {
                transform: [{ scale: ringScale }],
                opacity: ringOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.iconRing,
              styles.iconRingOuter,
              {
                transform: [{ scale: Animated.add(ringScale, 0.3) }],
                opacity: Animated.multiply(ringOpacity, 0.5),
              },
            ]}
          />
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[Colors.primaryLight, '#E0F4FF']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {icon}
            </LinearGradient>
          </View>
          <View style={styles.iconAccent} />
          <View style={styles.iconAccentSmall} />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            { transform: [{ translateY: titleSlide }] }
          ]}
        >
          <Text style={styles.title}>{title}</Text>
        </Animated.View>
        
        {highlight && (
          <Animated.View 
            style={[
              styles.highlightContainer,
              { transform: [{ translateY: titleSlide }] }
            ]}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.highlightGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.highlight}>{highlight}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.Text 
          style={[
            styles.subtitle,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: subtitleSlide }] 
            }
          ]}
        >
          {subtitle}
        </Animated.Text>

        {stats && (
          <Animated.View 
            style={[
              styles.statsContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: statsSlide }] 
              }
            ]}
          >
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <LinearGradient
                  colors={['#FFFFFF', Colors.backgroundSecondary]}
                  style={styles.statGradient}
                >
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </View>
            ))}
          </Animated.View>
        )}

        {testimonial && (
          <Animated.View 
            style={[
              styles.testimonialContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: statsSlide }] 
              }
            ]}
          >
            <View style={styles.quoteIcon}>
              <Text style={styles.quoteText}>&ldquo;</Text>
            </View>
            <Text style={styles.testimonialText}>{testimonial.text}</Text>
            <View style={styles.testimonialAuthor}>
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                style={styles.testimonialAvatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.testimonialAvatarText}>
                  {testimonial.author.charAt(0)}
                </Text>
              </LinearGradient>
              <View>
                <Text style={styles.testimonialName}>{testimonial.author}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  iconWrapper: {
    marginBottom: 32,
    position: 'relative',
  },
  iconRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.primary,
    top: -10,
    left: -10,
  },
  iconRingOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -20,
    left: -20,
  },
  iconContainer: {
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  iconGradient: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
  },
  iconAccent: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    top: -4,
    right: -4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconAccentSmall: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.warning,
    bottom: 8,
    left: -6,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  highlightContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  highlightGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  highlight: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
    letterSpacing: 0.2,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 16,
  },
  statItem: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statGradient: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    minWidth: 95,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600' as const,
  },
  testimonialContainer: {
    marginTop: 28,
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: 12,
    left: 16,
  },
  quoteText: {
    fontSize: 48,
    color: Colors.primaryLight,
    fontWeight: '700' as const,
    lineHeight: 48,
  },
  testimonialText: {
    fontSize: 16,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  testimonialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialAvatarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  testimonialName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  testimonialRole: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
