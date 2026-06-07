import { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { MacroBar } from './MacroBar';
import { colors, gradients, radius, shadows, spacing } from '@/theme';
import { timeAgo } from '@/lib/time';
import type { FeedPost } from '@/types';

const REACTIONS = ['🔥', '😍', '💪', '👏'] as const;

export function PostCard({ post }: { post: FeedPost }) {
  const [reaction, setReaction] = useState<string | null>(null);
  const [count, setCount] = useState(() => 3 + Math.floor(Math.random() * 40));

  const react = (emoji: string) => {
    setReaction((prev) => {
      if (prev === emoji) {
        setCount((c) => c - 1);
        return null;
      }
      if (!prev) setCount((c) => c + 1);
      return emoji;
    });
  };

  return (
    <View style={[styles.card, shadows.card]}>
      {/* Image with warm gradient underlay so it never reads as a blank box */}
      <View style={styles.media}>
        <LinearGradient colors={gradients.sunset} style={StyleSheet.absoluteFill} />
        {post.imageUrl ? (
          <Image source={{ uri: post.imageUrl }} style={StyleSheet.absoluteFill} />
        ) : null}
        {post.isSponsored ? (
          <View style={styles.sponsorTag}>
            <Ionicons name="storefront" size={12} color={colors.depth} />
            <AppText variant="overline" color={colors.depth}>
              SPONSORED
            </AppText>
          </View>
        ) : null}
        {post.cuisine ? (
          <View style={styles.cuisineTag}>
            <AppText variant="overline" color={colors.textInverse}>
              {post.cuisine.toUpperCase()}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Avatar name={post.authorName} uri={post.authorAvatar} size={40} />
          <View style={styles.flex}>
            <AppText variant="label">{post.authorName}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {post.isSponsored ? 'Local partner' : timeAgo(post.createdAt)}
            </AppText>
          </View>
          {post.isSponsored ? (
            <Pressable style={styles.cta}>
              <AppText variant="label" color={colors.textInverse}>
                View
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <AppText variant="serifBody" style={styles.caption}>
          {post.caption}
        </AppText>

        <MacroBar
          calories={post.calories}
          protein={post.protein}
          carbs={post.carbs}
          fat={post.fat}
        />

        <View style={styles.reactRow}>
          {REACTIONS.map((emoji) => (
            <ReactionButton
              key={emoji}
              emoji={emoji}
              selected={reaction === emoji}
              onPress={() => react(emoji)}
            />
          ))}
          <View style={styles.flex} />
          <AppText variant="caption" color={colors.textMuted}>
            {count} reactions
          </AppText>
        </View>
      </View>
    </View>
  );
}

/** A single reaction with a satisfying pop + clear selected state. */
function ReactionButton({
  emoji,
  selected,
  onPress,
}: {
  emoji: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const press = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.5, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 16 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={press} hitSlop={6}>
      <Animated.View
        style={[
          styles.reactBtn,
          selected && styles.reactActive,
          { transform: [{ scale }] },
        ]}
      >
        <AppText style={styles.reactEmoji}>{emoji}</AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  media: { height: 240, backgroundColor: colors.surfaceSunken },
  sponsorTag: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  cuisineTag: {
    position: 'absolute',
    bottom: spacing.base,
    left: spacing.base,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  body: { padding: spacing.lg, gap: spacing.md },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  cta: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  caption: { color: colors.text },
  reactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  reactBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSunken,
  },
  reactActive: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  reactEmoji: { fontSize: 18 },
});
