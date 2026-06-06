import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { AppText, Button, Screen, TextField } from '@/components';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, spacing } from '@/theme';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <AppText variant="title">Welcome back</AppText>
          <AppText variant="body" color={colors.textMuted}>
            Your crew is hungry. Let&apos;s eat.
          </AppText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="current-password"
          />
          {error ? (
            <AppText variant="caption" color={colors.danger}>
              {error}
            </AppText>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button label="Sign in" onPress={onSubmit} loading={loading} />
          <Button
            label="New here? Create an account"
            variant="ghost"
            onPress={() => router.replace('/(auth)/sign-up')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { gap: spacing.sm, marginTop: spacing['2xl'], marginBottom: spacing['2xl'] },
  form: { gap: spacing.lg },
  actions: { marginTop: 'auto', gap: spacing.sm, paddingBottom: spacing.lg },
});
