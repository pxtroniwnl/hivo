// Port de EditableExerciseRow (train.jsx:1160-1229): fila expandible con
// nombre editable, resumen mono y steppers de sets/reps/rest/RPE.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/ui';
import type { RoutineExercise } from '@/data/types';
import { colors, fonts, radii } from '@/theme';

import { EditableField } from './EditableField';
import { NumberRow, TextRow } from './rows';

type EditableExerciseRowProps = {
  exercise: RoutineExercise;
  index: number;
  count: number;
  onUpdate: (patch: Partial<RoutineExercise>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onTechnique?: () => void;
};

export function EditableExerciseRow({
  exercise,
  index,
  count,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onTechnique,
}: EditableExerciseRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.body}>
          <EditableField
            value={exercise.name}
            onChange={(v) => onUpdate({ name: v })}
            placeholder="Exercise name"
            textStyle={styles.nameText}
          />
          <Text style={styles.summary}>
            {exercise.sets}×{exercise.reps} · {exercise.rest}s rest · RPE {exercise.rpe}
          </Text>
        </View>
        {onTechnique && (
          <Pressable onPress={onTechnique} style={styles.iconBtn} hitSlop={6}>
            <Icon.info size={14} color={colors.fgMute} />
          </Pressable>
        )}
        <Pressable onPress={() => setExpanded((e) => !e)} style={styles.iconBtn} hitSlop={6}>
          <Svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke={colors.fgMute}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          >
            <Path d="M6 9l6 6 6-6" />
          </Svg>
        </Pressable>
      </View>

      {expanded && (
        <View style={styles.detail}>
          <NumberRow label="Sets" value={exercise.sets} onChange={(v) => onUpdate({ sets: v })} min={1} max={10} />
          <TextRow label="Reps" value={exercise.reps} onChange={(v) => onUpdate({ reps: v })} placeholder="e.g. 8-10" />
          <NumberRow label="Rest" value={exercise.rest} onChange={(v) => onUpdate({ rest: v })} min={15} max={300} step={15} unit="s" />
          <NumberRow label="Target RPE" value={exercise.rpe} onChange={(v) => onUpdate({ rpe: v })} min={5} max={10} step={1} />
          <View style={styles.actions}>
            <Pressable
              onPress={onMoveUp}
              disabled={index === 0}
              style={({ pressed }) => [styles.moveBtn, pressed && styles.pressed]}
            >
              <Text style={[styles.moveText, index === 0 && styles.disabledText]}>↑ Move up</Text>
            </Pressable>
            <Pressable
              onPress={onMoveDown}
              disabled={index === count - 1}
              style={({ pressed }) => [styles.moveBtn, pressed && styles.pressed]}
            >
              <Text style={[styles.moveText, index === count - 1 && styles.disabledText]}>
                ↓ Move down
              </Text>
            </Pressable>
            <Pressable
              onPress={onRemove}
              style={({ pressed }) => [styles.removeBtn, pressed && styles.pressed]}
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  head: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 11,
    color: colors.fgMute,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  nameText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.fg,
  },
  summary: {
    marginTop: 3,
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.fgMute,
    fontVariant: ['tabular-nums'],
  },
  iconBtn: {
    padding: 6,
  },
  detail: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  moveBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 9,
    backgroundColor: colors.bg3,
    alignItems: 'center',
  },
  moveText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.fgMid,
  },
  disabledText: {
    color: colors.fgDim,
  },
  removeBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 9,
    backgroundColor: 'rgba(255,107,107,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,107,107,0.3)',
    alignItems: 'center',
  },
  removeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.err,
  },
});
