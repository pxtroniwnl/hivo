// Port de ExerciseBlock (active.jsx:201-310): card hybrid — expandida si está
// enfocada, colapsada con mini-dots si no.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, Icon } from '@/components/ui';
import type { ActiveExercise, ActiveSet } from '@/data/types';
import type { AutoregNote } from '@/lib/active';
import { colors, fonts, type } from '@/theme';

import { SET_TYPE_COLOR, SetRow } from './SetRow';

type ExerciseBlockProps = {
  exercise: ActiveExercise;
  index: number;
  focused: boolean;
  onFocus: () => void;
  onLogSet: (setIdx: number, patch: Pick<ActiveSet, 'weight' | 'reps' | 'rpe'>) => void;
  onSwap: () => void;
  onTechnique: () => void;
  autoregNote: AutoregNote | null;
  onAutoregInfo: () => void;
};

export function ExerciseBlock({
  exercise: ex,
  index,
  focused,
  onFocus,
  onLogSet,
  onSwap,
  onTechnique,
  autoregNote,
  onAutoregInfo,
}: ExerciseBlockProps) {
  const expanded = focused;
  const allDone = ex.sets.every((s) => s.done);

  return (
    <View style={[styles.block, expanded && styles.blockExpanded]}>
      {/* Header */}
      <Pressable onPress={onFocus} style={styles.head}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.headBody}>
          <View style={styles.nameRow}>
            <Text style={[type.h3, styles.name]} numberOfLines={1}>
              {ex.name}
            </Text>
            {allDone && <Icon.check size={14} color={colors.ok} />}
            {ex.unavailable && (
              <View style={styles.warnChip}>
                <Icon.warn size={9} color={colors.warn} />
                <Text style={styles.warnChipText}>Not in gym</Text>
              </View>
            )}
            {ex.swapped && <Chip variant="acc">Swapped</Chip>}
          </View>
          <Text style={[type.sm, styles.meta]} numberOfLines={1}>
            {ex.muscle} · {ex.equipment} · last {ex.lastSession.weight}kg×{ex.lastSession.reps} @
            {ex.lastSession.rpe}
          </Text>
        </View>
        <Pressable onPress={onTechnique} style={styles.techBtn} hitSlop={6}>
          <Icon.info size={13} color={colors.fgMid} />
        </Pressable>
        {/* Mini dots de sets */}
        <View style={styles.dots}>
          {ex.sets.map((s, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: s.done ? SET_TYPE_COLOR[s.type] : colors.bg4,
                  opacity: s.done ? 1 : 0.6,
                },
              ]}
            />
          ))}
        </View>
      </Pressable>

      {/* Tabla de sets */}
      {expanded && (
        <View style={styles.body}>
          {ex.unavailable && (
            <Pressable onPress={onSwap} style={({ pressed }) => [styles.swapBanner, pressed && { transform: [{ scale: 0.98 }] }]}>
              <Icon.swap size={14} color={colors.warn} />
              <Text style={styles.swapText}>
                Cable not available at Powerhouse — tap to substitute
              </Text>
              <Icon.arrow size={12} color={colors.warn} />
            </Pressable>
          )}

          {/* Cabeceras */}
          <View style={styles.cols}>
            <Text style={[styles.colLabel, { width: 24 }]}>SET</Text>
            <Text style={[styles.colLabel, { flex: 1 }]}>PREVIOUS</Text>
            <Text style={[styles.colLabel, { width: 64, textAlign: 'right' }]}>KG</Text>
            <Text style={[styles.colLabel, { width: 56, textAlign: 'center' }]}>REPS</Text>
            <Text style={[styles.colLabel, { width: 56, textAlign: 'center' }]}>RPE</Text>
            <View style={{ width: 28 }} />
          </View>
          {ex.sets.map((s, i) => (
            <SetRow
              key={i}
              set={s}
              setNumber={
                ex.sets.slice(0, i + 1).filter((x) => x.type !== 'warmup').length ||
                (s.type === 'warmup' ? 'w' : 1)
              }
              lastSession={ex.lastSession}
              onLog={(patch) => onLogSet(i, patch)}
              autoregActive={autoregNote?.setIdx === i}
              onAutoregInfo={onAutoregInfo}
            />
          ))}

          <Pressable style={styles.addSet}>
            <Icon.plus size={13} color={colors.fgMute} />
            <Text style={styles.addSetText}>Add set</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  blockExpanded: {
    backgroundColor: colors.bg2,
    borderColor: colors.lineStrong,
  },
  head: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 12,
    color: colors.fgMute,
  },
  headBody: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 15,
    flexShrink: 1,
  },
  warnChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(245,181,74,0.12)',
  },
  warnChipText: {
    fontSize: 10,
    color: colors.warn,
    fontFamily: fonts.sansMedium,
  },
  meta: {
    marginTop: 3,
    fontSize: 13,
  },
  techBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  swapBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(245,181,74,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.warn,
    borderStyle: 'dashed',
  },
  swapText: {
    flex: 1,
    fontSize: 12,
    color: colors.warn,
    fontFamily: fonts.sansMedium,
  },
  cols: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  colLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 10 * 0.04,
    color: colors.fgMute,
    textTransform: 'uppercase',
  },
  addSet: {
    marginTop: 6,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addSetText: {
    fontSize: 13,
    color: colors.fgMute,
    fontFamily: fonts.sansMedium,
  },
});
