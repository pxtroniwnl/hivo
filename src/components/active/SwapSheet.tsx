// Port de SwapSheet (active.jsx:475-504): sustitutos gym-aware.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, Icon, Sheet } from '@/components/ui';
import type { ActiveExercise } from '@/data/types';
import { colors, fonts, type } from '@/theme';

type SwapSheetProps = {
  exercise: ActiveExercise;
  onClose: () => void;
  onPick: (name: string) => void;
};

export function SwapSheet({ exercise, onClose, onPick }: SwapSheetProps) {
  return (
    <Sheet onClose={onClose} title="Substitute exercise" subtitle={`${exercise.name} isn't at Powerhouse`}>
      <View style={styles.list}>
        {(exercise.swapSuggestions ?? []).map((name, i) => (
          <Pressable
            key={name}
            onPress={() => onPick(name)}
            style={({ pressed }) => [styles.row, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <View style={styles.iconBox}>
              <Icon.swap size={16} color={colors.accent} />
            </View>
            <View style={styles.body}>
              <Text style={[type.h3, { fontSize: 14 }]}>{name}</Text>
              <Text style={[type.sm, { marginTop: 2 }]}>
                Same muscles · {i === 0 ? 'closest match' : 'similar volume'}
              </Text>
            </View>
            {i === 0 && <Chip variant="acc">Best</Chip>}
          </Pressable>
        ))}
      </View>
      <View style={styles.hint}>
        <Icon.info size={13} color={colors.accent} />
        <Text style={styles.hintText}>
          Hivo knows your gym&apos;s equipment. Update it in Profile → Gyms.
        </Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  hint: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.bg3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: colors.fgMid,
    fontFamily: fonts.sans,
  },
});
