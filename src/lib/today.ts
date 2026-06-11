// Lógica pura de la pantalla Today
// (extraída de hivo-design/home.jsx:314-399,524-529).

import type { Routine, Workout, WorkoutDay } from '@/data/types';

export type Greeting = 'Morning' | 'Afternoon' | 'Evening';

/** Saludo según la hora del día (0-23). */
export function getGreeting(hour: number): Greeting {
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

/** Busca el día del programa que corresponde al nombre de día dado (ej. 'Mon'). */
export function findTodaySlot(workout: Workout, dayName: string): WorkoutDay | undefined {
  return (workout.days || []).find((d) => d.day === dayName);
}

/** Un slot es de descanso si no tiene rutina asignada o su nombre contiene "rest". */
export function isRestSlot(slot: WorkoutDay): boolean {
  return !slot.routineId || /rest/i.test(slot.name);
}

/** Minutos estimados para completar la rutina: round(Σ sets × (rest/60 + 1)). */
export function estimateMinutes(routine: Routine): number {
  return Math.round(
    routine.exercises.reduce((m, e) => m + (e.sets || 0) * ((e.rest || 90) / 60 + 1), 0)
  );
}

/** Suma total de sets de todos los ejercicios de la rutina. */
export function totalSets(routine: Routine): number {
  return routine.exercises.reduce((n, e) => n + (e.sets || 0), 0);
}
