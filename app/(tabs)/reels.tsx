import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Avatar } from '@/components';
import { MOCK_REELS, compactCount, type Reel } from '@/features/reels/mockReels';
import { colors, radius, spacing } from '@/theme';

const TAB_BAR_SPACE = Platform.OS === 'ios' ? 96 : 80;

export default function ReelsScreen() {
  const { height, width } = useWindowDimensions();

  return (
    <View style={styles.fill}>
      <StatusBar style="light" />
      <FlatList
        data={MOCK_REELS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReelItem reel={item} height={height} width={width} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        initialNumToRender={2}
        windowSize={3}
        maxToRenderPerBatch={2}
      />
    </View>
  );
}

function ReelItem({
  reel,
  height,
  width,
}: {
  reel: Reel;
  height: number;
  width: number;
}) {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [saved, setSaved] = useState(false);

  const heartPop = useRef(new Animated.Value(1)).current;
  const burst = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const setLikedTo = (next: boolean) => {
    setLiked(next);
    setLikes((c) => c + (next ? 1 : -1));
  };

  const popHeart = () => {
    Animated.sequence([
      Animated.spring(heartPop, { toValue: 1.35, useNativeDriver: true, speed: 50 }),
      Animated.spring(heartPop, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
  };

  const toggleLike = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!liked) popHeart();
    setLikedTo(!liked);
  };

  // Double-tap anywhere on the reel to like (TikTok-style heart burst).
  const onMediaTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (!liked) {
        setLikedTo(true);
        popHeart();
      }
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      burst.setValue(0);
      Animated.sequence([
        Animated.spring(burst, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }),
        Animated.timing(burst, { toValue: 0, duration: 350, delay: 250, useNativeDriver: true }),
      ]).start();
    }
    lastTap.current = now;
  };

  return (
    <View style={[styles.reel, { height, width }]}>
      <Image source={{ uri: reel.imageUrl }} style={StyleSheet.absoluteFill} />
      {/* Legibility washes top & bottom */}
      <LinearGradient
        colors={['rgba(14,27,39,0.55)', 'transparent']}
        style={[styles.topWash, { height: insets.top + 80 }]}
      />
      <LinearGradient
        colors={['transparent', 'rgba(14,27,39,0.85)']}
        style={styles.bottomWash}
      />

      {/* Double-tap target */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onMediaTap} />

      {/* Center heart burst */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.burst,
          {
            opacity: burst,
            transform: [
              { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.1] }) },
            ],
          },
        ]}
      >
        <Ionicons name="heart" size={120} color="rgba(255,255,255,0.92)" />
      </Animated.View>

      {/* Top tabs */}
      <View style={[styles.top, { top: insets.top + spacing.sm }]}>
        <AppText variant="label" color="rgba(255,255,255,0.6)">
          Following
        </AppText>
        <AppText variant="label" color={colors.white}>
          For You
        </AppText>
      </View>

      {/* Right action rail */}
      <View style={[styles.rail, { bottom: TAB_BAR_SPACE + spacing.lg }]}>
        <View style={styles.avatarWrap}>
          <Avatar name={reel.creator} uri={reel.avatar} size={48} />
          <View style={styles.followBadge}>
            <Ionicons name="add" size={14} color={colors.white} />
          </View>
        </View>

        <RailButton
          icon={liked ? 'heart' : 'heart-outline'}
          color={liked ? colors.primary : colors.white}
          label={compactCount(likes)}
          onPress={toggleLike}
          scale={heartPop}
        />
        <RailButton icon="chatbubble-outline" label={compactCount(reel.comments)} />
        <RailButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          color={saved ? colors.accent : colors.white}
          label="Save"
          onPress={() => {
            void Haptics.selectionAsync();
            setSaved((s) => !s);
          }}
        />
        <RailButton icon="arrow-redo-outline" label={compactCount(reel.shares)} />
      </View>

      {/* Bottom caption */}
      <View style={[styles.caption, { bottom: TAB_BAR_SPACE }]}>
        <AppText variant="bodyLarge" color={colors.white} style={styles.handle}>
          {reel.handle}
        </AppText>
        <AppText variant="body" color="rgba(255,255,255,0.92)">
          {reel.caption}
        </AppText>

        <View style={styles.metaRow}>
          <View style={styles.cuisinePill}>
            <Ionicons name="restaurant" size={12} color={colors.white} />
            <AppText variant="caption" color={colors.white}>
              {reel.cuisine}
            </AppText>
          </View>
          {reel.hasRecipe ? (
            <Pressable style={styles.recipeCta}>
              <Ionicons name="book-outline" size={14} color={colors.depth} />
              <AppText variant="label" color={colors.depth}>
                View recipe
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.soundRow}>
          <Ionicons name="musical-notes" size={13} color={colors.white} />
          <AppText variant="caption" color="rgba(255,255,255,0.85)">
            {reel.sound}
          </AppText>
        </View>
      </View>
    </View>
  );
}

function RailButton({
  icon,
  label,
  color = colors.white,
  onPress,
  scale,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  onPress?: () => void;
  scale?: Animated.Value;
}) {
  return (
    <Pressable style={styles.railBtn} onPress={onPress}>
      <Animated.View style={scale ? { transform: [{ scale }] } : undefined}>
        <Ionicons name={icon} size={32} color={color} />
      </Animated.View>
      <AppText variant="caption" color={colors.white} style={styles.railLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.depth },
  reel: { backgroundColor: colors.navy900, justifyContent: 'flex-end' },
  topWash: { position: 'absolute', top: 0, left: 0, right: 0 },
  bottomWash: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 280 },
  burst: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  rail: {
    position: 'absolute',
    right: spacing.base,
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.xs },
  followBadge: {
    position: 'absolute',
    bottom: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  railBtn: { alignItems: 'center', gap: 2 },
  railLabel: { fontSize: 12 },
  caption: {
    position: 'absolute',
    left: spacing.lg,
    right: 88,
    gap: spacing.sm,
  },
  handle: { fontFamily: 'Jost_600SemiBold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  cuisinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  recipeCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.sand,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  soundRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
});
