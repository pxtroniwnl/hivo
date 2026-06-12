// Port de .btn / .btn-primary / .btn-ghost (hivo-design/tokens.css:142-154).
// Press = scale 0.98, como el prototipo (:active).
import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii } from '@/theme';

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
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        block && styles.block,
        pressed && { transform: [{ scale: 0.98 }] },
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
    </Pressable>
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
