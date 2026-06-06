import { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, gradients, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  /** Dark navy backdrop instead of warm sand — used for hero / vote screens. */
  dark?: boolean;
  /** Apply a subtle gradient wash over the background. */
  gradient?: boolean;
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: { top?: boolean; bottom?: boolean };
};

export function Screen({
  children,
  scroll = false,
  dark = false,
  gradient = false,
  padded = true,
  contentStyle,
  edges = { top: true, bottom: false },
}: Props) {
  const insets = useSafeAreaInsets();
  const bg = dark ? colors.surfaceDark : colors.background;

  const padding: ViewStyle = {
    paddingTop: edges.top ? insets.top + spacing.sm : spacing.sm,
    paddingBottom: edges.bottom ? insets.bottom + spacing.sm : 0,
    paddingHorizontal: padded ? spacing.lg : 0,
  };

  const inner = (
    <View style={[styles.flex, padding, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: bg }]}>
      {gradient && (
        <LinearGradient
          colors={dark ? gradients.dusk : gradients.sandFade}
          style={StyleSheet.absoluteFill}
        />
      )}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            padding,
            { paddingBottom: insets.bottom + spacing['3xl'] },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        inner
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
