// Port de TrainList (train.jsx:172-294): header con Build, card AI Coach,
// segmented My Workouts | Trending | My Routines.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Chip, Icon, ScreenHeader } from '@/components/ui';
import type { Routine, Workout } from '@/data/types';
import type { CoachWorkout } from '@/lib/coach';
import type { LibraryFilters } from '@/lib/library';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { AICoachSheet } from './AICoachSheet';
import { GradientTile } from './GradientTile';
import { MyRoutinesSection } from './MyRoutinesSection';
import { MyWorkoutsSection } from './MyWorkoutsSection';
import { TrendingSection } from './TrendingSection';
import { SparklesIcon } from './badges';

type TrainTab = 'myworkouts' | 'trending' | 'myroutines';

const TABS: { id: TrainTab; label: string }[] = [
  { id: 'myworkouts', label: 'My Workouts' },
  { id: 'trending', label: 'Trending' },
  { id: 'myroutines', label: 'My Routines' },
];

type TrainListProps = {
  myRoutines: Routine[];
  myWorkouts: Workout[];
  onOpenRoutine: (r: Routine) => void;
  onOpenWorkout: (w: Workout) => void;
  onBuildRoutine: () => void;
  onBuildWorkout: () => void;
  onSetActive: (id: string) => void;
  onAddWorkout: (w: CoachWorkout) => void;
  bottomPadding?: number;
  topPadding?: number;
};

export function TrainList({
  myRoutines,
  myWorkouts,
  onOpenRoutine,
  onOpenWorkout,
  onBuildRoutine,
  onBuildWorkout,
  onSetActive,
  onAddWorkout,
  bottomPadding = 24,
  topPadding = 0,
}: TrainListProps) {
  const [tab, setTab] = useState<TrainTab>('myworkouts');
  const [coachOpen, setCoachOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<LibraryFilters['level']>('All');
  const [typeFilter, setTypeFilter] = useState<LibraryFilters['type']>('all');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
    >
      <ScreenHeader
        title="Train"
        subtitle="Workouts & routines"
        right={
          <Pressable
            onPress={tab === 'myroutines' ? onBuildRoutine : onBuildWorkout}
            style={({ pressed }) => [styles.buildBtn, pressed && styles.pressed]}
          >
            <Icon.plus size={14} color={colors.accentFg} />
            <Text style={styles.buildText}>Build</Text>
          </Pressable>
        }
      />

      {/* AI Coach card (train.jsx:219-254) */}
      <View style={styles.coachWrap}>
        <Pressable
          onPress={() => setCoachOpen(true)}
          style={({ pressed }) => [styles.coachCard, pressed && styles.pressed]}
        >
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="coachBg" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.bg3} />
                <Stop offset="1" stopColor={colors.bg2} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" rx={radii.md} fill="url(#coachBg)" />
          </Svg>
          {/* Glow del proto (blur 38px) aproximado. */}
          <View style={styles.coachGlow} />
          <GradientTile size={44} radius={12}>
            <SparklesIcon />
          </GradientTile>
          <View style={styles.coachBody}>
            <View style={styles.coachTitleRow}>
              <Text style={[type.h3, styles.coachTitle]}>AI Coach</Text>
              <Chip variant="acc">New</Chip>
            </View>
            <Text style={[type.sm, styles.coachSub]}>
              Need help? Get a personalized workout in 60 seconds.
            </Text>
          </View>
          <Icon.arrow size={18} color={colors.fgMute} />
        </Pressable>
      </View>

      {/* Segmented tabs */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tab, tab === t.id && styles.tabOn]}
            >
              <Text style={[styles.tabText, tab === t.id && styles.tabTextOn]} numberOfLines={1}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tab === 'myworkouts' && (
        <MyWorkoutsSection
          myWorkouts={myWorkouts}
          onOpen={onOpenWorkout}
          onBuild={onBuildWorkout}
          onSetActive={onSetActive}
        />
      )}
      {tab === 'trending' && (
        <TrendingSection
          filters={{ level, type: typeFilter, query }}
          setLevel={setLevel}
          setType={setTypeFilter}
          setQuery={setQuery}
          onOpenRoutine={onOpenRoutine}
          onOpenWorkout={onOpenWorkout}
        />
      )}
      {tab === 'myroutines' && (
        <MyRoutinesSection myRoutines={myRoutines} onOpen={onOpenRoutine} onBuild={onBuildRoutine} />
      )}

      {coachOpen && <AICoachSheet onClose={() => setCoachOpen(false)} onAddWorkout={onAddWorkout} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  buildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
  buildText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.accentFg,
  },
  coachWrap: {
    paddingTop: 8,
    paddingHorizontal: screenInset,
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    overflow: 'hidden',
  },
  coachGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  coachBody: {
    flex: 1,
    minWidth: 0,
  },
  coachTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coachTitle: {
    fontSize: 15,
  },
  coachSub: {
    marginTop: 3,
    fontSize: 12,
  },
  tabsWrap: {
    paddingTop: 14,
    paddingHorizontal: screenInset,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: 12,
    padding: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabOn: {
    backgroundColor: colors.bg3,
  },
  tabText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12.5,
    color: colors.fgMute,
  },
  tabTextOn: {
    color: colors.fg,
  },
});
