// Port de WeekStrip (hivo-design/home.jsx:43-71).
// Tira de 7 botones para los días de la semana, con estados done/rest/today/planned + selected.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, space, tabularNums, type } from '@/theme';
import type { WeekDay } from '@/data/types';

type WeekStripProps = {
  week: WeekDay[];
  selectedIdx?: number;
  onPickDay?: (index: number) => void;
};

export function WeekStrip({ week, selectedIdx, onPickDay }: WeekStripProps) {
  return (
    <View style={styles.row}>
      {week.map((d, i) => {
        const isToday = d.status === 'today';
        const isDone = d.status === 'done';
        const isSel = selectedIdx === i;

        const dotColor = isSel
          ? colors.accentFg
          : isDone
            ? colors.ok
            : isToday
              ? colors.accent
              : d.status === 'rest'
                ? colors.fgDim
                : colors.bg4;

        return (
          <Pressable
            key={i}
            onPress={() => onPickDay?.(i)}
            style={[
              styles.day,
              {
                backgroundColor: isSel ? colors.accent : isToday ? colors.accentSoft : colors.bg2,
                borderColor: isSel ? colors.accent : isToday ? colors.accent : colors.line,
              },
            ]}
          >
            <Text
              style={[
                type.xs,
                isSel ? { color: colors.accentFg } : isToday ? { color: colors.accent } : null,
              ]}
            >
              {d.day}
            </Text>
            <Text
              style={[
                styles.date,
                isSel ? { color: colors.accentFg } : isToday ? { color: colors.accent } : { color: colors.fg },
              ]}
            >
              {d.date}
            </Text>
            <View style={[styles.dot, { backgroundColor: dotColor, opacity: isSel ? 0.7 : 1 }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.s2 - 2, // 6px
    paddingHorizontal: 18,
  },
  day: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 15,
    ...tabularNums,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 50,
  },
});
