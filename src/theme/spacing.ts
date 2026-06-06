/** 4-point spacing scale plus shared radii and shadows. */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/**
 * Soft, warm shadows — never harsh. Tuned to read on the sand background.
 * iOS uses the shadow* props; Android uses elevation.
 */
export const shadows = {
  card: {
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  floating: {
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 12,
  },
  subtle: {
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
} as const;
