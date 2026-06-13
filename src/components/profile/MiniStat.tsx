// Port de MiniStat (other-screens.jsx:1362-1372): valor mono centrado + label.
import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui';
import { colors, fonts, type } from '@/theme';

export function MiniStat({ value, label }: { value: string | number; label: string }) {
  return (
    <Card padding={14} style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={[type.xs, { marginTop: 4 }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center' },
  value: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 24, color: colors.fg, letterSpacing: -0.48 },
});
