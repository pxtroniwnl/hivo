// Port de EditableField (train.jsx:1235-1286): texto que al tocar se vuelve
// input (fondo accent-soft + borde accent); commit al blur/submit.
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import { colors, fonts } from '@/theme';

type EditableFieldProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

export function EditableField({ value, onChange, placeholder, multiline, textStyle }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');

  const startEditing = () => {
    setDraft(value || '');
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    onChange((draft || '').trim());
  };

  if (!editing) {
    const isEmpty = !value;
    return (
      <Pressable onPress={startEditing}>
        <Text
          style={[
            styles.display,
            textStyle,
            isEmpty && styles.empty,
          ]}
        >
          {value || placeholder}
        </Text>
      </Pressable>
    );
  }

  return (
    <TextInput
      autoFocus
      value={draft}
      onChangeText={setDraft}
      onBlur={commit}
      onSubmitEditing={multiline ? undefined : commit}
      placeholder={placeholder}
      placeholderTextColor={colors.fgDim}
      multiline={multiline}
      style={[styles.input, textStyle]}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fonts.sans,
    color: colors.fg,
  },
  empty: {
    color: colors.fgMute,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  input: {
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontFamily: fonts.sans,
    color: colors.fg,
  },
});
