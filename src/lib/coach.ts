// AI Coach: generación determinista del workout a partir del intake
// (port de buildWorkout, train.jsx:1886-2022) y absorción del resultado en
// la biblioteca del usuario (port del onAddWorkout de TrainList, l.146-161).
import type { Routine, RoutineExercise, RoutineLevel, Workout, WorkoutDay } from '@/data/types';

export type CoachAnswers = {
  experience?: 'new' | 'casual' | 'regular' | 'veteran';
  goal?: 'strength' | 'hypertrophy' | 'recomp' | 'general';
  days?: number;
  duration?: number;
  equipment?: 'full' | 'home' | 'dbs' | 'bw';
  focus?: 'none' | 'upper' | 'lower' | 'posterior';
};

export type CoachDay = WorkoutDay & { _routineData: Routine };
export type CoachWorkout = Omit<Workout, 'days'> & { estMin: number; days: CoachDay[] };

type DayTemplate = { name: string; exercises: RoutineExercise[] };

export function generateCoachWorkout(a: CoachAnswers): CoachWorkout {
  const exp = a.experience;
  const level: RoutineLevel =
    exp === 'new' || exp === 'casual' ? 'Beginner' : exp === 'veteran' ? 'Advanced' : 'Intermediate';
  const days = a.days || 4;
  const estMin = a.duration || 60;
  const equip = a.equipment || 'full';

  // Ejercicios según equipamiento
  const ex = {
    chest: equip === 'bw' ? 'Push-up' : equip === 'dbs' ? 'DB bench press' : 'Barbell bench press',
    back: equip === 'bw' ? 'Inverted row' : equip === 'dbs' ? 'DB row' : 'Barbell row',
    quad: equip === 'bw' ? 'Bodyweight squat' : equip === 'dbs' ? 'Goblet squat' : 'Back squat',
    hinge: equip === 'bw' ? 'Single-leg RDL' : equip === 'dbs' ? 'DB Romanian DL' : 'Romanian DL',
    ohp: equip === 'bw' ? 'Pike push-up' : equip === 'dbs' ? 'Seated DB press' : 'Overhead press',
    pull: equip === 'bw' ? 'Pull-up (assisted)' : equip === 'dbs' ? 'DB pullover' : 'Pull-up',
    arms: equip === 'bw' ? 'Diamond push-up' : equip === 'dbs' ? 'DB curl' : 'Triceps pushdown',
    glute: equip === 'bw' ? 'Glute bridge' : 'Hip thrust',
  };

  // Esquema de sets/reps por objetivo
  const scheme = (kind: 'main' | 'acc'): Omit<RoutineExercise, 'name'> => {
    if (a.goal === 'strength')
      return {
        sets: 4,
        reps: kind === 'main' ? '5' : '6-8',
        rest: kind === 'main' ? 180 : 120,
        rpe: kind === 'main' ? 8 : 7,
      };
    if (a.goal === 'hypertrophy')
      return { sets: 4, reps: kind === 'main' ? '8-10' : '10-12', rest: 90, rpe: 7 };
    if (a.goal === 'recomp') return { sets: 3, reps: '8-10', rest: 75, rpe: 7 };
    return { sets: 3, reps: '10-12', rest: 60, rpe: 6 };
  };

  const mk = (name: string, kind: 'main' | 'acc' = 'acc'): RoutineExercise => ({
    name,
    ...scheme(kind),
  });

  const focusUpper = a.focus === 'upper';
  const focusLower = a.focus === 'lower' || a.focus === 'posterior';
  const focusPost = a.focus === 'posterior';

  const upperHeavy: DayTemplate = {
    name: 'Upper · Heavy',
    exercises: [mk(ex.chest, 'main'), mk(ex.back, 'main'), mk(ex.ohp), mk(ex.pull), mk(ex.arms)],
  };
  const lowerHeavy: DayTemplate = {
    name: 'Lower · Heavy',
    exercises: [
      mk(ex.quad, 'main'),
      mk(focusPost ? ex.hinge : ex.glute, 'main'),
      mk(focusPost ? ex.glute : ex.hinge),
      mk(equip === 'bw' ? 'Walking lunge' : 'Bulgarian split squat'),
      mk(equip === 'bw' ? 'Calf raise' : 'Standing calf raise'),
    ],
  };
  const upperVolume: DayTemplate = { ...upperHeavy, name: 'Upper · Volume' };
  const lowerVolume: DayTemplate = { ...lowerHeavy, name: 'Lower · Volume' };
  const pushDay: DayTemplate = {
    name: 'Push',
    exercises: [mk(ex.chest, 'main'), mk(ex.ohp), mk('Incline DB press'), mk('Lateral raise'), mk(ex.arms)],
  };
  const pullDay: DayTemplate = {
    name: 'Pull',
    exercises: [
      mk(ex.back, 'main'),
      mk(ex.pull),
      mk('Face pull'),
      mk(equip === 'bw' ? 'Inverted row (close grip)' : 'Hammer curl'),
    ],
  };
  const legDay = lowerHeavy;
  const fullBody: DayTemplate = {
    name: 'Full body',
    exercises: [mk(ex.quad, 'main'), mk(ex.chest), mk(ex.back), mk(ex.hinge), mk('Plank')],
  };

  let dayPlan: ({ day: string } & DayTemplate)[];
  if (days <= 3) {
    dayPlan = [
      { day: 'Mon', ...fullBody },
      { day: 'Wed', ...fullBody, name: 'Full body B' },
      { day: 'Fri', ...fullBody, name: 'Full body C' },
    ];
  } else if (days === 4) {
    dayPlan = [
      { day: 'Mon', ...upperHeavy },
      { day: 'Tue', ...lowerHeavy },
      { day: 'Thu', ...upperVolume },
      { day: 'Fri', ...lowerVolume },
    ];
  } else if (days === 5) {
    dayPlan = [
      { day: 'Mon', ...pushDay },
      { day: 'Tue', ...pullDay },
      { day: 'Wed', ...legDay },
      { day: 'Fri', ...upperHeavy },
      { day: 'Sat', ...lowerHeavy },
    ];
  } else {
    dayPlan = [
      { day: 'Mon', ...pushDay },
      { day: 'Tue', ...pullDay },
      { day: 'Wed', ...legDay },
      { day: 'Thu', ...pushDay, name: 'Push · Volume' },
      { day: 'Fri', ...pullDay, name: 'Pull · Volume' },
      { day: 'Sat', ...legDay, name: 'Legs · Volume' },
    ];
  }

  // Sesgo de focus: extiende ligeramente los días enfocados
  if (focusUpper) {
    dayPlan = dayPlan.map((d) =>
      /Upper|Push|Pull/.test(d.name) ? { ...d, exercises: [...d.exercises, mk('Cable fly')] } : d,
    );
  } else if (focusLower) {
    dayPlan = dayPlan.map((d) =>
      /Lower|Legs/.test(d.name)
        ? { ...d, exercises: [...d.exercises, mk(equip === 'bw' ? 'Glute bridge hold' : 'Glute bridge')] }
        : d,
    );
  }

  const id = 'w-ai-' + Date.now();
  const coachDays: CoachDay[] = dayPlan.map((d, i) => ({
    day: d.day,
    name: d.name,
    routineId: `${id}-d${i + 1}`,
    _routineData: {
      id: `${id}-d${i + 1}`,
      name: d.name,
      author: 'AI Coach',
      level,
      description: `Auto-generated for your ${a.goal || 'general'} goal.`,
      tags: [d.name.split(' ')[0]],
      exercises: d.exercises,
    },
  }));

  const goalLabel =
    a.goal === 'strength'
      ? 'Strength'
      : a.goal === 'hypertrophy'
        ? 'Hypertrophy'
        : a.goal === 'recomp'
          ? 'Recomp'
          : 'General fitness';
  const splitLabel =
    days <= 3 ? 'Full body' : days === 4 ? 'Upper / Lower' : days === 5 ? 'PPL + extras' : 'PPL × 2';
  return {
    id,
    name: `${goalLabel} ${days}× · ${splitLabel}`,
    author: 'AI Coach',
    level,
    tags: [goalLabel, `${days} days`, splitLabel],
    description: `AI-generated for ${level.toLowerCase()} lifter · ${goalLabel.toLowerCase()} focus · ${
      equip === 'full' ? 'full gym' : equip === 'home' ? 'home gym' : equip === 'dbs' ? 'dumbbells only' : 'bodyweight only'
    }.`,
    duration: '6 weeks',
    daysPerWeek: days,
    estMin,
    days: coachDays,
  };
}

/** Extrae las rutinas embebidas a myRoutines y guarda el workout limpio. */
export function absorbCoachWorkout(
  myRoutines: Routine[],
  myWorkouts: Workout[],
  w: CoachWorkout,
): { routines: Routine[]; workouts: Workout[] } {
  const embedded = w.days.map((d) => d._routineData).filter(Boolean);
  const seen = new Set(myRoutines.map((r) => r.id));
  const fresh = embedded.filter((r) => !seen.has(r.id));
  const cleanedDays: WorkoutDay[] = w.days.map(({ _routineData, ...rest }) => rest);
  const { estMin, ...workoutBase } = w;
  const exists = myWorkouts.some((x) => x.id === w.id);
  return {
    routines: [...fresh, ...myRoutines],
    workouts: exists
      ? myWorkouts
      : [{ ...workoutBase, days: cleanedDays, author: 'AI Coach' }, ...myWorkouts],
  };
}
