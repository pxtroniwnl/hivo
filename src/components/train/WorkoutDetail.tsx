// Port de WorkoutDetail (train.jsx:660-913): editor del programa semanal —
// días reordenables, asignación de rutina por día y dock Save/Done.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, Icon, Sheet } from '@/components/ui';
import { ROUTINES } from '@/data/mock';
import type { Routine, Workout, WorkoutDay } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { EditableField } from './EditableField';
import { KindBadge, LevelChip } from './badges';
import { DayPicker, LevelPicker } from './pickers';

function ShareGlyph({ size = 16, color = colors.fg }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={6} cy={12} r={3} />
      <Circle cx={18} cy={6} r={3} />
      <Circle cx={18} cy={18} r={3} />
      <Path d="M8.5 10.5l7-3M8.5 13.5l7 3" />
    </Svg>
  );
}

function Chevron({ up, dim }: { up?: boolean; dim?: boolean }) {
  return (
    <Svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke={dim ? colors.fgDim : colors.fgMute} strokeWidth={2}>
      <Path d={up ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
    </Svg>
  );
}

type WorkoutDetailProps = {
  workout: Workout;
  isNew: boolean;
  myRoutines: Routine[];
  onChange: (w: Workout) => void;
  onSave: () => void;
  onBack: () => void;
  onOpenRoutine: (r: Routine) => void;
  onShare?: () => void;
};

export function WorkoutDetail({
  workout,
  isNew,
  myRoutines,
  onChange,
  onSave,
  onBack,
  onOpenRoutine,
  onShare,
}: WorkoutDetailProps) {
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [pickRoutineFor, setPickRoutineFor] = useState<number | null>(null);
  const isMine = workout.author === 'You';

  const update = (patch: Partial<Workout>) => onChange({ ...workout, ...patch });
  const updateDay = (idx: number, patch: Partial<WorkoutDay>) => {
    const days = [...workout.days];
    days[idx] = { ...days[idx], ...patch };
    onChange({ ...workout, days });
  };
  const removeDay = (idx: number) =>
    onChange({ ...workout, days: workout.days.filter((_, i) => i !== idx) });
  const moveDay = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= workout.days.length) return;
    const days = [...workout.days];
    [days[idx], days[next]] = [days[next], days[idx]];
    onChange({ ...workout, days });
  };
  const addDay = () =>
    onChange({
      ...workout,
      days: [...workout.days, { day: 'Sun', name: `Day ${workout.days.length + 1}`, routineId: null }],
    });

  // Pool: rutinas trending + del usuario, dedupe por id (train.jsx:697-704).
  const routinePool = useMemo(() => {
    const all = [...ROUTINES.trending, ...myRoutines];
    const seen = new Set<string>();
    return all.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [myRoutines]);
  const routineById = (id: string) => routinePool.find((r) => r.id === id);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 110 + insets.bottom }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
            <Icon.back size={16} color={colors.fgMid} />
          </Pressable>
          <Text style={styles.headerLabel}>
            {isNew ? 'New workout' : isMine ? 'Edit workout' : 'Workout'}
          </Text>
          {onShare && (
            <Pressable onPress={onShare} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
              <ShareGlyph color={colors.fg} />
            </Pressable>
          )}
          {!isMine && !isNew && (
            <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveCopyBtn, pressed && styles.pressed]}>
              <Icon.plus size={13} color={colors.fg} />
              <Text style={styles.saveCopyText}>Save copy</Text>
            </Pressable>
          )}
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <View style={styles.badges}>
            <KindBadge kind="workout" />
            <LevelPicker value={workout.level} onChange={(v) => update({ level: v })} editable={isMine || isNew} />
          </View>
          <EditableField
            value={workout.name}
            onChange={(v) => update({ name: v })}
            placeholder="Workout name"
            textStyle={styles.titleText}
          />
          <View style={styles.metaRow}>
            <Text style={[type.sm, styles.metaText]}>by {workout.author}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={[type.sm, styles.metaText]}>{workout.days.length} days</Text>
            {!!workout.duration && (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={[type.sm, styles.metaText]}>{workout.duration}</Text>
              </>
            )}
          </View>
          {workout.tags.length > 0 && (
            <View style={styles.tags}>
              {workout.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.descBlock}>
          <EditableField
            value={workout.description}
            onChange={(v) => update({ description: v })}
            placeholder="Describe this workout (optional)"
            multiline
            textStyle={styles.descText}
          />
        </View>

        {/* Weekly grid */}
        <View style={styles.week}>
          <View style={styles.weekHead}>
            <Text style={type.xs}>Weekly schedule</Text>
            <Text style={[type.xs, { color: colors.fgMute }]}>Tap a day to assign a routine</Text>
          </View>
          <View style={styles.dayList}>
            {workout.days.map((d, i) => {
              const routine = d.routineId ? routineById(d.routineId) : null;
              return (
                <View key={i} style={styles.dayCard}>
                  <View style={styles.dayRow}>
                    <View
                      style={[
                        styles.dayBadge,
                        { backgroundColor: routine ? colors.accentSoft : colors.bg3 },
                      ]}
                    >
                      <Text
                        style={[styles.dayBadgeText, { color: routine ? colors.accent : colors.fgMute }]}
                      >
                        {d.day.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.dayBody}>
                      <EditableField
                        value={d.name}
                        onChange={(v) => updateDay(i, { name: v })}
                        placeholder="Day name"
                        textStyle={styles.dayName}
                      />
                      {routine ? (
                        <Pressable onPress={() => onOpenRoutine(routine)} style={styles.routineLink} hitSlop={4}>
                          <Icon.dumb size={11} color={colors.accent} />
                          <Text style={styles.routineLinkText}>
                            {routine.name} · {routine.exercises.length} ex
                          </Text>
                        </Pressable>
                      ) : (
                        <Pressable onPress={() => setPickRoutineFor(i)} hitSlop={4}>
                          <Text style={styles.addRoutineText}>+ Add routine</Text>
                        </Pressable>
                      )}
                    </View>
                    {routine && (
                      <Pressable
                        onPress={() => setPickRoutineFor(i)}
                        style={({ pressed }) => [styles.swapBtn, pressed && styles.pressed]}
                      >
                        <Icon.swap size={13} color={colors.fgMid} />
                      </Pressable>
                    )}
                    <DayPicker value={d.day} onChange={(v) => updateDay(i, { day: v })} />
                    <View style={styles.moveCol}>
                      <Pressable onPress={() => moveDay(i, -1)} disabled={i === 0} hitSlop={4}>
                        <Chevron up dim={i === 0} />
                      </Pressable>
                      <Pressable
                        onPress={() => moveDay(i, 1)}
                        disabled={i === workout.days.length - 1}
                        hitSlop={4}
                      >
                        <Chevron dim={i === workout.days.length - 1} />
                      </Pressable>
                    </View>
                    <Pressable onPress={() => removeDay(i)} hitSlop={4}>
                      <Icon.close size={13} color={colors.fgMute} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
            <Pressable
              onPress={addDay}
              style={({ pressed }) => [styles.addDay, pressed && styles.pressed]}
            >
              <Icon.plus size={14} color={colors.fgMid} />
              <Text style={styles.addDayText}>Add day</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Dock pegajoso */}
      <View style={[styles.dock, { paddingBottom: 12 + insets.bottom }]}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="dockFadeW" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.bg0} stopOpacity={0} />
              <Stop offset="0.4" stopColor={colors.bg0} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#dockFadeW)" />
        </Svg>
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
          {saved ? (
            <>
              <Icon.check size={14} color={colors.accent} />
              <Text style={styles.saveText}>Saved</Text>
            </>
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </Pressable>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      {/* Routine picker */}
      {pickRoutineFor !== null && (
        <Sheet
          onClose={() => setPickRoutineFor(null)}
          title="Pick a routine"
          subtitle="From trending + your routines"
        >
          <View style={styles.pickList}>
            {routinePool.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => {
                  updateDay(pickRoutineFor, { routineId: r.id, name: r.name });
                  setPickRoutineFor(null);
                }}
                style={({ pressed }) => [styles.pickRow, pressed && styles.pressed]}
              >
                <Icon.dumb size={16} color={colors.accent} />
                <View style={styles.dayBody}>
                  <Text style={styles.pickName}>{r.name}</Text>
                  <Text style={styles.pickMeta}>
                    {r.exercises.length} ex · {r.author}
                  </Text>
                </View>
                <LevelChip level={r.level} />
              </Pressable>
            ))}
          </View>
        </Sheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: screenInset,
    paddingBottom: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
  saveCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
  },
  saveCopyText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.fg,
  },
  titleBlock: {
    paddingHorizontal: screenInset,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    zIndex: 10,
  },
  titleText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 28,
    letterSpacing: 28 * -0.02,
    lineHeight: 28 * 1.1,
    color: colors.fg,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
  metaDot: {
    color: colors.fgDim,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  descBlock: {
    paddingTop: 14,
    paddingHorizontal: screenInset,
  },
  descText: {
    fontSize: 13,
    color: colors.fgMid,
    lineHeight: 13 * 1.45,
  },
  week: {
    paddingTop: 20,
    paddingHorizontal: screenInset,
  },
  weekHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayList: {
    gap: 8,
  },
  dayCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 11 * 0.05,
  },
  dayBody: {
    flex: 1,
    minWidth: 0,
  },
  dayName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.fg,
  },
  routineLink: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routineLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11.5,
    color: colors.accent,
  },
  addRoutineText: {
    marginTop: 3,
    fontFamily: fonts.sansMedium,
    fontSize: 11.5,
    color: colors.fgMute,
    textDecorationLine: 'underline',
  },
  swapBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.bg3,
  },
  moveCol: {
    gap: 2,
    alignItems: 'center',
  },
  addDay: {
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addDayText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.fgMid,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  saveBtn: {
    minWidth: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  saveText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.fg,
  },
  doneBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
  },
  doneText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.accentFg,
  },
  pickList: {
    gap: 6,
  },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.bg3,
  },
  pickName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.fg,
  },
  pickMeta: {
    marginTop: 2,
    fontSize: 10.5,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
});
