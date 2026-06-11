// Port de WarmupCard (hivo-design/home.jsx:663-692) en carrusel horizontal con snap.
// El proto desborda el scroll hasta el borde derecho (marginRight -18) con inset
// izquierdo efectivo de 16px — se replica con paddings del contentContainer.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconProps } from '@/components/ui';
import { colors, fonts, radii, tabularNums, type } from '@/theme';
import type { Warmup, WarmupTarget } from '@/data/types';

const CARD_WIDTH = 150;
const CARD_GAP = 8;

const WARMUP_ICONS: Record<WarmupTarget, (props: IconProps) => React.JSX.Element> = {
  Shoulders: Icon.wuShoulders,
  Chest: Icon.wuChest,
  Back: Icon.wuBack,
  Legs: Icon.wuLegs,
  'Full body': Icon.wuFullBody,
};

type WarmupCarouselProps = {
  warmups: Warmup[];
  onOpen?: (warmup: Warmup) => void;
};

export function WarmupCarousel({ warmups, onOpen }: WarmupCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + CARD_GAP}
      decelerationRate="fast"
      contentContainerStyle={styles.content}
    >
      {warmups.map((w) => (
        <WarmupCard key={w.id} warmup={w} onOpen={() => onOpen?.(w)} />
      ))}
    </ScrollView>
  );
}

type WarmupCardProps = {
  warmup: Warmup;
  onOpen?: () => void;
};

function WarmupCard({ warmup, onOpen }: WarmupCardProps) {
  const TargetIcon = WARMUP_ICONS[warmup.target] ?? Icon.wuFullBody;
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconBubble}>
          <TargetIcon size={16} color={colors.accent} />
        </View>
        <Text style={styles.duration}>{warmup.duration}m</Text>
      </View>
      <View>
        <Text style={[type.xs, styles.target]}>{warmup.target.toUpperCase()}</Text>
        <Text style={[type.h3, styles.name]}>{warmup.name}</Text>
      </View>
      <Text style={[type.sm, styles.count]}>{warmup.exercises.length} exercises</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 16,
    gap: CARD_GAP,
    paddingBottom: 4,
  },
  card: {
    flexShrink: 0,
    width: CARD_WIDTH,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    gap: 8,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.fgMute,
    ...tabularNums,
  },
  target: {
    color: colors.accent,
    fontSize: 10,
  },
  name: {
    fontSize: 13,
    marginTop: 2,
  },
  count: {
    fontSize: 11,
    lineHeight: 11 * 1.35,
    color: colors.fgMid,
  },
});
