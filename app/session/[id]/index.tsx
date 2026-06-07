import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, Card, TextField } from '@/components';
import { getSession, setSessionStatus } from '@/features/sessions/api';
import { CUISINE_DIRECTIONS } from '@/data/cuisines';
import { colors, gradients, radius, spacing } from '@/theme';
import type { MealSession } from '@/types';

export default function SessionLobby() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [session, setSession] = useState<MealSession | null>(null);
  const [crew, setCrew] = useState<string[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!id) return;
    void getSession(id).then(setSession);
  }, [id]);

  const addMember = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    void Haptics.selectionAsync();
    setCrew((prev) => [...prev, trimmed]);
    setName('');
  };

  const removeMember = (i: number) =>
    setCrew((prev) => prev.filter((_, idx) => idx !== i));

  const start = async () => {
    if (!id || crew.length < 2) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setSessionStatus(id, 'voting');
    router.push({
      pathname: '/session/[id]/vote',
      params: {
        id,
        players: crew.join('|'),
        direction: session?.cuisineDirection ?? 'anything',
      },
    });
  };

  const direction = CUISINE_DIRECTIONS.find(
    (d) => d.id === session?.cuisineDirection,
  );

  return (
    <View style={styles.fill}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={gradients.dusk}
        style={[styles.banner, { paddingTop: insets.top + spacing.base }]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={26} color={colors.sand} />
        </Pressable>
        <AppText variant="overline" color={colors.amber}>
          LOBBY
        </AppText>
        <AppText variant="title" color={colors.sand}>
          {session?.title ?? 'Loading…'}
        </AppText>
        {direction ? (
          <AppText variant="body" color="rgba(244,237,227,0.8)">
            {direction.emoji} {direction.label}
          </AppText>
        ) : null}

        <View style={styles.codeBlock}>
          <AppText variant="caption" color="rgba(244,237,227,0.7)">
            SHARE CODE
          </AppText>
          <AppText style={styles.code}>{session?.code ?? '••••••'}</AppText>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <AppText variant="heading">Who&apos;s at the table?</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Add everyone passing the phone. You need at least two.
        </AppText>

        <View style={styles.addRow}>
          <View style={styles.flex}>
            <TextField
              value={name}
              onChangeText={setName}
              placeholder="Add a name"
              onSubmitEditing={addMember}
              returnKeyType="done"
              autoCapitalize="words"
            />
          </View>
          <Pressable onPress={addMember} style={styles.addBtn}>
            <Ionicons name="add" size={26} color={colors.textInverse} />
          </Pressable>
        </View>

        <View style={styles.crew}>
          {crew.length === 0 ? (
            <AppText variant="body" color={colors.textMuted} center>
              No one yet — add your crew above.
            </AppText>
          ) : (
            crew.map((member, i) => (
              <Card key={`${member}-${i}`} style={styles.member} padded>
                <AppText style={styles.memberEmoji}>🍽️</AppText>
                <AppText variant="bodyLarge" style={styles.flex}>
                  {member}
                </AppText>
                <Pressable onPress={() => removeMember(i)} hitSlop={10}>
                  <Ionicons name="close-circle" size={22} color={colors.textMuted} />
                </Pressable>
              </Card>
            ))
          )}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.base }]}>
        <Button
          label={
            crew.length < 2
              ? `Add ${2 - crew.length} more to start`
              : `Start voting · ${crew.length}`
          }
          icon="🔥"
          disabled={crew.length < 2}
          onPress={start}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  banner: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    gap: spacing.xs,
  },
  back: { marginBottom: spacing.sm, marginLeft: -spacing.xs },
  codeBlock: { marginTop: spacing.lg, gap: 2 },
  code: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 44,
    lineHeight: 56,
    letterSpacing: 10,
    color: colors.sand,
  },
  body: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
  flex: { flex: 1 },
  addBtn: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crew: { gap: spacing.sm, marginTop: spacing.md },
  member: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  memberEmoji: { fontSize: 20 },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
});
