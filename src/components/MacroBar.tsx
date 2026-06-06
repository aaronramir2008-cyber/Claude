import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';

type Props = {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  compact?: boolean;
};

/** Macro readout shown on every feed post — the "Strava for eating" detail. */
export function MacroBar({ calories, protein, carbs, fat, compact }: Props) {
  const macros = [
    { label: 'P', value: protein, color: colors.protein },
    { label: 'C', value: carbs, color: colors.carbs },
    { label: 'F', value: fat, color: colors.fat },
  ].filter((m) => m.value != null);

  return (
    <View style={styles.row}>
      {calories != null && (
        <View style={[styles.chip, styles.calorieChip]}>
          <AppText variant="label" color={colors.textInverse}>
            {calories} cal
          </AppText>
        </View>
      )}
      {macros.map((m) => (
        <View key={m.label} style={styles.chip}>
          <View style={[styles.dot, { backgroundColor: m.color }]} />
          <AppText variant="label" color={colors.text}>
            {m.value}g{compact ? '' : ` ${m.label}`}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSunken,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  calorieChip: { backgroundColor: colors.depth },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
