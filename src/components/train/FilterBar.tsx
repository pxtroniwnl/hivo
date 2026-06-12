// Port de FilterBar (train.jsx:300-340): chips de nivel + segmented de tipo.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { LibraryFilters } from '@/lib/library';
import { mixOklab } from '@/lib/heat';
import { colors, fonts } from '@/theme';

import { LEVELS, LEVEL_COLORS } from './badges';

type FilterBarProps = {
  level: LibraryFilters['level'];
  setLevel: (l: LibraryFilters['level']) => void;
  type: LibraryFilters['type'];
  setType: (t: LibraryFilters['type']) => void;
};

const TYPE_OPTIONS: { id: LibraryFilters['type']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'workouts', label: 'Workouts' },
  { id: 'routines', label: 'Routines' },
];

export function FilterBar({ level, setLevel, type: typeFilter, setType }: FilterBarProps) {
  const levelOptions: LibraryFilters['level'][] = ['All', ...LEVELS];
  return (
    <View style={styles.col}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {levelOptions.map((lv) => {
          const active = level === lv;
          const c = lv === 'All' ? colors.accent : LEVEL_COLORS[lv];
          return (
            <Pressable
              key={lv}
              onPress={() => setLevel(lv)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? lv === 'All'
                      ? colors.accent
                      : mixOklab(c, colors.bg3, 0.22)
                    : colors.bg2,
                  borderColor: active ? c : colors.line,
                },
              ]}
            >
              {lv !== 'All' && <View style={[styles.dot, { backgroundColor: LEVEL_COLORS[lv] }]} />}
              <Text
                style={[
                  styles.chipText,
                  { color: active ? (lv === 'All' ? colors.accentFg : c) : colors.fgMid },
                ]}
              >
                {lv}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.segmented}>
        {TYPE_OPTIONS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setType(t.id)}
            style={[styles.segBtn, typeFilter === t.id && styles.segBtnOn]}
          >
            <Text style={[styles.segText, typeFilter === t.id && styles.segTextOn]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    gap: 8,
  },
  chips: {
    gap: 6,
    paddingRight: 18,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: 10,
    padding: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segBtnOn: {
    backgroundColor: colors.bg3,
  },
  segText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11.5,
    color: colors.fgMute,
  },
  segTextOn: {
    color: colors.fg,
  },
});
