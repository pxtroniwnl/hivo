// Port de AddExerciseSheet (train.jsx:1362-1415): búsqueda + librería.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon, Sheet } from '@/components/ui';
import { EXERCISE_LIBRARY } from '@/data/exercise-library';
import { colors, fonts } from '@/theme';

import { SearchIcon } from './badges';

type AddExerciseSheetProps = {
  onClose: () => void;
  onPick: (name: string) => void;
  onPreviewTechnique?: (name: string) => void;
};

export function AddExerciseSheet({ onClose, onPick, onPreviewTechnique }: AddExerciseSheetProps) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const filtered = EXERCISE_LIBRARY.filter(
    (e) => !q || e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q),
  );
  return (
    <Sheet
      onClose={onClose}
      title="Add exercise"
      subtitle={`${EXERCISE_LIBRARY.length} in library · plus your custom`}
    >
      <View style={styles.search}>
        <SearchIcon />
        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercises…"
          placeholderTextColor={colors.fgDim}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.list}>
        {filtered.map((e) => (
          <View key={e.name} style={styles.row}>
            <Pressable style={styles.rowBody} onPress={() => onPick(e.name)}>
              <Text style={styles.rowName}>{e.name}</Text>
              <Text style={styles.rowMuscle}>{e.muscle}</Text>
            </Pressable>
            {onPreviewTechnique && (
              <Pressable
                onPress={() => onPreviewTechnique(e.name)}
                style={({ pressed }) => [styles.infoBtn, pressed && styles.pressed]}
              >
                <Icon.info size={13} color={colors.fgMid} />
              </Pressable>
            )}
            <Pressable
              onPress={() => onPick(e.name)}
              style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
            >
              <Icon.plus size={13} color={colors.accent} />
            </Pressable>
          </View>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.fg,
  },
  list: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.fg,
  },
  rowMuscle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  infoBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.bg3,
  },
  addBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
  },
});
