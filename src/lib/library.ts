// Lógica de la biblioteca de Train (port de train.jsx:162,498-516).
import type { Routine, RoutineLevel, Workout } from '@/data/types';

export type LibraryItem =
  | (Workout & { kind: 'workout' })
  | (Routine & { kind: 'routine' });

export type LibraryFilters = {
  level: 'All' | RoutineLevel;
  type: 'all' | 'workouts' | 'routines';
  query: string;
};

export function filterTrending(items: LibraryItem[], filters: LibraryFilters): LibraryItem[] {
  const q = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.level !== 'All' && item.level !== filters.level) return false;
    if (filters.type === 'workouts' && item.kind !== 'workout') return false;
    if (filters.type === 'routines' && item.kind !== 'routine') return false;
    if (!q) return true;
    const inName = item.name.toLowerCase().includes(q);
    const inTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
    const inLevel = (item.level || '').toLowerCase().includes(q);
    const inExercises =
      item.kind === 'routine'
        ? (item.exercises || []).some((e) => e.name.toLowerCase().includes(q))
        : (item.days || []).some((d) => (d.name || '').toLowerCase().includes(q));
    return inName || inTags || inLevel || inExercises;
  });
}

/** Activa el workout dado y desactiva el resto; si ya era el activo, lo apaga. */
export function setActiveWorkout(workouts: Workout[], id: string): Workout[] {
  return workouts.map((w) => ({ ...w, current: w.id === id ? !w.current : false }));
}
