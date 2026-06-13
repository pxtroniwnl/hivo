// Modelo de dominio de Hivo (ver CLAUDE.md §Modelo de dominio):
// Exercise (movimiento) → Routine (sesión de un día) → Workout (programa semanal).
// Shapes derivadas del mock del prototipo (hivo-design/ui.jsx).

export type User = {
  name: string;
  handle: string;
  streak: number;
  shields: number;
  rank: string;
  level: number;
  recovery: number;
  hrv: number;
  sleep: number;
  soreness: 'low' | 'mid' | 'high';
  bodyweight: number;
  gym: string;
};

export type RaidContribution = {
  name: string;
  value: number;
  you?: boolean;
  behind?: boolean;
};

export type Raid = {
  name: string;
  target: number;
  current: number;
  unit: string;
  daysLeft: number;
  contributions: RaidContribution[];
};

export type Mission = {
  id: string;
  title: string;
  subtitle?: string;
  target?: string;
  /** 0..1 */
  progress: number;
  members: number;
  upcoming?: boolean;
};

export type Clan = {
  name: string;
  tag: string;
  members: number;
  rank: string;
  /** 0..1 */
  rankProgress: number;
  week: string;
  online: number;
  raid: Raid;
  missions: Mission[];
};

export type LoggedExercise = {
  name: string;
  sets: string;
  top: string;
};

export type WorkoutSummary = {
  duration: string;
  volume: number;
  sets: number;
  pr: string | null;
  avgRpe: number;
  exercises: LoggedExercise[];
};

export type PlannedDay = {
  exercises: string[];
  sets: number;
  duration: string;
};

export type WeekDayStatus = 'done' | 'rest' | 'today' | 'planned';

export type WeekDay = {
  day: string;
  date: number;
  status: WeekDayStatus;
  label: string;
  summary?: WorkoutSummary;
  plan?: PlannedDay | null;
};

export type WarmupExercise = {
  name: string;
  duration: string;
  tip: string;
};

export type WarmupTarget = 'Shoulders' | 'Chest' | 'Back' | 'Legs' | 'Full body';

export type Warmup = {
  id: string;
  target: WarmupTarget;
  name: string;
  /** minutos */
  duration: number;
  cue: string;
  exercises: WarmupExercise[];
};

export type FeedItem = {
  id: string;
  who: string;
  clan: string;
  when: string;
  action: string;
  detail: string;
  badge?: string;
  alert?: boolean;
};

export type NotificationKind = 'raid' | 'pr' | 'autoreg' | 'clan' | 'mission';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  when: string;
  unread?: boolean;
};

export type RoutineLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RoutineExercise = {
  name: string;
  sets: number;
  reps: string;
  /** segundos */
  rest: number;
  rpe: number;
};

export type Routine = {
  id: string;
  name: string;
  author: string;
  users?: number | null;
  level: RoutineLevel;
  tags: string[];
  rating?: number | null;
  description: string;
  exercises: RoutineExercise[];
};

// ── Logger activo (active.jsx) ──────────────────────────────────
export type SetType = 'warmup' | 'normal' | 'drop' | 'failure' | 'superset' | 'cluster';

export type SetPrescription = { weight: number; reps: number; rpe: number };

export type ActiveSet = {
  type: SetType;
  weight: number;
  reps: number;
  rpe: number | null;
  prescribed?: SetPrescription;
  done: boolean;
  current?: boolean;
  /** Si autoreg intervino: siempre explícito, nunca silencioso (CLAUDE.md). */
  adjusted?: { from: number; to: number; reason: string };
};

export type ActiveExercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  sets: ActiveSet[];
  /** segundos */
  rest: number;
  lastSession: { weight: number; reps: number; rpe: number };
  /** gym-aware: el equipamiento no está en el gym actual */
  unavailable?: boolean;
  swapSuggestions?: string[];
  swapped?: boolean;
};

export type Technique = {
  cues: string[];
  common: string;
  sets: string;
};

export type WorkoutDay = {
  day: string;
  name: string;
  routineId: string | null;
};

export type Workout = {
  id: string;
  name: string;
  author: string;
  users?: number;
  level: RoutineLevel;
  rating?: number;
  tags: string[];
  description: string;
  duration: string;
  daysPerWeek: number;
  week?: number;
  totalWeeks?: number;
  /** Solo un workout puede estar activo por usuario. */
  current?: boolean;
  days: WorkoutDay[];
};
