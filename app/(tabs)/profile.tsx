import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { AppText, Avatar, Button, Card, Screen } from '@/components';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, gradients, radius, spacing } from '@/theme';

// Stand-in daily totals until Health / logging is wired.
const TODAY = { calories: 1840, goal: 2400, protein: 142, carbs: 168, fat: 61 };

const INTEGRATIONS = [
  { id: 'apple', label: 'Apple Health', icon: 'heart' as const, on: true },
  { id: 'garmin', label: 'Garmin', icon: 'watch' as const, on: false },
  { id: 'mfp', label: 'MyFitnessPal', icon: 'nutrition' as const, on: false },
];

export default function ProfileScreen() {
  const { profile, signOut, demoMode } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.on])),
  );

  const pct = Math.min(100, Math.round((TODAY.calories / TODAY.goal) * 100));

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Avatar name={profile?.displayName ?? 'You'} size={72} />
        <View style={styles.flex}>
          <AppText variant="heading">{profile?.displayName ?? 'You'}</AppText>
          <AppText variant="body" color={colors.textMuted}>
            @{profile?.username ?? 'cook'}
          </AppText>
        </View>
      </View>

      {/* Daily macros */}
      <Card padded={false} style={styles.macroCard}>
        <LinearGradient colors={gradients.dusk} style={styles.macroGradient}>
          <View style={styles.macroTop}>
            <View>
              <AppText variant="overline" color={colors.amber}>
                TODAY
              </AppText>
              <AppText variant="title" color={colors.sand}>
                {TODAY.calories.toLocaleString()}
                <AppText variant="body" color="rgba(244,237,227,0.7)">
                  {' '}/ {TODAY.goal.toLocaleString()} cal
                </AppText>
              </AppText>
            </View>
            <AppText style={styles.pct}>{pct}%</AppText>
          </View>

          <View style={styles.track}>
            <View style={[styles.fillBar, { width: `${pct}%` }]} />
          </View>

          <View style={styles.macroRow}>
            {[
              { label: 'Protein', value: TODAY.protein, color: colors.protein },
              { label: 'Carbs', value: TODAY.carbs, color: colors.carbs },
              { label: 'Fat', value: TODAY.fat, color: colors.fat },
            ].map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                <AppText variant="label" color={colors.sand}>
                  {m.value}g
                </AppText>
                <AppText variant="caption" color="rgba(244,237,227,0.7)">
                  {m.label}
                </AppText>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Card>

      {/* AI recipe teaser */}
      <Card style={styles.recipe} onPress={() => {}}>
        <View style={styles.recipeIcon}>
          <Ionicons name="sparkles" size={22} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <AppText variant="label">AI Recipe Generator</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Tell Mesā what&apos;s in your kitchen — get a recipe with macros.
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Card>

      {/* Integrations */}
      <AppText variant="heading" style={styles.sectionTitle}>
        Health & sync
      </AppText>
      <Card>
        {INTEGRATIONS.map((it, i) => (
          <View
            key={it.id}
            style={[styles.intRow, i < INTEGRATIONS.length - 1 && styles.intDivider]}
          >
            <View style={styles.intIcon}>
              <Ionicons name={it.icon} size={20} color={colors.primary} />
            </View>
            <AppText variant="bodyLarge" style={styles.flex}>
              {it.label}
            </AppText>
            <Switch
              value={toggles[it.id]}
              onValueChange={(v) => setToggles((t) => ({ ...t, [it.id]: v }))}
              trackColor={{ true: colors.primary, false: colors.surfaceSunken }}
              thumbColor={colors.surface}
            />
          </View>
        ))}
      </Card>

      {demoMode ? (
        <AppText variant="caption" color={colors.accent} center style={styles.demoNote}>
          Running in demo mode. Add Supabase keys to .env to enable real accounts
          and sync.
        </AppText>
      ) : null}

      <Button
        label="Sign out"
        variant="ghost"
        onPress={() => void signOut()}
        style={styles.signOut}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  flex: { flex: 1 },
  macroCard: { marginBottom: spacing.lg },
  macroGradient: { padding: spacing.lg, borderRadius: radius.lg, gap: spacing.md },
  macroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pct: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: colors.amber },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(244,237,227,0.2)',
    overflow: 'hidden',
  },
  fillBar: { height: 10, borderRadius: radius.pill, backgroundColor: colors.primary },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  macroItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  recipe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  recipeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { marginBottom: spacing.md },
  intRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  intDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  intIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoNote: { marginTop: spacing.lg },
  signOut: { marginTop: spacing.lg },
});
