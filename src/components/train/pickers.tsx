// Port de DayPicker + LevelPicker (train.jsx:916-967). El <select> nativo del
// proto se hace con un dropdown propio (igual que LevelPicker).
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { RoutineLevel } from '@/data/types';
import { colors, fonts } from '@/theme';

import { LEVELS, LEVEL_COLORS, LevelChip } from './badges';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Caret({ size = 10 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={colors.fgMute} strokeWidth={2}>
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function DayPicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.anchor}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.dayBtn} hitSlop={4}>
        <Text style={styles.dayText}>{value}</Text>
        <Caret size={9} />
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {DAYS.map((d) => (
            <Pressable
              key={d}
              onPress={() => {
                onChange(d);
                setOpen(false);
              }}
              style={styles.option}
            >
              <Text style={[styles.optionText, d === value && { color: colors.accent }]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function LevelPicker({
  value,
  onChange,
  editable,
}: {
  value: RoutineLevel;
  onChange: (l: RoutineLevel) => void;
  editable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!editable) return <LevelChip level={value} />;
  return (
    <View style={styles.anchor}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.levelBtn} hitSlop={4}>
        <LevelChip level={value} />
        <Caret />
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {LEVELS.map((lv) => (
            <Pressable
              key={lv}
              onPress={() => {
                onChange(lv);
                setOpen(false);
              }}
              style={styles.option}
            >
              <View style={[styles.dot, { backgroundColor: LEVEL_COLORS[lv] }]} />
              <Text style={styles.optionText}>{lv}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'relative',
    zIndex: 10,
  },
  dayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  dayText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.fg,
  },
  levelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    borderRadius: 10,
    padding: 4,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    minWidth: 120,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  optionText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.fg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
});
