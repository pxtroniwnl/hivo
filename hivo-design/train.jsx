// train.jsx — Train tab: My Workouts | Trending (mixed) | My Routines
const { useState: useStateT, useEffect: useEffectT, useMemo: useMemoT, useRef: useRefT } = React;

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LEVEL_COLORS = {
  Beginner: 'var(--ok)',
  Intermediate: 'var(--accent)',
  Advanced: 'var(--warn)',
};

function LevelChip({ level, size = 'sm' }) {
  if (!level) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'lg' ? '4px 9px' : '3px 7px',
      borderRadius: 999,
      background: 'color-mix(in oklab, ' + LEVEL_COLORS[level] + ' 14%, var(--bg-3))',
      color: LEVEL_COLORS[level],
      fontSize: size === 'lg' ? 11 : 10, fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 50, background: LEVEL_COLORS[level] }}/>
      {level}
    </span>
  );
}

function KindBadge({ kind }) {
  const isWorkout = kind === 'workout';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 7px', borderRadius: 999,
      background: 'var(--bg-2)', color: 'var(--fg-mid)',
      fontSize: 9.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      border: '0.5px solid var(--line)',
    }}>
      {isWorkout ? (
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 5h14M5 10h14M5 15h14M5 20h8"/>
        </svg>
      )}
      {isWorkout ? 'Workout' : 'Routine'}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Train shell
// ─────────────────────────────────────────────────────────────
function TrainScreen({ onStart, onModalChange, myRoutines, setMyRoutines, myWorkouts, setMyWorkouts }) {
  const [openRoutine, setOpenRoutine] = useStateT(null);
  const [isNewRoutine, setIsNewRoutine] = useStateT(false);
  const [openWorkout, setOpenWorkout] = useStateT(null);
  const [isNewWorkout, setIsNewWorkout] = useStateT(false);

  useEffectT(() => {
    if (onModalChange) onModalChange(!!openRoutine || !!openWorkout);
  }, [openRoutine, openWorkout, onModalChange]);

  // Routine handlers
  const openExistingRoutine = (r) => { setOpenRoutine(JSON.parse(JSON.stringify(r))); setIsNewRoutine(false); };
  const openBlankRoutine = () => {
    setOpenRoutine({
      id: 'r-new-' + Date.now(),
      name: 'New routine', author: 'You', level: 'Intermediate',
      tags: [], description: '', exercises: [],
    });
    setIsNewRoutine(true);
  };
  const handleSaveRoutine = (routine) => {
    setMyRoutines(prev => {
      const existsIdx = prev.findIndex(r => r.id === routine.id);
      if (existsIdx >= 0) {
        const next = [...prev]; next[existsIdx] = routine; return next;
      }
      return [{ ...routine, author: 'You' }, ...prev];
    });
  };

  // Workout handlers
  const openExistingWorkout = (w) => { setOpenWorkout(JSON.parse(JSON.stringify(w))); setIsNewWorkout(false); };
  const openBlankWorkout = () => {
    setOpenWorkout({
      id: 'w-new-' + Date.now(),
      name: 'New workout', author: 'You', level: 'Intermediate',
      tags: [], description: '', daysPerWeek: 4, duration: '4 weeks',
      days: [
        { day: 'Mon', name: 'Day 1', routineId: null },
        { day: 'Wed', name: 'Day 2', routineId: null },
        { day: 'Fri', name: 'Day 3', routineId: null },
        { day: 'Sun', name: 'Day 4', routineId: null },
      ],
    });
    setIsNewWorkout(true);
  };
  const handleSaveWorkout = (workout) => {
    setMyWorkouts(prev => {
      const existsIdx = prev.findIndex(w => w.id === workout.id);
      if (existsIdx >= 0) {
        const next = [...prev]; next[existsIdx] = workout; return next;
      }
      return [{ ...workout, author: 'You' }, ...prev];
    });
  };

  if (openRoutine) {
    return (
      <RoutineDetail
        routine={openRoutine}
        isNew={isNewRoutine}
        onChange={setOpenRoutine}
        onSave={() => handleSaveRoutine(openRoutine)}
        onBack={() => { setOpenRoutine(null); setIsNewRoutine(false); }}
        onStart={() => onStart && onStart()}
      />
    );
  }
  if (openWorkout) {
    return (
      <WorkoutDetail
        workout={openWorkout}
        isNew={isNewWorkout}
        onChange={setOpenWorkout}
        onSave={() => handleSaveWorkout(openWorkout)}
        onBack={() => { setOpenWorkout(null); setIsNewWorkout(false); }}
        onOpenRoutine={openExistingRoutine}
        myRoutines={myRoutines}
      />
    );
  }
  return (
    <TrainList
      onStart={onStart}
      onLog={() => onStart && onStart('log-past')}
      onOpenRoutine={openExistingRoutine}
      onOpenWorkout={openExistingWorkout}
      onBuildRoutine={openBlankRoutine}
      onBuildWorkout={openBlankWorkout}
      onAddWorkout={(w) => {
        // Extract embedded routines (from AI Coach) and persist them into myRoutines too
        const embedded = (w.days || [])
          .map(d => d._routineData)
          .filter(Boolean);
        if (embedded.length) {
          setMyRoutines(prev => {
            const seen = new Set(prev.map(r => r.id));
            const fresh = embedded.filter(r => !seen.has(r.id));
            return [...fresh, ...prev];
          });
        }
        // Strip the inline data so the workout stores only the id reference
        const cleanedDays = (w.days || []).map(({ _routineData, ...rest }) => rest);
        setMyWorkouts(prev => [{ ...w, days: cleanedDays, author: 'AI Coach' }, ...prev]);
      }}
      onSetActive={(id) => setMyWorkouts(prev => prev.map(w => ({ ...w, current: w.id === id ? !w.current : false })))}
      myRoutines={myRoutines}
      myWorkouts={myWorkouts}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// List view: My Workouts | Trending | My Routines + search
// ─────────────────────────────────────────────────────────────
function TrainList({ onStart, onLog, onOpenRoutine, onOpenWorkout, onBuildRoutine, onBuildWorkout, myRoutines, myWorkouts, onAddWorkout, onSetActive }) {
  const [query, setQuery] = useStateT('');
  const [tab, setTab] = useStateT('myworkouts'); // myworkouts | trending | myroutines
  const [levelFilter, setLevelFilter] = useStateT('All');
  const [typeFilter, setTypeFilter] = useStateT('all'); // all | workouts | routines
  const [coachOpen, setCoachOpen] = useStateT(false);

  // Decorate items with `kind` so we can mix them
  const allWorkouts = useMemoT(() => [...WORKOUTS.trending, ...myWorkouts].map(w => ({ ...w, kind: 'workout' })), [myWorkouts]);
  const allRoutines = useMemoT(() => [...ROUTINES.trending, ...myRoutines].map(r => ({ ...r, kind: 'routine' })), [myRoutines]);

  const matchesFilters = (item) => {
    if (levelFilter !== 'All' && item.level !== levelFilter) return false;
    if (typeFilter === 'workouts' && item.kind !== 'workout') return false;
    if (typeFilter === 'routines' && item.kind !== 'routine') return false;
    return true;
  };

  const filtered = useMemoT(() => {
    if (!query) return null;
    const q = query.toLowerCase();
    const all = [...allWorkouts, ...allRoutines];
    return all.filter(item => {
      if (!matchesFilters(item)) return false;
      const inName = item.name.toLowerCase().includes(q);
      const inTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
      const inLevel = (item.level || '').toLowerCase().includes(q);
      const inExercises = item.kind === 'routine'
        ? (item.exercises || []).some(e => e.name.toLowerCase().includes(q))
        : (item.days || []).some(d => (d.name || '').toLowerCase().includes(q));
      return inName || inTags || inLevel || inExercises;
    });
  }, [query, allWorkouts, allRoutines, levelFilter, typeFilter]);

  return (
    <div className="screen-in" style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Train" subtitle="Workouts & routines" right={
        <button onClick={tab === 'myroutines' ? onBuildRoutine : onBuildWorkout} style={{
          padding: '0 12px', height: 40, borderRadius: 12,
          background: 'var(--accent)', color: 'var(--accent-fg)',
          border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <I.plus style={{ width: 14, height: 14 }}/> Build
        </button>
      }/>

      {/* AI Coach card (replaces top search) */}
      <div style={{ padding: '8px 18px 0' }}>
        <button onClick={() => setCoachOpen(true)} className="hover-lift" style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: 14, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))',
          border: '0.5px solid var(--line-strong)',
          color: 'inherit', cursor: 'pointer', textAlign: 'left',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 130, height: 130,
            borderRadius: '50%', background: 'var(--accent)', opacity: 0.18, filter: 'blur(38px)',
            pointerEvents: 'none',
          }}/>
          <div className="glow-pulse" style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-fg)', flexShrink: 0,
            position: 'relative',
          }}>
            <SparklesIcon/>
          </div>
          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="t-h3" style={{ fontSize: 15 }}>AI Coach</span>
              <Chip variant="acc" style={{ fontSize: 9.5 }}>New</Chip>
            </div>
            <div className="t-sm" style={{ marginTop: 3, fontSize: 12 }}>
              Need help? Get a personalized workout in 60 seconds.
            </div>
          </div>
          <I.arrow style={{ width: 18, height: 18, color: 'var(--fg-mute)', position: 'relative' }}/>
        </button>
      </div>

      {/* Segmented tabs */}
      <div style={{ padding: '14px 18px 0' }}>
            <div style={{
              display: 'flex', background: 'var(--bg-2)', borderRadius: 12, padding: 3,
              border: '0.5px solid var(--line)',
            }}>
              {[
                { id: 'myworkouts', label: 'My Workouts' },
                { id: 'trending', label: 'Trending' },
                { id: 'myroutines', label: 'My Routines' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: '9px 8px', borderRadius: 10,
                  background: tab === t.id ? 'var(--bg-3)' : 'transparent',
                  color: tab === t.id ? 'var(--fg)' : 'var(--fg-mute)',
                  border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {tab === 'myworkouts' && <MyWorkoutsSection onOpen={onOpenWorkout} onBuild={onBuildWorkout} myWorkouts={myWorkouts} onSetActive={onSetActive}/>}
          {tab === 'trending' && (
            <TrendingSection
              onOpenRoutine={onOpenRoutine}
              onOpenWorkout={onOpenWorkout}
              levelFilter={levelFilter} setLevelFilter={setLevelFilter}
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              query={query} setQuery={setQuery}
              myRoutines={myRoutines} myWorkouts={myWorkouts}
            />
          )}
          {tab === 'myroutines' && <MyRoutinesSection onOpen={onOpenRoutine} onBuild={onBuildRoutine} myRoutines={myRoutines}/>}

      {/* AI Coach sheet */}
      {coachOpen && <AICoachSheet onClose={() => setCoachOpen(false)} onAddWorkout={onAddWorkout}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Filter bar — level chips + type pill
// ─────────────────────────────────────────────────────────────
function FilterBar({ level, setLevel, type, setType }) {
  const levelOptions = ['All', ...LEVELS];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginLeft: -2, marginRight: -18, paddingRight: 18 }} className="hv-scroll">
        {levelOptions.map(lv => {
          const active = level === lv;
          return (
            <button key={lv} onClick={() => setLevel(lv)} style={{
              flexShrink: 0, padding: '7px 12px', borderRadius: 999,
              background: active ? (lv === 'All' ? 'var(--accent)' : 'color-mix(in oklab, ' + (LEVEL_COLORS[lv] || 'var(--accent)') + ' 22%, var(--bg-3))') : 'var(--bg-2)',
              color: active ? (lv === 'All' ? 'var(--accent-fg)' : (LEVEL_COLORS[lv] || 'var(--fg)')) : 'var(--fg-mid)',
              border: '0.5px solid ' + (active ? (lv === 'All' ? 'var(--accent)' : (LEVEL_COLORS[lv] || 'var(--line)')) : 'var(--line)'),
              cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {lv !== 'All' && (
                <span style={{ width: 5, height: 5, borderRadius: 50, background: LEVEL_COLORS[lv] }}/>
              )}
              {lv}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', background: 'var(--bg-2)', borderRadius: 10, padding: 3, border: '0.5px solid var(--line)' }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'workouts', label: 'Workouts' },
          { id: 'routines', label: 'Routines' },
        ].map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            flex: 1, padding: '7px 8px', borderRadius: 8,
            background: type === t.id ? 'var(--bg-3)' : 'transparent',
            color: type === t.id ? 'var(--fg)' : 'var(--fg-mute)',
            border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 500,
          }}>{t.label}</button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// My Workouts section
// ─────────────────────────────────────────────────────────────
function MyWorkoutsSection({ onOpen, onBuild, myWorkouts, onSetActive }) {
  const current = myWorkouts.find(w => w.current);
  const others = myWorkouts.filter(w => !w.current);

  return (
    <>
      {current ? (
        <Reveal style={{ padding: '16px 18px 0' }}>
          <div className="t-xs" style={{ marginBottom: 10 }}>Current program</div>
          <button onClick={() => onOpen(current)} className="card-elev hover-lift" style={{
            width: '100%', padding: 16, textAlign: 'left', color: 'inherit',
            border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'var(--accent)', opacity: 0.15, filter: 'blur(40px)' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <KindBadge kind="workout"/>
                  <LevelChip level={current.level}/>
                </div>
                <div className="t-h2">{current.name}</div>
                <div className="t-sm" style={{ marginTop: 4 }}>Week {current.week || 1} of {current.totalWeeks || '—'} · {current.daysPerWeek} days/week</div>
              </div>
              <Chip variant="acc">Active</Chip>
            </div>
            {current.totalWeeks && (
              <div style={{ display: 'flex', gap: 4, marginTop: 14, position: 'relative' }}>
                {Array.from({ length: current.totalWeeks }).map((_, i) => {
                  const isPast = i < ((current.week || 1) - 1), isNow = i === ((current.week || 1) - 1), isDeload = i === Math.floor(current.totalWeeks * 0.65);
                  return (
                    <div key={i} style={{
                      flex: 1, height: 30, borderRadius: 6,
                      background: isPast ? 'var(--accent)' : isNow ? 'var(--accent-soft)' : 'var(--bg-3)',
                      border: '0.5px solid ' + (isNow ? 'var(--accent)' : 'transparent'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                      color: isPast ? 'var(--accent-fg)' : isNow ? 'var(--accent)' : 'var(--fg-mute)',
                    }}>{isDeload ? 'DELOAD' : `W${i+1}`}</div>
                  );
                })}
              </div>
            )}
          </button>
        </Reveal>
      ) : (
        <Reveal style={{ padding: '16px 18px 0' }}>
          <div className="t-xs" style={{ marginBottom: 10 }}>Current program</div>
          <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderStyle: 'dashed' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: 'var(--bg-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-mute)', marginBottom: 10,
            }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>
              </svg>
            </div>
            <div className="t-h3" style={{ fontSize: 14 }}>No active program</div>
            <div className="t-sm" style={{ marginTop: 4, fontSize: 12, maxWidth: 240 }}>
              Pick one from below to set it as your active program for the week.
            </div>
          </div>
        </Reveal>
      )}

      <Reveal style={{ padding: '16px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="t-xs">{current ? 'Other workouts' : 'Saved workouts'}</span>
          <button onClick={onBuild} style={{
            background: 'transparent', border: 'none', color: 'var(--accent)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}><I.plus style={{ width: 12, height: 12 }}/> New</button>
        </div>
        {others.length > 0 ? (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {others.map(w => (
              <SavedWorkoutCard
                key={w.id}
                workout={w}
                onOpen={() => onOpen(w)}
                onSetActive={() => onSetActive && onSetActive(w.id)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="t-sm" style={{ fontSize: 12.5 }}>
              {current ? 'No other workouts saved.' : 'No workouts yet.'}
            </div>
            <button onClick={onBuild} className="btn" style={{ marginTop: 10, background: 'var(--bg-3)' }}>
              <I.plus style={{ width: 13, height: 13 }}/> Build a workout
            </button>
          </div>
        )}
      </Reveal>
    </>
  );
}

function SavedWorkoutCard({ workout, onOpen, onSetActive }) {
  return (
    <div className="card hover-lift" style={{ padding: 0, overflow: 'hidden' }}>
      <button onClick={onOpen} style={{
        width: '100%', padding: '14px 14px 12px', textAlign: 'left', cursor: 'pointer',
        background: 'transparent', border: 'none', color: 'inherit',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'var(--accent-fg)',
        }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 13h2M12 13h2M16 13h1"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <KindBadge kind="workout"/>
            <LevelChip level={workout.level}/>
          </div>
          <div className="t-h3" style={{ fontSize: 15 }}>{workout.name}</div>
          <div className="t-sm" style={{ marginTop: 3, fontSize: 12 }}>
            {(workout.days || []).filter(d => d.routineId).length} days/wk · {workout.duration || '—'}
          </div>
        </div>
        <I.arrow style={{ width: 16, height: 16, color: 'var(--fg-mute)', flexShrink: 0 }}/>
      </button>
      <div style={{ padding: '0 12px 12px', display: 'flex', gap: 8 }}>
        <button onClick={(e) => { e.stopPropagation(); onSetActive && onSetActive(); }} style={{
          flex: 1, padding: '8px 10px', borderRadius: 9,
          background: 'var(--accent-soft)', border: '0.5px solid var(--accent)',
          color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <I.check style={{ width: 13, height: 13, strokeWidth: 2.5 }}/> Set as active
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Trending section — mixes workouts + routines, with own search
// ─────────────────────────────────────────────────────────────
function TrendingSection({ onOpenRoutine, onOpenWorkout, levelFilter, setLevelFilter, typeFilter, setTypeFilter, query, setQuery, myRoutines, myWorkouts }) {
  const all = useMemoT(() => [
    ...WORKOUTS.trending.map(w => ({ ...w, kind: 'workout' })),
    ...ROUTINES.trending.map(r => ({ ...r, kind: 'routine' })),
  ], []);

  const passesFilters = (item) => {
    if (levelFilter !== 'All' && item.level !== levelFilter) return false;
    if (typeFilter === 'workouts' && item.kind !== 'workout') return false;
    if (typeFilter === 'routines' && item.kind !== 'routine') return false;
    return true;
  };

  const q = (query || '').trim().toLowerCase();
  const filtered = all.filter(item => {
    if (!passesFilters(item)) return false;
    if (!q) return true;
    const inName = item.name.toLowerCase().includes(q);
    const inTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
    const inLevel = (item.level || '').toLowerCase().includes(q);
    const inExercises = item.kind === 'routine'
      ? (item.exercises || []).some(e => e.name.toLowerCase().includes(q))
      : (item.days || []).some(d => (d.name || '').toLowerCase().includes(q));
    return inName || inTags || inLevel || inExercises;
  });

  return (
    <div style={{ padding: '14px 18px 0' }}>
      {/* Search inside Trending */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 12,
        background: 'var(--bg-2)', border: '0.5px solid var(--line)',
        marginBottom: 12,
      }}>
        <SearchIcon/>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search workouts, routines, exercises…"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
          }}/>
        {query && (
          <button onClick={() => setQuery('')} style={{
            background: 'transparent', border: 'none', color: 'var(--fg-mute)', cursor: 'pointer', padding: 2,
          }}><I.close style={{ width: 14, height: 14 }}/></button>
        )}
      </div>

      <FilterBar
        level={levelFilter} setLevel={setLevelFilter}
        type={typeFilter} setType={setTypeFilter}
      />
      <div className="t-xs" style={{ margin: '14px 0 10px' }}>
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'} {levelFilter !== 'All' && `· ${levelFilter}`}
      </div>
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 22, textAlign: 'center' }}>
          <div className="t-sm" style={{ fontSize: 12.5 }}>Nothing matches those filters{q ? ` for "${query}"` : ''}.</div>
          <button onClick={() => { setLevelFilter('All'); setTypeFilter('all'); setQuery(''); }} className="btn" style={{ marginTop: 10, background: 'var(--bg-3)' }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(item => (
            <ProgramCard key={item.id} item={item} onOpen={() => item.kind === 'workout' ? onOpenWorkout(item) : onOpenRoutine(item)} showStats/>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// My Routines section
// ─────────────────────────────────────────────────────────────
function MyRoutinesSection({ onOpen, onBuild, myRoutines }) {
  return (
    <div style={{ padding: '16px 18px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span className="t-xs">{myRoutines.length} routine{myRoutines.length !== 1 ? 's' : ''} created by you</span>
      </div>
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {myRoutines.map(r => <ProgramCard key={r.id} item={{ ...r, kind: 'routine' }} onOpen={() => onOpen(r)}/>)}
        <button onClick={onBuild} style={{
          padding: 16, borderRadius: 14,
          background: 'transparent', border: '0.5px dashed var(--line-strong)',
          color: 'var(--fg-mid)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 13, fontWeight: 500,
        }}>
          <I.plus style={{ width: 16, height: 16 }}/> Build new routine
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card — works for both routine and workout
// ─────────────────────────────────────────────────────────────
function ProgramCard({ item, onOpen, showStats }) {
  const isWorkout = item.kind === 'workout';
  return (
    <button onClick={onOpen} className="card hover-lift" style={{
      width: '100%', padding: 14, textAlign: 'left', cursor: 'pointer',
      border: '0.5px solid var(--line)', color: 'inherit',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 11,
        background: isWorkout
          ? 'linear-gradient(135deg, var(--accent), var(--accent-deep))'
          : 'linear-gradient(135deg, color-mix(in oklab, var(--accent) 70%, transparent), color-mix(in oklab, var(--accent-deep) 70%, transparent))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: 'var(--accent-fg)',
        position: 'relative',
      }}>
        {isWorkout ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 13h2M12 13h2M16 13h1"/>
          </svg>
        ) : (
          <I.dumb style={{ width: 20, height: 20 }}/>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <KindBadge kind={item.kind}/>
          <LevelChip level={item.level}/>
        </div>
        <div className="t-h3" style={{ fontSize: 15 }}>{item.name}</div>
        <div className="t-sm" style={{ marginTop: 3, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {isWorkout ? (
            <>
              <span>{(item.days || []).filter(d => d.routineId).length} days/wk</span>
              <span style={{ color: 'var(--fg-dim)' }}>·</span>
              <span>{item.duration || '—'}</span>
            </>
          ) : (
            <span>{item.exercises.length} exercises</span>
          )}
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>{item.author}</span>
          {showStats && item.users && (
            <>
              <span style={{ color: 'var(--fg-dim)' }}>·</span>
              <span>{(item.users/1000).toFixed(1)}k</span>
            </>
          )}
        </div>
      </div>
      {showStats && item.rating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fg-mid)', fontSize: 12 }}>
          <StarIcon/> <span className="t-mono" style={{ fontSize: 12 }}>{item.rating}</span>
        </div>
      )}
      <I.arrow style={{ width: 16, height: 16, color: 'var(--fg-mute)', flexShrink: 0 }}/>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Workout detail (program-level)
// ─────────────────────────────────────────────────────────────
function WorkoutDetail({ workout, isNew, onChange, onSave, onBack, onOpenRoutine, myRoutines }) {
  const update = (patch) => onChange({ ...workout, ...patch });
  const updateDay = (idx, patch) => {
    const days = [...workout.days];
    days[idx] = { ...days[idx], ...patch };
    onChange({ ...workout, days });
  };
  const removeDay = (idx) => {
    onChange({ ...workout, days: workout.days.filter((_, i) => i !== idx) });
  };
  const moveDay = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= workout.days.length) return;
    const days = [...workout.days];
    [days[idx], days[next]] = [days[next], days[idx]];
    onChange({ ...workout, days });
  };
  const addDay = () => {
    const days = workout.days || [];
    onChange({
      ...workout,
      days: [...days, { day: 'Sun', name: `Day ${days.length + 1}`, routineId: null }],
    });
  };

  const [saved, setSaved] = useStateT(false);
  const [shareOpen, setShareOpen] = useStateT(false);
  const [pickRoutineFor, setPickRoutineFor] = useStateT(null); // dayIdx
  const isMine = workout.author === 'You';

  const handleSave = () => {
    onSave && onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // Lookup pool: trending workout routines + user routines
  const routinePool = useMemoT(() => {
    const trendingRoutines = ROUTINES.trending;
    const all = [...trendingRoutines, ...myRoutines];
    // dedupe by id
    const seen = new Set();
    return all.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
  }, [myRoutines]);
  const routineById = (id) => routinePool.find(r => r.id === id);

  return (
    <div className="screen-in" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '0 18px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} className="btn btn-ghost" style={{
          padding: 0, width: 40, height: 40, background: 'var(--bg-2)', borderRadius: 12,
          border: '0.5px solid var(--line)',
        }}>
          <I.back style={{ width: 16, height: 16, color: 'var(--fg-mid)' }}/>
        </button>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-mute)' }}>
          {isNew ? 'New workout' : isMine ? 'Edit workout' : 'Workout'}
        </div>
        <button onClick={() => setShareOpen(true)} className="btn" style={{
          padding: 0, width: 40, height: 40, background: 'var(--bg-2)', borderRadius: 12,
          border: '0.5px solid var(--line)', justifyContent: 'center',
        }} title="Share workout">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.5 10.5l7-3M8.5 13.5l7 3"/>
          </svg>
        </button>
        {!isMine && !isNew && (
          <button onClick={() => { onSave && onSave(); setSaved(true); setTimeout(() => setSaved(false), 1800); }} className="btn" style={{ padding: '8px 14px', background: 'var(--bg-2)', fontSize: 13 }}>
            <I.plus style={{ width: 13, height: 13 }}/> Save copy
          </button>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <KindBadge kind="workout"/>
          <LevelPicker value={workout.level} onChange={(v) => update({ level: v })} editable={isMine || isNew}/>
        </div>
        <EditableField
          value={workout.name}
          onChange={(v) => update({ name: v })}
          placeholder="Workout name"
          textStyle={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}
        />
        <div className="t-sm" style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>by {workout.author}</span>
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>{workout.days.length} days</span>
          {workout.duration && <>
            <span style={{ color: 'var(--fg-dim)' }}>·</span>
            <span>{workout.duration}</span>
          </>}
        </div>
        {workout.tags && workout.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {workout.tags.map(t => <Chip key={t}>{t}</Chip>)}
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ padding: '14px 18px 0' }}>
        <EditableField
          value={workout.description}
          onChange={(v) => update({ description: v })}
          placeholder="Describe this workout (optional)"
          multiline
          textStyle={{ fontSize: 13, color: 'var(--fg-mid)', lineHeight: 1.45 }}
        />
      </div>

      {/* Weekly grid */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="t-xs">Weekly schedule</span>
          <span className="t-xs fg-mute">Tap a day to assign a routine</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workout.days.map((d, i) => {
            const routine = d.routineId ? routineById(d.routineId) : null;
            return (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: routine ? 'var(--accent-soft)' : 'var(--bg-3)',
                    color: routine ? 'var(--accent)' : 'var(--fg-mute)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}>{d.day.toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <EditableField
                      value={d.name}
                      onChange={(v) => updateDay(i, { name: v })}
                      placeholder="Day name"
                      textStyle={{ fontSize: 14, fontWeight: 600 }}
                    />
                    {routine ? (
                      <button onClick={() => onOpenRoutine(routine)} style={{
                        background: 'transparent', border: 'none', padding: 0, marginTop: 3,
                        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                        color: 'var(--accent)', fontSize: 11.5, fontWeight: 500,
                      }}>
                        <I.dumb style={{ width: 11, height: 11 }}/>
                        {routine.name} · {routine.exercises.length} ex
                      </button>
                    ) : (
                      <button onClick={() => setPickRoutineFor(i)} style={{
                        background: 'transparent', border: 'none', padding: 0, marginTop: 3,
                        color: 'var(--fg-mute)', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
                        textDecoration: 'underline', textUnderlineOffset: 3,
                      }}>
                        + Add routine
                      </button>
                    )}
                  </div>
                  {routine && (
                    <button onClick={() => setPickRoutineFor(i)} style={{
                      padding: 6, background: 'var(--bg-3)', border: 'none', borderRadius: 8,
                      color: 'var(--fg-mid)', cursor: 'pointer', flexShrink: 0,
                    }} title="Change routine">
                      <I.swap style={{ width: 13, height: 13 }}/>
                    </button>
                  )}
                  <DayPicker value={d.day} onChange={(v) => updateDay(i, { day: v })}/>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                    <button onClick={() => moveDay(i, -1)} disabled={i === 0} style={{
                      padding: 2, background: 'transparent', border: 'none',
                      color: i === 0 ? 'var(--fg-dim)' : 'var(--fg-mute)', cursor: i === 0 ? 'default' : 'pointer',
                    }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 15l6-6 6 6"/></svg>
                    </button>
                    <button onClick={() => moveDay(i, 1)} disabled={i === workout.days.length - 1} style={{
                      padding: 2, background: 'transparent', border: 'none',
                      color: i === workout.days.length - 1 ? 'var(--fg-dim)' : 'var(--fg-mute)',
                      cursor: i === workout.days.length - 1 ? 'default' : 'pointer',
                    }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                  </div>
                  <button onClick={() => removeDay(i)} style={{
                    padding: 5, background: 'transparent', border: 'none',
                    color: 'var(--fg-mute)', cursor: 'pointer', flexShrink: 0,
                  }}>
                    <I.close style={{ width: 13, height: 13 }}/>
                  </button>
                </div>
              </div>
            );
          })}
          <button onClick={addDay} style={{
            padding: 14, borderRadius: 12,
            background: 'transparent', border: '0.5px dashed var(--line-strong)',
            color: 'var(--fg-mid)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 13, fontWeight: 500,
          }}>
            <I.plus style={{ width: 14, height: 14 }}/> Add day
          </button>
        </div>
      </div>

      {/* Sticky CTA dock */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 14px calc(12px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(180deg, transparent, var(--bg-0) 40%)',
        display: 'flex', gap: 8,
      }}>
        <button onClick={handleSave} style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'var(--bg-2)', border: '0.5px solid var(--line)',
          color: 'var(--fg)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8, minWidth: 92, justifyContent: 'center',
        }}>
          {saved ? <><I.check style={{ width: 14, height: 14, color: 'var(--accent)' }}/> Saved</> : 'Save'}
        </button>
        <button onClick={onBack} className="btn btn-primary" style={{ flex: 1 }}>
          Done
        </button>
      </div>

      {/* Routine picker */}
      {pickRoutineFor !== null && (
        <Sheet onClose={() => setPickRoutineFor(null)} title="Pick a routine" subtitle="From trending + your routines">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {routinePool.map(r => (
              <button key={r.id} onClick={() => { updateDay(pickRoutineFor, { routineId: r.id, name: r.name }); setPickRoutineFor(null); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: 'var(--bg-3)', border: 'none', color: 'inherit',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <I.dumb style={{ width: 16, height: 16, color: 'var(--accent)' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                  <div className="t-xs" style={{ marginTop: 2, fontSize: 10.5, textTransform: 'none', letterSpacing: 0 }}>
                    {r.exercises.length} ex · {r.author}
                  </div>
                </div>
                <LevelChip level={r.level}/>
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {/* Share */}
      {shareOpen && <ShareSheet item={workout} kind="workout" onClose={() => setShareOpen(false)}/>}
    </div>
  );
}

function DayPicker({ value, onChange }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'var(--bg-3)', border: '0.5px solid var(--line)', borderRadius: 8,
        color: 'var(--fg)', fontFamily: 'inherit', fontSize: 11, padding: '4px 6px',
        outline: 'none', cursor: 'pointer', appearance: 'none',
        WebkitAppearance: 'none',
      }}>
      {days.map(d => <option key={d} value={d} style={{ background: 'var(--bg-2)' }}>{d}</option>)}
    </select>
  );
}

function LevelPicker({ value, onChange, editable }) {
  const [open, setOpen] = useStateT(false);
  if (!editable) return <LevelChip level={value}/>;
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 3,
      }}>
        <LevelChip level={value}/>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="var(--fg-mute)" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4,
          background: 'var(--bg-3)', border: '0.5px solid var(--line-strong)',
          borderRadius: 10, padding: 4, zIndex: 10,
          boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
        }}>
          {LEVELS.map(lv => (
            <button key={lv} onClick={() => { onChange(lv); setOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              background: 'transparent', border: 'none', color: 'inherit',
              cursor: 'pointer', borderRadius: 6, width: '100%', textAlign: 'left',
              fontSize: 12,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 50, background: LEVEL_COLORS[lv] }}/>
              {lv}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Routine detail — fully editable (now includes level field)
// ─────────────────────────────────────────────────────────────
function RoutineDetail({ routine, isNew, onChange, onSave, onBack, onStart }) {
  const update = (patch) => onChange({ ...routine, ...patch });
  const updateEx = (idx, patch) => {
    const ex = [...routine.exercises];
    ex[idx] = { ...ex[idx], ...patch };
    onChange({ ...routine, exercises: ex });
  };
  const removeEx = (idx) => {
    onChange({ ...routine, exercises: routine.exercises.filter((_, i) => i !== idx) });
  };
  const moveEx = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= routine.exercises.length) return;
    const ex = [...routine.exercises];
    [ex[idx], ex[next]] = [ex[next], ex[idx]];
    onChange({ ...routine, exercises: ex });
  };
  const [showAddSheet, setShowAddSheet] = useStateT(false);
  const [saved, setSaved] = useStateT(false);
  const [techFor, setTechFor] = useStateT(null);
  const [shareOpen, setShareOpen] = useStateT(false);
  const isMine = routine.author === 'You';

  const totalSets = routine.exercises.reduce((n, e) => n + (e.sets || 0), 0);
  const estTime = Math.round(routine.exercises.reduce((m, e) => m + (e.sets || 0) * ((e.rest || 90) / 60 + 1), 0));

  const handleSave = () => {
    onSave && onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="screen-in" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '0 18px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} className="btn btn-ghost" style={{
          padding: 0, width: 40, height: 40, background: 'var(--bg-2)', borderRadius: 12,
          border: '0.5px solid var(--line)',
        }}>
          <I.back style={{ width: 16, height: 16, color: 'var(--fg-mid)' }}/>
        </button>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-mute)' }}>
          {isNew ? 'New routine' : isMine ? 'Edit routine' : 'Routine'}
        </div>
        <button onClick={() => setShareOpen(true)} className="btn" style={{
          padding: 0, width: 40, height: 40, background: 'var(--bg-2)', borderRadius: 12,
          border: '0.5px solid var(--line)', justifyContent: 'center',
        }} title="Share routine">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.5 10.5l7-3M8.5 13.5l7 3"/>
          </svg>
        </button>
        {!isMine && !isNew && (
          <button onClick={() => { onSave && onSave(); setSaved(true); setTimeout(() => setSaved(false), 1800); }} className="btn" style={{ padding: '8px 14px', background: 'var(--bg-2)', fontSize: 13 }}>
            <I.plus style={{ width: 13, height: 13 }}/> Save copy
          </button>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <KindBadge kind="routine"/>
          <LevelPicker value={routine.level || 'Intermediate'} onChange={(v) => update({ level: v })} editable={isMine || isNew}/>
        </div>
        <EditableField
          value={routine.name}
          onChange={(v) => update({ name: v })}
          placeholder="Routine name"
          textStyle={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}
        />
        <div className="t-sm" style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>by {routine.author}</span>
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>{routine.exercises.length} exercises</span>
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>~{estTime} min</span>
        </div>
        {routine.tags && routine.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {routine.tags.map(t => <Chip key={t}>{t}</Chip>)}
          </div>
        )}
      </div>

      <div style={{ padding: '14px 18px 0' }}>
        <EditableField
          value={routine.description}
          onChange={(v) => update({ description: v })}
          placeholder="Add a description (optional)"
          multiline
          textStyle={{ fontSize: 13, color: 'var(--fg-mid)', lineHeight: 1.45 }}
        />
      </div>

      <div style={{ padding: '16px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <MetaCard label="Exercises" value={routine.exercises.length}/>
        <MetaCard label="Sets" value={totalSets}/>
        <MetaCard label="Duration" value={`~${estTime}m`}/>
      </div>

      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="t-xs">Exercises</span>
          <span className="t-xs fg-mute">Tap any value to edit</span>
        </div>
        {routine.exercises.length === 0 ? (
          <button onClick={() => setShowAddSheet(true)} style={{
            width: '100%', padding: 22, borderRadius: 14,
            background: 'transparent', border: '0.5px dashed var(--line-strong)',
            color: 'var(--fg-mid)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 13, fontWeight: 500,
          }}>
            <I.plus style={{ width: 16, height: 16 }}/> Add first exercise
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {routine.exercises.map((ex, i) => (
              <EditableExerciseRow
                key={i}
                exercise={ex}
                index={i}
                count={routine.exercises.length}
                onUpdate={(patch) => updateEx(i, patch)}
                onRemove={() => removeEx(i)}
                onMoveUp={() => moveEx(i, -1)}
                onMoveDown={() => moveEx(i, 1)}
                onTechnique={() => setTechFor(ex.name)}
              />
            ))}
            <button onClick={() => setShowAddSheet(true)} style={{
              padding: 14, borderRadius: 12,
              background: 'transparent', border: '0.5px dashed var(--line-strong)',
              color: 'var(--fg-mid)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 13, fontWeight: 500,
            }}>
              <I.plus style={{ width: 14, height: 14 }}/> Add exercise
            </button>
          </div>
        )}
      </div>

      {/* Sticky dock */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 14px calc(12px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(180deg, transparent, var(--bg-0) 40%)',
        display: 'flex', gap: 8,
      }}>
        <button onClick={handleSave} style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'var(--bg-2)', border: '0.5px solid var(--line)',
          color: 'var(--fg)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8, minWidth: 92, justifyContent: 'center',
        }}>
          {saved ? <><I.check style={{ width: 14, height: 14, color: 'var(--accent)' }}/> Saved</> : 'Save'}
        </button>
        <button onClick={onStart} className="btn btn-primary" style={{ flex: 1 }}>
          <I.play style={{ width: 16, height: 16 }}/> Start workout
        </button>
      </div>

      {showAddSheet && (
        <AddExerciseSheet
          onClose={() => setShowAddSheet(false)}
          onPick={(name) => {
            onChange({
              ...routine,
              exercises: [...routine.exercises, { name, sets: 3, reps: '8-10', rest: 90, rpe: 7 }],
            });
            setShowAddSheet(false);
          }}
          onPreviewTechnique={(name) => setTechFor(name)}
        />
      )}

      {techFor && <TechniqueSheet exerciseName={techFor} onClose={() => setTechFor(null)}/>}
      {shareOpen && <ShareSheet item={routine} kind="routine" onClose={() => setShareOpen(false)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Editable exercise row (unchanged from before)
// ─────────────────────────────────────────────────────────────
function EditableExerciseRow({ exercise, index, count, onUpdate, onRemove, onMoveUp, onMoveDown, onTechnique }) {
  const [expanded, setExpanded] = useStateT(false);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: 'var(--bg-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--fg-mute)', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
          flexShrink: 0,
        }}>{index + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <EditableField
            value={exercise.name}
            onChange={(v) => onUpdate({ name: v })}
            placeholder="Exercise name"
            textStyle={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}
          />
          <div className="t-mono" style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 3 }}>
            {exercise.sets}×{exercise.reps} · {exercise.rest}s rest · RPE {exercise.rpe}
          </div>
        </div>
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); onTechnique && onTechnique(); }}
          style={{
            padding: 6, background: 'transparent', border: 'none',
            color: 'var(--fg-mute)', cursor: 'pointer',
          }}
          title="Technique"
        >
          <I.info style={{ width: 14, height: 14 }}/>
        </span>
        <button onClick={() => setExpanded(e => !e)} style={{
          padding: 6, background: 'transparent', border: 'none',
          color: 'var(--fg-mute)', cursor: 'pointer',
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          }}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      {expanded && (
        <div className="anim-up" style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '0.5px solid var(--line)', paddingTop: 12, marginTop: -2 }}>
          <NumberRow label="Sets" value={exercise.sets} onChange={(v) => onUpdate({ sets: v })} min={1} max={10}/>
          <TextRow label="Reps" value={exercise.reps} onChange={(v) => onUpdate({ reps: v })} placeholder="e.g. 8-10"/>
          <NumberRow label="Rest" value={exercise.rest} onChange={(v) => onUpdate({ rest: v })} min={15} max={300} step={15} unit="s"/>
          <NumberRow label="Target RPE" value={exercise.rpe} onChange={(v) => onUpdate({ rpe: v })} min={5} max={10} step={1}/>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button onClick={onMoveUp} disabled={index === 0} style={{
              flex: 1, padding: 8, borderRadius: 9, background: 'var(--bg-3)',
              border: 'none', color: index === 0 ? 'var(--fg-dim)' : 'var(--fg-mid)',
              cursor: index === 0 ? 'default' : 'pointer', fontSize: 12, fontWeight: 500,
            }}>↑ Move up</button>
            <button onClick={onMoveDown} disabled={index === count - 1} style={{
              flex: 1, padding: 8, borderRadius: 9, background: 'var(--bg-3)',
              border: 'none', color: index === count - 1 ? 'var(--fg-dim)' : 'var(--fg-mid)',
              cursor: index === count - 1 ? 'default' : 'pointer', fontSize: 12, fontWeight: 500,
            }}>↓ Move down</button>
            <button onClick={onRemove} style={{
              flex: 1, padding: 8, borderRadius: 9, background: 'rgba(255,107,107,0.10)',
              border: '0.5px solid rgba(255,107,107,0.3)', color: 'var(--err)',
              cursor: 'pointer', fontSize: 12, fontWeight: 500,
            }}>Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EditableField, NumberRow, TextRow, MetaCard (unchanged)
// ─────────────────────────────────────────────────────────────
function EditableField({ value, onChange, placeholder, multiline, textStyle = {} }) {
  const [editing, setEditing] = useStateT(false);
  const [draft, setDraft] = useStateT(value || '');
  const inputRef = useRefT(null);

  useEffectT(() => { setDraft(value || ''); }, [value]);
  useEffectT(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    onChange((draft || '').trim());
  };

  if (!editing) {
    const isEmpty = !value;
    return (
      <button onClick={() => setEditing(true)} style={{
        background: 'transparent', border: 'none', padding: 0,
        color: isEmpty ? 'var(--fg-mute)' : 'var(--fg)',
        cursor: 'text', textAlign: 'left', width: '100%',
        fontFamily: 'inherit',
        ...textStyle,
        fontStyle: isEmpty ? 'italic' : 'normal',
        opacity: isEmpty ? 0.7 : 1,
      }}>
        {value || placeholder}
      </button>
    );
  }

  const Tag = multiline ? 'textarea' : 'input';
  return (
    <Tag
      ref={inputRef}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === 'Enter' && !multiline) commit();
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
      }}
      placeholder={placeholder}
      rows={multiline ? 2 : undefined}
      style={{
        background: 'var(--accent-soft)', border: '0.5px solid var(--accent)',
        borderRadius: 8, padding: '4px 8px',
        color: 'var(--fg)', fontFamily: 'inherit', outline: 'none',
        width: '100%', resize: multiline ? 'vertical' : 'none',
        ...textStyle,
      }}/>
  );
}

function NumberRow({ label, value, onChange, min = 0, max = 99, step = 1, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span className="t-sm" style={{ flex: 1, color: 'var(--fg-mid)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-3)', borderRadius: 10, padding: 3 }}>
        <button onClick={() => onChange(Math.max(min, value - step))} style={{
          width: 28, height: 28, borderRadius: 7, background: 'var(--bg-2)',
          border: 'none', color: 'var(--fg-mid)', cursor: 'pointer', fontSize: 16, lineHeight: 1,
        }}>−</button>
        <span className="t-mono" style={{ fontSize: 14, fontWeight: 600, minWidth: 36, textAlign: 'center' }}>
          {value}{unit && <span style={{ fontSize: 11, color: 'var(--fg-mute)', marginLeft: 1 }}>{unit}</span>}
        </span>
        <button onClick={() => onChange(Math.min(max, value + step))} style={{
          width: 28, height: 28, borderRadius: 7, background: 'var(--bg-2)',
          border: 'none', color: 'var(--fg-mid)', cursor: 'pointer', fontSize: 16, lineHeight: 1,
        }}>+</button>
      </div>
    </div>
  );
}

function TextRow({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span className="t-sm" style={{ flex: 1, color: 'var(--fg-mid)' }}>{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: 100, padding: '7px 10px', borderRadius: 10,
          background: 'var(--bg-3)', border: '0.5px solid var(--line)',
          color: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
          outline: 'none', textAlign: 'center',
        }}/>
    </div>
  );
}

function MetaCard({ label, value }) {
  return (
    <div className="card" style={{ padding: 12, textAlign: 'center' }}>
      <div className="t-mono" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="t-xs" style={{ marginTop: 3 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Add exercise sheet (unchanged)
// ─────────────────────────────────────────────────────────────
const EXERCISE_LIBRARY = [
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

function AddExerciseSheet({ onClose, onPick, onPreviewTechnique }) {
  const [query, setQuery] = useStateT('');
  const filtered = EXERCISE_LIBRARY.filter(e =>
    !query || e.name.toLowerCase().includes(query.toLowerCase()) || e.muscle.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <Sheet onClose={onClose} title="Add exercise" subtitle={`${EXERCISE_LIBRARY.length} in library · plus your custom`}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 12, marginBottom: 12,
        background: 'var(--bg-3)', border: '0.5px solid var(--line)',
      }}>
        <SearchIcon/>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search exercises…"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
          }}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 360, overflowY: 'auto' }}>
        {filtered.map(e => (
          <div key={e.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '10px 12px', borderRadius: 10,
          }}>
            <button onClick={() => onPick(e.name)} style={{
              flex: 1, background: 'transparent', border: 'none', color: 'inherit',
              cursor: 'pointer', textAlign: 'left', padding: 0,
            }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
              <div className="t-xs" style={{ marginTop: 2, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'var(--fg-mute)' }}>{e.muscle}</div>
            </button>
            <button onClick={() => onPreviewTechnique && onPreviewTechnique(e.name)} style={{
              padding: 6, background: 'var(--bg-3)', border: 'none', borderRadius: 8,
              color: 'var(--fg-mid)', cursor: 'pointer',
            }} title="How to do this">
              <I.info style={{ width: 13, height: 13 }}/>
            </button>
            <button onClick={() => onPick(e.name)} style={{
              padding: 6, background: 'var(--accent-soft)', border: 'none', borderRadius: 8,
              color: 'var(--accent)', cursor: 'pointer',
            }}>
              <I.plus style={{ width: 13, height: 13 }}/>
            </button>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────
// Share sheet — works for both routine and workout
// ─────────────────────────────────────────────────────────────
function ShareSheet({ item, kind, onClose }) {
  const isWorkout = kind === 'workout';
  const [copied, setCopied] = useStateT(false);
  const [mode, setMode] = useStateT('share');
  const [importedAs, setImportedAs] = useStateT(null);

  const slug = (item.id || 'x-1').replace(/^[rw]-/, '');
  const url = `https://hivo.app/${isWorkout ? 'w' : 'r'}/${slug}`;

  const copyLink = async () => {
    try { if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(url); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (mode === 'recipient') {
    return (
      <Sheet
        onClose={() => { setMode('share'); setImportedAs(null); }}
        title="Preview as recipient"
        subtitle={url}
      >
        <div style={{
          padding: 12, borderRadius: 10, background: 'var(--bg-3)',
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
          border: '0.5px solid var(--line)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 50,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-fg)', fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>{(item.author || 'A')[0].toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div className="t-sm" style={{ color: 'var(--fg)', fontSize: 12.5 }}>
              <strong style={{ fontWeight: 600 }}>{item.author}</strong>{' '}
              <span className="fg-mute">shared a {kind}</span>
            </div>
            <div className="t-xs" style={{ marginTop: 2, fontFamily: 'var(--font-mono)', textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>{url}</div>
          </div>
        </div>

        <div className="card-elev" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <KindBadge kind={kind}/>
            <LevelChip level={item.level}/>
          </div>
          <div className="t-h2">{item.name}</div>
          <div className="t-sm" style={{ marginTop: 4 }}>
            by {item.author} · {isWorkout ? `${item.days.length} days · ${item.duration || '—'}` : `${item.exercises.length} exercises`}
          </div>
          {item.description && (
            <div className="t-sm" style={{ marginTop: 10, fontSize: 12.5, color: 'var(--fg-mid)', lineHeight: 1.45 }}>
              {item.description}
            </div>
          )}
          <div className="divider"/>
          {isWorkout ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {item.days.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 30, height: 22, borderRadius: 6, background: 'var(--bg-3)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--fg-mute)', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                  }}>{d.day.toUpperCase()}</span>
                  <span className="t-sm" style={{ flex: 1, fontSize: 12.5, color: 'var(--fg)' }}>{d.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {item.exercises.map((ex, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', minWidth: 16 }}>{i+1}</span>
                  <span className="t-sm" style={{ flex: 1, fontSize: 12.5, color: 'var(--fg)' }}>{ex.name}</span>
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{ex.sets}×{ex.reps}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 14 }}>
          {importedAs ? (
            <div className="anim-up card-elev" style={{ padding: 14, textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 50, background: 'var(--accent-soft)',
                margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                <I.check style={{ width: 18, height: 18, strokeWidth: 2.5 }}/>
              </div>
              <div className="t-h3" style={{ fontSize: 14 }}>Added to My {isWorkout ? 'Workouts' : 'Routines'}</div>
              <div className="t-sm" style={{ marginTop: 4 }}>Saved as "{importedAs}"</div>
            </div>
          ) : (
            <>
              <button onClick={() => setImportedAs(item.name)} className="btn btn-primary btn-block">
                <I.plus style={{ width: 14, height: 14 }}/> Copy to my {isWorkout ? 'workouts' : 'routines'}
              </button>
              <button onClick={() => setMode('share')} className="btn btn-block" style={{ marginTop: 8, background: 'var(--bg-3)' }}>
                Back to share
              </button>
            </>
          )}
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} title={`Share ${kind}`} subtitle={item.name}>
      <div style={{
        padding: 14, borderRadius: 14,
        background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))',
        border: '0.5px solid var(--line)', marginBottom: 14, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'var(--accent)', opacity: 0.18, filter: 'blur(36px)' }}/>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative' }}>
          <div style={{
            width: 50, height: 50, borderRadius: 13,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'var(--accent-fg)',
          }}>
            {isWorkout ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>
              </svg>
            ) : <I.dumb style={{ width: 22, height: 22 }}/>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <KindBadge kind={kind}/>
              <LevelChip level={item.level}/>
            </div>
            <div className="t-h3" style={{ fontSize: 15 }}>{item.name}</div>
          </div>
        </div>
      </div>

      <div className="t-xs" style={{ marginBottom: 8 }}>Shareable link</div>
      <div style={{
        display: 'flex', gap: 8,
        padding: '12px 14px', borderRadius: 12,
        background: 'var(--bg-3)', border: '0.5px solid var(--line)',
        alignItems: 'center',
      }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--fg-mute)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1.5 1.5"/>
          <path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1.5-1.5"/>
        </svg>
        <span className="t-mono" style={{ flex: 1, fontSize: 12.5, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
        <button onClick={copyLink} style={{
          padding: '6px 12px', borderRadius: 8,
          background: copied ? 'var(--accent-soft)' : 'var(--bg-2)',
          color: copied ? 'var(--accent)' : 'var(--fg)',
          border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}>
          {copied ? <><I.check style={{ width: 12, height: 12, strokeWidth: 2.5, verticalAlign: -2 }}/> Copied</> : 'Copy'}
        </button>
      </div>

      <div className="t-sm" style={{ marginTop: 8, fontSize: 11.5, color: 'var(--fg-mute)' }}>
        Anyone with the link can preview the {kind} and copy it to their own {isWorkout ? 'workouts' : 'routines'}.
      </div>

      <div className="t-xs" style={{ marginTop: 16, marginBottom: 8 }}>Quick share</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <ShareTarget label="Messages" icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3C6.5 3 2 6.5 2 11c0 2.5 1.5 4.7 4 6L4 22l5-3c1 .2 2 .3 3 .3 5.5 0 10-3.5 10-8.3S17.5 3 12 3z"/></svg>}/>
        <ShareTarget label="WhatsApp" icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 12a8 8 0 00-13.6-5.7A8 8 0 003.3 17l-1 4 4-1A8 8 0 0020 12z" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M9 9c.3-.7 1-.8 1.5-.5L11 9c.3.3.2.7 0 1l-.5.7a5 5 0 002.8 2.8l.7-.5c.3-.2.7-.3 1 0l.5.5c.3.5.2 1.2-.5 1.5-1.5.7-3.5 0-5-1.5S8.3 10.5 9 9z" fill="currentColor"/></svg>}/>
        <ShareTarget label="Email" icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>}/>
        <ShareTarget label="Twitter" icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 4h3l-7 8 8 8h-6l-5-6-5 6H3l7-9-7-7h6l4 5 5-5z"/></svg>}/>
        <ShareTarget label="Instagram" icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>}/>
        <ShareTarget label="More" icon={<I.more style={{ width: 18, height: 18 }}/>}/>
      </div>

      <div className="divider"/>

      <button onClick={() => setMode('recipient')} className="btn btn-block" style={{ background: 'var(--bg-3)' }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Preview as recipient
      </button>
    </Sheet>
  );
}

function ShareTarget({ label, icon }) {
  return (
    <button className="hover-lift" style={{
      padding: 12, borderRadius: 12,
      background: 'var(--bg-3)', border: '0.5px solid var(--line)',
      color: 'var(--fg-mid)', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <div style={{ color: 'var(--accent)' }}>{icon}</div>
      <span className="t-xs" style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'var(--fg)' }}>{label}</span>
    </button>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2l1.7 4.6 4.6 1.7-4.6 1.7L12 14.6 10.3 10l-4.6-1.7 4.6-1.7L12 2z"/>
      <path d="M19 13l.8 2.2 2.2.8-2.2.8L19 19l-.8-2.2-2.2-.8 2.2-.8L19 13z" opacity="0.7"/>
      <path d="M5 15l.7 1.9 1.9.6-1.9.6L5 20l-.7-1.9-1.9-.6 1.9-.6L5 15z" opacity="0.5"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--fg-mute)" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M16 16l4 4"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// AI Coach — chat-style intake → generates a personalized workout
// ─────────────────────────────────────────────────────────────
const COACH_QUESTIONS = [
  { id: 'experience',
    prompt: "Hi 👋 I'm your AI Coach. Quick intake, then I'll design a workout for you.\n\nFirst — how long have you been training?",
    options: [
      { value: 'new',    label: 'New to the gym',     sub: 'Less than 3 months' },
      { value: 'casual', label: 'Casual',             sub: '3 months – 1 year' },
      { value: 'regular',label: 'Regular',            sub: '1 – 3 years' },
      { value: 'veteran',label: 'Veteran',            sub: '3+ years' },
    ]},
  { id: 'goal',
    prompt: "What's your main goal right now?",
    options: [
      { value: 'strength',  label: 'Get stronger',   sub: 'Heavier compound lifts' },
      { value: 'hypertrophy', label: 'Build muscle', sub: 'Aesthetic, more volume' },
      { value: 'recomp',    label: 'Recomposition',   sub: 'Lean out while keeping strength' },
      { value: 'general',   label: 'General fitness', sub: 'Stay healthy, feel good' },
    ]},
  { id: 'days',
    prompt: "How many days per week can you train?",
    options: [
      { value: 3, label: '3 days', sub: 'Minimum effective dose' },
      { value: 4, label: '4 days', sub: 'Upper / Lower split' },
      { value: 5, label: '5 days', sub: 'Push / Pull / Legs + 2' },
      { value: 6, label: '6 days', sub: 'Full PPL' },
    ]},
  { id: 'duration',
    prompt: "How long can each session be?",
    options: [
      { value: 30, label: '30 min', sub: 'Short, focused' },
      { value: 45, label: '45 min', sub: 'Balanced' },
      { value: 60, label: '60 min', sub: 'Standard hour' },
      { value: 90, label: '75 – 90 min', sub: 'I have time' },
    ]},
  { id: 'equipment',
    prompt: "What equipment do you have?",
    options: [
      { value: 'full',   label: 'Full gym',         sub: 'Barbells, DBs, machines, cables' },
      { value: 'home',   label: 'Home gym',         sub: 'Barbell + plates + rack' },
      { value: 'dbs',    label: 'Dumbbells only',   sub: 'Adjustable or rack' },
      { value: 'bw',     label: 'Bodyweight only',  sub: 'No equipment' },
    ]},
  { id: 'focus',
    prompt: "Any specific focus or weak point?",
    options: [
      { value: 'none',     label: 'Balanced',     sub: 'Hit everything evenly' },
      { value: 'upper',    label: 'Upper body',   sub: 'Chest, back, arms' },
      { value: 'lower',    label: 'Lower body',   sub: 'Legs and glutes' },
      { value: 'posterior',label: 'Posterior chain', sub: 'Back, hams, glutes' },
    ]},
];

function AICoachSheet({ onClose, onAddWorkout }) {
  const [step, setStep] = useStateT(0);          // 0..N (questions) | 'generating' | 'done'
  const [answers, setAnswers] = useStateT({});
  const [generated, setGenerated] = useStateT(null);
  const [savedFlash, setSavedFlash] = useStateT(false);

  const totalSteps = COACH_QUESTIONS.length;

  const choose = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
    if (step + 1 < totalSteps) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setStep('generating');
      setTimeout(() => {
        setGenerated(buildWorkout({ ...answers, [qid]: value }));
        setStep('done');
      }, 1400);
    }
  };

  const back = () => {
    if (typeof step === 'number' && step > 0) setStep(step - 1);
  };

  const saveAndClose = () => {
    if (!generated) return;
    onAddWorkout && onAddWorkout(generated);
    setSavedFlash(true);
    setTimeout(() => onClose && onClose(), 900);
  };

  return (
    <Sheet onClose={onClose} title={<><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><SparklesIcon/> AI Coach</span></>} subtitle={
      step === 'done' ? 'Your custom workout is ready' :
      step === 'generating' ? 'Designing your program…' :
      `Step ${step + 1} of ${totalSteps}`
    }>
      {/* Progress bar */}
      {typeof step === 'number' && (
        <div style={{ marginBottom: 18 }}>
          <ProgressBar value={(step + 1) / totalSteps * 100} height={3}/>
        </div>
      )}

      {/* Question step */}
      {typeof step === 'number' && (() => {
        const q = COACH_QUESTIONS[step];
        return (
          <div className="anim-up" key={q.id}>
            <div style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'var(--bg-3)', border: '0.5px solid var(--line)',
              marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 50,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-fg)', flexShrink: 0,
              }}>
                <SparklesIcon/>
              </div>
              <span style={{ flex: 1, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{q.prompt}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {q.options.map(opt => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button key={String(opt.value)} onClick={() => choose(q.id, opt.value)} className="hover-lift" style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 12,
                    background: selected ? 'var(--accent-soft)' : 'var(--bg-3)',
                    border: '0.5px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
                    color: 'inherit', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 50,
                      border: '1.5px solid ' + (selected ? 'var(--accent)' : 'var(--line-strong)'),
                      background: selected ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-fg)', flexShrink: 0,
                    }}>
                      {selected && <I.check style={{ width: 11, height: 11, strokeWidth: 3 }}/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{opt.label}</div>
                      <div className="t-xs" style={{ marginTop: 2, fontSize: 11, textTransform: 'none', letterSpacing: 0 }}>{opt.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <button onClick={back} className="btn btn-block" style={{ marginTop: 14, background: 'var(--bg-3)' }}>
                <I.back style={{ width: 13, height: 13 }}/> Back
              </button>
            )}
          </div>
        );
      })()}

      {/* Generating */}
      {step === 'generating' && (
        <div className="anim-up" style={{ padding: '40px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', position: 'relative', width: 60, height: 60 }}>
            <div className="float" style={{
              width: 60, height: 60, borderRadius: 50,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-fg)',
            }}>
              <SparklesIcon/>
            </div>
            <div className="glow-pulse" style={{
              position: 'absolute', inset: -4, borderRadius: 50,
              background: 'transparent',
            }}/>
          </div>
          <div className="t-h2" style={{ marginTop: 18 }}>Designing your workout</div>
          <div className="t-sm" style={{ marginTop: 6 }}>Matching exercises to your goals…</div>
        </div>
      )}

      {/* Done — generated preview */}
      {step === 'done' && generated && (
        <div className="anim-up">
          <div className="card-elev" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'var(--accent)', opacity: 0.18, filter: 'blur(36px)' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, position: 'relative' }}>
              <KindBadge kind="workout"/>
              <LevelChip level={generated.level}/>
              <Chip variant="acc" style={{ fontSize: 10 }}>AI-built</Chip>
            </div>
            <div className="t-h2" style={{ position: 'relative' }}>{generated.name}</div>
            <div className="t-sm" style={{ marginTop: 4, position: 'relative' }}>
              {generated.days.length} days · ~{generated.estMin} min/session · {generated.duration}
            </div>
            <div className="t-sm" style={{ marginTop: 8, fontSize: 12.5, color: 'var(--fg-mid)', lineHeight: 1.45, position: 'relative' }}>
              {generated.description}
            </div>
          </div>

          <div className="t-xs" style={{ marginTop: 14, marginBottom: 8 }}>Weekly schedule</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {generated.days.map((d, i) => (
              <div key={i} className="card" style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 30, height: 22, borderRadius: 6, background: 'var(--bg-3)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>{d.day.toUpperCase()}</span>
                <span className="t-sm" style={{ flex: 1, fontSize: 12.5, color: 'var(--fg)' }}>{d.name}</span>
                {d.exercises && (
                  <span className="t-xs" style={{ fontSize: 10, color: 'var(--fg-mute)' }}>{d.exercises.length} ex</span>
                )}
              </div>
            ))}
          </div>

          {savedFlash ? (
            <div className="anim-up card-elev" style={{ padding: 14, marginTop: 14, textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 50, background: 'var(--accent-soft)',
                margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                <I.check style={{ width: 18, height: 18, strokeWidth: 2.5 }}/>
              </div>
              <div className="t-h3" style={{ fontSize: 14 }}>Added to My Workouts</div>
            </div>
          ) : (
            <>
              <button onClick={saveAndClose} className="btn btn-primary btn-block" style={{ marginTop: 16 }}>
                <I.plus style={{ width: 14, height: 14 }}/> Add to My Workouts
              </button>
              <button onClick={() => { setStep(0); setAnswers({}); setGenerated(null); }} className="btn btn-block" style={{ marginTop: 8, background: 'var(--bg-3)' }}>
                Start over
              </button>
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}

// Build a deterministic-ish workout from intake answers
function buildWorkout(a) {
  const exp = a.experience;
  const level = exp === 'new' ? 'Beginner' : exp === 'casual' ? 'Beginner' : exp === 'veteran' ? 'Advanced' : 'Intermediate';
  const days = a.days || 4;
  const estMin = a.duration || 60;
  const equip = a.equipment || 'full';

  // Pick exercises depending on equipment
  const ex = {
    chest: equip === 'bw' ? 'Push-up' : equip === 'dbs' ? 'DB bench press' : 'Barbell bench press',
    back:  equip === 'bw' ? 'Inverted row' : equip === 'dbs' ? 'DB row' : 'Barbell row',
    quad:  equip === 'bw' ? 'Bodyweight squat' : equip === 'dbs' ? 'Goblet squat' : 'Back squat',
    hinge: equip === 'bw' ? 'Single-leg RDL' : equip === 'dbs' ? 'DB Romanian DL' : 'Romanian DL',
    ohp:   equip === 'bw' ? 'Pike push-up' : equip === 'dbs' ? 'Seated DB press' : 'Overhead press',
    pull:  equip === 'bw' ? 'Pull-up (assisted)' : equip === 'dbs' ? 'DB pullover' : 'Pull-up',
    arms:  equip === 'bw' ? 'Diamond push-up' : equip === 'dbs' ? 'DB curl' : 'Triceps pushdown',
    glute: equip === 'bw' ? 'Glute bridge' : 'Hip thrust',
  };

  // Set/rep scheme by goal
  const scheme = (kind) => {
    if (a.goal === 'strength') return { sets: 4, reps: kind === 'main' ? '5' : '6-8', rest: kind === 'main' ? 180 : 120, rpe: kind === 'main' ? 8 : 7 };
    if (a.goal === 'hypertrophy') return { sets: 4, reps: kind === 'main' ? '8-10' : '10-12', rest: 90, rpe: 7 };
    if (a.goal === 'recomp') return { sets: 3, reps: '8-10', rest: 75, rpe: 7 };
    return { sets: 3, reps: '10-12', rest: 60, rpe: 6 };
  };

  const mk = (name, kind = 'acc') => ({ name, ...scheme(kind) });

  // Build day templates
  const focusUpper = a.focus === 'upper';
  const focusLower = a.focus === 'lower' || a.focus === 'posterior';
  const focusPost = a.focus === 'posterior';

  const upperHeavy = {
    name: 'Upper · Heavy',
    exercises: [
      mk(ex.chest, 'main'),
      mk(ex.back, 'main'),
      mk(ex.ohp),
      mk(ex.pull),
      mk(ex.arms),
    ],
  };
  const lowerHeavy = {
    name: 'Lower · Heavy',
    exercises: [
      mk(ex.quad, 'main'),
      mk(focusPost ? ex.hinge : ex.glute, 'main'),
      mk(focusPost ? ex.glute : ex.hinge),
      mk(equip === 'bw' ? 'Walking lunge' : 'Bulgarian split squat'),
      mk(equip === 'bw' ? 'Calf raise' : 'Standing calf raise'),
    ],
  };
  const upperVolume = { ...upperHeavy, name: 'Upper · Volume' };
  const lowerVolume = { ...lowerHeavy, name: 'Lower · Volume' };
  const pushDay = { name: 'Push', exercises: [mk(ex.chest, 'main'), mk(ex.ohp), mk('Incline DB press'), mk('Lateral raise'), mk(ex.arms)] };
  const pullDay = { name: 'Pull', exercises: [mk(ex.back, 'main'), mk(ex.pull), mk('Face pull'), mk(equip === 'bw' ? 'Inverted row (close grip)' : 'Hammer curl')] };
  const legDay  = lowerHeavy;
  const fullBody = {
    name: 'Full body',
    exercises: [
      mk(ex.quad, 'main'),
      mk(ex.chest),
      mk(ex.back),
      mk(ex.hinge),
      mk('Plank'),
    ],
  };

  let dayPlan;
  if (days <= 3) {
    dayPlan = [
      { day: 'Mon', ...fullBody },
      { day: 'Wed', ...fullBody, name: 'Full body B' },
      { day: 'Fri', ...fullBody, name: 'Full body C' },
    ];
  } else if (days === 4) {
    dayPlan = [
      { day: 'Mon', ...upperHeavy },
      { day: 'Tue', ...lowerHeavy },
      { day: 'Thu', ...upperVolume },
      { day: 'Fri', ...lowerVolume },
    ];
  } else if (days === 5) {
    dayPlan = [
      { day: 'Mon', ...pushDay },
      { day: 'Tue', ...pullDay },
      { day: 'Wed', ...legDay },
      { day: 'Fri', ...upperHeavy },
      { day: 'Sat', ...lowerHeavy },
    ];
  } else {
    dayPlan = [
      { day: 'Mon', ...pushDay },
      { day: 'Tue', ...pullDay },
      { day: 'Wed', ...legDay },
      { day: 'Thu', ...pushDay, name: 'Push · Volume' },
      { day: 'Fri', ...pullDay, name: 'Pull · Volume' },
      { day: 'Sat', ...legDay, name: 'Legs · Volume' },
    ];
  }

  // Apply focus bias — extend the focused days slightly
  if (focusUpper) {
    dayPlan = dayPlan.map(d => /Upper|Push|Pull/.test(d.name) ? { ...d, exercises: [...d.exercises, mk('Cable fly')] } : d);
  } else if (focusLower) {
    dayPlan = dayPlan.map(d => /Lower|Legs/.test(d.name) ? { ...d, exercises: [...d.exercises, mk(equip === 'bw' ? 'Glute bridge hold' : 'Glute bridge')] } : d);
  }

  // Generate routine objects per day and attach
  const id = 'w-ai-' + Date.now();
  const days_ = dayPlan.map((d, i) => ({
    day: d.day,
    name: d.name,
    routineId: `${id}-d${i+1}`,
    // Embed the exercises in the routine for the workout-detail picker
    _routineData: {
      id: `${id}-d${i+1}`, name: d.name, author: 'AI Coach',
      level, description: `Auto-generated for your ${a.goal || 'general'} goal.`,
      tags: [d.name.split(' ')[0]], exercises: d.exercises,
    },
  }));

  const goalLabel = a.goal === 'strength' ? 'Strength' : a.goal === 'hypertrophy' ? 'Hypertrophy' : a.goal === 'recomp' ? 'Recomp' : 'General fitness';
  const splitLabel = days <= 3 ? 'Full body' : days === 4 ? 'Upper / Lower' : days === 5 ? 'PPL + extras' : 'PPL × 2';
  return {
    id, name: `${goalLabel} ${days}× · ${splitLabel}`,
    author: 'AI Coach', level,
    tags: [goalLabel, `${days} days`, splitLabel],
    description: `AI-generated for ${level.toLowerCase()} lifter · ${goalLabel.toLowerCase()} focus · ${equip === 'full' ? 'full gym' : equip === 'home' ? 'home gym' : equip === 'dbs' ? 'dumbbells only' : 'bodyweight only'}.`,
    duration: '6 weeks',
    daysPerWeek: days,
    estMin,
    days: days_,
  };
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="var(--accent)">
      <path d="M12 2l3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9z"/>
    </svg>
  );
}

Object.assign(window, { TrainScreen, RoutineDetail, WorkoutDetail, ShareSheet, LevelChip });
