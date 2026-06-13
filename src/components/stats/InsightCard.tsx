// Port de InsightCard (other-screens.jsx:1119-1149): tarjeta de insight con
// color por tipo (good/warn/info), métrica mono y cuerpo.
import { StyleSheet, Text, View } from 'react-native';

import { Card, Icon } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';

export type InsightKind = 'good' | 'warn' | 'info';
export type Insight = { kind: InsightKind; title: string; body: string; metric: string };

const COLORS: Record<InsightKind, { color: string; bg: string }> = {
  good: { color: colors.ok, bg: 'rgba(92,214,168,0.10)' },
  warn: { color: colors.warn, bg: 'rgba(245,181,74,0.10)' },
  info: { color: colors.accent, bg: colors.accentSoft },
};

export function InsightCard({ insight }: { insight: Insight }) {
  const { color, bg } = COLORS[insight.kind];
  const glyph =
    insight.kind === 'good' ? (
      <Icon.check size={14} color={color} />
    ) : insight.kind === 'warn' ? (
      <Icon.warn size={14} color={color} />
    ) : (
      <Icon.info size={14} color={color} />
    );
  return (
    <Card padding={14}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={[styles.iconBox, { backgroundColor: bg }]}>{glyph}</View>
          <Text style={[type.h3, { fontSize: 13.5, flex: 1 }]}>{insight.title}</Text>
        </View>
        <Text style={[styles.metric, { color }]}>{insight.metric}</Text>
      </View>
      <Text style={styles.body}>{insight.body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 },
  iconBox: { width: 28, height: 28, borderRadius: radii.xs, alignItems: 'center', justifyContent: 'center' },
  metric: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 13 },
  body: { ...type.sm, fontSize: 12.5, color: colors.fgMid, lineHeight: 19 },
});
