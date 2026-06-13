// Port de StatsSparklesIcon (other-screens.jsx:951-962): glifo de IA (fill).
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

export function SparklesIcon({ size = 20, color = colors.accentFg }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M12 2l1.7 4.6 4.6 1.7-4.6 1.7L12 14.6 10.3 10l-4.6-1.7 4.6-1.7L12 2z" />
      <Path d="M19 13l.8 2.2 2.2.8-2.2.8L19 19l-.8-2.2-2.2-.8 2.2-.8L19 13z" opacity={0.7} />
      <Path d="M5 15l.7 1.9 1.9.6-1.9.6L5 20l-.7-1.9-1.9-.6 1.9-.6L5 15z" opacity={0.5} />
    </Svg>
  );
}
