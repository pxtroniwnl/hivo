// Port de SetRow (active.jsx:315-396): fila de set con label por tipo,
// última sesión (tap para autocompletar — CLAUDE.md §logger), celdas y check.
// La nota de autoreg aparece encima del set ajustado, siempre explicable.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { ActiveSet, SetType } from '@/data/types';
import { colors, fonts } from '@/theme';

import { Cell } from './Cell';

export const SET_TYPE_LABEL: Record<SetType, string> = {
  warmup: 'W',
  normal: '',
  drop: 'D',
  failure: 'F',
  superset: 'S',
  cluster: 'C',
};

export const SET_TYPE_COLOR: Record<SetType, string> = {
  warmup: colors.fgMute,
  normal: colors.accent,
  drop: colors.warn,
  failure: colors.err,
  superset: colors.ok,
  cluster: colors.accent,
};

type SetRowProps = {
  set: ActiveSet;
  setNumber: number | string;
  lastSession: { weight: number; reps: number; rpe: number };
  onLog: (patch: Pick<ActiveSet, 'weight' | 'reps' | 'rpe'>) => void;
  autoregActive?: boolean;
  onAutoregInfo?: () => void;
};

export function SetRow({ set, setNumber, lastSession, onLog, autoregActive, onAutoregInfo }: SetRowProps) {
  const [w, setW] = useState(set.weight);
  const [r, setR] = useState(set.reps);
  const [rpe, setRpe] = useState(set.rpe || set.prescribed?.rpe || 7);
  // El peso puede cambiar desde fuera (autoreg) — sincronizar sin efecto.
  const [lastPropWeight, setLastPropWeight] = useState(set.weight);
  if (set.weight !== lastPropWeight) {
    setLastPropWeight(set.weight);
    setW(set.weight);
  }

  const isDone = set.done;
  const isCurrent = !isDone && !!set.current;
  const label = SET_TYPE_LABEL[set.type] || String(setNumber);

  return (
    <>
      {set.adjusted && autoregActive && (
        <View style={styles.autoregNote}>
          <Icon.bolt size={13} color={colors.accent} />
          <Text style={styles.autoregText}>
            <Text style={styles.autoregBrand}>Adaptive</Text>{' '}
            <Text style={styles.autoregFrom}>{set.adjusted.from} kg</Text>
            {' → '}
            <Text style={styles.autoregTo}>{set.adjusted.to} kg</Text>
          </Text>
          <Pressable onPress={onAutoregInfo} hitSlop={8}>
            <Text style={styles.whyBtn}>Why?</Text>
          </Pressable>
        </View>
      )}
      <View style={[styles.row, isCurrent && styles.rowCurrent, isDone && styles.rowDone]}>
        {/* Label del set */}
        <View
          style={[
            styles.setLabel,
            {
              backgroundColor: isDone ? SET_TYPE_COLOR[set.type] : 'transparent',
              borderColor: isDone ? SET_TYPE_COLOR[set.type] : colors.bg4,
            },
          ]}
        >
          <Text
            style={[
              styles.setLabelText,
              { color: isDone ? colors.accentFg : SET_TYPE_COLOR[set.type] || colors.fgMute },
            ]}
          >
            {label}
          </Text>
        </View>

        {/* Última sesión — tap para autocompletar */}
        <Pressable
          style={styles.prev}
          disabled={isDone}
          onPress={() => {
            setW(lastSession.weight);
            setR(lastSession.reps);
          }}
        >
          <Text style={styles.prevText}>
            {lastSession.weight}×{lastSession.reps}
          </Text>
        </Pressable>

        <View style={styles.wCol}>
          <Cell value={w} onChange={setW} align="right" disabled={isDone} />
        </View>
        <View style={styles.rCol}>
          <Cell value={r} onChange={setR} align="center" disabled={isDone} />
        </View>
        <View style={styles.rCol}>
          <Cell value={rpe} onChange={setRpe} align="center" disabled={isDone} accent />
        </View>

        {/* Log */}
        <Pressable
          disabled={isDone}
          onPress={() => onLog({ weight: w, reps: r, rpe })}
          style={({ pressed }) => [
            styles.logBtn,
            !isDone && { backgroundColor: isCurrent ? colors.accent : colors.bg3 },
            pressed && !isDone && { transform: [{ scale: 0.92 }] },
          ]}
        >
          <Icon.check
            size={15}
            color={isDone ? colors.ok : isCurrent ? colors.accentFg : colors.fgMute}
          />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  autoregNote: {
    marginTop: 4,
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoregText: {
    flex: 1,
    fontSize: 12,
    color: colors.fg,
    fontFamily: fonts.sans,
  },
  autoregBrand: {
    fontFamily: fonts.sansSemiBold,
    color: colors.accent,
  },
  autoregFrom: {
    textDecorationLine: 'line-through',
    color: colors.fgMute,
  },
  autoregTo: {
    fontFamily: fonts.sansSemiBold,
  },
  whyBtn: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.accent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  rowCurrent: {
    backgroundColor: colors.bg3,
    marginHorizontal: -4,
    paddingHorizontal: 8,
  },
  rowDone: {
    opacity: 0.55,
  },
  setLabel: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setLabelText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 11,
  },
  prev: {
    flex: 1,
  },
  prevText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.fgMute,
    fontVariant: ['tabular-nums'],
  },
  wCol: {
    width: 64,
  },
  rCol: {
    width: 56,
  },
  logBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
