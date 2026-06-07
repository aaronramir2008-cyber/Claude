/**
 * Mesā palette.
 *
 * Warm, upscale beach-resort energy — think Nobu. A deep sand base, a coral /
 * terracotta accent, navy depth for grounding, and amber for highlights.
 */

export const palette = {
  // Brand anchors (from the brief)
  sand: '#F4EDE3', // deep sand base
  coral: '#E06B4F', // coral / terracotta accent
  navy: '#18293A', // navy depth
  amber: '#C9963A', // amber highlight

  // Sand ramp — backgrounds and surfaces
  sand50: '#FBF7F1',
  sand100: '#F4EDE3',
  sand200: '#EAE0D2',
  sand300: '#DFD2BF',

  // Coral ramp — primary actions and energy
  coral400: '#E8856D',
  coral500: '#E06B4F',
  coral600: '#C9573D',

  // Navy ramp — text, depth, dark surfaces
  navy500: '#2C4257',
  navy700: '#18293A',
  navy900: '#0E1B27',

  // Amber ramp — secondary highlights, macros, awards
  amber400: '#D6A954',
  amber500: '#C9963A',
  amber600: '#A97B27',

  // Support
  white: '#FFFFFF',
  cream: '#FFFCF7',
  ink: '#16202B',
  mutedInk: '#5C6B78',
  hairline: 'rgba(24, 41, 58, 0.08)',
  overlay: 'rgba(14, 27, 39, 0.55)',

  // Semantic
  success: '#5E8C61',
  warning: '#C9963A',
  danger: '#C24B3A',
} as const;

export const colors = {
  // Surfaces
  background: palette.sand100,
  backgroundElevated: palette.cream,
  surface: palette.white,
  surfaceSunken: palette.sand200,
  surfaceDark: palette.navy700,

  // Brand
  primary: palette.coral500,
  primaryPressed: palette.coral600,
  accent: palette.amber500,
  depth: palette.navy700,

  // Raw brand tones used directly on dark surfaces
  sand: palette.sand50,
  sand300: palette.sand300,
  amber: palette.amber500,
  white: palette.white,
  navy900: palette.navy900,

  // Text
  text: palette.navy700,
  textOnDark: palette.sand50,
  textMuted: palette.mutedInk,
  textInverse: palette.cream,

  // Lines & overlays
  border: palette.hairline,
  overlay: palette.overlay,

  // Semantic
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,

  // Macro chips
  protein: palette.coral500,
  carbs: palette.amber500,
  fat: palette.navy500,
} as const;

/** Reusable gradient stops for the warm resort feel. */
export const gradients = {
  sunset: ['#E8856D', '#E06B4F', '#C9573D'] as const,
  dusk: ['#2C4257', '#18293A', '#0E1B27'] as const,
  amberGlow: ['#D6A954', '#C9963A'] as const,
  sandFade: ['#FBF7F1', '#F4EDE3'] as const,
};

export type ColorToken = keyof typeof colors;
