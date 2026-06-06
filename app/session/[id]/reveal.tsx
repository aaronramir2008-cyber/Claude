import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components';
import { revealWinner, tallySession } from '@/features/sessions/api';
import { cuisineById } from '@/data/cuisines';
import { colors, gradients, radius, spacing } from '@/theme';
import type { TallyRow } from '@/types';

export default function RevealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [results, setResults] = useState<TallyRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fade = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const rows = await tallySession(id);
      setResults(rows);
      if (rows[0]) await revealWinner(id, rows[0].cuisineLabel);
      setLoading(false);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(pop, { toValue: 1, useNativeDriver: true, bounciness: 10, speed: 8 }),
      ]).start();
    })();
  }, [id, fade, pop]);

  const winner = results[0];
  const winnerCuisine = winner ? cuisineById(winner.cuisineId) : undefined;
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const isTie = results.length > 1 && results[1].votes === winner?.votes;

  return (
    <View style={styles.fill}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={winnerCuisine?.gradient ?? gradients.sunset}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(14,27,39,0.65)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + spacing['2xl'], paddingBottom: insets.bottom + spacing.xl }]}>
        <Animated.View style={[styles.winnerBlock, { opacity: fade }]}>
          <AppText variant="overline" color="rgba(244,237,227,0.85)">
            {loading ? 'COUNTING VOTES…' : isTie ? 'TIEBREAK WINNER' : 'THE TABLE HAS DECIDED'}
          </AppText>
          <Animated.Text style={[styles.emoji, { transform: [{ scale: pop }] }]}>
            {winnerCuisine?.emoji ?? '🍽️'}
          </Animated.Text>
          <AppText style={styles.winnerName}>
            {winner?.cuisineLabel ?? '…'}
          </AppText>
          {winner ? (
            <AppText variant="bodyLarge" color={colors.sand} center>
              {winner.votes} of {totalVotes} votes
            </AppText>
          ) : null}
        </Animated.View>

        <Animated.View style={[styles.results, { opacity: fade }]}>
          {results.map((r, i) => {
            const pct = totalVotes ? Math.round((r.votes / totalVotes) * 100) : 0;
            return (
              <View key={r.cuisineId} style={styles.resultRow}>
                <AppText style={styles.resultEmoji}>
                  {cuisineById(r.cuisineId)?.emoji ?? '🍴'}
                </AppText>
                <View style={styles.flex}>
                  <View style={styles.resultLabel}>
                    <AppText variant="label" color={colors.sand}>
                      {r.cuisineLabel}
                    </AppText>
                    <AppText variant="label" color="rgba(244,237,227,0.8)">
                      {r.votes}
                    </AppText>
                  </View>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fillBar,
                        { width: `${Math.max(pct, 6)}%`, opacity: i === 0 ? 1 : 0.5 },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>

        <View style={styles.actions}>
          <Button label="Find places nearby" icon="📍" variant="primary" onPress={() => {}} />
          <Button
            label="Back to the feed"
            variant="ghost"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.depth },
  content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  winnerBlock: { alignItems: 'center', gap: spacing.xs, marginTop: spacing.xl },
  emoji: { fontSize: 96, marginVertical: spacing.sm },
  winnerName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 44,
    color: colors.sand,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  results: { gap: spacing.md },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  resultEmoji: { fontSize: 26 },
  flex: { flex: 1, gap: spacing.xs },
  resultLabel: { flexDirection: 'row', justifyContent: 'space-between' },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(244,237,227,0.22)',
    overflow: 'hidden',
  },
  fillBar: { height: 10, borderRadius: radius.pill, backgroundColor: colors.sand },
  actions: { gap: spacing.sm },
});
