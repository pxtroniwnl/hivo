// Port de DayDetail (hivo-design/home.jsx:844-891) + PastWorkoutDetail (l.137-199)
// + PlannedWorkoutDetail (l.201-230) + RestDayCard (l.232-252).
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Card, Chip, Icon, Stat } from '@/components/ui';
import { colors, fonts, radii, space, tabularNums, type } from '@/theme';
import type { PlannedDay, WeekDay, WorkoutSummary } from '@/data/types';
import { WeekStrip } from './WeekStrip';

const FULL_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type DayDetailProps = {
  /** Día seleccionado de la semana. */
  day: WeekDay;
  /** Semana completa, para el WeekStrip de "jump to day" al final. */
  week: WeekDay[];
  /** Índice de hoy dentro de `week`. */
  todayIdx: number;
  /** Volver a la vista de hoy (botón "Back to today" y al pulsar el día actual en el strip). */
  onBackToToday: () => void;
  /** Saltar a otro día de la semana desde el strip inferior. */
  onJump: (index: number) => void;
  /** Iniciar el workout planificado (PlannedWorkoutDetail). */
  onStart?: () => void;
};

export function DayDetail({ day, week, todayIdx, onBackToToday, onJump, onStart }: DayDetailProps) {
  const isPast = day.status === 'done' || (day.status === 'rest' && day.date < 23);
  const isRest = day.status === 'rest';
  const isPlanned = day.status === 'planned';
  const idx = week.findIndex((d) => d.date === day.date);
  const fullName = FULL_DAY_NAMES[idx] ?? 'Day';

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      {/* Banner "Back to today" */}
      <View style={styles.backWrap}>
        <Button onPress={onBackToToday} style={styles.backBtn} textStyle={styles.backText}>
          <Icon.back size={13} color={colors.fgMid} />
          Back to today
        </Button>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[type.xs, isPlanned && { color: colors.accent }]}>
          {isPast ? 'Logged' : isPlanned ? 'Planned' : ''}
        </Text>
        <Text style={[type.h1, styles.headerTitle]}>
          {fullName} {day.date}
        </Text>
        <Text style={[type.sm, styles.headerLabel]}>{day.label}</Text>
      </View>

      {/* Cuerpo */}
      {isRest ? (
        <RestDayCard isPast={isPast} />
      ) : isPast && day.summary ? (
        <PastWorkoutDetail summary={day.summary} label={day.label} />
      ) : isPlanned && day.plan ? (
        <PlannedWorkoutDetail plan={day.plan} label={day.label} onStart={onStart} />
      ) : (
        <RestDayCard isPast={false} />
      )}

      {/* Week strip al final, para saltar de día */}
      <View style={styles.jumpWrap}>
        <View style={styles.jumpLabel}>
          <Text style={type.xs}>Jump to day</Text>
        </View>
        <WeekStrip
          week={week}
          selectedIdx={idx}
          onPickDay={(i) => (i === todayIdx ? onBackToToday() : onJump(i))}
        />
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// PastWorkoutDetail (hivo-design/home.jsx:137-199)
// ─────────────────────────────────────────────────────────────

type PastWorkoutDetailProps = {
  summary: WorkoutSummary;
  label: string;
};

function PastWorkoutDetail({ summary, label }: PastWorkoutDetailProps) {
  return (
    <>
      <View style={styles.section}>
        <Card variant="elev" padding={18}>
          <View style={styles.summaryHeadRow}>
            <View style={styles.flex1}>
              <Text style={type.h2}>{label}</Text>
              <Text style={[type.sm, styles.completedText]}>Completed in {summary.duration}</Text>
            </View>
            {summary.pr && <Chip variant="acc">PR</Chip>}
          </View>

          <View style={styles.statsGrid}>
            <Stat label="Volume" value={`${(summary.volume / 1000).toFixed(1)}k`} />
            <Stat label="Sets" value={summary.sets} />
            <Stat label="Avg RPE" value={summary.avgRpe} />
          </View>

          {summary.pr && (
            <View style={styles.prBanner}>
              <Icon.trophy size={16} color={colors.accent} />
              <Text style={[type.sm, styles.prText]}>{summary.pr}</Text>
            </View>
          )}
        </Card>
      </View>

      {/* Ejercicios registrados */}
      <View style={styles.exercisesSection}>
        <Text style={[type.xs, styles.exercisesLabel]}>Exercises</Text>
        <Card padding={0} style={styles.exercisesCard}>
          {summary.exercises.map((ex, i, a) => (
            <View
              key={i}
              style={[styles.exerciseRow, i < a.length - 1 && styles.exerciseRowBorder]}
            >
              <View style={styles.exerciseIndex}>
                <Text style={styles.exerciseIndexText}>{i + 1}</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={[type.h3, styles.exerciseName]}>{ex.name}</Text>
                <Text style={[type.sm, styles.exerciseTop]}>
                  {ex.sets} · top {ex.top}
                </Text>
              </View>
              {ex.top.includes('PR') && (
                <Chip variant="acc" textStyle={styles.exercisePrChip}>
                  PR
                </Chip>
              )}
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.actionsRow}>
        <Button style={styles.bg2} onPress={undefined}>
          <Icon.swap size={15} color={colors.fg} />
          Repeat
        </Button>
        <Button variant="ghost" style={styles.bg2}>
          Share
        </Button>
      </View>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// PlannedWorkoutDetail (hivo-design/home.jsx:201-230)
// ─────────────────────────────────────────────────────────────

type PlannedWorkoutDetailProps = {
  plan: PlannedDay;
  label: string;
  onStart?: () => void;
};

function PlannedWorkoutDetail({ plan, label, onStart }: PlannedWorkoutDetailProps) {
  return (
    <>
      <View style={styles.section}>
        <Card variant="elev" padding={18}>
          <Chip variant="acc">Planned</Chip>
          <Text style={[type.h2, styles.plannedTitle]}>{label}</Text>
          <Text style={[type.sm, styles.completedText]}>
            {plan.duration} · {plan.sets} sets
          </Text>

          <View style={styles.divider} />

          <Text style={[type.xs, styles.exercisesLabel]}>Exercises</Text>
          <View style={styles.plannedList}>
            {plan.exercises.map((ex, i) => (
              <View key={ex} style={styles.plannedRow}>
                <Text style={styles.plannedIndex}>{i + 1}</Text>
                <Text style={[type.sm, styles.plannedExercise]}>{ex}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
      <View style={styles.section}>
        <Button block style={[styles.bg2, styles.rescheduleBtn]} textStyle={styles.rescheduleText} onPress={onStart}>
          <Icon.swap size={15} color={colors.fgMid} />
          Reschedule
        </Button>
      </View>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// RestDayCard (hivo-design/home.jsx:232-252)
// ─────────────────────────────────────────────────────────────

type RestDayCardProps = {
  isPast: boolean;
};

function RestDayCard({ isPast }: RestDayCardProps) {
  return (
    <View style={styles.section}>
      <Card padding={22} style={styles.restCard}>
        <View style={styles.restIconCircle}>
          <Icon.leaf size={24} color={colors.fgMute} />
        </View>
        <Text style={[type.h2, styles.restTitle]}>{isPast ? 'Rest day' : 'Scheduled rest'}</Text>
        <Text style={[type.sm, styles.restBody]}>
          {isPast
            ? 'No workout logged. Recovery is part of the program.'
            : 'No workout planned. Recovery preserves adaptation.'}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  backWrap: {
    paddingHorizontal: space.s4 + 2, // 18px
    paddingBottom: space.s3,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  backText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.fgMid,
  },
  header: {
    paddingHorizontal: space.s4 + 2, // 18px
    paddingBottom: space.s4,
  },
  headerTitle: {
    marginTop: space.s1,
  },
  headerLabel: {
    marginTop: space.s1,
  },
  section: {
    paddingHorizontal: space.s4 + 2, // 18px
    marginTop: space.s4,
  },
  flex1: {
    flex: 1,
  },
  summaryHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  completedText: {
    marginTop: space.s1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: space.s3,
    marginTop: space.s5 - 2, // 18px
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  prBanner: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: space.s3,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3 - 2, // 10px
  },
  prText: {
    color: colors.fg,
  },
  exercisesSection: {
    paddingHorizontal: space.s4 + 2, // 18px
    marginTop: space.s4 + 2, // 18px
  },
  exercisesLabel: {
    marginBottom: space.s3 - 2, // 10px
  },
  exercisesCard: {
    overflow: 'hidden',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    paddingVertical: space.s3,
    paddingHorizontal: 14,
  },
  exerciseRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  exerciseIndex: {
    width: 24,
    height: 24,
    borderRadius: radii.xs,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIndexText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 11,
    color: colors.fgMute,
    ...tabularNums,
  },
  exerciseName: {
    fontSize: 14,
  },
  exerciseTop: {
    marginTop: 2,
    fontSize: 12,
  },
  exercisePrChip: {
    fontSize: 10,
  },
  actionsRow: {
    paddingHorizontal: space.s4 + 2, // 18px
    marginTop: 14,
    flexDirection: 'row',
    gap: space.s2,
  },
  bg2: {
    flex: 1,
    backgroundColor: colors.bg2,
  },
  plannedTitle: {
    marginTop: space.s3 - 2, // 10px
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    marginVertical: space.s4,
  },
  plannedList: {
    gap: space.s2,
  },
  plannedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3 - 2, // 10px
  },
  plannedIndex: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.fgMute,
    minWidth: 18,
    ...tabularNums,
  },
  plannedExercise: {
    color: colors.fg,
  },
  rescheduleBtn: {
    backgroundColor: colors.bg2,
  },
  rescheduleText: {
    color: colors.fgMid,
  },
  restCard: {
    alignItems: 'center',
  },
  restIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    marginTop: 14,
    textAlign: 'center',
  },
  restBody: {
    marginTop: 6,
    maxWidth: 240,
    textAlign: 'center',
  },
  jumpWrap: {
    marginTop: space.s6,
    paddingBottom: 12,
  },
  jumpLabel: {
    paddingHorizontal: space.s4 + 2, // 18px
    paddingBottom: space.s3 - 2, // 10px
  },
});
