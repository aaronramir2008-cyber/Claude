import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components';
import { CuisineCard } from '@/components/CuisineCard';
import { castVote } from '@/features/sessions/api';
import { deckForDirection } from '@/data/cuisines';
import type { Cuisine } from '@/data/cuisines';
import { colors, gradients, spacing } from '@/theme';

/**
 * Pass the Phone. One device, one player at a time. Each player gets a private
 * handoff screen, taps their pick, then passes on. After the last vote we head
 * to the reveal.
 */
export default function VoteScreen() {
  const { id, players, direction } = useLocalSearchParams<{
    id: string;
    players: string;
    direction?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const crew = useMemo(
    () => (players ? players.split('|').filter(Boolean) : []),
    [players],
  );
  const deck = useMemo(() => deckForDirection(direction ?? 'anything'), [direction]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'handoff' | 'picking'>('handoff');
  const [busy, setBusy] = useState(false);

  const current = crew[index];

  const pick = async (cuisine: Cuisine) => {
    if (!id || busy) return;
    setBusy(true);
    try {
      await castVote({
        sessionId: id,
        voterName: current,
        cuisineId: cuisine.id,
        cuisineLabel: cuisine.label,
      });
    } catch {
      // In a live session a failed write shouldn't trap the crew; keep moving.
    } finally {
      setBusy(false);
    }

    if (index + 1 < crew.length) {
      setIndex((i) => i + 1);
      setPhase('handoff');
    } else {
      router.replace({ pathname: '/session/[id]/reveal', params: { id } });
    }
  };

  if (!current) {
    return (
      <View style={[styles.fill, styles.center]}>
        <AppText color={colors.sand}>No players found.</AppText>
      </View>
    );
  }

  // Handoff: a private "pass to NAME" gate so picks stay secret.
  if (phase === 'handoff') {
    return (
      <View style={styles.fill}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={gradients.dusk} style={StyleSheet.absoluteFill} />
        <View style={[styles.handoff, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.center}>
            <AppText variant="overline" color={colors.amber}>
              PASS THE PHONE TO
            </AppText>
            <AppText style={styles.handoffName}>{current}</AppText>
            <AppText variant="body" color="rgba(244,237,227,0.75)" center>
              Player {index + 1} of {crew.length}. Pick privately — no one sees
              your choice until the reveal.
            </AppText>
          </View>
          <Button
            label={`I'm ${current} — let me pick`}
            variant="primary"
            onPress={() => setPhase('picking')}
          />
        </View>
      </View>
    );
  }

  // Picking: tap a cuisine to lock it in.
  return (
    <View style={styles.fill}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.pickHeader, { paddingTop: insets.top + spacing.base }]}>
        <AppText variant="overline" color={colors.primary}>
          {current.toUpperCase()}&apos;S PICK
        </AppText>
        <AppText variant="title">What sounds good?</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Tap one. Then pass the phone along.
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.deck,
          { paddingBottom: insets.bottom + spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {chunkPairs(deck).map((pair, row) => (
          <View key={row} style={styles.row}>
            {pair.map((c) => (
              <CuisineCard key={c.id} cuisine={c} onPick={pick} />
            ))}
            {pair.length === 1 ? <View style={styles.flex} /> : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/** Group the deck into rows of two for a balanced grid. */
function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  handoff: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  handoffName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 52,
    color: colors.sand,
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  pickHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.base,
    gap: spacing.xs,
  },
  deck: { paddingHorizontal: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
