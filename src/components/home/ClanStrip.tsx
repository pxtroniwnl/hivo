// Port de ClanStrip (hivo-design/home.jsx:454-482), corrigiendo el bug del
// prototipo (l.461-464: objeto style duplicado como texto hijo) — un solo style.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, Icon, Ring } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';
import type { Clan } from '@/data/types';

type ClanStripProps = {
  clan: Clan;
  onOpen?: () => void;
};

export function ClanStrip({ clan, onOpen }: ClanStripProps) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <View style={styles.ringWrap}>
        <Ring size={44} value={clan.rankProgress} stroke={3} color={colors.accent}>
          <Text style={styles.tag}>{clan.tag.slice(0, 3)}</Text>
        </Ring>
      </View>
      <View style={styles.textWrap}>
        <View style={styles.nameRow}>
          <Text style={type.h3}>{clan.name}</Text>
          <Chip>{clan.rank}</Chip>
        </View>
        <Text style={[type.sm, styles.raidLine]}>
          <Text style={styles.raidName}>{clan.raid.name}</Text> ·{' '}
          {Math.round((clan.raid.current / clan.raid.target) * 100)}% · {clan.raid.daysLeft}d left
        </Text>
      </View>
      <Icon.arrow size={18} color={colors.fgMute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.md,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  ringWrap: {
    width: 44,
    height: 44,
    flexShrink: 0,
  },
  tag: {
    // El proto usa fontWeight 700; solo hay Geist 400/500/600 cargadas → 600.
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: 14 * -0.02,
    color: colors.fg,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  raidLine: {
    marginTop: 3,
  },
  raidName: {
    color: colors.accent,
  },
});
