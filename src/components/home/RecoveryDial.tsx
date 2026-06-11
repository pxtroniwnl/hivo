// Port de RecoveryDial + RecoveryRow (hivo-design/home.jsx:4-41).
// Se exporta pero NO se monta en Home (igual que el prototipo); lo usará Stats.
import { StyleSheet, Text, View } from 'react-native';

import { Ring } from '@/components/ui';
import { colors, fonts, radii, tabularNums, type } from '@/theme';

type RecoveryDialProps = {
  score?: number;
  hrv?: number;
  sleep?: number;
  soreness?: 'low' | 'mid' | 'high';
};

export function RecoveryDial({ score = 78, hrv = 62, sleep = 7.2, soreness = 'low' }: RecoveryDialProps) {
  const sleepNorm = Math.min(1, sleep / 9);
  const hrvNorm = Math.min(1, hrv / 100);
  const sorenessNorm = soreness === 'low' ? 0.9 : soreness === 'mid' ? 0.55 : 0.3;

  return (
    <View style={styles.root}>
      <Ring size={104} value={score / 100} stroke={9} color={colors.accent} track={colors.bg3}>
        <Text style={styles.score}>{score}</Text>
        <Text style={[type.xs, styles.ready]}>READY</Text>
      </Ring>
      <View style={styles.rows}>
        <RecoveryRow label="HRV" value={`${hrv} ms`} norm={hrvNorm} />
        <RecoveryRow label="Sleep" value={`${sleep} h`} norm={sleepNorm} />
        <RecoveryRow label="Soreness" value={soreness} norm={sorenessNorm} />
      </View>
    </View>
  );
}

type RecoveryRowProps = {
  label: string;
  value: string;
  /** 0..1 */
  norm: number;
};

function RecoveryRow({ label, value, norm }: RecoveryRowProps) {
  const col = norm > 0.7 ? colors.ok : norm > 0.45 ? colors.warn : colors.err;
  return (
    <View>
      <Text style={type.xs}>{label}</Text>
      <View style={styles.barRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${norm * 100}%`, backgroundColor: col }]} />
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  score: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 30,
    letterSpacing: 30 * -0.04,
    color: colors.fg,
    ...tabularNums,
  },
  ready: {
    marginTop: -2,
    color: colors.fgMute,
  },
  rows: {
    flex: 1,
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  track: {
    flex: 1,
    height: 3,
    backgroundColor: colors.bg3,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  value: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    color: colors.fgMid,
    minWidth: 42,
    textAlign: 'right',
    ...tabularNums,
  },
});
