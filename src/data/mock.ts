// Datos mock tipados, portados literalmente de hivo-design/ui.jsx
// (ver CLAUDE.md §Fuentes de verdad — no inventar/aproximar valores).

import type {
  AppNotification,
  Clan,
  FeedItem,
  Routine,
  Warmup,
  WeekDay,
  Workout,
  User,
} from './types';

// ui.jsx l.169-180
export const USER: User = {
  name: 'Mara Vidal',
  handle: 'maravidal',
  streak: 47,
  shields: 3,
  rank: 'Diamond II',
  level: 14,
  recovery: 78,
  hrv: 62,
  sleep: 7.2,
  soreness: 'low',
  bodyweight: 71.3,
  gym: 'Powerhouse, Castellana',
};

// ui.jsx l.182-210
export const CLAN: Clan = {
  name: 'Iron Crows',
  tag: 'CRWS',
  members: 6,
  rank: 'Diamond',
  rankProgress: 0.62,
  week: 'Week 3 of season',
  online: 3,
  raid: {
    name: 'Bench Press Raid',
    target: 50000,
    current: 31420,
    unit: 'kg',
    daysLeft: 2,
    contributions: [
      { name: 'Mara', value: 8400, you: true },
      { name: 'Diego', value: 7200 },
      { name: 'Tea', value: 6100 },
      { name: 'Yuki', value: 5800 },
      { name: 'Karim', value: 2520, behind: true },
      { name: 'Pia', value: 1400, behind: true },
    ],
  },
  missions: [
    { id: 'm1', title: 'Collective volume', target: '120,000 kg this week', progress: 0.72, members: 6 },
    { id: 'm2', title: 'Leg day x6', subtitle: 'Each member ≥ 1 leg session', progress: 0.66, members: 4 },
    { id: 'm3', title: 'No-skip Sunday', subtitle: 'Whole clan logs Sun', progress: 0, members: 0, upcoming: true },
  ],
};

// ui.jsx l.233-299
export const WARMUPS: Warmup[] = [
  {
    id: 'wu-shoulders',
    target: 'Shoulders',
    name: 'Shoulder mobility',
    duration: 6,
    cue: 'Before pressing or pulling overhead',
    exercises: [
      { name: 'Shoulder dislocates (band)', duration: '15 reps', tip: "Grip wide on the band, slow tempo. Don't shrug." },
      { name: 'Wall slides', duration: '10 reps', tip: 'Keep lower back flat. Drive elbows up the wall.' },
      { name: 'Scapular push-up', duration: '12 reps', tip: 'Just protract and retract. No elbow bend.' },
      { name: 'Cable face pull', duration: '15 reps', tip: 'Light weight. Drive elbows back, not up.' },
    ],
  },
  {
    id: 'wu-chest',
    target: 'Chest',
    name: 'Chest & T-spine',
    duration: 5,
    cue: 'Before bench or push day',
    exercises: [
      { name: 'Cat-cow', duration: '10 reps', tip: 'Move slow, breathe with each rep.' },
      { name: 'Thoracic rotation', duration: '8/side', tip: 'Hand behind head, drive elbow up to the ceiling.' },
      { name: 'Banded chest opener', duration: '30s', tip: 'Pull band apart, slowly arc arms behind you.' },
      { name: 'Push-up to down dog', duration: '8 reps', tip: 'Slow eccentric. Press hips back to long spine.' },
    ],
  },
  {
    id: 'wu-back',
    target: 'Back',
    name: 'Lat & spine prep',
    duration: 7,
    cue: 'Before pull, row, or deadlift',
    exercises: [
      { name: 'Bird dog', duration: '10/side', tip: 'Opposite arm + leg, brace core. No hip rotation.' },
      { name: 'Lat hang', duration: '30s', tip: 'Dead hang from bar. Pack shoulders.' },
      { name: 'Banded pull-apart', duration: '15 reps', tip: 'Drive shoulder blades together.' },
      { name: 'Hip airplane', duration: '8/side', tip: 'Single-leg balance. Hinge at hips, rotate slowly.' },
    ],
  },
  {
    id: 'wu-legs',
    target: 'Legs',
    name: 'Hip & ankle prep',
    duration: 8,
    cue: 'Before squat or deadlift',
    exercises: [
      { name: 'Couch stretch', duration: '45s/side', tip: 'Rear shin against wall, hips squared forward.' },
      { name: '90/90 hip switches', duration: '8/side', tip: 'Both hips at 90°. Switch slow and controlled.' },
      { name: 'Ankle dorsiflexion rocks', duration: '10/side', tip: 'Knee forward over toe. Heel stays down.' },
      { name: 'Goblet squat hold', duration: '30s', tip: 'Sit deep, elbows on inner thighs, drive knees out.' },
    ],
  },
  {
    id: 'wu-full',
    target: 'Full body',
    name: 'General warmup',
    duration: 10,
    cue: 'Any session',
    exercises: [
      { name: "World's greatest stretch", duration: '5/side', tip: 'Hits hips, t-spine, and adductors.' },
      { name: 'Inchworm', duration: '8 reps', tip: 'Walk hands out to plank, push up, walk back.' },
      { name: 'Reverse lunge w/ rotation', duration: '8/side', tip: 'Step back, rotate over front leg.' },
      { name: 'Bear crawl', duration: '30s', tip: 'Knees hover off the floor. Slow steps.' },
    ],
  },
];

// ui.jsx l.358-362
export const FEED: FeedItem[] = [
  { id: 'f1', who: 'Diego R.', clan: 'CRWS', when: '12m', action: 'hit a PR', detail: 'Deadlift 180 kg × 3', badge: 'PR' },
  { id: 'f2', who: 'Tea M.', clan: 'CRWS', when: '1h', action: 'finished', detail: 'Pull · Heavy in 58:12' },
  { id: 'f3', who: 'Karim O.', clan: 'CRWS', when: '4h', action: 'needs a rescue', detail: 'Behind on the raid by 3,500 kg', alert: true },
];

// ui.jsx l.364-397
export const WEEK: WeekDay[] = [
  {
    day: 'M', date: 19, status: 'done', label: 'Pull · Heavy',
    summary: {
      duration: '58:12', volume: 14820, sets: 19, pr: 'Barbell row 92.5 kg × 6', avgRpe: 7.4,
      exercises: [
        { name: 'Deadlift', sets: '4 × 5', top: '160 kg × 5 @ 8' },
        { name: 'Pull-up', sets: '4 × 8', top: 'BW + 10 kg × 8 @ 8' },
        { name: 'Barbell row', sets: '4 × 6', top: '92.5 kg × 6 @ 8 · PR' },
        { name: 'Lat pulldown', sets: '3 × 10', top: '60 kg × 10 @ 7' },
        { name: 'Hammer curl', sets: '4 × 12', top: '14 kg × 12 @ 7' },
      ],
    },
  },
  {
    day: 'T', date: 20, status: 'done', label: 'Push · Volume',
    summary: {
      duration: '52:40', volume: 11240, sets: 17, pr: null, avgRpe: 7.1,
      exercises: [
        { name: 'Bench press', sets: '4 × 8', top: '77.5 kg × 8 @ 7' },
        { name: 'Overhead press', sets: '3 × 6', top: '52.5 kg × 6 @ 8' },
        { name: 'Incline DB press', sets: '3 × 10', top: '26 kg × 10 @ 7' },
        { name: 'Lateral raise', sets: '4 × 12', top: '9 kg × 12 @ 8' },
        { name: 'Cable fly', sets: '3 × 12', top: '11 kg × 12 @ 7' },
      ],
    },
  },
  { day: 'W', date: 21, status: 'rest', label: 'Rest' },
  {
    day: 'T', date: 22, status: 'done', label: 'Legs · Heavy',
    summary: {
      duration: '1:04:18', volume: 22100, sets: 20, pr: 'Back squat 140 kg × 4', avgRpe: 7.8,
      exercises: [
        { name: 'Back squat', sets: '5 × 4', top: '140 kg × 4 @ 9 · PR' },
        { name: 'Romanian DL', sets: '4 × 8', top: '110 kg × 8 @ 7' },
        { name: 'Bulgarian split', sets: '3 × 10', top: '24 kg × 10 @ 8' },
        { name: 'Leg curl', sets: '4 × 12', top: '50 kg × 12 @ 7' },
        { name: 'Calf raise', sets: '4 × 15', top: '90 kg × 15 @ 7' },
      ],
    },
  },
  { day: 'F', date: 23, status: 'today', label: 'Push · Heavy' },
  {
    day: 'S', date: 24, status: 'planned', label: 'Pull · Volume',
    plan: { exercises: ['Barbell row', 'Lat pulldown', 'Face pull', 'Curl', 'Hammer curl'], sets: 16, duration: '~50 min' },
  },
  { day: 'S', date: 25, status: 'planned', label: 'Rest', plan: null },
];

// ui.jsx l.403-470
export const ROUTINES: { trending: Routine[]; recommended: Routine[]; mine: Routine[] } = {
  trending: [
    {
      id: 'r-t1', name: 'Heavy Bench Day', author: '@joelcoaches', users: 8420, level: 'Intermediate', tags: ['Push', 'Strength'], rating: 4.8,
      description: 'Bench-focused push session. Heavy compound, accessory volume.',
      exercises: [
        { name: 'Barbell bench press', sets: 5, reps: '5', rest: 180, rpe: 8 },
        { name: 'Overhead press', sets: 3, reps: '6-8', rest: 120, rpe: 7 },
        { name: 'Incline DB press', sets: 3, reps: '10', rest: 90, rpe: 7 },
        { name: 'Lateral raise', sets: 4, reps: '12-15', rest: 60, rpe: 8 },
        { name: 'Triceps pushdown', sets: 3, reps: '12', rest: 60, rpe: 7 },
      ],
    },
    {
      id: 'r-t2', name: 'Beginner Full Body', author: 'Hivo Coaches', users: 14200, level: 'Beginner', tags: ['Full body', 'Bodyweight friendly'], rating: 4.9,
      description: 'Simple 5-exercise full body for first-timers. Compound focus, low fatigue.',
      exercises: [
        { name: 'Goblet squat', sets: 3, reps: '10', rest: 90, rpe: 6 },
        { name: 'DB bench press', sets: 3, reps: '10', rest: 90, rpe: 6 },
        { name: 'DB row', sets: 3, reps: '10', rest: 90, rpe: 6 },
        { name: 'Glute bridge', sets: 3, reps: '12', rest: 60, rpe: 6 },
        { name: 'Plank', sets: 3, reps: '30s', rest: 45, rpe: 7 },
      ],
    },
    {
      id: 'r-t3', name: 'Glute Hammer', author: '@bretcontreras', users: 11800, level: 'Advanced', tags: ['Glutes', 'High volume'], rating: 4.9,
      description: 'High-volume glute day. Compounds + isolations.',
      exercises: [
        { name: 'Hip thrust', sets: 5, reps: '6-8', rest: 150, rpe: 8 },
        { name: 'Bulgarian split squat', sets: 4, reps: '10', rest: 90, rpe: 8 },
        { name: 'Cable kickback', sets: 4, reps: '12', rest: 60, rpe: 8 },
        { name: 'Glute bridge', sets: 4, reps: '15', rest: 60, rpe: 8 },
      ],
    },
    {
      id: 'r-t4', name: 'Mobility & Core', author: 'Hivo Coaches', users: 5800, level: 'Beginner', tags: ['Recovery', 'Mobility'], rating: 4.7,
      description: 'Active recovery day. Mobility flow + light core.',
      exercises: [
        { name: "World's greatest stretch", sets: 2, reps: '8/side', rest: 30, rpe: 5 },
        { name: 'Cat-cow', sets: 2, reps: '10', rest: 30, rpe: 4 },
        { name: 'Dead bug', sets: 3, reps: '10', rest: 45, rpe: 6 },
        { name: 'Bird dog', sets: 3, reps: '10/side', rest: 45, rpe: 6 },
      ],
    },
  ],
  recommended: [],
  mine: [
    {
      id: 'r-m1', name: 'Push · Heavy', author: 'You', level: 'Intermediate', users: null, tags: ['Push'], rating: null,
      description: 'My current push day. Heavy bench focus with shoulder accessory.',
      exercises: [
        { name: 'Barbell bench press', sets: 5, reps: '6', rest: 150, rpe: 7 },
        { name: 'Seated DB press', sets: 3, reps: '10', rest: 90, rpe: 7 },
        { name: 'Incline cable fly', sets: 3, reps: '12', rest: 75, rpe: 7 },
        { name: 'Triceps pushdown', sets: 3, reps: '12', rest: 60, rpe: 7 },
        { name: 'Lateral raise · drop', sets: 3, reps: '12', rest: 90, rpe: 8 },
      ],
    },
    {
      id: 'r-m2', name: 'Pull · Heavy', author: 'You', level: 'Intermediate', users: null, tags: ['Pull'], rating: null,
      description: 'Deadlift-driven pull day.',
      exercises: [
        { name: 'Deadlift', sets: 4, reps: '5', rest: 180, rpe: 8 },
        { name: 'Pull-up', sets: 4, reps: '8', rest: 120, rpe: 8 },
        { name: 'Barbell row', sets: 4, reps: '6', rest: 120, rpe: 7 },
        { name: 'Lat pulldown', sets: 3, reps: '10', rest: 75, rpe: 7 },
        { name: 'Hammer curl', sets: 4, reps: '12', rest: 60, rpe: 7 },
      ],
    },
    {
      id: 'r-m3', name: 'Legs · Heavy', author: 'You', level: 'Intermediate', users: null, tags: ['Legs'], rating: null,
      description: 'Squat-focused leg day.',
      exercises: [
        { name: 'Back squat', sets: 5, reps: '4', rest: 180, rpe: 8 },
        { name: 'Romanian DL', sets: 4, reps: '8', rest: 120, rpe: 7 },
        { name: 'Bulgarian split squat', sets: 3, reps: '10', rest: 90, rpe: 8 },
        { name: 'Leg curl', sets: 4, reps: '12', rest: 75, rpe: 7 },
        { name: 'Calf raise', sets: 4, reps: '15', rest: 60, rpe: 7 },
      ],
    },
  ],
};

// ui.jsx l.473-544
export const WORKOUTS: { trending: Workout[]; mine: Workout[] } = {
  trending: [
    {
      id: 'w-t1', name: 'PPL · Hypertrophy', author: '@joelcoaches', users: 18420, level: 'Intermediate', rating: 4.8,
      tags: ['Push Pull Legs', '6 days', 'Hypertrophy'],
      description: '6-day Push/Pull/Legs split. Three pushing days, three pulling days. Built for hypertrophy.',
      duration: '6 weeks', daysPerWeek: 6,
      days: [
        { day: 'Mon', name: 'Push · Heavy', routineId: 'r-m1' },
        { day: 'Tue', name: 'Pull · Heavy', routineId: 'r-m2' },
        { day: 'Wed', name: 'Legs · Heavy', routineId: 'r-m3' },
        { day: 'Thu', name: 'Push · Volume', routineId: 'r-t1' },
        { day: 'Fri', name: 'Pull · Volume', routineId: 'r-m2' },
        { day: 'Sat', name: 'Legs · Volume', routineId: 'r-m3' },
        { day: 'Sun', name: 'Rest', routineId: null },
      ],
    },
    {
      id: 'w-t2', name: '5/3/1 BBB', author: '@wendlerOG', users: 12880, level: 'Advanced', rating: 4.9,
      tags: ['Strength', '4 days', 'Powerlifting'],
      description: 'Classic Jim Wendler 5/3/1 with Boring But Big assistance. Slow progression, durable strength.',
      duration: '4 weeks', daysPerWeek: 4,
      days: [
        { day: 'Mon', name: 'Bench', routineId: 'r-m1' },
        { day: 'Tue', name: 'Squat', routineId: 'r-m3' },
        { day: 'Thu', name: 'OHP', routineId: 'r-m1' },
        { day: 'Fri', name: 'Deadlift', routineId: 'r-m2' },
      ],
    },
    {
      id: 'w-t3', name: 'Upper / Lower · 4d', author: 'Hivo AI', users: 9400, level: 'Intermediate', rating: 4.7,
      tags: ['Upper Lower', '4 days', 'Balanced'],
      description: 'Balanced upper/lower split. Great middle ground between full body and PPL.',
      duration: '6 weeks', daysPerWeek: 4,
      days: [
        { day: 'Mon', name: 'Upper · Heavy', routineId: 'r-m1' },
        { day: 'Tue', name: 'Lower · Heavy', routineId: 'r-m3' },
        { day: 'Thu', name: 'Upper · Volume', routineId: 'r-m2' },
        { day: 'Fri', name: 'Lower · Volume', routineId: 'r-m3' },
      ],
    },
    {
      id: 'w-t4', name: 'Starting Strength', author: '@markripp', users: 22100, level: 'Beginner', rating: 4.9,
      tags: ['Strength', '3 days', 'Linear progression'],
      description: 'The classic 3-day beginner barbell program. Squat, bench, deadlift, press, row. Add weight every session.',
      duration: '8-12 weeks', daysPerWeek: 3,
      days: [
        { day: 'Mon', name: 'Workout A', routineId: 'r-t2' },
        { day: 'Wed', name: 'Workout B', routineId: 'r-t2' },
        { day: 'Fri', name: 'Workout A', routineId: 'r-t2' },
      ],
    },
    {
      id: 'w-t5', name: 'Glute Hypertrophy 4d', author: '@bretcontreras', users: 24100, level: 'Advanced', rating: 4.9,
      tags: ['Glutes', '4 days', 'Aesthetic'],
      description: 'High-frequency glute focus. Compounds + isolations every session.',
      duration: '8 weeks', daysPerWeek: 4,
      days: [
        { day: 'Mon', name: 'Glutes · Heavy', routineId: 'r-t3' },
        { day: 'Tue', name: 'Upper', routineId: 'r-m1' },
        { day: 'Thu', name: 'Glutes · Pump', routineId: 'r-t3' },
        { day: 'Sat', name: 'Upper · Light', routineId: 'r-m1' },
      ],
    },
  ],
  mine: [
    {
      id: 'w-m1', name: 'Hypertrophy 6× Upper/Lower', author: 'You', level: 'Intermediate',
      week: 3, totalWeeks: 6, daysPerWeek: 6,
      tags: ['Upper Lower', 'My program'],
      description: 'My current program. Week 3 of 6, deload at week 4.',
      duration: '6 weeks',
      days: [
        { day: 'Mon', name: 'Upper · Heavy', routineId: 'r-m1' },
        { day: 'Tue', name: 'Lower · Heavy', routineId: 'r-m3' },
        { day: 'Wed', name: 'Rest', routineId: null },
        { day: 'Thu', name: 'Upper · Volume', routineId: 'r-m2' },
        { day: 'Fri', name: 'Lower · Volume', routineId: 'r-m3' },
        { day: 'Sat', name: 'Upper · Pump', routineId: 'r-m1' },
        { day: 'Sun', name: 'Rest', routineId: null },
      ],
    },
  ],
};

// ui.jsx l.637-643
export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', kind: 'raid', title: 'Karim needs a rescue', body: 'Behind on the Bench Raid by 3,500 kg. Your reps count 2× until Fri.', when: '12m', unread: true },
  { id: 'n2', kind: 'pr', title: 'New PR · Diego R.', body: 'Deadlift 180 kg × 3', when: '38m', unread: true },
  { id: 'n3', kind: 'autoreg', title: 'Adaptive note', body: "HRV down 8 ms — Hivo softened tomorrow's squat target", when: '2h', unread: true },
  { id: 'n4', kind: 'clan', title: 'Tea M. liked your post', body: 'Pull · Heavy summary', when: '4h' },
  { id: 'n5', kind: 'mission', title: 'Mission complete', body: 'Collective volume 120k kg — clan earned 240 XP', when: 'yesterday' },
];
