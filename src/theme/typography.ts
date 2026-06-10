// Escala tipográfica canónica de hivo-design/tokens.css:86-93.
// Nota RN: letterSpacing va en px (el CSS usa em) → se multiplica em × fontSize.
import type { TextStyle } from 'react-native';

import { colors } from './tokens';

export const fonts = {
  sans: 'Geist_400Regular',
  sansMedium: 'Geist_500Medium',
  sansSemiBold: 'Geist_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemiBold: 'JetBrainsMono_600SemiBold',
} as const;

/** Números (pesos, reps, timers) siempre en mono con cifras tabulares. */
export const tabularNums: TextStyle = {
  fontVariant: ['tabular-nums'],
};

export const type = {
  display: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 34,
    letterSpacing: 34 * -0.025,
    lineHeight: 34 * 1.05,
    color: colors.fg,
  },
  h1: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 26,
    letterSpacing: 26 * -0.02,
    lineHeight: 26 * 1.15,
    color: colors.fg,
  },
  h2: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 20,
    letterSpacing: 20 * -0.015,
    lineHeight: 20 * 1.2,
    color: colors.fg,
  },
  h3: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    letterSpacing: 17 * -0.01,
    lineHeight: 17 * 1.25,
    color: colors.fg,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 15 * 1.4,
    color: colors.fg,
  },
  sm: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 13 * 1.35,
    color: colors.fgMid,
  },
  xs: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 11 * 1.3,
    color: colors.fgMute,
    letterSpacing: 11 * 0.04,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: fonts.mono,
    letterSpacing: -0.13,
    ...tabularNums,
  },
} satisfies Record<string, TextStyle>;
