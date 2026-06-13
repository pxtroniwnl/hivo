// Port de ClanTab (other-screens.jsx:133-243): banner de fundador, raid card,
// misiones semanales, leaderboard de temporada y clan strength map.
import { StyleSheet, Text, View } from 'react-native';

import { BodyHeatmap, HeatmapLegend } from '@/components/body/BodyHeatmap';
import { Button, Card, Chip, Icon } from '@/components/ui';
import { CLAN_BODY } from '@/data/body-stats';
import type { Clan } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { MissionCard } from './MissionCard';
import { RaidCard } from './RaidCard';

type LeaderRow = { rank: number; name: string; tag: string; pts: number; you?: boolean };

const LEADERBOARD: LeaderRow[] = [
  { rank: 1, name: 'Iron Crows', tag: 'CRWS', pts: 18420, you: true },
  { rank: 2, name: 'Steel Pact', tag: 'STPC', pts: 17890 },
  { rank: 3, name: 'Riverside Lifters', tag: 'RVRL', pts: 16320 },
  { rank: 4, name: 'Norte Power', tag: 'NRTP', pts: 14400 },
  { rank: 5, name: 'Casa Fuerte', tag: 'CFRT', pts: 13800 },
];

export function ClanTab({ clan }: { clan: Clan }) {
  return (
    <View style={styles.root}>
      {/* Banner de fundador (solo clan recién creado) */}
      {clan.isFounder && clan.members <= 1 ? (
        <View style={styles.section}>
          <Card variant="elev" style={styles.founder}>
            <View style={styles.founderGlow} />
            <Chip variant="acc">Founder</Chip>
            <Text style={[type.h2, { marginTop: 8 }]}>Welcome to {clan.name}</Text>
            <Text style={[type.sm, { marginTop: 4 }]}>Invite up to 7 friends to start your first raid.</Text>
            <Button
              variant="primary"
              style={styles.founderBtn}
              icon={<Icon.plus size={14} color={colors.accentFg} />}
            >
              Invite friends
            </Button>
          </Card>
        </View>
      ) : null}

      {/* Raid */}
      <View style={styles.section}>
        <RaidCard raid={clan.raid} />
      </View>

      {/* Misiones */}
      <View style={[styles.section, styles.topGap]}>
        <Text style={[type.xs, styles.label]}>Weekly missions</Text>
        <View style={{ gap: 8 }}>
          {clan.missions.map((m) => (
            <MissionCard key={m.id} mission={m} clan={clan} />
          ))}
        </View>
      </View>

      {/* Leaderboard */}
      <View style={[styles.section, styles.topGap]}>
        <View style={styles.lbHeader}>
          <Text style={type.xs}>Season leaderboard</Text>
          <Text style={[type.sm, { color: colors.fgMute }]}>{clan.week}</Text>
        </View>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {LEADERBOARD.map((c, i) => (
            <View
              key={c.tag}
              style={[
                styles.lbRow,
                i < LEADERBOARD.length - 1 && styles.lbRowBorder,
                c.you && { backgroundColor: colors.accentSoft },
              ]}
            >
              <Text style={[styles.lbRank, { color: c.you ? colors.accent : colors.fgMute }]}>
                {c.rank}
              </Text>
              <View style={[styles.lbBadge, { backgroundColor: c.you ? colors.accent : colors.bg3 }]}>
                <Text style={[styles.lbBadgeText, { color: c.you ? colors.accentFg : colors.fgMid }]}>
                  {c.tag.slice(0, 3)}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[type.h3, { fontSize: 14 }]}>{c.name}</Text>
                {c.you ? <Text style={styles.youTag}>YOU</Text> : null}
              </View>
              <Text style={styles.lbPts}>{c.pts.toLocaleString()}</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Clan strength map */}
      <View style={[styles.section, styles.topGap]}>
        <Card padding={16}>
          <View style={styles.mapHeader}>
            <Text style={type.h3}>Clan strength map</Text>
            <Text style={[type.sm, { color: colors.fgMute }]}>Avg of {clan.members}</Text>
          </View>
          <Text style={styles.mapSub}>Where your clan is collectively strong, by muscle group.</Text>
          <BodyHeatmap values={CLAN_BODY.values} />
          <HeatmapLegend />
          <View style={styles.muscleGrid}>
            {CLAN_BODY.topMuscles.map((m) => (
              <View key={m.name} style={styles.muscleBox}>
                <Text style={[type.xs, { fontSize: 9 }]}>{m.name.toUpperCase()}</Text>
                <Text style={styles.muscleValue}>{m.value}</Text>
                <Text style={styles.muscleSub}>{m.sub}</Text>
              </View>
            ))}
          </View>
          <View style={styles.weakBox}>
            <Icon.warn size={13} color={colors.warn} />
            <Text style={styles.weakText}>
              Weak as a clan: <Text style={styles.weakNames}>{CLAN_BODY.weak.join(' · ')}</Text>
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  section: { paddingHorizontal: screenInset, paddingBottom: 0 },
  topGap: { paddingTop: 20 },
  label: { marginBottom: 10 },
  founder: { padding: 14, overflow: 'hidden' },
  founderGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
    opacity: 0.15,
  },
  founderBtn: { marginTop: 12, alignSelf: 'flex-start' },
  lbHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  lbRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  lbRank: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 13, width: 18, textAlign: 'center' },
  lbBadge: { width: 30, height: 30, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  lbBadgeText: { fontFamily: fonts.sansSemiBold, fontSize: 10, letterSpacing: 0.2 },
  youTag: { fontFamily: fonts.sansMedium, fontSize: 9, color: colors.accent, letterSpacing: 0.44 },
  lbPts: { ...type.mono, fontFamily: fonts.monoMedium, fontSize: 14, color: colors.fg },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  mapSub: { ...type.sm, fontSize: 12, marginBottom: 10 },
  muscleGrid: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  muscleBox: { width: '48.5%', padding: 10, borderRadius: radii.sm, backgroundColor: colors.bg3 },
  muscleValue: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 14, color: colors.fg, marginTop: 4 },
  muscleSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.fgMute, marginTop: 2 },
  weakBox: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(245,181,74,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,181,74,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weakText: { flex: 1, fontFamily: fonts.sans, fontSize: 11.5, color: colors.fgMid },
  weakNames: { fontFamily: fonts.sansSemiBold, color: colors.warn },
});
