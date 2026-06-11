// Tests de las funciones puras de la lógica de "Today"
// (extraídas de hivo-design/home.jsx:314-399,524-529).

import {
  getGreeting,
  findTodaySlot,
  isRestSlot,
  estimateMinutes,
  totalSets,
} from '../today';
import { ROUTINES, WORKOUTS } from '@/data/mock';
import type { WorkoutDay } from '@/data/types';

describe('getGreeting', () => {
  it('devuelve Morning antes de las 12h', () => {
    expect(getGreeting(0)).toBe('Morning');
    expect(getGreeting(11)).toBe('Morning');
  });

  it('devuelve Afternoon entre las 12h y las 18h', () => {
    expect(getGreeting(12)).toBe('Afternoon');
    expect(getGreeting(17)).toBe('Afternoon');
  });

  it('devuelve Evening a partir de las 18h', () => {
    expect(getGreeting(18)).toBe('Evening');
    expect(getGreeting(23)).toBe('Evening');
  });
});

describe('findTodaySlot', () => {
  const workout = WORKOUTS.mine.find((w) => w.id === 'w-m1')!;

  it('encuentra el slot del día solicitado', () => {
    const slot = findTodaySlot(workout, 'Mon');
    expect(slot).toEqual({ day: 'Mon', name: 'Upper · Heavy', routineId: 'r-m1' });
  });

  it('devuelve undefined si el día no está en el programa', () => {
    expect(findTodaySlot(workout, 'NotADay')).toBeUndefined();
  });
});

describe('isRestSlot', () => {
  it('es true cuando routineId es null', () => {
    const slot: WorkoutDay = { day: 'Wed', name: 'Rest', routineId: null };
    expect(isRestSlot(slot)).toBe(true);
  });

  it('es true cuando el nombre contiene "rest" (case-insensitive)', () => {
    const slot: WorkoutDay = { day: 'Sun', name: 'Rest day', routineId: 'r-m1' };
    expect(isRestSlot(slot)).toBe(true);
  });

  it('es false para un día de entreno normal', () => {
    const slot: WorkoutDay = { day: 'Mon', name: 'Upper · Heavy', routineId: 'r-m1' };
    expect(isRestSlot(slot)).toBe(false);
  });
});

describe('estimateMinutes', () => {
  it('calcula los minutos estimados de la rutina r-m1', () => {
    const routine = ROUTINES.mine.find((r) => r.id === 'r-m1')!;
    const expected = Math.round(
      5 * (150 / 60 + 1) +
        3 * (90 / 60 + 1) +
        3 * (75 / 60 + 1) +
        3 * (60 / 60 + 1) +
        3 * (90 / 60 + 1)
    );
    expect(estimateMinutes(routine)).toBe(expected);
  });
});

describe('totalSets', () => {
  it('suma los sets de todos los ejercicios de r-m1', () => {
    const routine = ROUTINES.mine.find((r) => r.id === 'r-m1')!;
    expect(totalSets(routine)).toBe(5 + 3 + 3 + 3 + 3);
  });
});
