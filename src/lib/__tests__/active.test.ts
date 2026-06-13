import { EXERCISES } from '@/data/mock';
import type { ActiveExercise } from '@/data/types';

import { adjustedWeight, formatClock, logSet, sessionTotals } from '../active';

const fresh = (): ActiveExercise[] => JSON.parse(JSON.stringify(EXERCISES));

describe('formatClock (port de active.jsx:111-114)', () => {
  it('formats m:ss', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(61)).toBe('1:01');
    expect(formatClock(1382)).toBe('23:02');
  });
});

describe('adjustedWeight (autoreg −5% redondeado a 0.5, active.jsx:80)', () => {
  it('drops 5% and rounds to nearest 0.5', () => {
    expect(adjustedWeight(80)).toBe(76);
    expect(adjustedWeight(22)).toBe(21);
    expect(adjustedWeight(12)).toBe(11.5);
  });
});

describe('sessionTotals', () => {
  it('counts sets and done sets', () => {
    const t = sessionTotals(fresh());
    expect(t.totalSets).toBe(17);
    expect(t.doneSets).toBe(2); // los dos warmups del bench
  });

  it('excludes warmups from volume (CLAUDE.md §LoggedSet)', () => {
    // Solo los warmups están done en el mock → volumen 0.
    expect(sessionTotals(fresh()).volume).toBe(0);
    const ex = fresh();
    ex[0].sets[2].done = true; // 80×6 normal
    expect(sessionTotals(ex).volume).toBe(480);
  });
});

describe('logSet (port de active.jsx:66-104)', () => {
  it('marks the set done and advances current', () => {
    const out = logSet(fresh(), 0, 2, { weight: 80, reps: 6, rpe: 7 });
    expect(out.exercises[0].sets[2].done).toBe(true);
    expect(out.exercises[0].sets[2].current).toBe(false);
    expect(out.exercises[0].sets[3].current).toBe(true);
    expect(out.autoreg).toBeNull();
  });

  it('triggers autoreg when logged RPE exceeds prescribed by more than 1', () => {
    const out = logSet(fresh(), 0, 2, { weight: 80, reps: 6, rpe: 9 });
    const next = out.exercises[0].sets[3];
    expect(next.weight).toBe(76);
    expect(next.adjusted).toMatchObject({ from: 80, to: 76 });
    expect(out.autoreg).toMatchObject({ exIdx: 0, setIdx: 3, from: 80, to: 76 });
  });

  it('moves focus to the next incomplete exercise when one finishes', () => {
    let ex = fresh();
    ex = logSet(ex, 1, 0, { weight: 22, reps: 10, rpe: 7 }).exercises;
    ex = logSet(ex, 1, 1, { weight: 22, reps: 10, rpe: 7 }).exercises;
    const out = logSet(ex, 1, 2, { weight: 22, reps: 10, rpe: 8 });
    expect(out.exercises[1].sets.every((s) => s.done)).toBe(true);
    expect(out.nextFocusIdx).toBe(2);
  });

  it('returns the rest seconds of the exercise', () => {
    expect(logSet(fresh(), 0, 2, { weight: 80, reps: 6, rpe: 7 }).restSec).toBe(150);
    expect(logSet(fresh(), 3, 0, { weight: 25, reps: 12, rpe: 7 }).restSec).toBe(60);
  });
});
