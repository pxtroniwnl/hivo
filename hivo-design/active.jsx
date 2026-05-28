// active.jsx — Active workout (hybrid list + focus mode), rest timer, adaptive autoreg
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA, useMemo: useMemoA } = React;

const SET_TYPE_LABEL = {
  warmup: 'W',
  normal: '',
  drop: 'D',
  failure: 'F',
  superset: 'S',
  cluster: 'C',
};

const SET_TYPE_COLOR = {
  warmup: 'var(--fg-mute)',
  normal: 'var(--accent)',
  drop: 'var(--warn)',
  failure: 'var(--err)',
  superset: 'var(--ok)',
  cluster: 'var(--accent)',
};

function ActiveWorkout({ onExit, layout = 'hybrid', mode = 'live' }) {
  // workout state
  const [exercises, setExercises] = useStateA(() => JSON.parse(JSON.stringify(EXERCISES)));
  const [focusedIdx, setFocusedIdx] = useStateA(() => exercises.findIndex(e => e.sets.some(s => !s.done)));
  const [restRemaining, setRestRemaining] = useStateA(0); // seconds
  const [restTotal, setRestTotal] = useStateA(0);
  const [showRest, setShowRest] = useStateA(false);
  const [autoregNote, setAutoregNote] = useStateA(null);
  const [autoregOpen, setAutoregOpen] = useStateA(false);
  const [showSwap, setShowSwap] = useStateA(null); // exerciseId or null
  const [showTech, setShowTech] = useStateA(null); // exerciseName or null
  const [elapsed, setElapsed] = useStateA(1382); // 23:02
  const [view, setView] = useStateA(layout); // 'hybrid' | 'list' | 'focus'

  // Workout timer
  useEffectA(() => {
    if (mode === 'log-past') return; // freeze in post-hoc logging
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [mode]);

  // Rest timer countdown
  useEffectA(() => {
    if (restRemaining <= 0) return;
    const id = setInterval(() => {
      setRestRemaining(r => {
        if (r <= 1) {
          // auto-close
          setTimeout(() => setShowRest(false), 400);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restRemaining > 0]);

  // Sync view with layout prop (Tweaks)
  useEffectA(() => setView(layout), [layout]);

  const totalSets = exercises.reduce((n, e) => n + e.sets.length, 0);
  const doneSets = exercises.reduce((n, e) => n + e.sets.filter(s => s.done).length, 0);
  const totalVolume = exercises.reduce((v, e) => v + e.sets.filter(s => s.done).reduce((vv, s) => vv + (s.weight * s.reps), 0), 0);

  const logSet = (exIdx, setIdx, patch) => {
    setExercises(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const set = next[exIdx].sets[setIdx];
      Object.assign(set, patch, { done: true, current: false });
      // Set the next set as current
      const remaining = next[exIdx].sets.findIndex((s, i) => i > setIdx && !s.done);
      if (remaining !== -1) next[exIdx].sets[remaining].current = true;

      // Adaptive autoreg: if RPE > prescribed + 1, drop next set by 5%
      if (set.rpe && set.prescribed?.rpe && set.rpe > set.prescribed.rpe + 1) {
        const nextSet = next[exIdx].sets[remaining];
        if (nextSet) {
          const oldW = nextSet.weight;
          const newW = Math.round(oldW * 0.95 / 0.5) * 0.5;
          nextSet.weight = newW;
          nextSet.adjusted = { from: oldW, to: newW, reason: `RPE ${set.rpe} on a prescribed RPE ${set.prescribed.rpe} — dropping ${Math.round((1-0.95)*100)}%` };
          setAutoregNote({ exIdx, setIdx: remaining, from: oldW, to: newW, reason: nextSet.adjusted.reason });
          setTimeout(() => setAutoregNote(null), 6000);
        }
      }

      // Start rest timer (skip in log-past mode — user is logging after the fact)
      if (mode === 'live') {
        const restSec = next[exIdx].rest || 90;
        setRestTotal(restSec);
        setRestRemaining(restSec);
        setShowRest(true);
      }

      // If exercise complete, focus next
      const exDone = next[exIdx].sets.every(s => s.done);
      if (exDone) {
        const nextEx = next.findIndex((e, i) => i > exIdx && e.sets.some(s => !s.done));
        if (nextEx !== -1) setFocusedIdx(nextEx);
      }
      return next;
    });
  };

  const swapExercise = (exId, newName) => {
    setExercises(prev => prev.map(e => e.id === exId ? { ...e, name: newName, unavailable: false, swapped: true } : e));
    setShowSwap(null);
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60), ss = s % 60;
    return `${m}:${String(ss).padStart(2, '0')}`;
  };

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '8px 18px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onExit} className="btn btn-ghost" style={{ padding: 8, background: 'var(--bg-2)', borderRadius: 12, width: 40, height: 40 }}>
          <I.close style={{ width: 18, height: 18 }}/>
        </button>
        <div style={{ flex: 1 }}>
          <div className="t-xs">{mode === 'log-past' ? 'Log past workout' : 'Push · Heavy'}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginTop: 2 }}>
            <span className="t-mono" style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{mode === 'log-past' ? '—' : fmtTime(elapsed)}</span>
            <span className="t-sm">{doneSets}/{totalSets} sets · {Math.round(totalVolume).toLocaleString()} kg</span>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ padding: '6px 12px', background: 'var(--bg-2)', borderRadius: 12, fontSize: 13 }}>
          {mode === 'log-past' ? 'Save' : 'Finish'}
        </button>
      </div>

      {/* Top progress */}
      <div style={{ padding: '0 18px 14px' }}>
        <ProgressBar value={doneSets} max={totalSets} height={3}/>
      </div>

      {/* Exercise list */}
      <div className="hv-scroll" style={{ padding: '0 18px', paddingBottom: 140 }}>
        {exercises.map((ex, i) => (
          <ExerciseBlock
            key={ex.id}
            exercise={ex}
            index={i}
            focused={view === 'focus' ? i === focusedIdx : view === 'list' ? false : i === focusedIdx}
            forceCollapsed={view === 'focus' && i !== focusedIdx}
            forceExpanded={view === 'list'}
            onFocus={() => setFocusedIdx(i)}
            onLogSet={(setIdx, patch) => logSet(i, setIdx, patch)}
            onSwap={() => setShowSwap(ex.id)}
            onTechnique={() => setShowTech(ex.name)}
            autoregNote={autoregNote && autoregNote.exIdx === i ? autoregNote : null}
            onAutoregInfo={() => setAutoregOpen(true)}
          />
        ))}

        {/* Done CTA */}
        {doneSets === totalSets && (
          <div className="card-elev anim-up" style={{ padding: 22, textAlign: 'center', marginTop: 6 }}>
            <I.trophy style={{ width: 36, height: 36, color: 'var(--accent)' }}/>
            <div className="t-h2" style={{ marginTop: 10 }}>Workout complete</div>
            <div className="t-sm" style={{ marginTop: 4 }}>Tap Finish to log and contribute to your raid.</div>
          </div>
        )}
      </div>

      {/* Rest timer dock */}
      {showRest && (
        <RestTimer
          remaining={restRemaining}
          total={restTotal}
          onSkip={() => { setRestRemaining(0); setShowRest(false); }}
          onAdd={(d) => setRestRemaining(r => r + d)}
          onClose={() => setShowRest(false)}
        />
      )}

      {/* Swap sheet */}
      {showSwap && (
        <SwapSheet
          exercise={exercises.find(e => e.id === showSwap)}
          onClose={() => setShowSwap(null)}
          onPick={(name) => swapExercise(showSwap, name)}
        />
      )}

      {/* Autoreg explainer */}
      {autoregOpen && <AutoregSheet onClose={() => setAutoregOpen(false)}/>}

      {/* Technique sheet */}
      {showTech && <TechniqueSheet exerciseName={showTech} onClose={() => setShowTech(null)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Exercise block
// ─────────────────────────────────────────────────────────────
function ExerciseBlock({ exercise, index, focused, forceCollapsed, forceExpanded, onFocus, onLogSet, onSwap, onTechnique, autoregNote, onAutoregInfo }) {
  const ex = exercise;
  const expanded = forceExpanded || (focused && !forceCollapsed);
  const allDone = ex.sets.every(s => s.done);
  const doneCount = ex.sets.filter(s => s.done).length;

  return (
    <div style={{
      marginBottom: 10, borderRadius: 16,
      background: expanded ? 'var(--bg-2)' : 'transparent',
      border: '0.5px solid ' + (expanded ? 'var(--line-strong)' : 'var(--line)'),
      overflow: 'hidden',
      transition: 'background 0.18s ease, border-color 0.18s ease',
    }}>
      {/* Header */}
      <button onClick={onFocus} style={{
        width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: 'var(--bg-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'var(--fg-mute)',
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
        }}>{index + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="t-h3" style={{ fontSize: 15 }}>{ex.name}</span>
            {allDone && <I.check style={{ width: 14, height: 14, color: 'var(--ok)' }}/>}
            {ex.unavailable && <Chip style={{ background: 'rgba(245,181,74,0.12)', color: 'var(--warn)', fontSize: 10 }} icon={<I.warn style={{ width: 9, height: 9 }}/>}>Not in gym</Chip>}
            {ex.swapped && <Chip variant="acc" style={{ fontSize: 10 }}>Swapped</Chip>}
          </div>
          <div className="t-sm" style={{ marginTop: 3 }}>
            {ex.muscle} · {ex.equipment} · last {ex.lastSession.weight}kg×{ex.lastSession.reps} @{ex.lastSession.rpe}
          </div>
        </div>
        {/* Technique button */}
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); onTechnique && onTechnique(); }}
          style={{
            width: 26, height: 26, borderRadius: 7, background: 'var(--bg-3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--fg-mid)', flexShrink: 0, cursor: 'pointer',
          }}
          title="How to do this exercise"
        >
          <I.info style={{ width: 13, height: 13 }}/>
        </span>
        {/* Mini set dots */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
          {ex.sets.map((s, i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: 50,
              background: s.done ? SET_TYPE_COLOR[s.type] : 'var(--bg-4)',
              opacity: s.done ? 1 : 0.6,
            }}/>
          ))}
        </div>
      </button>

      {/* Sets table — only when expanded */}
      {expanded && (
        <div style={{ padding: '0 14px 14px' }} className="anim-up">
          {ex.unavailable && (
            <button onClick={(e) => { e.stopPropagation(); onSwap(); }} style={{
              width: '100%', padding: '10px 12px', marginBottom: 10, borderRadius: 12,
              background: 'rgba(245,181,74,0.08)', border: '0.5px dashed var(--warn)',
              color: 'var(--warn)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, fontWeight: 500, textAlign: 'left',
            }}>
              <I.swap style={{ width: 14, height: 14 }}/>
              <span style={{ flex: 1 }}>Cable not available at Powerhouse — tap to substitute</span>
              <I.arrow style={{ width: 12, height: 12 }}/>
            </button>
          )}

          {/* Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 64px 56px 56px 32px', gap: 8, padding: '2px 4px 8px', alignItems: 'center' }}>
            <span className="t-xs" style={{ fontSize: 10 }}>SET</span>
            <span className="t-xs" style={{ fontSize: 10 }}>PREVIOUS</span>
            <span className="t-xs" style={{ fontSize: 10, textAlign: 'right' }}>KG</span>
            <span className="t-xs" style={{ fontSize: 10, textAlign: 'center' }}>REPS</span>
            <span className="t-xs" style={{ fontSize: 10, textAlign: 'center' }}>RPE</span>
            <span/>
          </div>
          {ex.sets.map((s, i) => (
            <SetRow
              key={i}
              set={s}
              setIdx={i}
              setNumber={ex.sets.slice(0, i+1).filter(x => x.type !== 'warmup').length || (s.type === 'warmup' ? 'w' : 1)}
              isWarmup={s.type === 'warmup'}
              lastSession={ex.lastSession}
              onLog={(patch) => onLogSet(i, patch)}
              adjusted={s.adjusted}
              autoregActive={autoregNote && autoregNote.setIdx === i}
              onAutoregInfo={onAutoregInfo}
            />
          ))}

          {/* Add set */}
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 6, padding: 10, fontSize: 13, color: 'var(--fg-mute)' }}>
            <I.plus style={{ width: 13, height: 13 }}/> Add set
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Set row — editable, with adaptive autoreg display
// ─────────────────────────────────────────────────────────────
function SetRow({ set, setIdx, setNumber, isWarmup, lastSession, onLog, adjusted, autoregActive, onAutoregInfo }) {
  const [w, setW] = useStateA(set.weight);
  const [r, setR] = useStateA(set.reps);
  const [rpe, setRpe] = useStateA(set.rpe || set.prescribed?.rpe || 7);
  const [editing, setEditing] = useStateA(null);

  useEffectA(() => { setW(set.weight); }, [set.weight]);

  const isDone = set.done;
  const isCurrent = !isDone && set.current;
  const labelLetter = SET_TYPE_LABEL[set.type] || setNumber;

  return (
    <>
      {adjusted && autoregActive && (
        <div className="anim-up" style={{
          margin: '4px 0 6px', padding: '8px 10px', borderRadius: 10,
          background: 'var(--accent-soft)', border: '0.5px solid var(--accent)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <I.bolt style={{ width: 13, height: 13, color: 'var(--accent)', flexShrink: 0 }}/>
          <div style={{ flex: 1, fontSize: 12, color: 'var(--fg)' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Adaptive</span>{' '}
            <span style={{ textDecoration: 'line-through', color: 'var(--fg-mute)' }}>{adjusted.from} kg</span>{' → '}
            <span style={{ fontWeight: 600 }}>{adjusted.to} kg</span>
          </div>
          <button onClick={onAutoregInfo} style={{
            background: 'transparent', border: 'none', color: 'var(--accent)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>Why?</button>
        </div>
      )}
      <div style={{
        display: 'grid', gridTemplateColumns: '28px 1fr 64px 56px 56px 32px', gap: 8,
        padding: '8px 4px', alignItems: 'center',
        background: isCurrent ? 'var(--bg-3)' : 'transparent',
        borderRadius: 10,
        margin: isCurrent ? '0 -4px' : 0, paddingLeft: isCurrent ? 8 : 4, paddingRight: isCurrent ? 8 : 4,
        opacity: isDone ? 0.55 : 1,
        transition: 'opacity 0.2s ease, background 0.2s ease',
      }}>
        {/* Set label */}
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: isDone ? SET_TYPE_COLOR[set.type] : 'transparent',
          border: '1px solid ' + (isDone ? SET_TYPE_COLOR[set.type] : 'var(--bg-4)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDone ? 'var(--accent-fg)' : SET_TYPE_COLOR[set.type] || 'var(--fg-mute)',
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
        }}>{labelLetter || (set.type === 'warmup' ? 'W' : setNumber)}</div>

        {/* Previous */}
        <div className="t-mono" style={{ fontSize: 12, color: 'var(--fg-mute)' }}>
          {lastSession.weight}×{lastSession.reps}
        </div>

        {/* Weight */}
        <Cell value={w} onChange={setW} suffix="" align="right" editing={editing === 'w'} onFocus={() => !isDone && setEditing('w')} onBlur={() => setEditing(null)} disabled={isDone}/>

        {/* Reps */}
        <Cell value={r} onChange={setR} align="center" editing={editing === 'r'} onFocus={() => !isDone && setEditing('r')} onBlur={() => setEditing(null)} disabled={isDone}/>

        {/* RPE */}
        <Cell value={rpe} onChange={setRpe} align="center" editing={editing === 'rpe'} onFocus={() => !isDone && setEditing('rpe')} onBlur={() => setEditing(null)} disabled={isDone} accent/>

        {/* Log */}
        <button
          disabled={isDone}
          onClick={() => onLog({ weight: w, reps: r, rpe })}
          style={{
            width: 28, height: 28, borderRadius: 8, padding: 0,
            background: isDone ? 'transparent' : (isCurrent ? 'var(--accent)' : 'var(--bg-3)'),
            border: 'none', color: isDone ? 'var(--ok)' : (isCurrent ? 'var(--accent-fg)' : 'var(--fg-mute)'),
            cursor: isDone ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <I.check style={{ width: 15, height: 15, strokeWidth: 2.4 }}/>
        </button>
      </div>
    </>
  );
}

function Cell({ value, onChange, align = 'left', editing, onFocus, onBlur, disabled, accent }) {
  return (
    <button
      onClick={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      style={{
        background: editing ? 'var(--accent-soft)' : 'var(--bg-3)',
        border: '1px solid ' + (editing ? 'var(--accent)' : 'transparent'),
        borderRadius: 8, padding: '6px 8px',
        color: accent && !disabled ? 'var(--accent)' : 'var(--fg)',
        fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500,
        textAlign: align, cursor: disabled ? 'default' : 'pointer',
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease',
      }}>
      {value}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Rest timer (filling bar floats above tab bar)
// ─────────────────────────────────────────────────────────────
function RestTimer({ remaining, total, onSkip, onAdd, onClose }) {
  const [expanded, setExpanded] = useStateA(false);
  const pct = total > 0 ? remaining / total : 0;
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const overdue = remaining === 0;

  return (
    <>
      {/* Compact dock */}
      <div className="anim-up" style={{
        position: 'absolute', left: 12, right: 12, bottom: 12,
        zIndex: 25,
        borderRadius: 16, overflow: 'hidden',
        background: 'rgba(20,20,28,0.92)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '0.5px solid var(--line-strong)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      }}>
        {/* fill bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct * 100}%`,
          background: overdue ? 'var(--ok)' : 'var(--accent-soft)',
          transition: 'width 0.95s linear',
        }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12 }}>
          <I.timer style={{ width: 18, height: 18, color: 'var(--accent)' }}/>
          <div style={{ flex: 1 }}>
            <div className="t-xs" style={{ color: 'var(--fg-mid)' }}>{overdue ? 'HR recovered — ready' : 'Rest'}</div>
            <div className="t-mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 2 }}>
              {String(mm).padStart(1,'0')}:{String(ss).padStart(2,'0')}
            </div>
          </div>
          <button onClick={() => onAdd(15)} style={{
            padding: '6px 10px', borderRadius: 10, background: 'var(--bg-3)',
            border: '0.5px solid var(--line)', color: 'var(--fg-mid)',
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}>+15s</button>
          <button onClick={onSkip} style={{
            padding: '6px 12px', borderRadius: 10, background: 'var(--accent)',
            border: 'none', color: 'var(--accent-fg)',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>Skip</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Swap sheet
// ─────────────────────────────────────────────────────────────
function SwapSheet({ exercise, onClose, onPick }) {
  return (
    <Sheet onClose={onClose} title="Substitute exercise" subtitle={exercise.name + ' isn\'t at Powerhouse'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exercise.swapSuggestions.map((name, i) => (
          <button key={name} onClick={() => onPick(name)} style={{
            width: '100%', padding: 14, borderRadius: 12,
            background: 'var(--bg-3)', border: '0.5px solid var(--line)',
            color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: 'var(--bg-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
            }}>
              <I.swap style={{ width: 16, height: 16 }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-h3" style={{ fontSize: 14 }}>{name}</div>
              <div className="t-sm" style={{ marginTop: 2 }}>Same muscles · {i === 0 ? 'closest match' : 'similar volume'}</div>
            </div>
            {i === 0 && <Chip variant="acc">Best</Chip>}
          </button>
        ))}
      </div>
      <div className="t-sm" style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg-3)', borderRadius: 10, color: 'var(--fg-mid)' }}>
        <I.info style={{ width: 13, height: 13, verticalAlign: -2, marginRight: 4, color: 'var(--accent)' }}/>
        Hivo knows your gym's equipment. Update it in Profile → Gyms.
      </div>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────
// Technique sheet (video placeholder + cues)
// ─────────────────────────────────────────────────────────────
const HIVO_TECH_PREF_KEY = 'hivo-technique-pref';
function TechniqueSheet({ exerciseName, onClose }) {
  const tech = TECHNIQUE[exerciseName] || TECHNIQUE.default;
  const [muted, setMuted] = useStateA(true);
  const [autoShow, setAutoShow] = useStateA(() => {
    try { return localStorage.getItem(HIVO_TECH_PREF_KEY) !== 'off'; } catch (e) { return true; }
  });
  const togglePref = () => {
    const next = !autoShow;
    setAutoShow(next);
    try { localStorage.setItem(HIVO_TECH_PREF_KEY, next ? 'on' : 'off'); } catch (e) {}
  };
  return (
    <Sheet onClose={onClose} title="How to do this" subtitle={exerciseName}>
      {/* Video placeholder */}
      <div style={{
        position: 'relative', aspectRatio: '16 / 9', borderRadius: 14, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a24, #08080a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '0.5px solid var(--line-strong)',
      }}>
        {/* Subtle moving stripes */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 12px, transparent 12px 24px)',
        }}/>
        {/* Play */}
        <div style={{
          width: 60, height: 60, borderRadius: 50,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-fg)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          <I.play style={{ width: 24, height: 24, marginLeft: 3 }}/>
        </div>
        {/* Caption */}
        <div style={{
          position: 'absolute', left: 12, bottom: 10, fontSize: 11,
          color: 'var(--fg-mid)', fontFamily: 'var(--font-mono)',
        }}>HD · 0:42 · slow-mo & cues</div>
        <button onClick={() => setMuted(m => !m)} style={{
          position: 'absolute', right: 10, bottom: 10,
          width: 32, height: 32, borderRadius: 50,
          background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
          color: 'var(--fg-mid)', fontSize: 14,
        }}>{muted ? '🔇' : '🔊'}</button>
      </div>

      {/* Cues */}
      <div style={{ marginTop: 14 }}>
        <div className="t-xs" style={{ marginBottom: 8 }}>Key cues</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tech.cues.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 50, background: 'var(--accent-soft)',
                color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                fontFamily: 'var(--font-mono)',
              }}>{i+1}</div>
              <span className="t-sm" style={{ color: 'var(--fg)', fontSize: 13, lineHeight: 1.45 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistake */}
      <div style={{
        marginTop: 14, padding: 12, borderRadius: 12,
        background: 'rgba(245,181,74,0.08)', border: '0.5px solid rgba(245,181,74,0.3)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <I.warn style={{ width: 14, height: 14, color: 'var(--warn)', flexShrink: 0, marginTop: 2 }}/>
        <div style={{ flex: 1 }}>
          <div className="t-xs" style={{ color: 'var(--warn)', marginBottom: 4 }}>Common mistake</div>
          <span className="t-sm" style={{ fontSize: 12.5, lineHeight: 1.45 }}>{tech.common}</span>
        </div>
      </div>

      {/* Beginner sets */}
      <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: 'var(--bg-3)' }}>
        <div className="t-xs" style={{ marginBottom: 4 }}>Beginner protocol</div>
        <span className="t-sm" style={{ fontSize: 12.5 }}>{tech.sets}</span>
      </div>

      {/* Preference toggle */}
      <div style={{
        marginTop: 14, padding: '12px 14px', borderRadius: 12,
        background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div className="t-h3" style={{ fontSize: 13 }}>Show technique automatically</div>
          <div className="t-xs" style={{ marginTop: 3, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
            Before each new exercise during a workout
          </div>
        </div>
        <button onClick={togglePref} style={{
          width: 44, height: 26, borderRadius: 50, padding: 2,
          background: autoShow ? 'var(--accent)' : 'var(--bg-4)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 50, background: '#fff',
            transform: `translateX(${autoShow ? 18 : 0}px)`,
            transition: 'transform 0.2s',
          }}/>
        </button>
      </div>
    </Sheet>
  );
}

function AutoregSheet({ onClose }) {
  return (
    <Sheet onClose={onClose} title="Adaptive autoregulation" subtitle="Why we adjusted your weight">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Row label="Logged RPE" value="9" sub="Prescribed RPE 7"/>
        <Row label="Sleep last night" value="7.2h" sub="Normal range"/>
        <Row label="HRV this morning" value="62 ms" sub="−8 ms vs 7-day avg"/>
        <div style={{ padding: 14, borderRadius: 12, background: 'var(--accent-soft)', border: '0.5px solid var(--accent)' }}>
          <div className="t-xs" style={{ color: 'var(--accent)' }}>RECOMMENDATION</div>
          <div className="t-h3" style={{ marginTop: 6 }}>Reduce next set by 5%</div>
          <div className="t-sm" style={{ marginTop: 6 }}>
            You came in hot. Pulling intensity back keeps fatigue manageable so the rest of the session — and tomorrow — stay productive.
          </div>
        </div>
        <button className="btn btn-block" style={{ background: 'var(--bg-3)' }}>Disable for this exercise</button>
      </div>
    </Sheet>
  );
}

function Row({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <div className="t-sm" style={{ color: 'var(--fg)' }}>{label}</div>
        <div className="t-xs" style={{ marginTop: 2 }}>{sub}</div>
      </div>
      <div className="t-mono" style={{ fontSize: 17, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet
// ─────────────────────────────────────────────────────────────
function Sheet({ children, onClose, title, subtitle }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease', WebkitBackdropFilter: 'blur(4px)',
      }}/>
      <div className="anim-up" style={{
        position: 'relative', width: '100%',
        background: 'var(--bg-2)', borderRadius: '20px 20px 0 0',
        padding: 18, paddingBottom: 28,
        borderTop: '0.5px solid var(--line-strong)',
        maxHeight: '80%', overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--bg-4)' }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div className="t-h2">{title}</div>
            {subtitle && <div className="t-sm" style={{ marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 50, background: 'var(--bg-3)',
            border: 'none', color: 'var(--fg-mid)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><I.close style={{ width: 14, height: 14 }}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { ActiveWorkout, Sheet, TechniqueSheet });
