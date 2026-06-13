// Datos de fuerza por grupo muscular — port de ui.jsx:549-575.
// `values` alimenta BodyHeatmap (intensidad 0..1 por músculo).
import type { MuscleValues } from '@/components/body/BodyHeatmap';

export type MuscleStat = { name: string; value: string; sub: string };

export type BodyStrength = {
  values: MuscleValues;
  topMuscles: MuscleStat[];
  weak: string[];
};

// Media de fuerza del clan (CLAN_BODY).
export const CLAN_BODY: BodyStrength = {
  values: {
    chest: 0.82,
    shoulders: 0.71,
    biceps: 0.55,
    forearms: 0.42,
    abs: 0.61,
    obliques: 0.4,
    quads: 0.92,
    hamstrings: 0.55,
    glutes: 0.74,
    traps: 0.68,
    rearDelts: 0.45,
    lats: 0.78,
    midBack: 0.52,
    lowerBack: 0.65,
    triceps: 0.6,
    calves: 0.38,
  },
  topMuscles: [
    { name: 'Quads', value: '320 kg avg', sub: 'Back squat' },
    { name: 'Chest', value: '92 kg avg', sub: 'Bench press' },
    { name: 'Lats', value: '+12 kg BW', sub: 'Weighted pull-up' },
    { name: 'Glutes', value: '180 kg avg', sub: 'Hip thrust' },
  ],
  weak: ['Calves', 'Forearms', 'Rear delts'],
};
