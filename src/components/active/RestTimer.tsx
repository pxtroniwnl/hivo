// Port de RestTimer (active.jsx:422-470): dock flotante con barra de relleno,
// +15s y Skip. El backdrop-filter del proto se aproxima con el rgba base.
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';
import { colors, fonts, type } from '@/theme';

type RestTimerProps = {
  remaining: number;
  total: number;
  onSkip: () => void;
  onAdd: (seconds: number) => void;
};

export function RestTimer({ remaining, total, onSkip, onAdd }: RestTimerProps) {
  const insets = useSafeAreaInsets();
  const pct = total > 0 ? remaining / total : 0;
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const overdue = remaining === 0;

  return (
    <View style={[styles.dock, { bottom: 12 + insets.bottom }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${pct * 100}%`,
            backgroundColor: overdue ? colors.ok : colors.accentSoft,
          },
        ]}
      />
      <View style={styles.row}>
        <Icon.timer size={18} color={colors.accent} />
        <View style={styles.body}>
          <Text style={[type.xs, styles.label]}>{overdue ? 'HR recovered — ready' : 'Rest'}</Text>
          <Text style={styles.clock}>
            {mm}:{String(ss).padStart(2, '0')}
          </Text>
        </View>
        <Pressable onPress={() => onAdd(15)} style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
          <Text style={styles.addText}>+15s</Text>
        </Pressable>
        <Pressable onPress={onSkip} style={({ pressed }) => [styles.skipBtn, pressed && styles.pressed]}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 25,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,28,0.96)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 },
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  body: {
    flex: 1,
  },
  label: {
    color: colors.fgMid,
  },
  clock: {
    marginTop: 2,
    fontFamily: fonts.monoSemiBold,
    fontSize: 22,
    letterSpacing: 22 * -0.03,
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  addBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  addText: {
    fontSize: 12,
    color: colors.fgMid,
    fontFamily: fonts.sansMedium,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  skipText: {
    fontSize: 12,
    color: colors.accentFg,
    fontFamily: fonts.sansSemiBold,
  },
});
