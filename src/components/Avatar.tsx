import { Image, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, gradients } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  name: string;
  uri?: string | null;
  size?: number;
};

/** Initials-on-gradient avatar, falling back to an image when present. */
export function Avatar({ name, uri, size = 44 }: Props) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.base, dimension]} />;
  }

  return (
    <LinearGradient
      colors={gradients.sunset}
      style={[styles.base, styles.center, dimension]}
    >
      <AppText
        color={colors.textInverse}
        style={{ fontSize: size * 0.36 }}
        variant="label"
      >
        {initials || '🍽'}
      </AppText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.surfaceSunken },
  center: { alignItems: 'center', justifyContent: 'center' },
});
