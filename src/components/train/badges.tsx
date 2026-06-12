// Port de LevelChip + KindBadge (train.jsx:4-52) y los mini-iconos SVG que
// usan las cards de la biblioteca (calendar/list/sparkles/star/search).
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import type { RoutineLevel } from '@/data/types';
import { mixOklab } from '@/lib/heat';
import { colors, fonts } from '@/theme';

export const LEVEL_COLORS: Record<RoutineLevel, string> = {
  Beginner: colors.ok,
  Intermediate: colors.accent,
  Advanced: colors.warn,
};

export const LEVELS: RoutineLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export function LevelChip({ level, size = 'sm' }: { level?: RoutineLevel; size?: 'sm' | 'lg' }) {
  if (!level) return null;
  const c = LEVEL_COLORS[level];
  const lg = size === 'lg';
  return (
    <View
      style={[
        styles.levelChip,
        {
          paddingVertical: lg ? 4 : 3,
          paddingHorizontal: lg ? 9 : 7,
          backgroundColor: mixOklab(c, colors.bg3, 0.14),
        },
      ]}
    >
      <View style={[styles.levelDot, { backgroundColor: c }]} />
      <Text style={[styles.levelText, { color: c, fontSize: lg ? 11 : 10 }]}>{level}</Text>
    </View>
  );
}

type GlyphProps = { size?: number; color?: string; detailed?: boolean };

export function WorkoutGlyph({ size = 9, color = colors.fgMid, detailed = false }: GlyphProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={5} width={18} height={14} rx={2} />
      <Path d={detailed ? 'M3 9h18M8 13h2M12 13h2M16 13h1' : 'M3 9h18'} />
    </Svg>
  );
}

export function RoutineGlyph({ size = 9, color = colors.fgMid }: GlyphProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 5h14M5 10h14M5 15h14M5 20h8" />
    </Svg>
  );
}

export function KindBadge({ kind }: { kind: 'workout' | 'routine' }) {
  const isWorkout = kind === 'workout';
  return (
    <View style={styles.kindBadge}>
      {isWorkout ? <WorkoutGlyph /> : <RoutineGlyph />}
      <Text style={styles.kindText}>{isWorkout ? 'WORKOUT' : 'ROUTINE'}</Text>
    </View>
  );
}

// train.jsx:1624-1632
export function SparklesIcon({ size = 18, color = colors.accentFg }: GlyphProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <Path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </Svg>
  );
}

// train.jsx:2023-2031
export function StarIcon({ size = 11, color = colors.warn }: GlyphProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2z" />
    </Svg>
  );
}

// train.jsx:1634-1644
export function SearchIcon({ size = 16, color = colors.fgMute }: GlyphProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
  },
  levelDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  levelText: {
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 10 * 0.02,
    lineHeight: 12,
  },
  kindBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  kindText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 9.5 * 0.06,
    color: colors.fgMid,
  },
});
