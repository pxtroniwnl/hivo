// Port de WarmupSheet (hivo-design/home.jsx:694-792) — preview de vídeo,
// detalle del ejercicio activo, lista seleccionable y CTA Next/Finish.
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Chip, Icon, Sheet } from '@/components/ui';
import { colors, fonts, radii, tabularNums, type } from '@/theme';
import type { Warmup } from '@/data/types';

type WarmupSheetProps = {
  warmup: Warmup;
  onClose: () => void;
};

export function WarmupSheet({ warmup, onClose }: WarmupSheetProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = warmup.exercises[activeIdx];
  const isLast = activeIdx >= warmup.exercises.length - 1;

  return (
    <Sheet
      onClose={onClose}
      title={warmup.name}
      subtitle={`${warmup.target} · ${warmup.duration} min · ${warmup.cue}`}
    >
      {/* Preview de vídeo del ejercicio seleccionado. El proto añade un patrón de
          rayas diagonales (repeating-linear-gradient) sobre el gradiente — RN no
          tiene gradientes repetidos; se omite (overlay al 2.5% de blanco). */}
      <View style={styles.video}>
        <LinearGradient
          colors={['#1a1a24', '#08080a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.playCircle}>
          <Icon.play size={22} color={colors.accentFg} />
        </View>
        <Text style={styles.videoMeta}>HD · 0:18 · slow-mo demo</Text>
        <View style={styles.videoCounter}>
          <Text style={styles.videoCounterText}>
            {activeIdx + 1} / {warmup.exercises.length}
          </Text>
        </View>
      </View>

      {/* Detalle del ejercicio activo */}
      <Animated.View key={active.name} entering={FadeInDown.duration(240)} style={styles.active}>
        <View style={styles.activeHead}>
          <Text style={[type.h3, styles.activeName]}>{active.name}</Text>
          <Chip variant="acc">{active.duration}</Chip>
        </View>
        <View style={styles.tipRow}>
          <Icon.info size={13} color={colors.accent} />
          <Text style={[type.sm, styles.tipText]}>{active.tip}</Text>
        </View>
      </Animated.View>

      {/* Lista de ejercicios — tap para cambiar */}
      <Text style={[type.xs, styles.listLabel]}>All exercises</Text>
      <View style={styles.list}>
        {warmup.exercises.map((ex, i) => {
          const selected = i === activeIdx;
          const done = i < activeIdx;
          return (
            <Pressable
              key={i}
              onPress={() => setActiveIdx(i)}
              style={[styles.row, selected && styles.rowSelected]}
            >
              <View
                style={[
                  styles.index,
                  done && styles.indexDone,
                  selected && !done && styles.indexSelected,
                ]}
              >
                {done ? (
                  <Icon.check size={11} color={colors.accentFg} />
                ) : (
                  <Text
                    style={[styles.indexText, selected && { color: colors.accent }]}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text style={styles.rowName}>{ex.name}</Text>
              <Text style={styles.rowDuration}>{ex.duration}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* CTA — avanzar el flujo */}
      <Button
        variant="primary"
        block
        style={styles.cta}
        onPress={() => (isLast ? onClose() : setActiveIdx(activeIdx + 1))}
      >
        {isLast ? (
          <>
            <Icon.check size={14} color={colors.accentFg} /> Finish warmup
          </>
        ) : (
          <>
            Next · {warmup.exercises[activeIdx + 1].name}{' '}
            <Icon.arrow size={14} color={colors.accentFg} />
          </>
        )}
      </Button>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  video: {
    position: 'relative',
    aspectRatio: 16 / 9,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    // El proto desplaza el triángulo 3px para centrarlo ópticamente.
    paddingLeft: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 30,
    shadowOpacity: 0.4,
  },
  videoMeta: {
    position: 'absolute',
    left: 12,
    bottom: 10,
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.fgMid,
    ...tabularNums,
  },
  videoCounter: {
    position: 'absolute',
    right: 12,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  videoCounterText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: '#fff',
    ...tabularNums,
  },
  active: {
    padding: 14,
    borderRadius: radii.sm + 2, // 12px
    backgroundColor: colors.bg3,
    marginBottom: 14,
  },
  activeHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  activeName: {
    fontSize: 15,
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 12.5 * 1.45,
  },
  listLabel: {
    marginBottom: 8,
  },
  list: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  rowSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  index: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  indexDone: {
    backgroundColor: colors.accent,
    borderColor: colors.line,
  },
  indexSelected: {
    backgroundColor: colors.bg2,
    borderColor: colors.accent,
  },
  indexText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 10,
    color: colors.fgMute,
    ...tabularNums,
  },
  rowName: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.fg,
  },
  rowDuration: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.fgMute,
    ...tabularNums,
  },
  cta: {
    marginTop: 14,
  },
});
