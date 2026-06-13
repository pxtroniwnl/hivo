// Port de BodyweightChart (other-screens.jsx:1180-1203): área + línea con
// react-native-svg, escalada al ancho del contenedor (preserveAspectRatio none).
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '@/theme';

const W = 320;
const H = 110;

export function BodyweightChart({ data }: { data: number[] }) {
  const max = Math.max(...data) + 0.3;
  const min = Math.min(...data) - 0.3;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / (max - min)) * (H - 16) - 8,
  ]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = `${path} L${W} ${H} L0 ${H} Z`;
  const last = pts[pts.length - 1];

  return (
    <View style={{ width: '100%', height: H, marginTop: 8 }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="bw-grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.35} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={area} fill="url(#bw-grad)" />
        <Path d={path} fill="none" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={last[0]} cy={last[1]} r={4} fill={colors.accent} stroke={colors.bg2} strokeWidth={2} />
      </Svg>
    </View>
  );
}
