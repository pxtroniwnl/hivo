// Port de JoinClanStrip (hivo-design/home.jsx:484-515) — CTA para descubrir/crear clan.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, Icon } from '@/components/ui';
import { colors, radii, type } from '@/theme';

type JoinClanStripProps = {
  onOpen?: () => void;
};

export function JoinClanStrip({ onOpen }: JoinClanStripProps) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      {/* Glow del proto: círculo accent opacity 0.08 con blur(28px);
          se aproxima sin blur, igual que el glow del TodayHero. */}
      <View style={styles.glow} />
      <View style={styles.iconBubble}>
        <Icon.squad size={22} color={colors.accent} />
      </View>
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={type.h3}>Clan</Text>
          <Chip variant="acc" textStyle={styles.optionalChip}>
            Optional
          </Chip>
        </View>
        <Text style={[type.sm, styles.subtitle]}>Find a clan, create your own, or train solo.</Text>
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
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    borderRadius: radii.md,
    position: 'relative',
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
    opacity: 0.08,
    pointerEvents: 'none',
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: radii.md - 2, // 12px
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionalChip: {
    fontSize: 10,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
  },
});
