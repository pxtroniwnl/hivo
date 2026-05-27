// ui.jsx — shared icons, atoms, mock data
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// Icons (stroke-based, 24px viewBox, current color)
// ─────────────────────────────────────────────────────────────
const I = {
  home:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z"/></svg>,
  dumb:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9v6M3 11v2M18 9v6M21 11v2M6 12h12"/></svg>,
  squad:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.2"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M15 19c0-2 1.5-3.5 4-3.5s2 1.5 2 3.5"/></svg>,
  chart:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6"/></svg>,
  user:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/></svg>,
  bell:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 004 0"/></svg>,
  plus:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  check:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12l5 5L20 6"/></svg>,
  arrow:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  back:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 5l-7 7 7 7"/></svg>,
  more:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>,
  flame:   (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2s4 4 4 8c0 1.5-1 3-2 3s-1-2-3-2c-3 0-5 2.5-5 5.5C6 20 9 22 12 22s7-2.5 7-7c0-7-7-13-7-13z"/></svg>,
  shield:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/></svg>,
  timer:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 3h6M12 5v-2"/></svg>,
  play:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 5l12 7-12 7V5z"/></svg>,
  pause:   (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>,
  swap:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 7h13l-3-3M17 17H4l3 3"/></svg>,
  bolt:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  warn:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l10 18H2L12 3zM12 10v5M12 18v.5"/></svg>,
  info:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>,
  pin:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21v-7M5 9c0-2 1.5-4 3-4h8c1.5 0 3 2 3 4 0 3-3 5-3 5H8s-3-2-3-5z"/></svg>,
  close:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>,
  heart:   (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 21s-7-4.5-9.5-9C0.5 7.5 4 4 7.5 5.5 9 6 11 7 12 9c1-2 3-3 4.5-3.5C20 4 23.5 7.5 21.5 12 19 16.5 12 21 12 21z"/></svg>,
  trophy:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3M9 14h6M10 14l-1 6h6l-1-6"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────
function Avatar({ name, size = 36, color, src }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div className="avatar" style={{
      width: size, height: size, fontSize: size * 0.36,
      background: color || 'linear-gradient(135deg, #3a3a48, #1d1d26)',
      ...(src ? { backgroundImage: `url(${src})`, backgroundSize: 'cover' } : {}),
    }}>
      {!src && initials}
    </div>
  );
}

function Chip({ children, variant = 'default', icon, style }) {
  const cls = 'chip' + (variant === 'acc' ? ' chip-acc' : variant === 'solid' ? ' chip-solid' : '');
  return <span className={cls} style={style}>{icon}{children}</span>;
}

function ProgressBar({ value, max = 100, color = 'var(--accent)', height = 6, bg = 'var(--bg-3)' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: '100%', height, background: bg, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%', background: color, borderRadius: 999,
        transition: 'width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }} />
    </div>
  );
}

function Ring({ size = 120, value = 0.7, stroke = 10, color = 'var(--accent)', track = 'var(--bg-3)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

// Header used across screens
function ScreenHeader({ title, subtitle, right, sticky }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '8px 18px 14px',
      position: sticky ? 'sticky' : 'static', top: 0,
      background: sticky ? 'linear-gradient(180deg, var(--bg-0) 70%, transparent)' : 'transparent',
      zIndex: 5,
    }}>
      <div>
        {subtitle && <div className="t-xs" style={{ marginBottom: 4 }}>{subtitle}</div>}
        <div className="t-h1">{title}</div>
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reveal-on-scroll — uses IntersectionObserver
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || visible) return;
    const node = ref.current;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold, rootMargin: '0px 0px -8% 0px' });
    obs.observe(node);
    return () => obs.disconnect();
  }, [visible, threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, threshold, as: As = 'div', className = '', style = {}, ...rest }) {
  const [ref, visible] = useReveal(threshold);
  return (
    <As
      ref={ref}
      className={`reveal ${visible ? 'in' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms', ...style }}
      {...rest}>
      {children}
    </As>
  );
}

// ─────────────────────────────────────────────────────────────
// Counter — animates a numeric value to its target
// ─────────────────────────────────────────────────────────────
function Counter({ to = 0, duration = 900, format = (v) => Math.round(v).toString(), startOnVisible = true }) {
  const [ref, visible] = useReveal(0.05);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (startOnVisible && !visible) return;
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setVal(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, visible, startOnVisible]);
  return <span ref={ref} className="count">{format(val)}</span>;
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────
const USER = {
  name: 'Mara Vidal',
  handle: 'maravidal',
  streak: 47,
  shields: 3,
  rank: 'Diamond II',
  level: 14,
  recovery: 78,
  hrv: 62, sleep: 7.2, soreness: 'low',
  bodyweight: 71.3,
  gym: 'Powerhouse, Castellana',
};

const CLAN = {
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

const TODAY_WORKOUT = {
  id: 'w-push-b',
  name: 'Push · Heavy',
  type: 'Recommended',
  reason: 'Based on Tuesday\'s pull volume and recovery 78',
  duration: 62,
  exercises: 5,
  totalSets: 18,
  difficulty: 'RPE 7–8',
  muscles: ['Chest', 'Shoulders', 'Triceps'],
};

const ALT_WORKOUTS = [
  { id: 'w-push-l', name: 'Push · Light', duration: 38, sets: 12, tag: 'Easier' },
  { id: 'w-mobility', name: 'Mobility & core', duration: 22, sets: 9, tag: 'Active recovery' },
  { id: 'w-skip', name: 'Skip today', duration: 0, sets: 0, tag: 'Rest day' },
];

// ─────────────────────────────────────────────────────────────
// Warmup routines — short mobility flows before main workout
// ─────────────────────────────────────────────────────────────
const WARMUPS = [
  {
    id: 'wu-shoulders',
    target: 'Shoulders',
    name: 'Shoulder mobility',
    duration: 6,
    cue: 'Before pressing or pulling overhead',
    exercises: [
      { name: 'Shoulder dislocates (band)', duration: '15 reps', tip: 'Grip wide on the band, slow tempo. Don\'t shrug.' },
      { name: 'Wall slides',                duration: '10 reps', tip: 'Keep lower back flat. Drive elbows up the wall.' },
      { name: 'Scapular push-up',           duration: '12 reps', tip: 'Just protract and retract. No elbow bend.' },
      { name: 'Cable face pull',            duration: '15 reps', tip: 'Light weight. Drive elbows back, not up.' },
    ],
  },
  {
    id: 'wu-chest',
    target: 'Chest',
    name: 'Chest & T-spine',
    duration: 5,
    cue: 'Before bench or push day',
    exercises: [
      { name: 'Cat-cow',                duration: '10 reps', tip: 'Move slow, breathe with each rep.' },
      { name: 'Thoracic rotation',      duration: '8/side',  tip: 'Hand behind head, drive elbow up to the ceiling.' },
      { name: 'Banded chest opener',    duration: '30s',     tip: 'Pull band apart, slowly arc arms behind you.' },
      { name: 'Push-up to down dog',    duration: '8 reps',  tip: 'Slow eccentric. Press hips back to long spine.' },
    ],
  },
  {
    id: 'wu-back',
    target: 'Back',
    name: 'Lat & spine prep',
    duration: 7,
    cue: 'Before pull, row, or deadlift',
    exercises: [
      { name: 'Bird dog',              duration: '10/side', tip: 'Opposite arm + leg, brace core. No hip rotation.' },
      { name: 'Lat hang',              duration: '30s',     tip: 'Dead hang from bar. Pack shoulders.' },
      { name: 'Banded pull-apart',     duration: '15 reps', tip: 'Drive shoulder blades together.' },
      { name: 'Hip airplane',          duration: '8/side',  tip: 'Single-leg balance. Hinge at hips, rotate slowly.' },
    ],
  },
  {
    id: 'wu-legs',
    target: 'Legs',
    name: 'Hip & ankle prep',
    duration: 8,
    cue: 'Before squat or deadlift',
    exercises: [
      { name: 'Couch stretch',          duration: '45s/side', tip: 'Rear shin against wall, hips squared forward.' },
      { name: '90/90 hip switches',     duration: '8/side',   tip: 'Both hips at 90°. Switch slow and controlled.' },
      { name: 'Ankle dorsiflexion rocks', duration: '10/side', tip: 'Knee forward over toe. Heel stays down.' },
      { name: 'Goblet squat hold',      duration: '30s',      tip: 'Sit deep, elbows on inner thighs, drive knees out.' },
    ],
  },
  {
    id: 'wu-full',
    target: 'Full body',
    name: 'General warmup',
    duration: 10,
    cue: 'Any session',
    exercises: [
      { name: 'World\'s greatest stretch', duration: '5/side', tip: 'Hits hips, t-spine, and adductors.' },
      { name: 'Inchworm',                 duration: '8 reps', tip: 'Walk hands out to plank, push up, walk back.' },
      { name: 'Reverse lunge w/ rotation', duration: '8/side', tip: 'Step back, rotate over front leg.' },
      { name: 'Bear crawl',               duration: '30s',     tip: 'Knees hover off the floor. Slow steps.' },
    ],
  },
];

const EXERCISES = [
  {
    id: 'ex-bench', name: 'Barbell bench press', muscle: 'Chest', equipment: 'Barbell',
    sets: [
      { type: 'warmup', weight: 40, reps: 10, rpe: null, done: true },
      { type: 'warmup', weight: 60, reps: 6, rpe: null, done: true },
      { type: 'normal', weight: 80, reps: 6, rpe: 7, prescribed: { weight: 80, reps: 6, rpe: 7 }, done: false, current: true },
      { type: 'normal', weight: 80, reps: 6, rpe: 7, prescribed: { weight: 80, reps: 6, rpe: 7 }, done: false },
      { type: 'normal', weight: 80, reps: 6, rpe: 8, prescribed: { weight: 80, reps: 6, rpe: 8 }, done: false },
    ],
    rest: 150,
    lastSession: { weight: 77.5, reps: 6, rpe: 7 },
  },
  {
    id: 'ex-ohp', name: 'Seated dumbbell press', muscle: 'Shoulders', equipment: 'Dumbbells',
    sets: [
      { type: 'normal', weight: 22, reps: 10, rpe: 7, prescribed: { weight: 22, reps: 10, rpe: 7 }, done: false },
      { type: 'normal', weight: 22, reps: 10, rpe: 7, prescribed: { weight: 22, reps: 10, rpe: 7 }, done: false },
      { type: 'normal', weight: 22, reps: 10, rpe: 8, prescribed: { weight: 22, reps: 10, rpe: 8 }, done: false },
    ],
    rest: 90,
    lastSession: { weight: 20, reps: 10, rpe: 7 },
  },
  {
    id: 'ex-incline', name: 'Incline cable fly', muscle: 'Chest', equipment: 'Cable',
    sets: [
      { type: 'normal', weight: 12, reps: 12, rpe: 7, prescribed: { weight: 12, reps: 12, rpe: 7 }, done: false },
      { type: 'normal', weight: 12, reps: 12, rpe: 7, prescribed: { weight: 12, reps: 12, rpe: 7 }, done: false },
      { type: 'normal', weight: 12, reps: 12, rpe: 8, prescribed: { weight: 12, reps: 12, rpe: 8 }, done: false },
    ],
    rest: 75,
    lastSession: { weight: 11, reps: 12, rpe: 7 },
    unavailable: true,        // gym-aware: cable not in current gym
    swapSuggestions: ['Incline dumbbell fly', 'Pec deck', 'Push-up to deficit'],
  },
  {
    id: 'ex-pushdown', name: 'Triceps rope pushdown', muscle: 'Triceps', equipment: 'Cable',
    sets: [
      { type: 'normal', weight: 25, reps: 12, rpe: 7, prescribed: { weight: 25, reps: 12, rpe: 7 }, done: false },
      { type: 'normal', weight: 25, reps: 12, rpe: 7, prescribed: { weight: 25, reps: 12, rpe: 7 }, done: false },
      { type: 'normal', weight: 25, reps: 12, rpe: 8, prescribed: { weight: 25, reps: 12, rpe: 8 }, done: false },
    ],
    rest: 60,
    lastSession: { weight: 22.5, reps: 12, rpe: 7 },
  },
  {
    id: 'ex-lateral', name: 'Lateral raise · drop set', muscle: 'Shoulders', equipment: 'Dumbbells',
    sets: [
      { type: 'normal', weight: 10, reps: 12, rpe: 8, prescribed: { weight: 10, reps: 12, rpe: 8 }, done: false },
      { type: 'drop', weight: 7.5, reps: 10, rpe: 9, prescribed: { weight: 7.5, reps: 10, rpe: 9 }, done: false },
      { type: 'drop', weight: 5, reps: 10, rpe: 10, prescribed: { weight: 5, reps: 10, rpe: 10 }, done: false },
    ],
    rest: 90,
    lastSession: { weight: 9, reps: 12, rpe: 8 },
  },
];

const FEED = [
  { id: 'f1', who: 'Diego R.', clan: 'CRWS', when: '12m', action: 'hit a PR', detail: 'Deadlift 180 kg × 3', badge: 'PR' },
  { id: 'f2', who: 'Tea M.', clan: 'CRWS', when: '1h', action: 'finished', detail: 'Pull · Heavy in 58:12' },
  { id: 'f3', who: 'Karim O.', clan: 'CRWS', when: '4h', action: 'needs a rescue', detail: 'Behind on the raid by 3,500 kg', alert: true },
];

const WEEK = [
  { day: 'M', date: 19, status: 'done', label: 'Pull · Heavy',
    summary: { duration: '58:12', volume: 14820, sets: 19, pr: 'Barbell row 92.5 kg × 6', avgRpe: 7.4,
      exercises: [
        { name: 'Deadlift', sets: '4 × 5', top: '160 kg × 5 @ 8' },
        { name: 'Pull-up', sets: '4 × 8', top: 'BW + 10 kg × 8 @ 8' },
        { name: 'Barbell row', sets: '4 × 6', top: '92.5 kg × 6 @ 8 · PR' },
        { name: 'Lat pulldown', sets: '3 × 10', top: '60 kg × 10 @ 7' },
        { name: 'Hammer curl', sets: '4 × 12', top: '14 kg × 12 @ 7' },
      ]} },
  { day: 'T', date: 20, status: 'done', label: 'Push · Volume',
    summary: { duration: '52:40', volume: 11240, sets: 17, pr: null, avgRpe: 7.1,
      exercises: [
        { name: 'Bench press', sets: '4 × 8', top: '77.5 kg × 8 @ 7' },
        { name: 'Overhead press', sets: '3 × 6', top: '52.5 kg × 6 @ 8' },
        { name: 'Incline DB press', sets: '3 × 10', top: '26 kg × 10 @ 7' },
        { name: 'Lateral raise', sets: '4 × 12', top: '9 kg × 12 @ 8' },
        { name: 'Cable fly', sets: '3 × 12', top: '11 kg × 12 @ 7' },
      ]} },
  { day: 'W', date: 21, status: 'rest', label: 'Rest' },
  { day: 'T', date: 22, status: 'done', label: 'Legs · Heavy',
    summary: { duration: '1:04:18', volume: 22100, sets: 20, pr: 'Back squat 140 kg × 4', avgRpe: 7.8,
      exercises: [
        { name: 'Back squat', sets: '5 × 4', top: '140 kg × 4 @ 9 · PR' },
        { name: 'Romanian DL', sets: '4 × 8', top: '110 kg × 8 @ 7' },
        { name: 'Bulgarian split', sets: '3 × 10', top: '24 kg × 10 @ 8' },
        { name: 'Leg curl', sets: '4 × 12', top: '50 kg × 12 @ 7' },
        { name: 'Calf raise', sets: '4 × 15', top: '90 kg × 15 @ 7' },
      ]} },
  { day: 'F', date: 23, status: 'today', label: 'Push · Heavy' },
  { day: 'S', date: 24, status: 'planned', label: 'Pull · Volume',
    plan: { exercises: ['Barbell row', 'Lat pulldown', 'Face pull', 'Curl', 'Hammer curl'], sets: 16, duration: '~50 min' } },
  { day: 'S', date: 25, status: 'planned', label: 'Rest', plan: null },
];

// ─────────────────────────────────────────────────────────────
// Routines = single-day session (e.g. Push Heavy with 5 exercises)
// Workouts = weekly program / split (e.g. PPL, Upper/Lower) — collection of routines
// ─────────────────────────────────────────────────────────────
const ROUTINES = {
  trending: [
    { id: 'r-t1', name: 'Heavy Bench Day', author: '@joelcoaches', users: 8420, level: 'Intermediate', tags: ['Push', 'Strength'], rating: 4.8,
      description: 'Bench-focused push session. Heavy compound, accessory volume.',
      exercises: [
        { name: 'Barbell bench press', sets: 5, reps: '5', rest: 180, rpe: 8 },
        { name: 'Overhead press', sets: 3, reps: '6-8', rest: 120, rpe: 7 },
        { name: 'Incline DB press', sets: 3, reps: '10', rest: 90, rpe: 7 },
        { name: 'Lateral raise', sets: 4, reps: '12-15', rest: 60, rpe: 8 },
        { name: 'Triceps pushdown', sets: 3, reps: '12', rest: 60, rpe: 7 },
      ]},
    { id: 'r-t2', name: 'Beginner Full Body', author: 'Hivo Coaches', users: 14200, level: 'Beginner', tags: ['Full body', 'Bodyweight friendly'], rating: 4.9,
      description: 'Simple 5-exercise full body for first-timers. Compound focus, low fatigue.',
      exercises: [
        { name: 'Goblet squat', sets: 3, reps: '10', rest: 90, rpe: 6 },
        { name: 'DB bench press', sets: 3, reps: '10', rest: 90, rpe: 6 },
        { name: 'DB row', sets: 3, reps: '10', rest: 90, rpe: 6 },
        { name: 'Glute bridge', sets: 3, reps: '12', rest: 60, rpe: 6 },
        { name: 'Plank', sets: 3, reps: '30s', rest: 45, rpe: 7 },
      ]},
    { id: 'r-t3', name: 'Glute Hammer', author: '@bretcontreras', users: 11800, level: 'Advanced', tags: ['Glutes', 'High volume'], rating: 4.9,
      description: 'High-volume glute day. Compounds + isolations.',
      exercises: [
        { name: 'Hip thrust', sets: 5, reps: '6-8', rest: 150, rpe: 8 },
        { name: 'Bulgarian split squat', sets: 4, reps: '10', rest: 90, rpe: 8 },
        { name: 'Cable kickback', sets: 4, reps: '12', rest: 60, rpe: 8 },
        { name: 'Glute bridge', sets: 4, reps: '15', rest: 60, rpe: 8 },
      ]},
    { id: 'r-t4', name: 'Mobility & Core', author: 'Hivo Coaches', users: 5800, level: 'Beginner', tags: ['Recovery', 'Mobility'], rating: 4.7,
      description: 'Active recovery day. Mobility flow + light core.',
      exercises: [
        { name: 'World\'s greatest stretch', sets: 2, reps: '8/side', rest: 30, rpe: 5 },
        { name: 'Cat-cow', sets: 2, reps: '10', rest: 30, rpe: 4 },
        { name: 'Dead bug', sets: 3, reps: '10', rest: 45, rpe: 6 },
        { name: 'Bird dog', sets: 3, reps: '10/side', rest: 45, rpe: 6 },
      ]},
  ],
  recommended: [],
  mine: [
    { id: 'r-m1', name: 'Push · Heavy', author: 'You', level: 'Intermediate', users: null, tags: ['Push'], rating: null,
      description: 'My current push day. Heavy bench focus with shoulder accessory.',
      exercises: [
        { name: 'Barbell bench press', sets: 5, reps: '6', rest: 150, rpe: 7 },
        { name: 'Seated DB press', sets: 3, reps: '10', rest: 90, rpe: 7 },
        { name: 'Incline cable fly', sets: 3, reps: '12', rest: 75, rpe: 7 },
        { name: 'Triceps pushdown', sets: 3, reps: '12', rest: 60, rpe: 7 },
        { name: 'Lateral raise · drop', sets: 3, reps: '12', rest: 90, rpe: 8 },
      ]},
    { id: 'r-m2', name: 'Pull · Heavy', author: 'You', level: 'Intermediate', users: null, tags: ['Pull'], rating: null,
      description: 'Deadlift-driven pull day.',
      exercises: [
        { name: 'Deadlift', sets: 4, reps: '5', rest: 180, rpe: 8 },
        { name: 'Pull-up', sets: 4, reps: '8', rest: 120, rpe: 8 },
        { name: 'Barbell row', sets: 4, reps: '6', rest: 120, rpe: 7 },
        { name: 'Lat pulldown', sets: 3, reps: '10', rest: 75, rpe: 7 },
        { name: 'Hammer curl', sets: 4, reps: '12', rest: 60, rpe: 7 },
      ]},
    { id: 'r-m3', name: 'Legs · Heavy', author: 'You', level: 'Intermediate', users: null, tags: ['Legs'], rating: null,
      description: 'Squat-focused leg day.',
      exercises: [
        { name: 'Back squat', sets: 5, reps: '4', rest: 180, rpe: 8 },
        { name: 'Romanian DL', sets: 4, reps: '8', rest: 120, rpe: 7 },
        { name: 'Bulgarian split squat', sets: 3, reps: '10', rest: 90, rpe: 8 },
        { name: 'Leg curl', sets: 4, reps: '12', rest: 75, rpe: 7 },
        { name: 'Calf raise', sets: 4, reps: '15', rest: 60, rpe: 7 },
      ]},
  ],
};

// Workouts = weekly programs. Each day points to a routineId (lives in ROUTINES / WORKOUT_ROUTINES).
const WORKOUTS = {
  trending: [
    { id: 'w-t1', name: 'PPL · Hypertrophy', author: '@joelcoaches', users: 18420, level: 'Intermediate', rating: 4.8,
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
      ]},
    { id: 'w-t2', name: '5/3/1 BBB', author: '@wendlerOG', users: 12880, level: 'Advanced', rating: 4.9,
      tags: ['Strength', '4 days', 'Powerlifting'],
      description: 'Classic Jim Wendler 5/3/1 with Boring But Big assistance. Slow progression, durable strength.',
      duration: '4 weeks', daysPerWeek: 4,
      days: [
        { day: 'Mon', name: 'Bench', routineId: 'r-m1' },
        { day: 'Tue', name: 'Squat', routineId: 'r-m3' },
        { day: 'Thu', name: 'OHP', routineId: 'r-m1' },
        { day: 'Fri', name: 'Deadlift', routineId: 'r-m2' },
      ]},
    { id: 'w-t3', name: 'Upper / Lower · 4d', author: 'Hivo AI', users: 9400, level: 'Intermediate', rating: 4.7,
      tags: ['Upper Lower', '4 days', 'Balanced'],
      description: 'Balanced upper/lower split. Great middle ground between full body and PPL.',
      duration: '6 weeks', daysPerWeek: 4,
      days: [
        { day: 'Mon', name: 'Upper · Heavy', routineId: 'r-m1' },
        { day: 'Tue', name: 'Lower · Heavy', routineId: 'r-m3' },
        { day: 'Thu', name: 'Upper · Volume', routineId: 'r-m2' },
        { day: 'Fri', name: 'Lower · Volume', routineId: 'r-m3' },
      ]},
    { id: 'w-t4', name: 'Starting Strength', author: '@markripp', users: 22100, level: 'Beginner', rating: 4.9,
      tags: ['Strength', '3 days', 'Linear progression'],
      description: 'The classic 3-day beginner barbell program. Squat, bench, deadlift, press, row. Add weight every session.',
      duration: '8-12 weeks', daysPerWeek: 3,
      days: [
        { day: 'Mon', name: 'Workout A', routineId: 'r-t2' },
        { day: 'Wed', name: 'Workout B', routineId: 'r-t2' },
        { day: 'Fri', name: 'Workout A', routineId: 'r-t2' },
      ]},
    { id: 'w-t5', name: 'Glute Hypertrophy 4d', author: '@bretcontreras', users: 24100, level: 'Advanced', rating: 4.9,
      tags: ['Glutes', '4 days', 'Aesthetic'],
      description: 'High-frequency glute focus. Compounds + isolations every session.',
      duration: '8 weeks', daysPerWeek: 4,
      days: [
        { day: 'Mon', name: 'Glutes · Heavy', routineId: 'r-t3' },
        { day: 'Tue', name: 'Upper', routineId: 'r-m1' },
        { day: 'Thu', name: 'Glutes · Pump', routineId: 'r-t3' },
        { day: 'Sat', name: 'Upper · Light', routineId: 'r-m1' },
      ]},
  ],
  mine: [
    { id: 'w-m1', name: 'Hypertrophy 6× Upper/Lower', author: 'You', level: 'Intermediate',
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
      ]},
  ],
};

// ─────────────────────────────────────────────────────────────
// Body heatmap data (clan combined + personal)
// ─────────────────────────────────────────────────────────────
const CLAN_BODY = {
  // 0..1 intensity per muscle group, averaged across 6 clan members' strength
  chest: 0.82, shoulders: 0.71, biceps: 0.55, forearms: 0.42, abs: 0.61, obliques: 0.4,
  quads: 0.92, hamstrings: 0.55, glutes: 0.74,
  traps: 0.68, rearDelts: 0.45, lats: 0.78, midBack: 0.52, lowerBack: 0.65, triceps: 0.6, calves: 0.38,
  topMuscles: [
    { name: 'Quads',     value: '320 kg avg', sub: 'Back squat' },
    { name: 'Chest',     value: '92 kg avg',  sub: 'Bench press' },
    { name: 'Lats',      value: '+12 kg BW',  sub: 'Weighted pull-up' },
    { name: 'Glutes',    value: '180 kg avg', sub: 'Hip thrust' },
  ],
  weak: ['Calves', 'Forearms', 'Rear delts'],
};

const PERSONAL_BODY = {
  chest: 0.78, shoulders: 0.62, biceps: 0.48, forearms: 0.35, abs: 0.55, obliques: 0.32,
  quads: 0.85, hamstrings: 0.42, glutes: 0.66,
  traps: 0.58, rearDelts: 0.38, lats: 0.7, midBack: 0.5, lowerBack: 0.62, triceps: 0.55, calves: 0.3,
  topLifts: [
    { name: 'Back squat',  value: '140 kg × 4' },
    { name: 'Deadlift',    value: '180 kg × 3' },
    { name: 'Bench press', value: '92.5 kg × 5' },
  ],
  weak: ['Calves', 'Hamstrings', 'Rear delts'],
};

// Bodyweight time series (last 12 weeks, kg)
const BODYWEIGHT_SERIES = [72.4, 72.3, 72.1, 72.5, 72.0, 71.9, 71.8, 71.6, 71.7, 71.5, 71.4, 71.3];

// ─────────────────────────────────────────────────────────────
// Technique notes — keyed by exercise name (partial match)
// ─────────────────────────────────────────────────────────────
const TECHNIQUE = {
  'Barbell bench press': {
    cues: [
      'Retract scapulae — squeeze shoulder blades into the bench',
      'Bar path: lower to nipple line, press up and slightly back',
      'Feet flat, slight arch, drive through the floor',
      'Wrists stacked over elbows — no wrist break',
    ],
    common: 'Flaring elbows past 75° loads the shoulder joint. Keep elbows ~45–60° from torso.',
    sets: 'Beginners: 3×5 at RPE 7. Rest 2–3 min.',
  },
  'Back squat': {
    cues: [
      'Brace before unracking — big breath into belly, not chest',
      'Knees track over toes, feet shoulder-width',
      'Hips and knees break together; sit between hips',
      'Drive whole foot through the floor on the way up',
    ],
    common: 'Knees caving in (valgus). Cue: "push the floor apart".',
    sets: 'Beginners: 3×5 at RPE 7. Rest 2–3 min.',
  },
  'Deadlift': {
    cues: [
      'Bar over mid-foot, shins close but not touching at start',
      'Hinge then bend — hips back, chest proud',
      'Lats engaged: "protect armpits" — pull slack out of the bar',
      'Stand all the way up; lock hips and knees together',
    ],
    common: 'Rounding the lower back. If you can\'t hold neutral, the weight is too heavy.',
    sets: 'Beginners: 3×3 at RPE 7. Rest 2–3 min.',
  },
  'Pull-up': {
    cues: [
      'Dead hang, shoulders packed (not shrugged into ears)',
      'Initiate by depressing scapulae, then pull elbows down',
      'Chin clears the bar — full range of motion',
      'Lower under control — 2-second eccentric',
    ],
    common: 'Kipping or swinging to compensate. Use a band assist instead.',
    sets: 'Beginners: 4–5 sets of 3–6, or band-assisted to 8.',
  },
  default: {
    cues: [
      'Set up: feet stable, core braced before the first rep',
      'Move through full range without bouncing or cheating',
      'Control the eccentric — 2 seconds down',
      'Match the cue, not the weight — leave 1–2 reps in reserve',
    ],
    common: 'Going too heavy before grooving the pattern. Drop weight, raise quality.',
    sets: 'Beginners: 3×8–10 at RPE 6–7. Rest 60–90 s.',
  },
};

// ─────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 'n1', kind: 'raid', title: 'Karim needs a rescue', body: 'Behind on the Bench Raid by 3,500 kg. Your reps count 2× until Fri.', when: '12m', unread: true },
  { id: 'n2', kind: 'pr', title: 'New PR · Diego R.', body: 'Deadlift 180 kg × 3', when: '38m', unread: true },
  { id: 'n3', kind: 'autoreg', title: 'Adaptive note', body: 'HRV down 8 ms — Hivo softened tomorrow\'s squat target', when: '2h', unread: true },
  { id: 'n4', kind: 'clan', title: 'Tea M. liked your post', body: 'Pull · Heavy summary', when: '4h' },
  { id: 'n5', kind: 'mission', title: 'Mission complete', body: 'Collective volume 120k kg — clan earned 240 XP', when: 'yesterday' },
];

// Expose globally for other Babel scripts
Object.assign(window, {
  I, Avatar, Chip, ProgressBar, Ring, ScreenHeader, Reveal, Counter, useReveal,
  USER, CLAN, TODAY_WORKOUT, ALT_WORKOUTS, EXERCISES, FEED, WEEK, ROUTINES, WORKOUTS, WARMUPS,
  CLAN_BODY, PERSONAL_BODY, TECHNIQUE, NOTIFICATIONS, BODYWEIGHT_SERIES,
});