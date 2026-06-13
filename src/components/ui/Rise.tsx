// Entrada estándar de secciones/items: fade + translateY pequeño con la curva
// firma y stagger capado (emil: 30–80ms; impeccable: limitar el total).
// reduce-motion → sin movimiento (render directo).
import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { durations, easing, stagger, useReduceMotion } from '@/theme/motion';

type RiseProps = {
  children: ReactNode;
  /** Índice para el stagger (delay = index × 50ms, capado). */
  index?: number;
  /** Delay extra en ms, sobre el del índice. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function Rise({ children, index = 0, delay = 0, style }: RiseProps) {
  const reduce = useReduceMotion();
  if (reduce) {
    return <View style={style}>{children}</View>;
  }
  return (
    <Animated.View
      style={style}
      entering={FadeInDown.delay(stagger.delayFor(index) + delay)
        .duration(durations.enter)
        .easing(easing.signature)}
    >
      {children}
    </Animated.View>
  );
}
