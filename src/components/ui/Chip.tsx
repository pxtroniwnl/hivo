// Port de .chip / .chip-acc / .chip-solid (hivo-design/tokens.css:116-139).
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { colors, fonts, radii } from '@/theme';

type ChipProps = {
  children: ReactNode;
  variant?: 'default' | 'acc' | 'solid';
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Chip({ children, variant = 'default', icon, style, textStyle }: ChipProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'acc' && styles.acc,
        variant === 'solid' && styles.solid,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          variant === 'acc' && styles.textAcc,
          variant === 'solid' && styles.textSolid,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  acc: {
    backgroundColor: colors.accentSoft,
    borderColor: 'transparent',
  },
  solid: {
    backgroundColor: colors.accent,
    borderColor: 'transparent',
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 11 * 0.02,
    color: colors.fgMid,
  },
  textAcc: { color: colors.accent },
  textSolid: { color: colors.accentFg },
});
