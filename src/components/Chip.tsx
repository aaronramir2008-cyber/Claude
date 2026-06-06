import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';

type Props = {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress?: () => void;
};

/** Selectable pill — cuisine directions, filters, tags. */
export function Chip({ label, emoji, selected, onPress }: Props) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      {emoji ? <AppText style={styles.emoji}>{emoji}</AppText> : null}
      <AppText
        variant="label"
        color={selected ? colors.textInverse : colors.text}
      >
        {label}
      </AppText>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  emoji: { fontSize: 16 },
});
