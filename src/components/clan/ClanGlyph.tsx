// Badge cuadrado con gradiente de clan + texto centrado (banner y avatar de clan).
// Port del bloque con `background: clan.color` de clan-onboarding.jsx.
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type ClanGlyphProps = {
  /** Gradiente [from, to]. */
  color: [string, string];
  width: number;
  height: number;
  radius?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

let gid = 0;

export function ClanGlyph({ color, width, height, radius = 12, children, style }: ClanGlyphProps) {
  // id único por instancia para que los <Defs> no colisionen.
  const id = `clan-grad-${gid++}`;
  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color[0]} />
            <Stop offset="1" stopColor={color[1]} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} rx={radius} fill={`url(#${id})`} />
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
