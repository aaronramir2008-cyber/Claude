/**
 * Typography scale.
 *
 * Playfair Display (serif) carries the headings — editorial, restaurant-menu
 * elegance. Jost (sans) handles everything functional and readable.
 *
 * Font family keys map to the names registered in app/_layout.tsx via
 * @expo-google-fonts.
 */

export const fonts = {
  // Playfair Display — headings
  serif: 'PlayfairDisplay_500Medium',
  serifSemibold: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  serifItalic: 'PlayfairDisplay_500Medium_Italic',

  // Jost — body / UI
  sans: 'Jost_400Regular',
  sansMedium: 'Jost_500Medium',
  sansSemibold: 'Jost_600SemiBold',
} as const;

type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
};

export const type: Record<string, TypeStyle> = {
  // Display / hero — Playfair
  hero: { fontFamily: fonts.serifBold, fontSize: 40, lineHeight: 46, letterSpacing: -0.5 },
  title: { fontFamily: fonts.serifSemibold, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.serifSemibold, fontSize: 22, lineHeight: 28 },
  serifBody: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 26 },

  // Functional — Jost
  bodyLarge: { fontFamily: fonts.sans, fontSize: 17, lineHeight: 25 },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 18, letterSpacing: 0.2 },
  button: { fontFamily: fonts.sansSemibold, fontSize: 16, lineHeight: 20, letterSpacing: 0.3 },
  caption: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 17 },
  overline: { fontFamily: fonts.sansSemibold, fontSize: 11, lineHeight: 14, letterSpacing: 1.4 },
};

/** The Google Font packages whose hooks we load at startup. */
export type FontMap = Record<string, number>;
