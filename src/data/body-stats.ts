// Datos de fuerza por grupo muscular — port de ui.jsx:549-575.
// `values` alimenta BodyHeatmap (intensidad 0..1 por músculo).
import type { MuscleValues } from '@/components/body/BodyHeatmap';

export type MuscleStat = { name: string; value: string; sub: string };

export type BodyStrength = {
  values: MuscleValues;
  topMuscles: MuscleStat[];
  weak: string[];
};

export type PersonalLift = { name: string; value: string };

export type PersonalStrength = {
  values: MuscleValues;
  topLifts: PersonalLift[];
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

// Fuerza personal del usuario (PERSONAL_BODY, ui.jsx:565-575).
export const PERSONAL_BODY: PersonalStrength = {
  values: {
    chest: 0.78,
    shoulders: 0.62,
    biceps: 0.48,
    forearms: 0.35,
    abs: 0.55,
    obliques: 0.32,
    quads: 0.85,
    hamstrings: 0.42,
    glutes: 0.66,
    traps: 0.58,
    rearDelts: 0.38,
    lats: 0.7,
    midBack: 0.5,
    lowerBack: 0.62,
    triceps: 0.55,
    calves: 0.3,
  },
  topLifts: [
    { name: 'Back squat', value: '140 kg × 4' },
    { name: 'Deadlift', value: '180 kg × 3' },
    { name: 'Bench press', value: '92.5 kg × 5' },
  ],
  weak: ['Calves', 'Hamstrings', 'Rear delts'],
};

// Serie de peso corporal, últimas 12 semanas en kg (BODYWEIGHT_SERIES, ui.jsx:578).
export const BODYWEIGHT_SERIES = [72.4, 72.3, 72.1, 72.5, 72.0, 71.9, 71.8, 71.6, 71.7, 71.5, 71.4, 71.3];
