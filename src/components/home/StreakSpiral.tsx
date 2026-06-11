// Port de StreakSpiral (hivo-design/home.jsx:254-312) — espiral de Arquímedes
// con gradiente de acento y shields orbitando el borde.
// El conteo del streak replica el Counter del prototipo (ui.jsx:146-164):
// ease-out cúbico de 900ms.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Card, Icon } from '@/components/ui';
import { colors, fonts, tabularNums, type } from '@/theme';

const SIZE = 76;
const POINTS = 80;

function spiralPath(days: number): string {
  const turns = Math.min(6, Math.floor(days / 10) + 2);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const path: string[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const t = (i / POINTS) * turns * Math.PI * 2;
    const r = (i / POINTS) * (SIZE / 2 - 4);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    path.push((i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2));
  }
  return path.join(' ');
}

function useCountUp(to: number, duration = 900): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return Math.round(val);
}

type StreakSpiralProps = {
  days?: number;
  shields?: number;
};

export function StreakSpiral({ days = 47, shields = 3 }: StreakSpiralProps) {
  const count = useCountUp(days);
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <Card padding={14} style={styles.root}>
      <View style={styles.spiralWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="spiral-g" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.4} />
              <Stop offset="100%" stopColor={colors.accent} />
            </LinearGradient>
          </Defs>
          <Path
            d={spiralPath(days)}
            fill="none"
            stroke="url(#spiral-g)"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </Svg>
        {Array.from({ length: shields }).map((_, i) => {
          const a = (i / Math.max(shields, 1)) * Math.PI * 2 - Math.PI / 2;
          const x = cx + (SIZE / 2 - 2) * Math.cos(a);
          const y = cy + (SIZE / 2 - 2) * Math.sin(a);
          return (
            <View key={i} style={[styles.shieldDot, { left: x - 8, top: y - 8 }]}>
              <Icon.shield size={9} color={colors.accent} />
            </View>
          );
        })}
      </View>
      <View style={styles.textWrap}>
        <View style={styles.countRow}>
          <Text style={styles.count}>{count}</Text>
          <Text style={type.sm}>day streak</Text>
        </View>
        <Text style={[type.sm, styles.shieldsLine]}>
          {shields}{' '}
          <Text style={styles.shieldsMute}>
            shield{shields !== 1 ? 's' : ''} stored — auto-uses when you miss
          </Text>
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  spiralWrap: {
    width: SIZE,
    height: SIZE,
    flexShrink: 0,
  },
  shieldDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  count: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 26,
    letterSpacing: 26 * -0.03,
    color: colors.fg,
    ...tabularNums,
  },
  shieldsLine: {
    marginTop: 2,
    color: colors.fgMid,
  },
  shieldsMute: {
    color: colors.fgMute,
  },
});
