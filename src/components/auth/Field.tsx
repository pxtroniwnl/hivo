// Port de Field (hivo-design/auth.jsx:241-263): label xs + input en card bg2.
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { colors, fonts, type } from '@/theme';

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  right?: ReactNode;
};

export function Field({ label, value, onChange, placeholder, secure, keyboardType, right }: FieldProps) {
  return (
    <View>
      <Text style={[type.xs, styles.label]}>{label}</Text>
      <View style={styles.box}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.fgDim}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' || secure ? 'none' : undefined}
          style={styles.input}
        />
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.fg,
  },
});
