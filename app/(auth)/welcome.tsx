import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, gradients, spacing } from '@/theme';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { demoMode } = useAuth();

  return (
    <View style={styles.fill}>
      <LinearGradient colors={gradients.dusk} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['transparent', 'rgba(224,107,79,0.35)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.content, { paddingTop: insets.top + spacing['4xl'] }]}>
        <View style={styles.brandBlock}>
          <AppText style={styles.mark}>Mesā</AppText>
          <View style={styles.rule} />
          <AppText variant="serifBody" color={colors.sand} style={styles.tagline}>
            Decide together. Eat well. Share the table.
          </AppText>
        </View>

        <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.xl }]}>
          <AppText variant="caption" color="rgba(244,237,227,0.7)" center>
            Tinder for food, meets Strava for eating.
          </AppText>
          <Button label="Get started" onPress={() => router.push('/(auth)/sign-up')} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.push('/(auth)/sign-in')}
          />
          {demoMode ? (
            <AppText variant="caption" color={colors.amber} center>
              Demo mode — Supabase keys not set yet. Sign in with anything.
            </AppText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.depth },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  brandBlock: { marginTop: spacing['4xl'] },
  mark: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 72,
    lineHeight: 92,
    color: colors.sand,
    letterSpacing: -1,
  },
  rule: {
    width: 64,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginVertical: spacing.lg,
  },
  tagline: { maxWidth: 280 },
  actions: { gap: spacing.md },
});
