// Port de MissionCard (other-screens.jsx:350-373): objetivo semanal con % y
// barra de progreso. `upcoming` = atenuado + borde discontinuo.
import { StyleSheet, Text, View } from 'react-native';

import { Card, ProgressBar } from '@/components/ui';
import type { Clan, Mission } from '@/data/types';
import { colors, fonts, type } from '@/theme';

export function MissionCard({ mission, clan }: { mission: Mission; clan: Clan }) {
  const upcoming = mission.upcoming;
  const total = clan.members;
  return (
    <Card padding={14} style={upcoming ? styles.upcoming : undefined}>
      <View style={styles.header}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[type.h3, { fontSize: 14 }]}>{mission.title}</Text>
          <Text style={[type.sm, { marginTop: 3 }]}>{mission.target || mission.subtitle}</Text>
        </View>
        <Text style={[styles.pct, { color: upcoming ? colors.fgMute : colors.accent }]}>
          {Math.round(mission.progress * 100)}%
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <ProgressBar value={mission.progress * 100} color={upcoming ? colors.fgDim : colors.accent} />
      </View>
      <Text style={[type.xs, styles.members]}>
        {mission.members}/{total} contributing
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  upcoming: { opacity: 0.55, borderStyle: 'dashed' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  pct: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 15 },
  members: { marginTop: 8, color: colors.fgMute },
});
