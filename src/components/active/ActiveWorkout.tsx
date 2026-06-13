// Port de ActiveWorkout (active.jsx:22-195) — SOLO layout hybrid (list/focus
// fueron exploración descartada, CLAUDE.md §Reglas de diseño).
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, ProgressBar } from '@/components/ui';
import { EXERCISES } from '@/data/mock';
import type { ActiveExercise, ActiveSet } from '@/data/types';
import { formatClock, logSet, sessionTotals, type AutoregNote } from '@/lib/active';
import { colors, fonts, type } from '@/theme';

import { AutoregSheet } from './AutoregSheet';
import { ExerciseBlock } from './ExerciseBlock';
import { RestTimer } from './RestTimer';
import { SwapSheet } from './SwapSheet';
import { TechniqueSheet } from './TechniqueSheet';

type ActiveWorkoutProps = {
  onExit: () => void;
  mode?: 'live' | 'log-past';
};

export function ActiveWorkout({ onExit, mode = 'live' }: ActiveWorkoutProps) {
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState<ActiveExercise[]>(
    () => JSON.parse(JSON.stringify(EXERCISES)) as ActiveExercise[],
  );
  const [focusedIdx, setFocusedIdx] = useState(() =>
    exercises.findIndex((e) => e.sets.some((s) => !s.done)),
  );
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [autoregNote, setAutoregNote] = useState<AutoregNote | null>(null);
  const [autoregOpen, setAutoregOpen] = useState(false);
  const [showSwap, setShowSwap] = useState<string | null>(null);
  const [showTech, setShowTech] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(1382); // 23:02, como el proto
  const autoregTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cronómetro del workout (congelado en log-past)
  useEffect(() => {
    if (mode === 'log-past') return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [mode]);

  // Cuenta atrás del descanso
  const restRunning = restRemaining > 0;
  useEffect(() => {
    if (!restRunning) return;
    const id = setInterval(() => {
      setRestRemaining((r) => {
        if (r <= 1) {
          setTimeout(() => setShowRest(false), 400);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restRunning]);

  const { totalSets, doneSets, volume } = sessionTotals(exercises);

  const handleLogSet = (exIdx: number, setIdx: number, patch: Pick<ActiveSet, 'weight' | 'reps' | 'rpe'>) => {
    const out = logSet(exercises, exIdx, setIdx, patch);
    setExercises(out.exercises);
    if (out.autoreg) {
      setAutoregNote(out.autoreg);
      if (autoregTimeout.current) clearTimeout(autoregTimeout.current);
      autoregTimeout.current = setTimeout(() => setAutoregNote(null), 6000);
    }
    if (out.nextFocusIdx != null) setFocusedIdx(out.nextFocusIdx);
    if (mode === 'live') {
      setRestTotal(out.restSec);
      setRestRemaining(out.restSec);
      setShowRest(true);
    }
  };

  const swapExercise = (exId: string, newName: string) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === exId ? { ...e, name: newName, unavailable: false, swapped: true } : e)),
    );
    setShowSwap(null);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onExit} style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}>
          <Icon.close size={18} color={colors.fg} />
        </Pressable>
        <View style={styles.headerBody}>
          <Text style={type.xs}>{mode === 'log-past' ? 'Log past workout' : 'Push · Heavy'}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.clock}>{mode === 'log-past' ? '—' : formatClock(elapsed)}</Text>
            <Text style={type.sm}>
              {doneSets}/{totalSets} sets · {Math.round(volume).toLocaleString()} kg
            </Text>
          </View>
        </View>
        <Pressable onPress={onExit} style={({ pressed }) => [styles.finishBtn, pressed && styles.pressed]}>
          <Text style={styles.finishText}>{mode === 'log-past' ? 'Save' : 'Finish'}</Text>
        </Pressable>
      </View>

      {/* Progreso */}
      <View style={styles.progress}>
        <ProgressBar value={doneSets} max={totalSets} height={3} />
      </View>

      {/* Lista de ejercicios */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 140 + insets.bottom }}
      >
        {exercises.map((ex, i) => (
          <ExerciseBlock
            key={ex.id}
            exercise={ex}
            index={i}
            focused={i === focusedIdx}
            onFocus={() => setFocusedIdx(i)}
            onLogSet={(setIdx, patch) => handleLogSet(i, setIdx, patch)}
            onSwap={() => setShowSwap(ex.id)}
            onTechnique={() => setShowTech(ex.name)}
            autoregNote={autoregNote && autoregNote.exIdx === i ? autoregNote : null}
            onAutoregInfo={() => setAutoregOpen(true)}
          />
        ))}

        {doneSets === totalSets && (
          <View style={styles.doneCard}>
            <Icon.trophy size={36} color={colors.accent} />
            <Text style={[type.h2, { marginTop: 10 }]}>Workout complete</Text>
            <Text style={[type.sm, { marginTop: 4 }]}>
              Tap Finish to log and contribute to your raid.
            </Text>
          </View>
        )}
      </ScrollView>

      {showRest && (
        <RestTimer
          remaining={restRemaining}
          total={restTotal}
          onSkip={() => {
            setRestRemaining(0);
            setShowRest(false);
          }}
          onAdd={(d) => setRestRemaining((r) => r + d)}
        />
      )}

      {showSwap != null &&
        (() => {
          const ex = exercises.find((e) => e.id === showSwap);
          return ex ? (
            <SwapSheet exercise={ex} onClose={() => setShowSwap(null)} onPick={(name) => swapExercise(showSwap, name)} />
          ) : null;
        })()}

      {autoregOpen && <AutoregSheet onClose={() => setAutoregOpen(false)} />}
      {showTech != null && <TechniqueSheet exerciseName={showTech} onClose={() => setShowTech(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBody: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginTop: 2,
  },
  clock: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 20,
    letterSpacing: 20 * -0.02,
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  finishBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.bg2,
  },
  finishText: {
    fontSize: 13,
    color: colors.fg,
    fontFamily: fonts.sansMedium,
  },
  progress: {
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  doneCard: {
    marginTop: 6,
    padding: 22,
    borderRadius: 14,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
  },
});
