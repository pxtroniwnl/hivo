// Port de body.jsx — silueta frente/espalda con heatmap por grupo muscular.
// values: { chest: 0.8, shoulders: 0.5, ... } intensidad 0..1.
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { heatColor, mixOklab } from '@/lib/heat';
import { colors, type } from '@/theme';

export type MuscleValues = Partial<Record<string, number>>;

type BodyHeatmapProps = {
  values?: MuscleValues;
  scale?: number;
  showLabels?: boolean;
};

const STROKE = 'rgba(255,255,255,0.08)';
const STROKE_W = 0.8;
const W = 110;
const H = 280;

export function BodyHeatmap({ values = {}, scale = 1 }: BodyHeatmapProps) {
  const v = (k: string) => Math.max(0, Math.min(1, values[k] ?? 0));
  const fill = (k: string) => heatColor(v(k));
  return (
    <View style={styles.row}>
      <BodyView side="front" fill={fill} scale={scale} />
      <BodyView side="back" fill={fill} scale={scale} />
    </View>
  );
}

function BodyView({
  side,
  fill,
  scale,
}: {
  side: 'front' | 'back';
  fill: (k: string) => string;
  scale: number;
}) {
  const p = (d: string, color: string) => (
    <Path d={d} fill={color} stroke={STROKE} strokeWidth={STROKE_W} />
  );
  return (
    <View style={styles.col}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale}>
        <BodyOutline />
        {side === 'front' ? (
          <>
            {/* Trapezius (upper) */}
            {p('M40 38 Q55 32 70 38 L66 52 L55 50 L44 52 Z', fill('traps'))}
            {/* Shoulders */}
            {p('M28 50 Q24 60 30 75 Q40 78 44 70 L44 52 Q35 50 28 50 Z', fill('shoulders'))}
            {p('M82 50 Q86 60 80 75 Q70 78 66 70 L66 52 Q75 50 82 50 Z', fill('shoulders'))}
            {/* Chest (pecs) */}
            {p('M44 52 L55 50 L55 88 Q49 92 42 88 Q40 80 41 70 Z', fill('chest'))}
            {p('M66 52 L55 50 L55 88 Q61 92 68 88 Q70 80 69 70 Z', fill('chest'))}
            {/* Biceps */}
            {p('M25 75 Q20 88 26 108 Q34 110 38 100 L38 78 Q32 75 25 75 Z', fill('biceps'))}
            {p('M85 75 Q90 88 84 108 Q76 110 72 100 L72 78 Q78 75 85 75 Z', fill('biceps'))}
            {/* Forearms */}
            {p('M24 110 Q20 130 22 148 Q28 150 32 142 L34 110 Q28 108 24 110 Z', fill('forearms'))}
            {p('M86 110 Q90 130 88 148 Q82 150 78 142 L76 110 Q82 108 86 110 Z', fill('forearms'))}
            {/* Abs */}
            {p('M44 92 L66 92 L65 138 Q55 142 45 138 Z', fill('abs'))}
            {/* Obliques (sides) */}
            {p('M42 92 L44 92 L45 138 L40 134 Q38 120 42 100 Z', fill('obliques'))}
            {p('M68 92 L66 92 L65 138 L70 134 Q72 120 68 100 Z', fill('obliques'))}
            {/* Hip area */}
            {p('M42 140 L68 140 L70 158 L40 158 Z', colors.bg3)}
            {/* Quads */}
            {p('M40 158 L54 158 L52 220 Q44 222 40 218 Q36 190 40 158 Z', fill('quads'))}
            {p('M70 158 L56 158 L58 220 Q66 222 70 218 Q74 190 70 158 Z', fill('quads'))}
            {/* Calves (front: tibialis area, subdued) */}
            {p('M42 222 L52 222 L52 268 Q46 270 42 268 Z', colors.bg3)}
            {p('M68 222 L58 222 L58 268 Q64 270 68 268 Z', colors.bg3)}
          </>
        ) : (
          <>
            {/* Traps (large back trap) */}
            {p('M38 38 Q55 30 72 38 L68 76 Q55 80 42 76 Z', fill('traps'))}
            {/* Rear delts (shoulders) */}
            {p('M28 50 Q24 60 30 75 Q40 78 42 70 L42 52 Q35 50 28 50 Z', fill('rearDelts'))}
            {p('M82 50 Q86 60 80 75 Q70 78 68 70 L68 52 Q75 50 82 50 Z', fill('rearDelts'))}
            {/* Lats */}
            {p('M42 70 L42 130 Q34 130 30 122 Q26 100 32 80 Z', fill('lats'))}
            {p('M68 70 L68 130 Q76 130 80 122 Q84 100 78 80 Z', fill('lats'))}
            {/* Mid back (rhomboids) */}
            {p('M42 76 L68 76 L66 130 L44 130 Z', fill('midBack'))}
            {/* Triceps */}
            {p('M25 75 Q20 90 26 108 Q34 110 38 100 L38 78 Q32 75 25 75 Z', fill('triceps'))}
            {p('M85 75 Q90 90 84 108 Q76 110 72 100 L72 78 Q78 75 85 75 Z', fill('triceps'))}
            {/* Forearms */}
            {p('M24 110 Q20 130 22 148 Q28 150 32 142 L34 110 Q28 108 24 110 Z', fill('forearms'))}
            {p('M86 110 Q90 130 88 148 Q82 150 78 142 L76 110 Q82 108 86 110 Z', fill('forearms'))}
            {/* Lower back */}
            {p('M44 130 L66 130 L66 152 L44 152 Z', fill('lowerBack'))}
            {/* Glutes */}
            {p('M38 152 L72 152 Q74 178 68 188 L42 188 Q36 178 38 152 Z', fill('glutes'))}
            {/* Hamstrings */}
            {p('M40 188 L54 188 L52 240 Q44 242 40 238 Q36 210 40 188 Z', fill('hamstrings'))}
            {p('M70 188 L56 188 L58 240 Q66 242 70 238 Q74 210 70 188 Z', fill('hamstrings'))}
            {/* Calves */}
            {p('M42 240 L52 240 L52 268 Q46 270 42 268 Z', fill('calves'))}
            {p('M68 240 L58 240 L58 268 Q64 270 68 268 Z', fill('calves'))}
          </>
        )}
      </Svg>
      <Text style={[type.xs, styles.sideLabel]}>{side === 'front' ? 'FRONT' : 'BACK'}</Text>
    </View>
  );
}

function BodyOutline() {
  const c = W / 2;
  return (
    <>
      {/* Head + neck (gris, no-músculo) */}
      <Ellipse cx={c} cy={18} rx={11} ry={14} fill={colors.bg3} />
      <Rect x={c - 7} y={30} width={14} height={9} fill={colors.bg3} />
      {/* Contorno sutil del cuerpo */}
      <Path
        d={`M ${c - 32} 50 Q ${c - 42} 70 ${c - 38} 90 L ${c - 38} 148 L ${c - 28} 158 L ${c - 30} 220 L ${c - 30} 268 L ${c - 18} 272 L ${c - 6} 268 L ${c - 4} 158 L ${c + 4} 158 L ${c + 6} 268 L ${c + 18} 272 L ${c + 30} 268 L ${c + 30} 220 L ${c + 28} 158 L ${c + 38} 148 L ${c + 38} 90 Q ${c + 42} 70 ${c + 32} 50 Z`}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={0.5}
      />
    </>
  );
}

// Port de HeatmapLegend (body.jsx:137-148); el gradiente CSS se hace con SVG.
export function HeatmapLegend({ label = 'Intensity' }: { label?: string }) {
  return (
    <View style={styles.legendRow}>
      <Text style={[type.xs, styles.legendLabel]}>{label}</Text>
      <View style={styles.legendBar}>
        <Svg width="100%" height={6}>
          <Defs>
            <LinearGradient id="heat" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colors.bg3} />
              <Stop offset="0.5" stopColor={mixOklab(colors.accent, colors.bg3, 0.5)} />
              <Stop offset="1" stopColor={colors.accent} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height={6} rx={3} fill="url(#heat)" />
        </Svg>
      </View>
      <Text style={[type.xs, styles.legendLabel]}>strong</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  col: {
    alignItems: 'center',
    gap: 6,
  },
  sideLabel: {
    fontSize: 10,
    letterSpacing: 10 * 0.08,
    color: colors.fgMute,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  legendLabel: {
    fontSize: 10,
  },
  legendBar: {
    flex: 1,
    height: 6,
  },
});
