// Port de EXERCISE_LIBRARY (train.jsx:1339-1360). En la app real serán ~400
// ejercicios globales + creados por el usuario (ver CLAUDE.md).
export type ExerciseInfo = { name: string; muscle: string };

export const EXERCISE_LIBRARY: ExerciseInfo[] = [
  { name: 'Barbell bench press', muscle: 'Chest' },
  { name: 'Incline DB press', muscle: 'Chest' },
  { name: 'Cable fly', muscle: 'Chest' },
  { name: 'Overhead press', muscle: 'Shoulders' },
  { name: 'Seated DB press', muscle: 'Shoulders' },
  { name: 'Lateral raise', muscle: 'Shoulders' },
  { name: 'Face pull', muscle: 'Shoulders' },
  { name: 'Pull-up', muscle: 'Back' },
  { name: 'Barbell row', muscle: 'Back' },
  { name: 'Lat pulldown', muscle: 'Back' },
  { name: 'Deadlift', muscle: 'Back' },
  { name: 'Back squat', muscle: 'Quads' },
  { name: 'Front squat', muscle: 'Quads' },
  { name: 'Romanian DL', muscle: 'Hamstrings' },
  { name: 'Leg curl', muscle: 'Hamstrings' },
  { name: 'Hip thrust', muscle: 'Glutes' },
  { name: 'Bulgarian split squat', muscle: 'Quads' },
  { name: 'Triceps pushdown', muscle: 'Triceps' },
  { name: 'Hammer curl', muscle: 'Biceps' },
  { name: 'Calf raise', muscle: 'Calves' },
];
