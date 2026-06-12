// Port de ProgramCard (train.jsx:596-655): card mixta para routine/workout.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { LibraryItem } from '@/lib/library';
import { colors, fonts, radii, type } from '@/theme';

import { GradientTile } from './GradientTile';
import { KindBadge, LevelChip, StarIcon, WorkoutGlyph } from './badges';

type ProgramCardProps = {
  item: LibraryItem;
  onOpen: () => void;
  showStats?: boolean;
};

export function ProgramCard({ item, onOpen, showStats }: ProgramCardProps) {
  const isWorkout = item.kind === 'workout';
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <GradientTile size={46} soft={!isWorkout}>
        {isWorkout ? (
          <WorkoutGlyph size={20} color={colors.accentFg} detailed />
        ) : (
          <Icon.dumb size={20} color={colors.accentFg} />
        )}
      </GradientTile>
      <View style={styles.body}>
        <View style={styles.badges}>
          <KindBadge kind={item.kind} />
          <LevelChip level={item.level} />
        </View>
        <Text style={[type.h3, styles.name]}>{item.name}</Text>
        <View style={styles.metaRow}>
          {isWorkout ? (
            <>
              <Text style={styles.meta}>
                {(item.days || []).filter((d) => d.routineId).length} days/wk
              </Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.meta}>{item.duration || '—'}</Text>
            </>
          ) : (
            <Text style={styles.meta}>{item.exercises.length} exercises</Text>
          )}
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{item.author}</Text>
          {showStats && item.users != null && (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.meta}>{(item.users / 1000).toFixed(1)}k</Text>
            </>
          )}
        </View>
      </View>
      {showStats && item.rating != null && (
        <View style={styles.rating}>
          <StarIcon />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      )}
      <Icon.arrow size={16} color={colors.fgMute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
  },
  metaRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.fgMid,
  },
  dot: {
    color: colors.fgDim,
    fontSize: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.fgMid,
    fontVariant: ['tabular-nums'],
  },
});
