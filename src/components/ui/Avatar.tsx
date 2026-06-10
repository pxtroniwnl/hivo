// Port de Avatar (hivo-design/ui.jsx:37-48 + tokens.css:167-174).
// El gradiente sutil del proto se aproxima con bg3 sólido + borde (sin dependencia de gradientes).
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type AvatarProps = {
  name: string;
  size?: number;
  /** Color de fondo alternativo (el proto usa gradiente accent para el usuario actual). */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({ name, size = 36, color, style }: AvatarProps) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color ?? colors.bg3,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
  },
  text: {
    fontFamily: fonts.sansSemiBold,
    color: colors.fg,
  },
});
