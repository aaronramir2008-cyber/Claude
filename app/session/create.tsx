import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, Chip, Screen, TextField } from '@/components';
import { useAuth } from '@/features/auth/AuthProvider';
import { createSession } from '@/features/sessions/api';
import { CUISINE_DIRECTIONS } from '@/data/cuisines';
import { colors, spacing } from '@/theme';

export default function CreateSession() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [direction, setDirection] = useState<string>('anything');
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const session = await createSession({
        hostId: profile.id,
        title: title.trim() || 'Dinner with the crew',
        cuisineDirection: direction,
      });
      router.replace(`/session/${session.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={[styles.grabberRow, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.grabber} />
        <Pressable onPress={() => router.back()} style={styles.close} hitSlop={12}>
          <Ionicons name="close" size={24} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.header}>
        <AppText variant="overline" color={colors.primary}>
          NEW SESSION
        </AppText>
        <AppText variant="title">Set the table</AppText>
      </View>

      <View style={styles.form}>
        <TextField
          label="What's the occasion?"
          value={title}
          onChangeText={setTitle}
          placeholder="Shift dinner, Friday cheat meal…"
          maxLength={60}
        />

        <View style={styles.section}>
          <AppText variant="overline" color={colors.textMuted}>
            CUISINE DIRECTION
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Narrow the deck, or let anything fly.
          </AppText>
          <View style={styles.chips}>
            {CUISINE_DIRECTIONS.map((d) => (
              <Chip
                key={d.id}
                label={d.label}
                emoji={d.emoji}
                selected={direction === d.id}
                onPress={() => setDirection(d.id)}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Create & open lobby" onPress={create} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grabberRow: { alignItems: 'center', marginBottom: spacing.md },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  close: { position: 'absolute', right: 0, top: '50%' },
  header: { gap: spacing.xs, marginBottom: spacing.xl },
  form: { gap: spacing.xl },
  section: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  actions: { marginTop: spacing['2xl'] },
});
