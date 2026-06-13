// Port de SummaryStat (other-screens.jsx:1232-1243): label + valor mono + sub.
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, type } from '@/theme';

export function SummaryStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={styles.root}>
      <Text style={type.xs}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '48%' },
  value: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 24, color: colors.fg, marginTop: 4, letterSpacing: -0.48 },
  sub: { ...type.sm, fontSize: 12, marginTop: 2 },
});
