import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { AppText, Button, Card, Screen, TextField } from '@/components';
import { getSessionByCode } from '@/features/sessions/api';
import { colors, radius, shadows, spacing } from '@/theme';

export default function CookScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playGame = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/session/create');
  };

  const join = async () => {
    setError(null);
    if (code.trim().length < 4) {
      setError('Enter the 6-character code from the host.');
      return;
    }
    setJoining(true);
    try {
      const session = await getSessionByCode(code);
      if (!session) {
        setError("We couldn't find a session with that code.");
        return;
      }
      void Haptics.selectionAsync();
      router.push(`/session/${session.id}`);
    } catch {
      setError('Something went wrong joining. Try again.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="overline" color={colors.primary}>
          LET&apos;S EAT
        </AppText>
        <AppText variant="title">What&apos;s the move?</AppText>
      </View>

      {/* Hero: Play the game (Pass the Phone) */}
      <Pressable onPress={playGame}>
        <LinearGradient
          colors={['#F2A65A', '#E06B4F', '#C0392B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, shadows.floating]}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="flame" size={30} color="#FFF7EF" />
          </View>
          <AppText variant="hero" color="#FFF7EF" style={styles.heroTitle}>
            Play the game
          </AppText>
          <AppText variant="bodyLarge" color="rgba(255,247,239,0.9)">
            Can&apos;t decide? Pass the phone, everyone votes, Mesā reveals the
            winner.
          </AppText>
          <View style={styles.heroCta}>
            <AppText variant="button" color={colors.depth}>
              Start a session
            </AppText>
            <Ionicons name="arrow-forward" size={18} color={colors.depth} />
          </View>
        </LinearGradient>
      </Pressable>

      {/* Two paths: recipe / eat out */}
      <View style={styles.row}>
        <ChoiceCard
          icon="book"
          title="Find a recipe"
          subtitle="AI · homemade · restaurant"
          soon
        />
        <ChoiceCard
          icon="location"
          title="Eat out"
          subtitle="Spots near you"
          soon
        />
      </View>

      {/* Join a crew's session */}
      <View style={styles.join}>
        <AppText variant="overline" color={colors.textMuted}>
          JOIN A CREW&apos;S SESSION
        </AppText>
        <TextField
          value={code}
          onChangeText={(t) => setCode(t.toUpperCase())}
          placeholder="ABC123"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          style={styles.codeInput}
        />
        {error ? (
          <AppText variant="caption" color={colors.danger}>
            {error}
          </AppText>
        ) : null}
        <Button label="Join session" variant="secondary" onPress={join} loading={joining} />
      </View>
    </Screen>
  );
}

function ChoiceCard({
  icon,
  title,
  subtitle,
  soon,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  soon?: boolean;
}) {
  return (
    <Card style={styles.choice}>
      {soon ? (
        <View style={styles.soonTag}>
          <AppText variant="overline" color={colors.depth}>
            SOON
          </AppText>
        </View>
      ) : null}
      <View style={styles.choiceIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <AppText variant="heading" style={styles.choiceTitle}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textMuted}>
        {subtitle}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.lg, marginBottom: spacing.lg, gap: spacing.xs },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,247,239,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: { marginBottom: spacing.xs },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.sand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  choice: { flex: 1, gap: spacing.xs, minHeight: 130, justifyContent: 'flex-end' },
  soonTag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  choiceIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  choiceTitle: { fontSize: 18 },
  join: { gap: spacing.md },
  codeInput: {
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 8,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
});
