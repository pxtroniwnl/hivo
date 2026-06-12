// Port de MyRoutinesSection (train.jsx:571-591).
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { Routine } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { ProgramCard } from './ProgramCard';

type MyRoutinesSectionProps = {
  myRoutines: Routine[];
  onOpen: (r: Routine) => void;
  onBuild: () => void;
};

export function MyRoutinesSection({ myRoutines, onOpen, onBuild }: MyRoutinesSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[type.xs, styles.label]}>
        {myRoutines.length} routine{myRoutines.length !== 1 ? 's' : ''} created by you
      </Text>
      <View style={styles.list}>
        {myRoutines.map((r) => (
          <ProgramCard key={r.id} item={{ ...r, kind: 'routine' }} onOpen={() => onOpen(r)} />
        ))}
        <Pressable
          onPress={onBuild}
          style={({ pressed }) => [styles.buildBtn, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Icon.plus size={16} color={colors.fgMid} />
          <Text style={styles.buildText}>Build new routine</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
    paddingHorizontal: screenInset,
  },
  label: {
    marginBottom: 10,
  },
  list: {
    gap: 8,
  },
  buildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    borderStyle: 'dashed',
  },
  buildText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.fgMid,
  },
});
