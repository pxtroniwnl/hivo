// Port de Stat (hivo-design/home.jsx:445-452) — label xs + valor mono.
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, tabularNums, type } from '@/theme';

type StatProps = {
  label: string;
  value: string | number;
};

export function Stat({ label, value }: StatProps) {
  return (
    <View style={styles.root}>
      <Text style={[type.xs, styles.label]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  label: { marginBottom: 4 },
  value: {
    fontFamily: fonts.monoMedium,
    fontSize: 15,
    color: colors.fg,
    ...tabularNums,
  },
});
