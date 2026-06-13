// Pressable con feedback de press animado (scale 0.97 eased) — drop-in para
// los Pressable que hoy hacen `pressed && scale(...)` (que salta sin transición).
// Regla emil: los botones/superficies deben sentirse responsivos; transform-only,
// curva firma, retorno algo más lento que la entrada; reduce-motion lo salta.
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { pressReturnTiming, pressTiming } from '@/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  /** Escala al presionar (default 0.97). */
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
};

export function PressableScale({
  children,
  scaleTo = 0.97,
  style,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Mutar `sharedValue.value` en callbacks es el patrón oficial de Reanimated;
  // el eslint del React Compiler lo marca como falso positivo (no es estado de React).
  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={(e) => {
        // eslint-disable-next-line react-hooks/immutability
        if (!disabled) scale.value = withTiming(scaleTo, pressTiming);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withTiming(1, pressReturnTiming);
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
