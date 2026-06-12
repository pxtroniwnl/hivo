import type { Routine, Workout } from '@/data/types';

import { filterTrending, setActiveWorkout, type LibraryItem } from '../library';

const routine = (over: Partial<Routine>): LibraryItem => ({
  id: 'r1',
  name: 'Push · Heavy',
  author: 'Hivo Team',
  level: 'Intermediate',
  tags: ['push', 'strength'],
  description: '',
  exercises: [
    { name: 'Bench Press', sets: 5, reps: '5', rest: 150, rpe: 8 },
    { name: 'Overhead Press', sets: 3, reps: '8', rest: 90, rpe: 8 },
  ],
  ...over,
  kind: 'routine',
});

const workout = (over: Partial<Workout>): LibraryItem => ({
  id: 'w1',
  name: 'PPL Classic',
  author: 'Hivo Team',
  level: 'Advanced',
  tags: ['hypertrophy'],
  description: '',
  duration: '8 weeks',
  daysPerWeek: 6,
  days: [
    { day: 'Mon', name: 'Push A', routineId: 'r1' },
    { day: 'Tue', name: 'Pull A', routineId: 'r2' },
  ],
  ...over,
  kind: 'workout',
});

const ALL = [routine({}), workout({})];

describe('filterTrending (port de train.jsx:498-516)', () => {
  it('passes everything with default filters', () => {
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: '' })).toHaveLength(2);
  });

  it('filters by level', () => {
    const out = filterTrending(ALL, { level: 'Advanced', type: 'all', query: '' });
    expect(out.map((i) => i.id)).toEqual(['w1']);
  });

  it('filters by type', () => {
    expect(filterTrending(ALL, { level: 'All', type: 'routines', query: '' }).map((i) => i.id)).toEqual(['r1']);
    expect(filterTrending(ALL, { level: 'All', type: 'workouts', query: '' }).map((i) => i.id)).toEqual(['w1']);
  });

  it('matches query against name, tags and level (case-insensitive)', () => {
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: 'ppl' }).map((i) => i.id)).toEqual(['w1']);
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: 'strength' }).map((i) => i.id)).toEqual(['r1']);
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: 'inter' }).map((i) => i.id)).toEqual(['r1']);
  });

  it('matches routine exercises and workout day names', () => {
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: 'bench' }).map((i) => i.id)).toEqual(['r1']);
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: 'pull a' }).map((i) => i.id)).toEqual(['w1']);
  });

  it('trims the query', () => {
    expect(filterTrending(ALL, { level: 'All', type: 'all', query: '  bench  ' }).map((i) => i.id)).toEqual(['r1']);
  });
});

describe('setActiveWorkout (port de train.jsx:162)', () => {
  const ws = [workout({ id: 'a' }), workout({ id: 'b', current: true })] as Workout[];

  it('activates the given workout and deactivates the rest', () => {
    const out = setActiveWorkout(ws, 'a');
    expect(out.find((w) => w.id === 'a')?.current).toBe(true);
    expect(out.find((w) => w.id === 'b')?.current).toBe(false);
  });

  it('toggles off when the workout was already active', () => {
    const out = setActiveWorkout(ws, 'b');
    expect(out.every((w) => !w.current)).toBe(true);
  });
});
