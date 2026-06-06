import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { AppText } from './AppText';
import { colors, gradients, radius, shadows, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
};

/**
 * Primary action button. Coral gradient by default, with a quick spring press
 * and a light haptic tap so every action feels deliberate and fast.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  fullWidth = true,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const spring = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  const handlePress = () => {
    if (disabled || loading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const textColor =
    variant === 'secondary'
      ? colors.primary
      : variant === 'ghost'
        ? colors.textMuted
        : colors.textInverse;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <AppText style={styles.icon}>{icon}</AppText> : null}
          <AppText variant="button" color={textColor}>
            {label}
          </AppText>
        </>
      )}
    </View>
  );

  const innerStyle: ViewStyle = {
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  return (
    <Animated.View
      style={[{ transform: [{ scale }] }, fullWidth && styles.full, style]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => spring(0.96)}
        onPressOut={() => spring(1)}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {variant === 'primary' || variant === 'dark' ? (
          <LinearGradient
            colors={variant === 'dark' ? gradients.dusk : gradients.sunset}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, shadows.subtle, innerStyle]}
          >
            {content}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.base,
              variant === 'secondary' ? styles.secondary : styles.ghost,
              innerStyle,
            ]}
          >
            {content}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  full: { width: '100%' },
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { fontSize: 18 },
});
