// Port de ProgressBar (hivo-design/ui.jsx:55-65).
import { View } from 'react-native';

import { colors, radii } from '@/theme';

type ProgressBarProps = {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  bg?: string;
};

export function ProgressBar({
  value,
  max = 100,
  color = colors.accent,
  height = 6,
  bg = colors.bg3,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View
      style={{
        width: '100%',
        height,
        backgroundColor: bg,
        borderRadius: radii.pill,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: radii.pill,
        }}
      />
    </View>
  );
}
