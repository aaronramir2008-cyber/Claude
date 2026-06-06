import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText, Button, Card, Screen, TextField } from '@/components';
import { getSessionByCode } from '@/features/sessions/api';
import { colors, gradients, radius, shadows, spacing } from '@/theme';

export default function SessionsScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          DECIDE TOGETHER
        </AppText>
        <AppText variant="title">Where are we eating?</AppText>
      </View>

      {/* Hero: start a session */}
      <Card padded={false} elevated style={styles.hero}>
        <LinearGradient colors={gradients.dusk} style={styles.heroGradient}>
          <View style={styles.heroIcon}>
            <Ionicons name="restaurant" size={26} color={colors.sand} />
          </View>
          <AppText variant="heading" color={colors.sand}>
            Start a meal session
          </AppText>
          <AppText variant="body" color="rgba(244,237,227,0.8)" style={styles.heroCopy}>
            Set a direction, gather the crew, and let everyone pick. Mesā reveals
            the winner.
          </AppText>
          <Button
            label="New session"
            icon="🔥"
            onPress={() => router.push('/session/create')}
          />
        </LinearGradient>
      </Card>

      {/* Pass the phone explainer */}
      <Card style={styles.explainer}>
        <View style={styles.explainerIcon}>
          <Ionicons name="phone-portrait-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <AppText variant="label">Pass the Phone</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            One phone, the whole crew. Everyone taps their pick, then Mesā counts
            the votes and reveals the table&apos;s choice.
          </AppText>
        </View>
      </Card>

      {/* Join by code */}
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

const styles = StyleSheet.create({
  header: { marginTop: spacing.lg, marginBottom: spacing.xl, gap: spacing.xs },
  hero: { marginBottom: spacing.lg, ...shadows.floating },
  heroGradient: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(244,237,227,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { marginBottom: spacing.sm },
  explainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  explainerIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  join: { gap: spacing.md },
  codeInput: {
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 8,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
});
