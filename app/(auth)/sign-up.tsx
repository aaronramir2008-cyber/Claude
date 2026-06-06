import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { AppText, Button, Screen, TextField } from '@/components';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, spacing } from '@/theme';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!displayName.trim() || !email.trim() || password.length < 6) {
      setError('Add your name, email, and a password (6+ characters).');
      return;
    }
    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        username:
          username.trim().toLowerCase().replace(/\s+/g, '_') ||
          displayName.trim().toLowerCase().replace(/\s+/g, '_'),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <AppText variant="title">Join the table</AppText>
          <AppText variant="body" color={colors.textMuted}>
            Start with your crew — your station, your gym, your people.
          </AppText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Jordan Vega"
            autoCapitalize="words"
          />
          <TextField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="jvega"
            autoCapitalize="none"
            hint="How your crew finds you. Optional."
          />
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
            placeholder="At least 6 characters"
            secureTextEntry
            autoComplete="new-password"
          />
          {error ? (
            <AppText variant="caption" color={colors.danger}>
              {error}
            </AppText>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button label="Create account" onPress={onSubmit} loading={loading} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.replace('/(auth)/sign-in')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.xl },
  form: { gap: spacing.lg },
  actions: { marginTop: spacing.xl, gap: spacing.sm },
});
