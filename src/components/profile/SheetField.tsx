// Port de SheetField (other-screens.jsx:1455-1480): label + input, con
// variantes disabled/inline/help y soporte de password/email.
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radii, type } from '@/theme';

type SheetFieldProps = {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  disabled?: boolean;
  help?: string;
  inline?: boolean;
};

export function SheetField({
  label,
  value,
  onChange,
  type: kind = 'text',
  placeholder,
  disabled,
  help,
  inline,
}: SheetFieldProps) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={[type.xs, { fontSize: 10 }]}>{label}</Text>
        {help ? <Text style={styles.help}>{help}</Text> : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.fgDim}
        editable={!disabled}
        secureTextEntry={kind === 'password'}
        keyboardType={kind === 'email' ? 'email-address' : 'default'}
        autoCapitalize={kind === 'email' || kind === 'password' ? 'none' : 'sentences'}
        autoCorrect={false}
        style={[
          styles.input,
          { backgroundColor: inline ? colors.bg2 : colors.bg3 },
          disabled && { color: colors.fgMute },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  help: { fontFamily: fonts.sans, fontSize: 10, color: colors.fgMute },
  input: {
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    color: colors.fg,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
});
