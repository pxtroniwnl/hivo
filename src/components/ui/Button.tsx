// Port de .btn / .btn-primary / .btn-ghost (hivo-design/tokens.css:142-154).
// Press = scale animado (0.97, curva firma) vía PressableScale — no un snap.
import type { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii } from '@/theme';

import { PressableScale } from './PressableScale';

type ButtonProps = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  block?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  children,
  variant = 'default',
  block,
  icon,
  iconRight,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  return (
    <PressableScale
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        block && styles.block,
        style,
      ]}
      {...rest}
    >
      {icon}
      <Text
        style={[
          styles.text,
          variant === 'primary' && styles.textPrimary,
          variant === 'ghost' && styles.textGhost,
          textStyle,
        ]}
      >
        {children}
      </Text>
      {iconRight}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
  },
  primary: { backgroundColor: colors.accent },
  ghost: { backgroundColor: 'transparent' },
  block: { alignSelf: 'stretch' },
  text: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    letterSpacing: 15 * -0.005,
    color: colors.fg,
  },
  textPrimary: { color: colors.accentFg },
  textGhost: { color: colors.fgMid },
});
