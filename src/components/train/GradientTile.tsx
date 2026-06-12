// Tile cuadrado con gradiente accent→accent-deep (las cards de Train usan
// linear-gradient(135deg,...) en CSS; aquí se hace con SVG).
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme';

type GradientTileProps = {
  size?: number;
  radius?: number;
  /** Variante atenuada (ProgramCard de rutina: acento al 70%). */
  soft?: boolean;
  children?: ReactNode;
};

export function GradientTile({ size = 44, radius = 11, soft, children }: GradientTileProps) {
  const opacity = soft ? 0.7 : 1;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={opacity} />
            <Stop offset="1" stopColor={colors.accentDeep} stopOpacity={opacity} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={size} height={size} rx={radius} fill="url(#tile)" />
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
