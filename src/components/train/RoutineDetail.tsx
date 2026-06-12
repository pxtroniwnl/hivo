// Port de RoutineDetail (train.jsx:972-1154): editor completo de rutina con
// dock pegajoso Save / Start workout.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, Icon } from '@/components/ui';
import type { Routine, RoutineExercise } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { AddExerciseSheet } from './AddExerciseSheet';
import { EditableExerciseRow } from './EditableExerciseRow';
import { EditableField } from './EditableField';
import { KindBadge } from './badges';
import { LevelPicker } from './pickers';
import { MetaCard } from './rows';

function ShareGlyph({ size = 16, color = colors.fg }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={6} cy={12} r={3} />
      <Circle cx={18} cy={6} r={3} />
      <Circle cx={18} cy={18} r={3} />
      <Path d="M8.5 10.5l7-3M8.5 13.5l7 3" />
    </Svg>
  );
}

type RoutineDetailProps = {
  routine: Routine;
  isNew: boolean;
  onChange: (r: Routine) => void;
  onSave: () => void;
  onBack: () => void;
  onStart?: () => void;
  onShare?: () => void;
  onTechnique?: (exerciseName: string) => void;
};

export function RoutineDetail({
  routine,
  isNew,
  onChange,
  onSave,
  onBack,
  onStart,
  onShare,
  onTechnique,
}: RoutineDetailProps) {
  const insets = useSafeAreaInsets();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [saved, setSaved] = useState(false);
  const isMine = routine.author === 'You';

  const update = (patch: Partial<Routine>) => onChange({ ...routine, ...patch });
  const updateEx = (idx: number, patch: Partial<RoutineExercise>) => {
    const exercises = [...routine.exercises];
    exercises[idx] = { ...exercises[idx], ...patch };
    onChange({ ...routine, exercises });
  };
  const removeEx = (idx: number) =>
    onChange({ ...routine, exercises: routine.exercises.filter((_, i) => i !== idx) });
  const moveEx = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= routine.exercises.length) return;
    const exercises = [...routine.exercises];
    [exercises[idx], exercises[next]] = [exercises[next], exercises[idx]];
    onChange({ ...routine, exercises });
  };

  const totalSets = routine.exercises.reduce((n, e) => n + (e.sets || 0), 0);
  const estTime = Math.round(
    routine.exercises.reduce((m, e) => m + (e.sets || 0) * ((e.rest || 90) / 60 + 1), 0),
  );

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 110 + insets.bottom }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
            <Icon.back size={16} color={colors.fgMid} />
          </Pressable>
          <Text style={styles.headerLabel}>
            {isNew ? 'New routine' : isMine ? 'Edit routine' : 'Routine'}
          </Text>
          {onShare && (
            <Pressable onPress={onShare} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
              <ShareGlyph color={colors.fg} />
            </Pressable>
          )}
          {!isMine && !isNew && (
            <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveCopyBtn, pressed && styles.pressed]}>
              <Icon.plus size={13} color={colors.fg} />
              <Text style={styles.saveCopyText}>Save copy</Text>
            </Pressable>
          )}
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <View style={styles.badges}>
            <KindBadge kind="routine" />
            <LevelPicker
              value={routine.level || 'Intermediate'}
              onChange={(v) => update({ level: v })}
              editable={isMine || isNew}
            />
          </View>
          <EditableField
            value={routine.name}
            onChange={(v) => update({ name: v })}
            placeholder="Routine name"
            textStyle={styles.titleText}
          />
          <View style={styles.metaRow}>
            <Text style={[type.sm, styles.metaText]}>by {routine.author}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={[type.sm, styles.metaText]}>{routine.exercises.length} exercises</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={[type.sm, styles.metaText]}>~{estTime} min</Text>
          </View>
          {routine.tags.length > 0 && (
            <View style={styles.tags}>
              {routine.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </View>
          )}
        </View>

        <View style={styles.descBlock}>
          <EditableField
            value={routine.description}
            onChange={(v) => update({ description: v })}
            placeholder="Add a description (optional)"
            multiline
            textStyle={styles.descText}
          />
        </View>

        <View style={styles.metaCards}>
          <MetaCard label="Exercises" value={routine.exercises.length} />
          <MetaCard label="Sets" value={totalSets} />
          <MetaCard label="Duration" value={`~${estTime}m`} />
        </View>

        <View style={styles.exercises}>
          <View style={styles.exercisesHead}>
            <Text style={type.xs}>Exercises</Text>
            <Text style={[type.xs, { color: colors.fgMute }]}>Tap any value to edit</Text>
          </View>
          {routine.exercises.length === 0 ? (
            <Pressable
              onPress={() => setShowAddSheet(true)}
              style={({ pressed }) => [styles.addFirst, pressed && styles.pressed]}
            >
              <Icon.plus size={16} color={colors.fgMid} />
              <Text style={styles.addText}>Add first exercise</Text>
            </Pressable>
          ) : (
            <View style={styles.exerciseList}>
              {routine.exercises.map((ex, i) => (
                <EditableExerciseRow
                  key={i}
                  exercise={ex}
                  index={i}
                  count={routine.exercises.length}
                  onUpdate={(patch) => updateEx(i, patch)}
                  onRemove={() => removeEx(i)}
                  onMoveUp={() => moveEx(i, -1)}
                  onMoveDown={() => moveEx(i, 1)}
                  onTechnique={onTechnique ? () => onTechnique(ex.name) : undefined}
                />
              ))}
              <Pressable
                onPress={() => setShowAddSheet(true)}
                style={({ pressed }) => [styles.addMore, pressed && styles.pressed]}
              >
                <Icon.plus size={14} color={colors.fgMid} />
                <Text style={styles.addText}>Add exercise</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Dock pegajoso (gradiente transparent → bg0) */}
      <View style={[styles.dock, { paddingBottom: 12 + insets.bottom }]}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="dockFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.bg0} stopOpacity={0} />
              <Stop offset="0.4" stopColor={colors.bg0} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#dockFade)" />
        </Svg>
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
          {saved ? (
            <>
              <Icon.check size={14} color={colors.accent} />
              <Text style={styles.saveText}>Saved</Text>
            </>
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </Pressable>
        <Pressable
          onPress={onStart}
          disabled={!onStart}
          style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
        >
          <Icon.play size={16} color={colors.accentFg} />
          <Text style={styles.startText}>Start workout</Text>
        </Pressable>
      </View>

      {showAddSheet && (
        <AddExerciseSheet
          onClose={() => setShowAddSheet(false)}
          onPick={(name) => {
            onChange({
              ...routine,
              exercises: [...routine.exercises, { name, sets: 3, reps: '8-10', rest: 90, rpe: 7 }],
            });
            setShowAddSheet(false);
          }}
          onPreviewTechnique={onTechnique}
        />
      )}
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
    paddingHorizontal: screenInset,
    paddingBottom: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
  saveCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
  },
  saveCopyText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.fg,
  },
  titleBlock: {
    paddingHorizontal: screenInset,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    zIndex: 10,
  },
  titleText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 28,
    letterSpacing: 28 * -0.02,
    lineHeight: 28 * 1.1,
    color: colors.fg,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
  metaDot: {
    color: colors.fgDim,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  descBlock: {
    paddingTop: 14,
    paddingHorizontal: screenInset,
  },
  descText: {
    fontSize: 13,
    color: colors.fgMid,
    lineHeight: 13 * 1.45,
  },
  metaCards: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
    paddingHorizontal: screenInset,
  },
  exercises: {
    paddingTop: 20,
    paddingHorizontal: screenInset,
  },
  exercisesHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseList: {
    gap: 8,
  },
  addFirst: {
    padding: 22,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addMore: {
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.fgMid,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  saveBtn: {
    minWidth: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  saveText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.fg,
  },
  startBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
  },
  startText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.accentFg,
  },
});
