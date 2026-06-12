// Port de NumberRow + TextRow + MetaCard (train.jsx:1288-1334).
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radii, type } from '@/theme';

export function NumberRow({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={[type.sm, styles.rowLabel]}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - step))}
          style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>
          {value}
          {unit != null && <Text style={styles.stepUnit}>{unit}</Text>}
        </Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + step))}
          style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function TextRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={[type.sm, styles.rowLabel]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.fgDim}
        style={styles.textInput}
      />
    </View>
  );
}

export function MetaCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metaCard}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={[type.xs, styles.metaLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    color: colors.fgMid,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bg3,
    borderRadius: 10,
    padding: 3,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 16,
    lineHeight: 18,
    color: colors.fgMid,
  },
  stepValue: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 14,
    minWidth: 36,
    textAlign: 'center',
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  stepUnit: {
    fontSize: 11,
    color: colors.fgMute,
  },
  textInput: {
    width: 100,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    color: colors.fg,
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    textAlign: 'center',
  },
  metaCard: {
    flex: 1,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
  },
  metaValue: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 18,
    letterSpacing: 18 * -0.02,
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  metaLabel: {
    marginTop: 3,
  },
});
