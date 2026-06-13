// Port de ClanPreviewSheet + PreviewStat (clan-onboarding.jsx:271-388).
// Banner, miembros, descripción, stats y CTA de join con estados:
// full / requested (con "simulate approval" demo) / open.
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Icon, Sheet } from '@/components/ui';
import { CLAN } from '@/data/mock';
import type { Clan, DiscoverClan } from '@/data/types';
import { colors, fonts, radii, type } from '@/theme';

import { ClanGlyph } from './ClanGlyph';

// El Sheet ocupa el ancho de pantalla menos los 18px de padding del panel a cada lado.
const SHEET_WIDTH = Dimensions.get('window').width - 36;

type ClanPreviewSheetProps = {
  clan: DiscoverClan;
  requested: boolean;
  onClose: () => void;
  onRequest: () => void;
  onJoined: (clan: Clan) => void;
};

export function ClanPreviewSheet({
  clan,
  requested,
  onClose,
  onRequest,
  onJoined,
}: ClanPreviewSheetProps) {
  const extra = clan.members - clan.sample.length;
  const simulateAccept = () => {
    onClose();
    onJoined({
      id: clan.id,
      name: clan.name,
      tag: clan.tag,
      members: clan.members + 1,
      max: clan.max,
      rank: clan.rank,
      rankProgress: 0.62,
      week: 'Week 3 of season',
      online: 3,
      color: clan.color,
      description: clan.description,
      raid: CLAN.raid,
      missions: CLAN.missions,
      fromOnboarding: true,
    });
  };

  return (
    <Sheet onClose={onClose} title={clan.name} subtitle={`${clan.id} · ${clan.rank} · ${clan.region}`}>
      {/* Banner */}
      <ClanGlyph color={clan.color} width={SHEET_WIDTH} height={110} radius={14} style={styles.bannerWrap}>
        <Text style={styles.bannerTag}>{clan.tag}</Text>
        {clan.trending ? (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>TRENDING</Text>
          </View>
        ) : null}
      </ClanGlyph>

      {/* Miembros */}
      <View style={styles.membersRow}>
        <View style={styles.avatars}>
          {clan.sample.map((name, i) => (
            <View key={name} style={[styles.avatarWrap, { marginLeft: i === 0 ? 0 : -8 }]}>
              <Avatar name={name} size={30} />
            </View>
          ))}
          {extra > 0 ? (
            <View style={[styles.avatarWrap, styles.extra, { marginLeft: -8 }]}>
              <Text style={styles.extraText}>+{extra}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[type.sm, { flex: 1 }]}>
          {clan.members}/{clan.max} members · ages {clan.ageRange}
        </Text>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{clan.description}</Text>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <PreviewStat label="Weekly volume" value={`${(clan.weeklyVolume / 1000).toFixed(0)}k`} unit="kg" />
        <PreviewStat label="PRs / month" value={String(clan.prs)} />
        <PreviewStat label="Rank" value={clan.rank} />
      </View>

      {/* CTA */}
      {!clan.openToJoin ? (
        <View style={styles.fullBox}>
          <Text style={[type.h3, { fontSize: 13 }]}>Clan is full</Text>
          <Text style={[type.sm, { marginTop: 4, fontSize: 12 }]}>Check back when a spot opens up.</Text>
        </View>
      ) : requested ? (
        <View style={styles.pendingBox}>
          <View style={styles.pendingHeader}>
            <Icon.timer size={16} color={colors.warn} />
            <Text style={[type.h3, { fontSize: 13 }]}>Request sent</Text>
          </View>
          <Text style={[type.sm, styles.pendingBody]}>
            Waiting for a clan member to approve your request. You&apos;ll get a notification when it&apos;s
            accepted.
          </Text>
          <Button onPress={simulateAccept} style={styles.simulateBtn} textStyle={styles.simulateText}>
            ▶ Simulate approval (demo)
          </Button>
        </View>
      ) : (
        <Button
          variant="primary"
          block
          onPress={onRequest}
          icon={<Icon.squad size={15} color={colors.accentFg} />}
        >
          Request to join
        </Button>
      )}
    </Sheet>
  );
}

function PreviewStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[type.xs, { fontSize: 9 }]}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrap: { marginBottom: 14 },
  bannerTag: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 48,
    letterSpacing: -1,
    color: 'rgba(255,255,255,0.95)',
  },
  trendingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  trendingText: { fontFamily: fonts.sansSemiBold, fontSize: 10, letterSpacing: 0.6, color: '#fff' },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatars: { flexDirection: 'row' },
  avatarWrap: {
    borderWidth: 2,
    borderColor: colors.bg2,
    borderRadius: 50,
  },
  extra: {
    width: 30,
    height: 30,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraText: { fontFamily: fonts.sansSemiBold, fontSize: 10, color: colors.fgMid },
  description: { ...type.sm, fontSize: 13, color: colors.fg, marginBottom: 14 },
  statsGrid: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  statBox: { flex: 1, padding: 10, borderRadius: radii.sm, backgroundColor: colors.bg3 },
  statValue: {
    ...type.mono,
    fontFamily: fonts.monoSemiBold,
    fontSize: 16,
    color: colors.fg,
    marginTop: 4,
    letterSpacing: -0.32,
  },
  statUnit: { fontFamily: fonts.mono, fontSize: 10, color: colors.fgMute },
  fullBox: { padding: 14, borderRadius: radii.sm, backgroundColor: colors.bg3, alignItems: 'center' },
  pendingBox: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(245,181,74,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,181,74,0.3)',
  },
  pendingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pendingBody: { marginTop: 6, fontSize: 12 },
  simulateBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  simulateText: { fontSize: 12, color: colors.accent },
});
