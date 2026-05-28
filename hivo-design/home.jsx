// home.jsx — Today / Home screen
const { useState: useStateH, useEffect: useEffectH } = React;

function RecoveryDial({ score = 78, hrv = 62, sleep = 7.2, soreness = 'low' }) {
  // Three concentric ticks around the ring indicating component health
  const r1 = score / 100;
  // map: HRV good if >55, sleep good if >7, soreness depends on string
  const sleepNorm = Math.min(1, sleep / 9);
  const hrvNorm = Math.min(1, hrv / 100);
  const sorenessNorm = soreness === 'low' ? 0.9 : soreness === 'mid' ? 0.55 : 0.3;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <Ring size={104} value={r1} stroke={9} color="var(--accent)" track="var(--bg-3)">
        <div className="t-mono" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.04em' }}>{score}</div>
        <div className="t-xs" style={{ marginTop: -2, color: 'var(--fg-mute)' }}>READY</div>
      </Ring>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <RecoveryRow label="HRV" value={`${hrv} ms`} norm={hrvNorm} />
        <RecoveryRow label="Sleep" value={`${sleep} h`} norm={sleepNorm} />
        <RecoveryRow label="Soreness" value={soreness} norm={sorenessNorm} />
      </div>
    </div>
  );
}

function RecoveryRow({ label, value, norm }) {
  const col = norm > 0.7 ? 'var(--ok)' : norm > 0.45 ? 'var(--warn)' : 'var(--err)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1 }}>
        <div className="t-xs">{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{ flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${norm * 100}%`, height: '100%', background: col, borderRadius: 999 }} />
          </div>
          <span className="t-mono" style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-mid)', minWidth: 42, textAlign: 'right' }}>{value}</span>
        </div>
      </div>
    </div>
  );
}

function WeekStrip({ onPickDay, selectedIdx }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 18px' }}>
      {WEEK.map((d, i) => {
        const isToday = d.status === 'today';
        const isDone = d.status === 'done';
        const isSel = selectedIdx === i;
        return (
          <button key={i} onClick={() => onPickDay && onPickDay(i)} style={{
            flex: 1, padding: '10px 4px 8px', borderRadius: 14,
            background: isSel ? 'var(--accent)' : isToday ? 'var(--accent-soft)' : 'var(--bg-2)',
            border: '0.5px solid ' + (isSel ? 'var(--accent)' : isToday ? 'var(--accent)' : 'var(--line)'),
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            color: 'inherit', cursor: 'pointer',
            transition: 'background 0.18s ease, border-color 0.18s ease',
          }}>
            <div className="t-xs" style={{ color: isSel ? 'var(--accent-fg)' : isToday ? 'var(--accent)' : undefined }}>{d.day}</div>
            <div className="t-mono" style={{ fontSize: 15, fontWeight: 600, color: isSel ? 'var(--accent-fg)' : isToday ? 'var(--accent)' : 'var(--fg)' }}>{d.date}</div>
            <div style={{
              width: 5, height: 5, borderRadius: 50,
              background: isSel ? 'var(--accent-fg)' : isDone ? 'var(--ok)' : isToday ? 'var(--accent)' : d.status === 'rest' ? 'var(--fg-dim)' : 'var(--bg-4)',
              opacity: isSel ? 0.7 : 1,
            }} />
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Day Detail — shown when a non-today day is selected
// ─────────────────────────────────────────────────────────────
const DAY_FULL = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', F: 'Friday', S: 'Saturday' };
const MONTH = 'March';

function DayDetail({ day, onBackToToday, onStart }) {
  const isPast = day.status === 'done' || (day.status === 'rest' && day.date < 23);
  const isRest = day.status === 'rest';
  const isPlanned = day.status === 'planned';
  const idx = WEEK.findIndex(d => d.date === day.date);
  const fullName = (() => {
    const names = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return names[idx] || 'Day';
  })();

  return (
    <div className="screen-in">
      {/* Back banner */}
      <div style={{ padding: '0 18px 12px' }}>
        <button onClick={onBackToToday} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 8px', borderRadius: 999,
          background: 'var(--bg-2)', border: '0.5px solid var(--line)',
          color: 'var(--fg-mid)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <I.back style={{ width: 13, height: 13 }}/> Back to today
        </button>
      </div>

      {/* Header */}
      <div style={{ padding: '0 18px 16px' }}>
        <div className="t-xs" style={{ color: isPast ? 'var(--fg-mute)' : isPlanned ? 'var(--accent)' : 'var(--fg-mute)' }}>
          {isPast ? 'Logged' : isPlanned ? 'Planned' : ''}
        </div>
        <div className="t-h1" style={{ marginTop: 4 }}>{fullName} {day.date}</div>
        <div className="t-sm" style={{ marginTop: 4 }}>{day.label}</div>
      </div>

      {/* Body */}
      {isRest ? (
        <RestDayCard isPast={isPast}/>
      ) : isPast && day.summary ? (
        <PastWorkoutDetail summary={day.summary} label={day.label}/>
      ) : isPlanned && day.plan ? (
        <PlannedWorkoutDetail plan={day.plan} label={day.label} onStart={onStart}/>
      ) : (
        <RestDayCard isPast={false}/>
      )}

      {/* Week strip stays at bottom for quick jump */}
      <div style={{ marginTop: 24 }}>
        <div style={{ padding: '0 18px 10px' }}>
          <span className="t-xs">Jump to day</span>
        </div>
        <WeekStrip selectedIdx={idx} onPickDay={(i) => {
          if (WEEK[i].status === 'today') onBackToToday();
          // else parent handles via prop callback (see HomeScreen)
        }}/>
      </div>
    </div>
  );
}

function PastWorkoutDetail({ summary, label }) {
  return (
    <>
      <div style={{ padding: '0 18px' }}>
        <div className="card-elev" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="t-h2">{label}</div>
              <div className="t-sm" style={{ marginTop: 4 }}>Completed in {summary.duration}</div>
            </div>
            {summary.pr && <Chip variant="acc">PR</Chip>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 18, padding: '14px 0', borderTop: '0.5px solid var(--line)', borderBottom: '0.5px solid var(--line)' }}>
            <Stat label="Volume" value={`${(summary.volume/1000).toFixed(1)}k`}/>
            <Stat label="Sets" value={summary.sets}/>
            <Stat label="Avg RPE" value={summary.avgRpe}/>
          </div>

          {summary.pr && (
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <I.trophy style={{ width: 16, height: 16, color: 'var(--accent)' }}/>
              <span className="t-sm" style={{ color: 'var(--fg)' }}>{summary.pr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Exercises logged */}
      <div style={{ padding: '18px 18px 0' }}>
        <div className="t-xs" style={{ marginBottom: 10 }}>Exercises</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {summary.exercises.map((ex, i, a) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderBottom: i < a.length - 1 ? '0.5px solid var(--line)' : 'none',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, background: 'var(--bg-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg-mute)', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
              }}>{i+1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-h3" style={{ fontSize: 14 }}>{ex.name}</div>
                <div className="t-sm" style={{ marginTop: 2, fontSize: 12 }}>{ex.sets} · top {ex.top}</div>
              </div>
              {ex.top.includes('PR') && <Chip variant="acc" style={{ fontSize: 10 }}>PR</Chip>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button className="btn" style={{ background: 'var(--bg-2)' }}>
          <I.swap style={{ width: 15, height: 15 }}/> Repeat
        </button>
        <button className="btn btn-ghost" style={{ background: 'var(--bg-2)' }}>
          Share
        </button>
      </div>
    </>
  );
}

function PlannedWorkoutDetail({ plan, label, onStart }) {
  return (
    <>
      <div style={{ padding: '0 18px' }}>
        <div className="card-elev" style={{ padding: 18 }}>
          <Chip variant="acc">Planned</Chip>
          <div className="t-h2" style={{ marginTop: 10 }}>{label}</div>
          <div className="t-sm" style={{ marginTop: 4 }}>{plan.duration} · {plan.sets} sets</div>

          <div className="divider"/>

          <div className="t-xs" style={{ marginBottom: 10 }}>Exercises</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.exercises.map((ex, i) => (
              <div key={ex} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="t-mono" style={{ fontSize: 12, color: 'var(--fg-mute)', minWidth: 18 }}>{i+1}</span>
                <span className="t-sm" style={{ color: 'var(--fg)' }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 18px 0' }}>
        <button className="btn btn-block" style={{ background: 'var(--bg-2)', color: 'var(--fg-mid)' }}>
          <I.swap style={{ width: 15, height: 15 }}/> Reschedule
        </button>
      </div>
    </>
  );
}

function RestDayCard({ isPast }) {
  return (
    <div style={{ padding: '0 18px' }}>
      <div className="card" style={{ padding: 22, textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 50, background: 'var(--bg-3)',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--fg-mute)',
        }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12c-.8 4-4.4 7-8.5 7C7 19 3 15 3 10c2.5 0 7-1 9-6.5C13 7 16 10 20 12z"/>
          </svg>
        </div>
        <div className="t-h2" style={{ marginTop: 14 }}>{isPast ? 'Rest day' : 'Scheduled rest'}</div>
        <div className="t-sm" style={{ marginTop: 6, maxWidth: 240, margin: '6px auto 0' }}>
          {isPast ? 'No workout logged. Recovery is part of the program.' : 'No workout planned. Recovery preserves adaptation.'}
        </div>
      </div>
    </div>
  );
}

function StreakSpiral({ days = 47, shields = 3 }) {
  // Spiral SVG built from a path; ring count grows with days
  const turns = Math.min(6, Math.floor(days / 10) + 2);
  const size = 76;
  const cx = size / 2, cy = size / 2;
  const path = [];
  // Archimedean spiral
  const points = 80;
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * turns * Math.PI * 2;
    const r = (i / points) * (size / 2 - 4);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    path.push((i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2));
  }
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="spiral-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="var(--accent)"/>
            </linearGradient>
          </defs>
          <path d={path.join(' ')} fill="none" stroke="url(#spiral-g)" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        {/* orbiting shield dots */}
        {Array.from({ length: shields }).map((_, i) => {
          const a = (i / Math.max(shields,1)) * Math.PI * 2 - Math.PI / 2;
          const x = cx + (size/2 - 2) * Math.cos(a);
          const y = cy + (size/2 - 2) * Math.sin(a);
          return (
            <div key={i} style={{
              position: 'absolute', left: x - 8, top: y - 8,
              width: 16, height: 16, borderRadius: 50,
              background: 'var(--bg-3)', border: '0.5px solid var(--line-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <I.shield style={{ width: 9, height: 9 }}/>
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="t-mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.03em' }}>
            <Counter to={days}/>
          </span>
          <span className="t-sm">day streak</span>
        </div>
        <div className="t-sm" style={{ marginTop: 2 }}>
          {shields} <span className="fg-mute">shield{shields !== 1 ? 's' : ''} stored — auto-uses when you miss</span>
        </div>
      </div>
    </div>
  );
}

function TodayHero({ onStart, onTab, myWorkouts = [], myRoutines = [] }) {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = DAY_NAMES[new Date().getDay()];
  const activeWorkout = myWorkouts.find(w => w.current);

  // No active program
  if (!activeWorkout) {
    return (
      <div className="card-elev" style={{
        margin: '0 18px', padding: 18, position: 'relative', overflow: 'hidden',
        borderStyle: 'dashed',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'var(--bg-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', flexShrink: 0,
          }}>
            <I.dumb style={{ width: 22, height: 22 }}/>
          </div>
          <div style={{ flex: 1 }}>
            <Chip>No active program</Chip>
            <div className="t-h2" style={{ marginTop: 8, fontSize: 22 }}>Pick a workout</div>
          </div>
        </div>
        <div className="t-sm" style={{ marginTop: 4 }}>
          Set one of your saved workouts as active and your daily plan shows up here.
        </div>
        <button onClick={() => onTab && onTab('train')} className="btn btn-primary btn-block" style={{ marginTop: 14 }}>
          <I.arrow style={{ width: 14, height: 14 }}/> Go to Train
        </button>
      </div>
    );
  }

  // Find today's slot in the active workout
  const todaySlot = (activeWorkout.days || []).find(d => d.day === today);
  const isRest = todaySlot && (!todaySlot.routineId || /rest/i.test(todaySlot.name));
  const routine = todaySlot && todaySlot.routineId
    ? [...ROUTINES.trending, ...myRoutines].find(r => r.id === todaySlot.routineId)
    : null;

  // Today is a rest day
  if (todaySlot && isRest) {
    return (
      <div className="card-elev" style={{
        margin: '0 18px', padding: 18, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Chip>{activeWorkout.name}</Chip>
          <span className="t-xs">{today.toUpperCase()}</span>
        </div>
        <div className="t-h1" style={{ fontSize: 28, marginTop: 10 }}>Rest day</div>
        <div className="t-sm" style={{ marginTop: 6, lineHeight: 1.45 }}>
          Recovery is part of the program. Mobility or a walk is great.
        </div>
      </div>
    );
  }

  // Today isn't in the program at all (e.g. PPL but today is Sunday and Sunday isn't scheduled)
  if (!todaySlot) {
    return (
      <div className="card-elev" style={{
        margin: '0 18px', padding: 18, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Chip>{activeWorkout.name}</Chip>
          <span className="t-xs">{today.toUpperCase()}</span>
        </div>
        <div className="t-h1" style={{ fontSize: 28, marginTop: 10 }}>Off day</div>
        <div className="t-sm" style={{ marginTop: 6, lineHeight: 1.45 }}>
          {today} isn't part of {activeWorkout.name}. Take it easy or train ad-hoc.
        </div>
        <button onClick={onStart} className="btn btn-block" style={{ marginTop: 14, background: 'var(--bg-3)' }}>
          <I.bolt style={{ width: 14, height: 14, color: 'var(--accent)' }}/> Quick workout
        </button>
      </div>
    );
  }

  // Has a routine for today
  const exerciseCount = routine ? routine.exercises.length : 0;
  const totalSets = routine ? routine.exercises.reduce((n, e) => n + (e.sets || 0), 0) : 0;
  const estMin = routine ? Math.round(routine.exercises.reduce((m, e) => m + (e.sets || 0) * ((e.rest || 90) / 60 + 1), 0)) : 0;
  const muscles = routine ? Array.from(new Set(routine.tags || [])).slice(0, 3) : [];

  return (
    <div className="card-elev" style={{
      margin: '0 18px', padding: 0, overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(135deg, var(--bg-3) 0%, var(--bg-2) 60%)',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 180, height: 180,
        borderRadius: '50%', background: 'var(--accent)', opacity: 0.15, filter: 'blur(40px)',
      }} />
      <div style={{ position: 'relative', padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip variant="acc" icon={<I.bolt style={{ width: 11, height: 11 }}/>}>
            {activeWorkout.name} · {today}
          </Chip>
          <span className="t-xs">{estMin || 60} min</span>
        </div>
        <div className="t-h1" style={{ marginTop: 14, fontSize: 28 }}>{todaySlot.name}</div>
        {routine && (
          <div className="t-sm" style={{ marginTop: 6, lineHeight: 1.45 }}>
            {routine.description || `${exerciseCount} exercises planned from your active program.`}
          </div>
        )}

        <div style={{ display: 'flex', gap: 18, marginTop: 16, padding: '12px 0', borderTop: '0.5px solid var(--line)', borderBottom: '0.5px solid var(--line)' }}>
          <Stat label="Exercises" value={exerciseCount || '—'}/>
          <Stat label="Sets" value={totalSets || '—'}/>
          <Stat label="Level" value={(activeWorkout.level || '—').slice(0,3)}/>
        </div>

        {muscles.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {muscles.map(m => <Chip key={m}>{m}</Chip>)}
          </div>
        )}

        <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={onStart}>
          <I.play style={{ width: 16, height: 16 }}/> Start workout
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="t-xs" style={{ marginBottom: 4 }}>{label}</div>
      <div className="t-mono" style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function ClanStrip({ clan, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      display: 'flex', width: '100%', alignItems: 'center', gap: 12,
      padding: 14, background: 'var(--bg-2)', border: '0.5px solid var(--line)',
      borderRadius: 14, color: 'inherit', cursor: 'pointer', textAlign: 'left',
    }}>
      display: 'flex', width: '100%', alignItems: 'center', gap: 12,
      padding: 14, background: 'var(--bg-2)', border: '0.5px solid var(--line)',
      borderRadius: 14, color: 'inherit', cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
        <Ring size={44} value={clan.rankProgress} stroke={3} color="var(--accent)">
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>{clan.tag.slice(0,3)}</div>
        </Ring>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="t-h3">{clan.name}</span>
          <Chip>{clan.rank}</Chip>
        </div>
        <div className="t-sm" style={{ marginTop: 3 }}>
          <span className="fg-acc">{clan.raid.name}</span> · {Math.round(clan.raid.current / clan.raid.target * 100)}% · {clan.raid.daysLeft}d left
        </div>
      </div>
      <I.arrow style={{ width: 18, height: 18, color: 'var(--fg-mute)' }}/>
    </button>
  );
}

function JoinClanStrip({ onOpen }) {
  return (
    <button onClick={onOpen} className="hover-lift" style={{
      display: 'flex', width: '100%', alignItems: 'center', gap: 12,
      padding: 14, background: 'var(--bg-2)',
      border: '0.5px dashed var(--line-strong)',
      borderRadius: 14, color: 'inherit', cursor: 'pointer', textAlign: 'left',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'var(--accent)', opacity: 0.08, filter: 'blur(28px)', pointerEvents: 'none' }}/>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--accent-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)', flexShrink: 0,
        position: 'relative',
      }}>
        <I.squad style={{ width: 22, height: 22 }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="t-h3">Clan</span>
          <Chip variant="acc" style={{ fontSize: 10 }}>Optional</Chip>
        </div>
        <div className="t-sm" style={{ marginTop: 3, fontSize: 12 }}>
          Find a clan, create your own, or train solo.
        </div>
      </div>
      <I.arrow style={{ width: 18, height: 18, color: 'var(--fg-mute)', flexShrink: 0, position: 'relative' }}/>
    </button>
  );
}

function HomeScreen({ onStart, onTab, gamification = true, authedUser, userClan, myWorkouts, myRoutines }) {
  const todayIdx = WEEK.findIndex(d => d.status === 'today');
  const [selectedIdx, setSelectedIdx] = useStateH(todayIdx);
  const [notifsOpen, setNotifsOpen] = useStateH(false);
  const [warmupOpen, setWarmupOpen] = useStateH(null);
  const displayName = (authedUser && authedUser.name) || USER.name;
  const firstName = displayName.split(' ')[0];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 18) return 'Afternoon';
    return 'Evening';
  })();

  // If a non-today day is selected, render DayDetail instead of the today view
  if (selectedIdx !== todayIdx) {
    const day = WEEK[selectedIdx];
    // For the WeekStrip jump-to-day inside DayDetail, we need to pass through
    // a setter that also resets to today when 'today' is picked. We accomplish
    // that by rendering a wrapper around DayDetail.
    return (
      <div className="screen-in">
        {/* topbar still useful */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={displayName} size={36} color="linear-gradient(135deg, var(--accent), var(--accent-deep))"/>
            <div>
              <div className="t-xs">History</div>
              <div className="t-h3" style={{ marginTop: 1 }}>{firstName}</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ width: 40, height: 40, padding: 0, background: 'var(--bg-2)', border: '0.5px solid var(--line)', position: 'relative' }} onClick={() => setSelectedIdx(todayIdx)}>
            <I.close style={{ width: 16, height: 16, color: 'var(--fg-mid)' }}/>
          </button>
        </div>
        <DayDetailWrapper day={day} onBackToToday={() => setSelectedIdx(todayIdx)} onJump={setSelectedIdx} todayIdx={todayIdx} onStart={onStart}/>
      </div>
    );
  }

  return (
    <div className="screen-in" style={{ paddingBottom: 24 }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={displayName} size={36} color="linear-gradient(135deg, var(--accent), var(--accent-deep))"/>
          <div>
            <div className="t-xs">{greeting}</div>
            <div className="t-h3" style={{ marginTop: 1 }}>{firstName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setNotifsOpen(true)} className="btn btn-ghost" style={{ width: 40, height: 40, padding: 0, background: 'var(--bg-2)', border: '0.5px solid var(--line)', position: 'relative' }}>
            <I.bell className="bell-ring" style={{ width: 18, height: 18, color: 'var(--fg-mid)' }}/>
            <span className="glow-pulse" style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 50, background: 'var(--accent)' }}/>
          </button>
        </div>
      </div>

      {/* Today's workout */}
      <Reveal style={{ marginTop: 4 }}>
        <TodayHero onStart={onStart} onTab={onTab} myWorkouts={myWorkouts} myRoutines={myRoutines}/>
      </Reveal>

      {/* Warmup mobility carousel */}
      <Reveal delay={80} style={{ padding: '14px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="t-xs">Warm up first</span>
          <span className="t-sm fg-mute" style={{ fontSize: 11 }}>5–10 min</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginLeft: -2, marginRight: -18 }} className="hv-scroll h-snap">
          {WARMUPS.map(w => (
            <WarmupCard key={w.id} warmup={w} onOpen={() => setWarmupOpen(w)}/>
          ))}
        </div>
      </Reveal>

      {/* Week strip */}
      <Reveal style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 18px 10px' }}>
          <span className="t-xs">This week</span>
          <span className="t-sm fg-mute">4/5 logged</span>
        </div>
        <WeekStrip selectedIdx={selectedIdx} onPickDay={setSelectedIdx}/>
      </Reveal>

      {/* Streak */}
      {gamification && (
        <Reveal delay={60} style={{ padding: '14px 18px 0' }}>
          <StreakSpiral days={USER.streak} shields={USER.shields}/>
        </Reveal>
      )}

      {/* Clan strip / Join CTA */}
      {gamification && (
        <Reveal delay={120} style={{ padding: '14px 18px 0' }}>
          {userClan ? (
            <ClanStrip clan={userClan} onOpen={() => onTab && onTab('squad')}/>
          ) : (
            <JoinClanStrip onOpen={() => onTab && onTab('squad')}/>
          )}
        </Reveal>
      )}

      {/* Feed preview — only when in a clan */}
      {userClan && (
        <Reveal style={{ padding: '22px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span className="t-xs">From your clan</span>
          <span className="t-sm fg-mute">See all</span>
        </div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FEED.slice(0,2).map(f => (
            <div key={f.id} className="card hover-lift" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <Avatar name={f.who} size={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-sm" style={{ color: 'var(--fg)' }}>
                  <strong style={{ fontWeight: 600 }}>{f.who}</strong>{' '}
                  <span className="fg-mute">{f.action}</span>
                </div>
                <div className="t-xs" style={{ marginTop: 2, color: 'var(--fg-mid)', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>{f.detail}</div>
              </div>
              {f.badge && <Chip variant="acc">{f.badge}</Chip>}
              {f.alert && <Chip style={{ background: 'rgba(245,181,74,0.15)', color: 'var(--warn)' }}>Rescue</Chip>}
            </div>
          ))}
        </div>
      </Reveal>
      )}

      {notifsOpen && <NotificationsSheet onClose={() => setNotifsOpen(false)}/>}
      {warmupOpen && <WarmupSheet warmup={warmupOpen} onClose={() => setWarmupOpen(null)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Warmup card + sheet (short mobility routines per target area)
// ─────────────────────────────────────────────────────────────
const WARMUP_ICONS = {
  Shoulders: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4a3 3 0 100 6 3 3 0 000-6z"/><path d="M5 13c1.5-2 4-3 7-3s5.5 1 7 3M5 13v6M19 13v6"/></svg>,
  Chest:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 8c2-2 5-3 8-3s6 1 8 3M4 8v4c0 4 3.5 7 8 7s8-3 8-7V8M9 12h6"/></svg>,
  Back:      (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2v20M7 6l5-4 5 4M7 18l5 4 5-4M5 12h14"/></svg>,
  Legs:      (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 4v8l-1 8M15 4v8l1 8M9 4h6M8 20h2M14 20h2"/></svg>,
  'Full body': (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="2.5"/><path d="M9 22l1-9-2-4 4-2 4 2-2 4 1 9M7 11l-2 2M17 11l2 2"/></svg>,
};

function WarmupCard({ warmup, onOpen }) {
  const Icon = WARMUP_ICONS[warmup.target] || WARMUP_ICONS['Full body'];
  return (
    <button onClick={onOpen} className="hover-lift" style={{
      flexShrink: 0, padding: 12, borderRadius: 14,
      background: 'var(--bg-2)', border: '0.5px solid var(--line)',
      display: 'flex', flexDirection: 'column', gap: 8, color: 'inherit',
      cursor: 'pointer', textAlign: 'left', minWidth: 150, width: 150,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'var(--accent-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)',
        }}>
          <Icon style={{ width: 16, height: 16 }}/>
        </div>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{warmup.duration}m</span>
      </div>
      <div>
        <span className="t-xs" style={{ color: 'var(--accent)', fontSize: 10 }}>{warmup.target.toUpperCase()}</span>
        <div className="t-h3" style={{ fontSize: 13, marginTop: 2 }}>{warmup.name}</div>
      </div>
      <div className="t-sm" style={{ fontSize: 11, lineHeight: 1.35, color: 'var(--fg-mid)' }}>
        {warmup.exercises.length} exercises
      </div>
    </button>
  );
}

function WarmupSheet({ warmup, onClose }) {
  const [activeIdx, setActiveIdx] = useStateH(0);
  const active = warmup.exercises[activeIdx];

  return (
    <Sheet onClose={onClose} title={warmup.name} subtitle={`${warmup.target} · ${warmup.duration} min · ${warmup.cue}`}>
      {/* Video preview for the selected exercise */}
      <div style={{
        position: 'relative', aspectRatio: '16 / 9', borderRadius: 14, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a24, #08080a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '0.5px solid var(--line-strong)', marginBottom: 14,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 12px, transparent 12px 24px)',
        }}/>
        <div style={{
          width: 56, height: 56, borderRadius: 50,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-fg)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          <I.play style={{ width: 22, height: 22, marginLeft: 3 }}/>
        </div>
        <div style={{
          position: 'absolute', left: 12, bottom: 10, fontSize: 11,
          color: 'var(--fg-mid)', fontFamily: 'var(--font-mono)',
        }}>HD · 0:18 · slow-mo demo</div>
        <div style={{
          position: 'absolute', right: 12, top: 10,
          background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 50,
          fontSize: 10, fontWeight: 600, color: '#fff', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>{activeIdx + 1} / {warmup.exercises.length}</div>
      </div>

      {/* Active exercise detail */}
      <div className="anim-up" key={active.name} style={{
        padding: 14, borderRadius: 12, background: 'var(--bg-3)', marginBottom: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
          <span className="t-h3" style={{ fontSize: 15 }}>{active.name}</span>
          <Chip variant="acc">{active.duration}</Chip>
        </div>
        <div className="t-sm" style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg-mid)' }}>
          <I.info style={{ width: 13, height: 13, color: 'var(--accent)', verticalAlign: -2, marginRight: 4 }}/>
          {active.tip}
        </div>
      </div>

      {/* Exercise list — tap to switch */}
      <div className="t-xs" style={{ marginBottom: 8 }}>All exercises</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {warmup.exercises.map((ex, i) => {
          const selected = i === activeIdx;
          const done = i < activeIdx;
          return (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: selected ? 'var(--accent-soft)' : 'transparent',
              border: '0.5px solid ' + (selected ? 'var(--accent)' : 'transparent'),
              color: 'inherit', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7,
                background: done ? 'var(--accent)' : selected ? 'var(--bg-2)' : 'var(--bg-3)',
                border: '0.5px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? 'var(--accent-fg)' : selected ? 'var(--accent)' : 'var(--fg-mute)',
                fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                flexShrink: 0,
              }}>{done ? <I.check style={{ width: 11, height: 11, strokeWidth: 3 }}/> : i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</div>
              </div>
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{ex.duration}</span>
            </button>
          );
        })}
      </div>

      {/* CTA — start the flow */}
      <button
        onClick={() => {
          if (activeIdx < warmup.exercises.length - 1) {
            setActiveIdx(activeIdx + 1);
          } else {
            onClose();
          }
        }}
        className="btn btn-primary btn-block"
        style={{ marginTop: 14 }}>
        {activeIdx < warmup.exercises.length - 1
          ? <>Next · {warmup.exercises[activeIdx + 1].name} <I.arrow style={{ width: 14, height: 14 }}/></>
          : <><I.check style={{ width: 14, height: 14 }}/> Finish warmup</>}
      </button>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────
// Notifications sheet
// ─────────────────────────────────────────────────────────────
function NotificationsSheet({ onClose }) {
  const [items, setItems] = useStateH(NOTIFICATIONS);
  const unread = items.filter(n => n.unread).length;
  const kindIcon = {
    raid: <I.shield style={{ width: 14, height: 14 }}/>,
    pr: <I.trophy style={{ width: 14, height: 14 }}/>,
    autoreg: <I.bolt style={{ width: 14, height: 14 }}/>,
    clan: <I.heart style={{ width: 14, height: 14 }}/>,
    mission: <I.check style={{ width: 14, height: 14 }}/>,
  };
  return (
    <Sheet onClose={onClose} title="Notifications" subtitle={unread ? `${unread} unread` : 'All caught up'}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button onClick={() => setItems(items.map(n => ({ ...n, unread: false })))} style={{
          background: 'transparent', border: 'none', color: 'var(--accent)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>Mark all read</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(n => (
          <div key={n.id} style={{
            padding: 12, borderRadius: 12,
            background: n.unread ? 'var(--accent-soft)' : 'var(--bg-3)',
            border: '0.5px solid ' + (n.unread ? 'var(--accent)' : 'transparent'),
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--bg-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)', flexShrink: 0,
            }}>{kindIcon[n.kind]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span className="t-h3" style={{ fontSize: 13 }}>{n.title}</span>
                <span className="t-xs" style={{ fontSize: 10, color: 'var(--fg-mute)', flexShrink: 0 }}>{n.when}</span>
              </div>
              <div className="t-sm" style={{ marginTop: 3, fontSize: 12, lineHeight: 1.4 }}>{n.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// DayDetail wrapper to thread jump-day state through the embedded WeekStrip
function DayDetailWrapper({ day, onBackToToday, onJump, todayIdx, onStart }) {
  const isPast = day.status === 'done' || (day.status === 'rest' && day.date < 23);
  const isRest = day.status === 'rest';
  const isPlanned = day.status === 'planned';
  const idx = WEEK.findIndex(d => d.date === day.date);
  const names = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const fullName = names[idx] || 'Day';

  return (
    <>
      <div style={{ padding: '0 18px 12px' }}>
        <button onClick={onBackToToday} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 8px', borderRadius: 999,
          background: 'var(--bg-2)', border: '0.5px solid var(--line)',
          color: 'var(--fg-mid)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <I.back style={{ width: 13, height: 13 }}/> Back to today
        </button>
      </div>

      <div style={{ padding: '0 18px 16px' }}>
        <div className="t-xs" style={{ color: isPlanned ? 'var(--accent)' : 'var(--fg-mute)' }}>
          {isPast ? 'Logged' : isPlanned ? 'Planned' : ''}
        </div>
        <div className="t-h1" style={{ marginTop: 4 }}>{fullName} {day.date}</div>
        <div className="t-sm" style={{ marginTop: 4 }}>{day.label}</div>
      </div>

      {isRest ? (
        <RestDayCard isPast={isPast}/>
      ) : isPast && day.summary ? (
        <PastWorkoutDetail summary={day.summary} label={day.label}/>
      ) : isPlanned && day.plan ? (
        <PlannedWorkoutDetail plan={day.plan} label={day.label} onStart={onStart}/>
      ) : (
        <RestDayCard isPast={false}/>
      )}

      <div style={{ marginTop: 24, paddingBottom: 12 }}>
        <div style={{ padding: '0 18px 10px' }}>
          <span className="t-xs">Jump to day</span>
        </div>
        <WeekStrip selectedIdx={idx} onPickDay={(i) => i === todayIdx ? onBackToToday() : onJump(i)}/>
      </div>
    </>
  );
}

Object.assign(window, { HomeScreen, RecoveryDial, WeekStrip, StreakSpiral, ClanStrip, JoinClanStrip, DayDetailWrapper, NotificationsSheet });
