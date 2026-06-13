// Port de RaidCard (other-screens.jsx:245-348): anillo de órbita con dots de
// miembros distribuidos por su cuota del volumen, banner de rescue y strip de
// contribuidores. Daño = volumen en el lift objetivo (CLAN.md §Raid).
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { Avatar, Card, Chip, Icon, ProgressBar } from '@/components/ui';
import type { Raid } from '@/data/types';
import { useCountUp } from '@/lib/use-count-up';
import { colors, fonts, radii, type } from '@/theme';
import { durations, easing, useReduceMotion } from '@/theme/motion';

const SIZE = 200;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function RaidCard({ raid }: { raid: Raid }) {
  const pct = raid.target > 0 ? raid.current / raid.target : 0;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = (SIZE - 22) / 2;
  const circ = 2 * Math.PI * r;
  const behind = raid.contributions.filter((m) => m.behind);
  const topValue = raid.contributions[0]?.value || 1;

  // El aro se dibuja al montar (de vacío a pct) y el total cuenta hacia arriba.
  const reduce = useReduceMotion();
  const offset = useSharedValue(circ);
  const lifted = useCountUp(raid.current, { duration: Math.max(durations.enter, 900) });

  useEffect(() => {
    const target = circ * (1 - pct);
    if (reduce) {
      offset.value = target;
    } else {
      offset.value = withTiming(target, { duration: 900, easing: easing.signature });
    }
  }, [circ, pct, reduce, offset]);

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));

  // Posición de cada dot según la fracción acumulada del total (other-screens.jsx:285-310):
  // el ángulo usa la suma de las contribuciones *anteriores*, no la propia.
  const dots = raid.contributions.map((m, i) => {
    const prior = raid.contributions.slice(0, i).reduce((sum, c) => sum + c.value, 0);
    const a = (raid.current > 0 ? prior / raid.current : 0) * 2 * Math.PI - Math.PI / 2;
    return {
      ...m,
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  });

  return (
    <Card variant="elev" style={styles.card}>
      <View style={styles.glow} />

      <View style={styles.header}>
        <Chip variant="acc" icon={<Icon.bolt size={11} color={colors.accent} />}>
          Active raid
        </Chip>
        <Text style={[type.h2, { marginTop: 10 }]}>{raid.name}</Text>
        <Text style={[type.sm, { marginTop: 4 }]}>
          {raid.daysLeft} days left · {raid.contributions.length} lifters
        </Text>
      </View>

      {/* Anillo de órbita */}
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="raid-grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.accent} />
              <Stop offset="1" stopColor={colors.accentDeep} />
            </LinearGradient>
          </Defs>
          <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.bg4} strokeWidth={3} />
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="url(#raid-grad)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circ}
            animatedProps={ringProps}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
          {dots.map((m) => (
            <G key={m.name}>
              <Circle
                cx={m.x}
                cy={m.y}
                r={m.you ? 9 : 7}
                fill={m.behind ? colors.warn : m.you ? colors.accent : colors.bg2}
                stroke={m.behind ? colors.warn : colors.accent}
                strokeWidth={1.5}
              />
              {m.behind ? (
                <SvgText
                  x={m.x}
                  y={m.y + 3}
                  fontSize={9}
                  fill={colors.bg0}
                  textAnchor="middle"
                  fontFamily={fonts.monoSemiBold}
                >
                  !
                </SvgText>
              ) : null}
            </G>
          ))}
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={[type.xs, { color: colors.fgMute }]}>LIFTED</Text>
          <Text style={styles.lifted}>
            {(lifted / 1000).toFixed(1)}
            <Text style={styles.liftedK}>k</Text>
          </Text>
          <Text style={[type.sm, { marginTop: 2 }]}>
            of {(raid.target / 1000).toFixed(0)}k {raid.unit}
          </Text>
        </View>
      </View>

      {/* Rescue banner */}
      {behind.length > 0 ? (
        <View style={styles.rescue}>
          <View style={styles.rescueIcon}>
            <Icon.shield size={13} color="#1a1209" />
          </View>
          <Text style={styles.rescueText}>
            <Text style={styles.rescueBold}>Rescue mode</Text> active — {behind.map((m) => m.name).join(' & ')}{' '}
            behind. Your reps count <Text style={styles.rescueMul}>2×</Text> until Friday.
          </Text>
        </View>
      ) : null}

      {/* Contribuidores top-3 */}
      <View style={styles.contribList}>
        {raid.contributions.slice(0, 3).map((m) => (
          <View key={m.name} style={styles.contribRow}>
            <Avatar name={m.name} size={26} color={m.you ? colors.accent : undefined} />
            <Text style={[styles.contribName, m.you && styles.contribNameYou]} numberOfLines={1}>
              {m.name}
              {m.you ? ' (you)' : ''}
            </Text>
            <View style={{ flex: 1 }}>
              <ProgressBar value={m.value} max={topValue} height={4} />
            </View>
            <Text style={styles.contribValue}>{m.value.toLocaleString()} kg</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, overflow: 'hidden' },
  glow: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 320,
    height: 240,
    borderRadius: 160,
    backgroundColor: colors.accent,
    opacity: 0.12,
  },
  header: {},
  ringWrap: { width: SIZE, height: SIZE, alignSelf: 'center', marginTop: 12, marginBottom: 6 },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lifted: {
    ...type.mono,
    fontFamily: fonts.monoSemiBold,
    fontSize: 32,
    color: colors.fg,
    letterSpacing: -0.96,
  },
  liftedK: { fontFamily: fonts.mono, fontSize: 16, color: colors.fgMute },
  rescue: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(245,181,74,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,181,74,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rescueIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.warn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescueText: { flex: 1, fontFamily: fonts.sans, fontSize: 12, color: colors.fgMid, lineHeight: 16 },
  rescueBold: { fontFamily: fonts.sansSemiBold, color: colors.fg },
  rescueMul: { fontFamily: fonts.sansSemiBold, color: colors.warn },
  contribList: { marginTop: 12, gap: 6 },
  contribRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contribName: { fontFamily: fonts.sans, fontSize: 13, color: colors.fgMid, minWidth: 70 },
  contribNameYou: { fontFamily: fonts.sansSemiBold, color: colors.fg },
  contribValue: {
    ...type.mono,
    fontSize: 11,
    color: colors.fgMid,
    minWidth: 56,
    textAlign: 'right',
  },
});
