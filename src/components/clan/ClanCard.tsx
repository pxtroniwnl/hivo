// Port de ClanCard (clan-onboarding.jsx:235-266): fila pulsable con badge,
// nombre, chips de estado y metadatos (ID · members · rank).
import { StyleSheet, Text, View } from 'react-native';

import { Chip, Icon, PressableScale } from '@/components/ui';
import type { DiscoverClan } from '@/data/types';
import { colors, fonts, radii, type } from '@/theme';

import { ClanGlyph } from './ClanGlyph';

type ClanCardProps = {
  clan: DiscoverClan;
  requested: boolean;
  onTap: () => void;
};

export function ClanCard({ clan, requested, onTap }: ClanCardProps) {
  return (
    <PressableScale onPress={onTap} scaleTo={0.98} style={styles.card}>
      <ClanGlyph color={clan.color} width={48} height={48} radius={12}>
        <Text style={styles.tag}>{clan.tag.slice(0, 3)}</Text>
      </ClanGlyph>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[type.h3, { fontSize: 14 }]}>{clan.name}</Text>
          {clan.trending ? (
            <Chip variant="acc" style={styles.miniChip} textStyle={styles.miniChipText}>
              Trending
            </Chip>
          ) : null}
          {requested ? (
            <Chip style={styles.pendingChip} textStyle={styles.pendingText}>
              Pending
            </Chip>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <Text style={[type.mono, styles.metaId]}>{clan.id}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>
            {clan.members}/{clan.max}
          </Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{clan.rank}</Text>
        </View>
      </View>
      <Icon.arrow size={16} color={colors.fgMute} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.bg2,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  tag: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    letterSpacing: 0.26,
    color: '#fff',
  },
  body: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  miniChip: { paddingVertical: 2, paddingHorizontal: 7 },
  miniChipText: { fontSize: 9 },
  pendingChip: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    backgroundColor: 'rgba(245,181,74,0.15)',
    borderColor: 'transparent',
  },
  pendingText: { fontSize: 9, color: colors.warn },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' },
  metaId: { fontSize: 11, color: colors.fgMute },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.fgMid },
  dot: { color: colors.fgDim, fontSize: 12 },
});
