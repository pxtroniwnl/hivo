// Port de Sheet (hivo-design/active.jsx:657-692) — modal bottom-up con scrim,
// handle, título y botón de cierre. Motion (skills emil/impeccable): el panel
// entra con la curva iOS-drawer y sale más rápido; el scrim hace fade
// coordinado; gestiona su animación de salida antes de desmontar. reduce-motion
// salta la animación.
import { useEffect, type ReactNode } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, type } from '@/theme';
import { durations, easing, useReduceMotion } from '@/theme/motion';

import { Icon } from './icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// Distancia de entrada del panel (suficiente para arrancar fuera de pantalla).
const TRAVEL = Math.min(Dimensions.get('window').height * 0.9, 640);

type SheetProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
  subtitle?: string;
};

export function Sheet({ children, onClose, title, subtitle }: SheetProps) {
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduce) {
      progress.value = 1;
      return;
    }
    progress.value = withTiming(1, { duration: durations.slow, easing: easing.drawer });
  }, [reduce, progress]);

  const close = () => {
    if (reduce) {
      onClose();
      return;
    }
    // Salida más rápida que la entrada (emil); al terminar, desmonta.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withTiming(0, { duration: durations.fast, easing: easing.drawer }, (finished) => {
      'worklet';
      if (finished) runOnJS(onClose)();
    });
  };

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 1], [0, 1, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [TRAVEL, 0]) }],
  }));

  return (
    <Modal transparent visible animationType="none" onRequestClose={close}>
      <View style={styles.root}>
        <AnimatedPressable style={[styles.scrim, scrimStyle]} onPress={close} />
        <Animated.View style={[styles.panel, panelStyle, { paddingBottom: 28 + insets.bottom }]}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={type.h2}>{title}</Text>
              {subtitle ? <Text style={[type.sm, { marginTop: 4 }]}>{subtitle}</Text> : null}
            </View>
            <Pressable style={styles.closeBtn} onPress={close}>
              <Icon.close size={14} color={colors.fgMid} />
            </Pressable>
          </View>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lineStrong,
    padding: 18,
    maxHeight: '80%',
  },
  handleRow: {
    alignItems: 'center',
    marginBottom: 14,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bg4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
