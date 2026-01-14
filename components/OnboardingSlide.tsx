import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
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
}: OnboardingSlideProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      scaleAnim.setValue(0.9);
    }
  }, [isActive, fadeAnim, slideAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}

        <View style={styles.iconContainer}>{icon}</View>

        <Text style={styles.title}>{title}</Text>
        
        {highlight && (
          <View style={styles.highlightContainer}>
            <Text style={styles.highlight}>{highlight}</Text>
          </View>
        )}

        <Text style={styles.subtitle}>{subtitle}</Text>

        {stats && (
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {testimonial && (
          <View style={styles.testimonialContainer}>
            <Text style={styles.testimonialText}>&ldquo;{testimonial.text}&rdquo;</Text>
            <View style={styles.testimonialAuthor}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialAvatarText}>
                  {testimonial.author.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>{testimonial.author}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  highlightContainer: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  highlight: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 90,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  testimonialContainer: {
    marginTop: 32,
    backgroundColor: Colors.backgroundSecondary,
    padding: 24,
    borderRadius: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  testimonialText: {
    fontSize: 16,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialAvatarText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  testimonialRole: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
