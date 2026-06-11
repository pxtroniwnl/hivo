// Port de TodayHero (hivo-design/home.jsx:314-443).
// 4 estados: sin programa activo / día de descanso / off-day (día fuera del programa) / rutina activa.
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Card, Chip, Icon, Stat } from '@/components/ui';
import { colors, radii, space, type } from '@/theme';
import { estimateMinutes, findTodaySlot, isRestSlot, totalSets } from '@/lib/today';
import type { Routine, Workout } from '@/data/types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type TodayHeroProps = {
  /** Workouts guardados por el usuario; se busca el que tiene `current: true`. */
  myWorkouts: Workout[];
  /** Rutinas propias del usuario (se combinan con las trending para resolver el routineId del día). */
  myRoutines: Routine[];
  /** Rutinas trending/globales (hivo-design/home.jsx:353 — `ROUTINES.trending`). */
  trendingRoutines: Routine[];
  /** Día actual (0=Sun..6=Sat). Por defecto `new Date().getDay()`. */
  dayOfWeek?: number;
  /** Iniciar el entreno de hoy (o uno ad-hoc si es off-day). */
  onStart?: () => void;
  /** Ir a la tab Train (estado "sin programa activo"). */
  onGoToTrain?: () => void;
};

export function TodayHero({
  myWorkouts,
  myRoutines,
  trendingRoutines,
  dayOfWeek,
  onStart,
  onGoToTrain,
}: TodayHeroProps) {
  const today = DAY_NAMES[dayOfWeek ?? new Date().getDay()] ?? 'Sun';
  const activeWorkout = myWorkouts.find((w) => w.current);

  // Estado 1: sin programa activo
  if (!activeWorkout) {
    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card variant="elev" padding={18} style={[styles.card, styles.dashed]}>
          <View style={styles.headRow}>
            <View style={styles.iconBubble}>
              <Icon.dumb size={22} color={colors.accent} />
            </View>
            <View style={styles.headText}>
              <Chip>No active program</Chip>
              <Text style={[type.h2, styles.pickTitle]}>Pick a workout</Text>
            </View>
          </View>
          <Text style={[type.sm, styles.bodyText]}>
            Set one of your saved workouts as active and your daily plan shows up here.
          </Text>
          <Button variant="primary" block style={styles.cta} onPress={onGoToTrain}>
            <Icon.arrow size={14} color={colors.accentFg} />
            Go to Train
          </Button>
        </Card>
      </Animated.View>
    );
  }

  const todaySlot = findTodaySlot(activeWorkout, today);
  const isRest = todaySlot ? isRestSlot(todaySlot) : false;
  const routine = todaySlot?.routineId
    ? [...trendingRoutines, ...myRoutines].find((r) => r.id === todaySlot.routineId)
    : undefined;

  // Estado 2: hoy es día de descanso
  if (todaySlot && isRest) {
    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card variant="elev" padding={18} style={styles.card}>
          <View style={styles.topRow}>
            <Chip>{activeWorkout.name}</Chip>
            <Text style={type.xs}>{today.toUpperCase()}</Text>
          </View>
          <Text style={[type.h1, styles.bigTitle]}>Rest day</Text>
          <Text style={[type.sm, styles.leadingText]}>
            Recovery is part of the program. Mobility or a walk is great.
          </Text>
        </Card>
      </Animated.View>
    );
  }

  // Estado 3: hoy no está en el programa (off-day)
  if (!todaySlot) {
    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card variant="elev" padding={18} style={styles.card}>
          <View style={styles.topRow}>
            <Chip>{activeWorkout.name}</Chip>
            <Text style={type.xs}>{today.toUpperCase()}</Text>
          </View>
          <Text style={[type.h1, styles.bigTitle]}>Off day</Text>
          <Text style={[type.sm, styles.leadingText]}>
            {today} isn&apos;t part of {activeWorkout.name}. Take it easy or train ad-hoc.
          </Text>
          <Button block style={[styles.cta, styles.bg3]} onPress={onStart}>
            <Icon.bolt size={14} color={colors.accent} />
            Quick workout
          </Button>
        </Card>
      </Animated.View>
    );
  }

  // Estado 4: hay una rutina prevista para hoy
  const exerciseCount = routine ? routine.exercises.length : 0;
  const sets = routine ? totalSets(routine) : 0;
  const estMin = routine ? estimateMinutes(routine) : 0;
  const muscles = routine ? Array.from(new Set(routine.tags ?? [])).slice(0, 3) : [];

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      <Card variant="elev" style={[styles.card, styles.heroCard]}>
        {/* Gradiente diagonal del hero (home.jsx:402): linear-gradient(135deg, var(--bg-3) 0%, var(--bg-2) 60%).
            135deg ≈ esquina superior-izquierda → inferior-derecha. */}
        <LinearGradient
          colors={[colors.bg3, colors.bg2]}
          locations={[0, 0.6]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Glow radial de acento: el prototipo usa un círculo de 180px con filter: blur(40px).
            RN no tiene blur nativo barato aquí, así que se aproxima con el mismo círculo,
            misma opacidad (0.15) pero sin blur (ver nota en CLAUDE.md/plan). */}
        <View style={styles.glow} pointerEvents="none" />
        <View style={styles.heroInner}>
          <View style={styles.topRow}>
            <Chip variant="acc" icon={<Icon.bolt size={11} color={colors.accent} />}>
              {activeWorkout.name} · {today}
            </Chip>
            <Text style={type.xs}>{estMin || 60} min</Text>
          </View>
          <Text style={[type.h1, styles.bigTitle]}>{todaySlot.name}</Text>
          {routine && (
            <Text style={[type.sm, styles.leadingText]}>
              {routine.description || `${exerciseCount} exercises planned from your active program.`}
            </Text>
          )}

          <View style={styles.statsRow}>
            <Stat label="Exercises" value={exerciseCount || '—'} />
            <Stat label="Sets" value={sets || '—'} />
            <Stat label="Level" value={(activeWorkout.level || '—').slice(0, 3)} />
          </View>

          {muscles.length > 0 && (
            <View style={styles.musclesRow}>
              {muscles.map((m) => (
                <Chip key={m}>{m}</Chip>
              ))}
            </View>
          )}

          <Button variant="primary" block style={styles.cta} onPress={onStart}>
            <Icon.play size={16} color={colors.accentFg} />
            Start workout
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: space.s4 + 2, // 18px
    overflow: 'hidden',
  },
  dashed: {
    borderStyle: 'dashed',
  },
  heroCard: {
    padding: 0,
    position: 'relative',
  },
  heroInner: {
    padding: space.s4 + 2, // 18px
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.15,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    marginBottom: space.s3,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: radii.md - 2,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: {
    flex: 1,
  },
  pickTitle: {
    marginTop: space.s2,
    fontSize: 22,
  },
  bodyText: {
    marginTop: space.s1,
  },
  cta: {
    marginTop: space.s4 - 2, // 14px
  },
  bg3: {
    backgroundColor: colors.bg3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.s2,
  },
  bigTitle: {
    marginTop: 10,
    fontSize: 28,
    // Recompute de los valores em-based de type.h1 para 28px (CSS usa unidades em).
    letterSpacing: 28 * -0.02,
    lineHeight: 28 * 1.15,
  },
  leadingText: {
    marginTop: 6,
    lineHeight: 15 * 1.45,
  },
  statsRow: {
    flexDirection: 'row',
    gap: space.s5 - 2, // 18px
    marginTop: space.s4,
    paddingVertical: space.s3,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  musclesRow: {
    flexDirection: 'row',
    gap: space.s2,
    marginTop: space.s3,
    flexWrap: 'wrap',
  },
});
