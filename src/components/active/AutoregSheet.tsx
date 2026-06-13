// Port de AutoregSheet + Row (active.jsx:622-652): explicación transparente
// del ajuste — siempre enmarcado como sugerencia (CLAUDE.md).
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Sheet } from '@/components/ui';
import { colors, fonts, type } from '@/theme';

function Row({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={[type.sm, { color: colors.fg }]}>{label}</Text>
        <Text style={[type.xs, { marginTop: 2 }]}>{sub}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function AutoregSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet onClose={onClose} title="Adaptive autoregulation" subtitle="Why we adjusted your weight">
      <View style={styles.col}>
        <Row label="Logged RPE" value="9" sub="Prescribed RPE 7" />
        <Row label="Sleep last night" value="7.2h" sub="Normal range" />
        <Row label="HRV this morning" value="62 ms" sub="−8 ms vs 7-day avg" />
        <View style={styles.recommendation}>
          <Text style={[type.xs, { color: colors.accent }]}>RECOMMENDATION</Text>
          <Text style={[type.h3, { marginTop: 6 }]}>Reduce next set by 5%</Text>
          <Text style={[type.sm, { marginTop: 6 }]}>
            You came in hot. Pulling intensity back keeps fatigue manageable so the rest of the
            session — and tomorrow — stay productive.
          </Text>
        </View>
        <Pressable style={({ pressed }) => [styles.disableBtn, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={styles.disableText}>Disable for this exercise</Text>
        </Pressable>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  col: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 17,
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  recommendation: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  disableBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.bg3,
  },
  disableText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.fg,
  },
});
