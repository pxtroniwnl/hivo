// Control segmentado con pill indicador deslizante (Reanimated). Reemplaza los
// segmented inline duplicados por toda la app. El pill se desliza con la curva
// firma; reduce-motion → salta. Texto activo/inactivo por color (instantáneo).
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, radii } from '@/theme';
import { durations, easing, useReduceMotion } from '@/theme/motion';

const PAD = 3;

export type SegmentedOption = { id: string; label: string };

type SegmentedProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Segmented({ options, value, onChange, style, textStyle }: SegmentedProps) {
  const reduce = useReduceMotion();
  const [width, setWidth] = useState(0);
  const tx = useSharedValue(0);
  const first = useRef(true);

  const n = options.length;
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const pillW = width > 0 ? (width - PAD * 2) / n : 0;

  useEffect(() => {
    if (pillW <= 0) return;
    const target = PAD + idx * pillW;
    if (first.current || reduce) {
      tx.value = target;
      first.current = false;
    } else {
      tx.value = withTiming(target, { duration: durations.base, easing: easing.signature });
    }
  }, [idx, pillW, reduce, tx]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }], width: pillW }));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {pillW > 0 ? <Animated.View style={[styles.pill, pillStyle]} /> : null}
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable key={o.id} style={styles.btn} onPress={() => onChange(o.id)}>
            <Text style={[styles.text, active && styles.textActive, textStyle]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: radii.sm,
    padding: PAD,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  pill: {
    position: 'absolute',
    top: PAD,
    bottom: PAD,
    left: 0,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
  },
  btn: { flex: 1, paddingVertical: 9, paddingHorizontal: 12, alignItems: 'center', zIndex: 1 },
  text: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.fgMute },
  textActive: { color: colors.fg },
});
