// Port de MyWorkoutsSection + SavedWorkoutCard (train.jsx:345-487):
// programa activo destacado con strip de semanas, y resto de workouts.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Chip, Icon } from '@/components/ui';
import type { Workout } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { GradientTile } from './GradientTile';
import { KindBadge, LevelChip, WorkoutGlyph } from './badges';

type MyWorkoutsSectionProps = {
  myWorkouts: Workout[];
  onOpen: (w: Workout) => void;
  onBuild: () => void;
  onSetActive: (id: string) => void;
};

export function MyWorkoutsSection({ myWorkouts, onOpen, onBuild, onSetActive }: MyWorkoutsSectionProps) {
  const current = myWorkouts.find((w) => w.current);
  const others = myWorkouts.filter((w) => !w.current);

  return (
    <>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
        <Text style={[type.xs, styles.sectionLabel]}>Current program</Text>
        {current ? (
          <Pressable
            onPress={() => onOpen(current)}
            style={({ pressed }) => [styles.currentCard, pressed && styles.pressed]}
          >
            {/* Glow del proto (blur 40px) aproximado con círculo accent 0.15. */}
            <View style={styles.glow} />
            <View style={styles.currentHead}>
              <View style={styles.flex1}>
                <View style={styles.badges}>
                  <KindBadge kind="workout" />
                  <LevelChip level={current.level} />
                </View>
                <Text style={type.h2}>{current.name}</Text>
                <Text style={[type.sm, styles.currentMeta]}>
                  Week {current.week || 1} of {current.totalWeeks || '—'} · {current.daysPerWeek}{' '}
                  days/week
                </Text>
              </View>
              <Chip variant="acc">Active</Chip>
            </View>
            {current.totalWeeks != null && (
              <View style={styles.weeks}>
                {Array.from({ length: current.totalWeeks }).map((_, i) => {
                  const week = current.week || 1;
                  const isPast = i < week - 1;
                  const isNow = i === week - 1;
                  const isDeload = i === Math.floor((current.totalWeeks ?? 0) * 0.65);
                  return (
                    <View
                      key={i}
                      style={[
                        styles.weekCell,
                        {
                          backgroundColor: isPast
                            ? colors.accent
                            : isNow
                              ? colors.accentSoft
                              : colors.bg3,
                          borderColor: isNow ? colors.accent : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.weekText,
                          {
                            color: isPast ? colors.accentFg : isNow ? colors.accent : colors.fgMute,
                          },
                        ]}
                      >
                        {isDeload ? 'DELOAD' : `W${i + 1}`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </Pressable>
        ) : (
          <View style={styles.emptyCurrent}>
            <View style={styles.emptyIcon}>
              <WorkoutGlyph size={20} color={colors.fgMute} />
            </View>
            <Text style={[type.h3, styles.emptyTitle]}>No active program</Text>
            <Text style={[type.sm, styles.emptyText]}>
              Pick one from below to set it as your active program for the week.
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.section}>
        <View style={styles.savedHead}>
          <Text style={type.xs}>{current ? 'Other workouts' : 'Saved workouts'}</Text>
          <Pressable onPress={onBuild} style={styles.newBtn} hitSlop={8}>
            <Icon.plus size={12} color={colors.accent} />
            <Text style={styles.newBtnText}>New</Text>
          </Pressable>
        </View>
        {others.length > 0 ? (
          <View style={styles.list}>
            {others.map((w) => (
              <SavedWorkoutCard
                key={w.id}
                workout={w}
                onOpen={() => onOpen(w)}
                onSetActive={() => onSetActive(w.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptySaved}>
            <Text style={[type.sm, styles.emptyText]}>
              {current ? 'No other workouts saved.' : 'No workouts yet.'}
            </Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}

function SavedWorkoutCard({
  workout,
  onOpen,
  onSetActive,
}: {
  workout: Workout;
  onOpen: () => void;
  onSetActive: () => void;
}) {
  return (
    <View style={styles.savedCard}>
      <Pressable
        onPress={onOpen}
        style={({ pressed }) => [styles.savedBody, pressed && styles.pressed]}
      >
        <GradientTile size={44}>
          <WorkoutGlyph size={20} color={colors.accentFg} detailed />
        </GradientTile>
        <View style={styles.flex1}>
          <View style={styles.badges}>
            <KindBadge kind="workout" />
            <LevelChip level={workout.level} />
          </View>
          <Text style={[type.h3, styles.savedName]}>{workout.name}</Text>
          <Text style={[type.sm, styles.savedMeta]}>
            {(workout.days || []).filter((d) => d.routineId).length} days/wk ·{' '}
            {workout.duration || '—'}
          </Text>
        </View>
        <Icon.arrow size={16} color={colors.fgMute} />
      </Pressable>
      <View style={styles.savedActions}>
        <Pressable
          onPress={onSetActive}
          style={({ pressed }) => [styles.setActiveBtn, pressed && styles.pressed]}
        >
          <Icon.check size={13} color={colors.accent} />
          <Text style={styles.setActiveText}>Set as active</Text>
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
  sectionLabel: {
    marginBottom: 10,
  },
  flex1: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  currentCard: {
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent,
    opacity: 0.15,
  },
  currentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currentMeta: {
    marginTop: 4,
  },
  weeks: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 14,
  },
  weekCell: {
    flex: 1,
    height: 30,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 10 * 0.04,
  },
  emptyCurrent: {
    padding: 18,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 12,
    maxWidth: 240,
    textAlign: 'center',
  },
  savedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newBtnText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.accent,
  },
  list: {
    gap: 8,
  },
  emptySaved: {
    padding: 18,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
  },
  savedCard: {
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  savedBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  savedName: {
    fontSize: 15,
  },
  savedMeta: {
    marginTop: 3,
    fontSize: 12,
  },
  savedActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  setActiveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  setActiveText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.accent,
  },
});
