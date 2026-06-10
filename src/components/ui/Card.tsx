// Port de .card / .card-elev (hivo-design/tokens.css:100-113).
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, space } from '@/theme';

type CardProps = ViewProps & {
  variant?: 'default' | 'elev';
  padding?: number;
};

export function Card({ variant = 'default', padding = space.s4, style, ...rest }: CardProps) {
  return (
    <View
      style={[styles.base, variant === 'elev' && styles.elev, { padding }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.bg2,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  elev: {
    backgroundColor: colors.bg3,
    borderColor: colors.lineStrong,
  },
});
