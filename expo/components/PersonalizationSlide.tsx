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
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface PersonalizationSlideProps {
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  options: Option[];
  selectedOptions: string[];
  onOptionSelect: (optionId: string) => void;
  multiSelect?: boolean;
}

export default function PersonalizationSlide({
  isActive,
  icon,
  title,
  subtitle,
  options,
  selectedOptions,
  onOptionSelect,
  multiSelect = false,
}: PersonalizationSlideProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const optionAnims = useRef(options.map(() => new Animated.Value(60))).current;

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
        optionAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
      scaleAnim.setValue(0.9);
      optionAnims.forEach((anim) => anim.setValue(60));
    }
  }, [isActive, fadeAnim, slideAnim, scaleAnim, optionAnims]);

  const handleOptionPress = (optionId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onOptionSelect(optionId);
  };

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
              colors={[Colors.primaryLight, '#E0F4FF']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {icon}
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <Animated.View
                key={option.id}
                style={{
                  transform: [{ translateY: optionAnims[index] }],
                  opacity: fadeAnim,
                }}
              >
                <TouchableOpacity
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleOptionPress(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    {option.icon && (
                      <View
                        style={[
                          styles.optionIconContainer,
                          isSelected && styles.optionIconContainerSelected,
                        ]}
                      >
                        {option.icon}
                      </View>
                    )}
                    <View style={styles.optionTextContainer}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text style={styles.optionDescription}>{option.description}</Text>
                      )}
                    </View>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Check size={14} color={Colors.white} strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {multiSelect && (
          <Animated.Text style={[styles.hint, { opacity: fadeAnim }]}>
            Select all that apply
          </Animated.Text>
        )}
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
    marginBottom: 20,
  },
  iconContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  iconGradient: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionIconContainerSelected: {
    backgroundColor: Colors.white,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.primaryDark,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
});
