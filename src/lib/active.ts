// Lógica pura del logger activo (port de active.jsx:62-114).
import type { ActiveExercise, ActiveSet } from '@/data/types';

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

/** Autoreg: baja el peso un 5% redondeando al múltiplo de 0.5 más cercano. */
export function adjustedWeight(weight: number): number {
  return Math.round((weight * 0.95) / 0.5) * 0.5;
}

export function sessionTotals(exercises: ActiveExercise[]): {
  totalSets: number;
  doneSets: number;
  volume: number;
} {
  const totalSets = exercises.reduce((n, e) => n + e.sets.length, 0);
  const doneSets = exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
  // El proto suma todo set done (active.jsx:64); CLAUDE.md manda: los warmups
  // se excluyen de los cálculos de volumen. La regla de dominio gana.
  const volume = exercises.reduce(
    (v, e) =>
      v +
      e.sets
        .filter((s) => s.done && s.type !== 'warmup')
        .reduce((vv, s) => vv + s.weight * s.reps, 0),
    0,
  );
  return { totalSets, doneSets, volume };
}

export type AutoregNote = {
  exIdx: number;
  setIdx: number;
  from: number;
  to: number;
  reason: string;
};

export type LogSetResult = {
  exercises: ActiveExercise[];
  autoreg: AutoregNote | null;
  /** Índice del siguiente ejercicio incompleto si este quedó terminado. */
  nextFocusIdx: number | null;
  /** Descanso prescrito del ejercicio (para el rest timer en modo live). */
  restSec: number;
};

export function logSet(
  exercises: ActiveExercise[],
  exIdx: number,
  setIdx: number,
  patch: Pick<ActiveSet, 'weight' | 'reps' | 'rpe'>,
): LogSetResult {
  const next: ActiveExercise[] = JSON.parse(JSON.stringify(exercises));
  const set = next[exIdx].sets[setIdx];
  Object.assign(set, patch, { done: true, current: false });

  // El siguiente set pendiente pasa a current
  const remaining = next[exIdx].sets.findIndex((s, i) => i > setIdx && !s.done);
  if (remaining !== -1) next[exIdx].sets[remaining].current = true;

  // Autoreg adaptativo: RPE > prescrito + 1 → −5% en el siguiente set
  let autoreg: AutoregNote | null = null;
  if (set.rpe && set.prescribed?.rpe && set.rpe > set.prescribed.rpe + 1) {
    const nextSet = remaining !== -1 ? next[exIdx].sets[remaining] : undefined;
    if (nextSet) {
      const oldW = nextSet.weight;
      const newW = adjustedWeight(oldW);
      nextSet.weight = newW;
      nextSet.adjusted = {
        from: oldW,
        to: newW,
        reason: `RPE ${set.rpe} on a prescribed RPE ${set.prescribed.rpe} — dropping 5%`,
      };
      autoreg = { exIdx, setIdx: remaining, from: oldW, to: newW, reason: nextSet.adjusted.reason };
    }
  }

  // Si el ejercicio quedó completo, enfocar el siguiente incompleto
  let nextFocusIdx: number | null = null;
  if (next[exIdx].sets.every((s) => s.done)) {
    const nextEx = next.findIndex((e, i) => i > exIdx && e.sets.some((s) => !s.done));
    if (nextEx !== -1) nextFocusIdx = nextEx;
  }

  return { exercises: next, autoreg, nextFocusIdx, restSec: next[exIdx].rest || 90 };
}
