import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, type } from '@/theme';

type Variant = keyof typeof type;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
  children: React.ReactNode;
};

/**
 * The only text primitive in the app — guarantees every string is rendered in
 * a Mesā typeface with a sensible default color.
 */
export function AppText({
  variant = 'body',
  color = colors.text,
  center,
  style,
  children,
  ...rest
}: Props) {
  const base = type[variant] as TextStyle;
  return (
    <Text
      style={[base, { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
