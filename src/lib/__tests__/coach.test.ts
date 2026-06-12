import type { Routine, Workout } from '@/data/types';

import { absorbCoachWorkout, generateCoachWorkout } from '../coach';

const baseAnswers = {
  experience: 'regular' as const,
  goal: 'hypertrophy' as const,
  days: 4,
  duration: 60,
  equipment: 'full' as const,
  focus: 'none' as const,
};

describe('generateCoachWorkout (port de train.jsx:1886-2022)', () => {
  it('maps experience to level', () => {
    expect(generateCoachWorkout({ ...baseAnswers, experience: 'new' }).level).toBe('Beginner');
    expect(generateCoachWorkout({ ...baseAnswers, experience: 'casual' }).level).toBe('Beginner');
    expect(generateCoachWorkout({ ...baseAnswers, experience: 'regular' }).level).toBe('Intermediate');
    expect(generateCoachWorkout({ ...baseAnswers, experience: 'veteran' }).level).toBe('Advanced');
  });

  it('builds the split by days per week', () => {
    expect(generateCoachWorkout({ ...baseAnswers, days: 3 }).days).toHaveLength(3);
    expect(generateCoachWorkout({ ...baseAnswers, days: 4 }).days.map((d) => d.name)).toEqual([
      'Upper · Heavy',
      'Lower · Heavy',
      'Upper · Volume',
      'Lower · Volume',
    ]);
    expect(generateCoachWorkout({ ...baseAnswers, days: 6 }).days).toHaveLength(6);
  });

  it('swaps exercises by equipment', () => {
    const bw = generateCoachWorkout({ ...baseAnswers, days: 4, equipment: 'bw' });
    const names = bw.days.flatMap((d) => d._routineData.exercises.map((e) => e.name));
    expect(names).toContain('Push-up');
    expect(names).not.toContain('Barbell bench press');
  });

  it('applies the strength scheme to main lifts', () => {
    const w = generateCoachWorkout({ ...baseAnswers, goal: 'strength', days: 4 });
    const main = w.days[0]._routineData.exercises[0];
    expect(main).toMatchObject({ sets: 4, reps: '5', rest: 180, rpe: 8 });
  });

  it('extends focused days with an extra exercise', () => {
    const w = generateCoachWorkout({ ...baseAnswers, days: 4, focus: 'upper' });
    const upper = w.days[0]._routineData.exercises.map((e) => e.name);
    expect(upper).toContain('Cable fly');
  });

  it('embeds routine data matching each routineId', () => {
    const w = generateCoachWorkout(baseAnswers);
    for (const d of w.days) {
      expect(d._routineData.id).toBe(d.routineId);
      expect(d._routineData.author).toBe('AI Coach');
    }
  });
});

describe('absorbCoachWorkout (port de train.jsx:146-161)', () => {
  it('extracts embedded routines and strips them from the workout', () => {
    const generated = generateCoachWorkout(baseAnswers);
    const myRoutines: Routine[] = [];
    const myWorkouts: Workout[] = [];
    const out = absorbCoachWorkout(myRoutines, myWorkouts, generated);

    expect(out.routines).toHaveLength(generated.days.length);
    expect(out.workouts).toHaveLength(1);
    expect(out.workouts[0].author).toBe('AI Coach');
    expect(out.workouts[0].days.every((d) => !('_routineData' in d))).toBe(true);
  });

  it('does not duplicate routines already present', () => {
    const generated = generateCoachWorkout(baseAnswers);
    const first = absorbCoachWorkout([], [], generated);
    const second = absorbCoachWorkout(first.routines, first.workouts, generated);
    expect(second.routines).toHaveLength(first.routines.length);
  });
});
