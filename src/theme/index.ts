export { colors, palette, gradients } from './colors';
export type { ColorToken } from './colors';
export { fonts, type } from './typography';
export { spacing, radius, shadows } from './spacing';

import { colors, gradients } from './colors';
import { fonts, type } from './typography';
import { spacing, radius, shadows } from './spacing';

export const theme = {
  colors,
  gradients,
  fonts,
  type,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
