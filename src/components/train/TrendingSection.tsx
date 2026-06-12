// Port de TrendingSection (train.jsx:492-566): búsqueda + filtros + resultados.
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { ROUTINES, WORKOUTS } from '@/data/mock';
import type { Routine, Workout } from '@/data/types';
import { filterTrending, type LibraryFilters, type LibraryItem } from '@/lib/library';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { FilterBar } from './FilterBar';
import { ProgramCard } from './ProgramCard';
import { SearchIcon } from './badges';

type TrendingSectionProps = {
  filters: LibraryFilters;
  setLevel: (l: LibraryFilters['level']) => void;
  setType: (t: LibraryFilters['type']) => void;
  setQuery: (q: string) => void;
  onOpenRoutine: (r: Routine) => void;
  onOpenWorkout: (w: Workout) => void;
};

export function TrendingSection({
  filters,
  setLevel,
  setType,
  setQuery,
  onOpenRoutine,
  onOpenWorkout,
}: TrendingSectionProps) {
  const all = useMemo<LibraryItem[]>(
    () => [
      ...WORKOUTS.trending.map((w) => ({ ...w, kind: 'workout' as const })),
      ...ROUTINES.trending.map((r) => ({ ...r, kind: 'routine' as const })),
    ],
    [],
  );
  const filtered = filterTrending(all, filters);
  const q = filters.query.trim();

  return (
    <View style={styles.section}>
      {/* Búsqueda dentro de Trending */}
      <View style={styles.search}>
        <SearchIcon />
        <TextInput
          value={filters.query}
          onChangeText={setQuery}
          placeholder="Search workouts, routines, exercises…"
          placeholderTextColor={colors.fgDim}
          style={styles.searchInput}
        />
        {filters.query !== '' && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Icon.close size={14} color={colors.fgMute} />
          </Pressable>
        )}
      </View>

      <FilterBar level={filters.level} setLevel={setLevel} type={filters.type} setType={setType} />

      <Text style={[type.xs, styles.count]}>
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        {filters.level !== 'All' ? ` · ${filters.level}` : ''}
      </Text>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[type.sm, styles.emptyText]}>
            Nothing matches those filters{q ? ` for "${q}"` : ''}.
          </Text>
          <Pressable
            onPress={() => {
              setLevel('All');
              setType('all');
              setQuery('');
            }}
            style={({ pressed }) => [styles.resetBtn, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Text style={styles.resetText}>Reset filters</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {filtered.map((item) => (
            <ProgramCard
              key={item.id}
              item={item}
              showStats
              onOpen={() => (item.kind === 'workout' ? onOpenWorkout(item) : onOpenRoutine(item))}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 14,
    paddingHorizontal: screenInset,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.fg,
  },
  count: {
    marginTop: 14,
    marginBottom: 10,
  },
  empty: {
    padding: 22,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12.5,
  },
  resetBtn: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
  },
  resetText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.fg,
  },
  list: {
    gap: 8,
  },
});
