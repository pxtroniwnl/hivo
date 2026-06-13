// Port de MuscleHeatmap (other-screens.jsx:1151-1178): rejilla volumen semanal
// por grupo muscular (8 músculos × 12 semanas), intensidad determinista.
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

const MUSCLES = ['Chest', 'Back', 'Quads', 'Hams', 'Glutes', 'Shldrs', 'Biceps', 'Triceps'];
const WEEKS = 12;

export function MuscleHeatmap() {
  return (
    <View style={styles.root}>
      {MUSCLES.map((m, mi) => (
        <View key={m} style={styles.row}>
          <Text style={styles.label}>{m}</Text>
          <View style={styles.cells}>
            {Array.from({ length: WEEKS }).map((_, wi) => {
              // Pseudo-aleatorio pero determinista (igual que el proto).
              const base = (Math.sin(mi * 1.3 + wi * 0.7) + 1) / 2;
              const isPost = m === 'Hams' || m === 'Back';
              const v = isPost ? base * 0.5 : base;
              return (
                <View key={wi} style={[styles.cell, { opacity: 0.15 + v * 0.85 }]} />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { width: 50, fontFamily: fonts.sans, fontSize: 11, color: colors.fgMid },
  cells: { flex: 1, flexDirection: 'row', gap: 2 },
  cell: { flex: 1, height: 14, borderRadius: 3, backgroundColor: colors.accent },
});
