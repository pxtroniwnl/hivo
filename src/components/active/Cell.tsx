// Port de Cell (active.jsx:398-417): celda numérica mono editable.
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { colors, fonts } from '@/theme';

type CellProps = {
  value: number;
  onChange: (v: number) => void;
  align?: 'left' | 'center' | 'right';
  disabled?: boolean;
  accent?: boolean;
};

export function Cell({ value, onChange, align = 'left', disabled, accent }: CellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    setEditing(false);
    if (draft != null) {
      const n = parseFloat(draft.replace(',', '.'));
      if (!Number.isNaN(n)) onChange(n);
      setDraft(null);
    }
  };

  return (
    <TextInput
      value={draft ?? String(value)}
      editable={!disabled}
      keyboardType="decimal-pad"
      selectTextOnFocus
      onFocus={() => setEditing(true)}
      onChangeText={setDraft}
      onBlur={commit}
      onSubmitEditing={commit}
      style={[
        styles.cell,
        { textAlign: align },
        editing && styles.editing,
        accent && !disabled && { color: colors.accent },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: colors.fg,
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    letterSpacing: 14 * -0.01,
    fontVariant: ['tabular-nums'],
  },
  editing: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
});
