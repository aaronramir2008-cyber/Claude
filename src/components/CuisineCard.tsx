import { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { AppText } from './AppText';
import { colors, radius, shadows, spacing } from '@/theme';
import type { Cuisine } from '@/data/cuisines';

type Props = {
  cuisine: Cuisine;
  onPick: (cuisine: Cuisine) => void;
};

/** A single tappable cuisine in the Pass-the-Phone deck. */
export function CuisineCard({ cuisine, onPick }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const press = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.05, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start(() => onPick(cuisine));
  };

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={cuisine.label}>
        <LinearGradient
          colors={cuisine.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, shadows.card]}
        >
          <AppText style={styles.emoji}>{cuisine.emoji}</AppText>
          <AppText variant="heading" color={colors.sand}>
            {cuisine.label}
          </AppText>
          <AppText variant="caption" color="rgba(244,237,227,0.85)">
            {cuisine.blurb}
          </AppText>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 150,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  emoji: { fontSize: 40 },
});
