// other-screens.jsx — Squad, Stats, Profile
const { useState: useStateO, useEffect: useEffectO } = React;

// ═════════════════════════════════════════════════════════════
// SQUAD — clan home, raid, missions, leaderboard
// ═════════════════════════════════════════════════════════════
function SquadScreen({ userClan, onJoinClan, onLeaveClan }) {
  const [tab, setTab] = useStateO('clan');
  const [menuOpen, setMenuOpen] = useStateO(false);
  const [leaveConfirm, setLeaveConfirm] = useStateO(false);

  // No clan yet → show onboarding
  if (!userClan) {
    return <ClanOnboarding onJoined={onJoinClan}/>;
  }

  // Use the active clan
  const C = userClan;
  return (
    <div className="screen-in" style={{ paddingBottom: 24 }}>
      <ScreenHeader title={C.name} subtitle={`${C.rank} · ${C.week}`} right={
        <button onClick={() => setMenuOpen(true)} style={{
          width: 40, height: 40, borderRadius: 12, background: 'var(--bg-2)',
          border: '0.5px solid var(--line)', color: 'var(--fg-mid)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><I.more style={{ width: 18, height: 18 }}/></button>
      }/>

      {/* Inline segmented */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{
          display: 'flex', background: 'var(--bg-2)', borderRadius: 12, padding: 3,
          border: '0.5px solid var(--line)',
        }}>
          {['clan', 'feed'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px 12px', borderRadius: 10,
              background: tab === t ? 'var(--bg-3)' : 'transparent',
              color: tab === t ? 'var(--fg)' : 'var(--fg-mute)',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              textTransform: 'capitalize',
            }}>{t === 'feed' ? 'Feed' : 'Clan'}</button>
          ))}
        </div>
      </div>

      {tab === 'clan' && <ClanTab clan={C}/>}
      {tab === 'feed' && <FeedTab clan={C}/>}

      {/* ⋯ menu sheet */}
      {menuOpen && (
        <Sheet onClose={() => setMenuOpen(false)} title={C.name} subtitle={`${C.members} member${C.members !== 1 ? 's' : ''} · ${C.id || 'CRWS-CRWS'}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <MenuRow icon={<I.plus style={{ width: 14, height: 14 }}/>} label="Invite friends" sub="Share clan invite link" onClick={() => {}}/>
            <MenuRow icon={<I.squad style={{ width: 14, height: 14 }}/>} label="Members" sub={`${C.members} active · ${C.online || 0} online now`} onClick={() => {}}/>
            <MenuRow icon={<I.shield style={{ width: 14, height: 14 }}/>} label="Clan settings" sub="Name, photo, visibility" onClick={() => {}}/>
            <MenuRow icon={<I.info style={{ width: 14, height: 14 }}/>} label="Clan ID" sub={C.id || 'CRWS-4892'} onClick={() => navigator.clipboard && navigator.clipboard.writeText(C.id || 'CRWS-4892')}/>
            <div className="divider"/>
            <button onClick={() => { setMenuOpen(false); setLeaveConfirm(true); }} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12,
              background: 'transparent', border: 'none',
              color: 'var(--err)', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,107,107,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--err)', flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 17l5-5-5-5M21 12H9M12 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ fontSize: 14, color: 'var(--err)' }}>Leave clan</div>
                <div className="t-sm" style={{ marginTop: 2, fontSize: 11.5 }}>Find another clan or create one</div>
              </div>
            </button>
          </div>
        </Sheet>
      )}

      {leaveConfirm && (
        <Sheet onClose={() => setLeaveConfirm(false)} title={`Leave ${C.name}?`} subtitle="Your stats stay, but clan progress doesn't">
          <div style={{
            padding: 14, borderRadius: 12,
            background: 'rgba(255,107,107,0.10)', border: '0.5px solid rgba(255,107,107,0.3)',
            display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16,
          }}>
            <I.warn style={{ width: 16, height: 16, color: 'var(--err)', flexShrink: 0, marginTop: 1 }}/>
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
              You'll lose your contribution to the current raid. You can rejoin later — a member will need to accept your request again.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setLeaveConfirm(false)} className="btn" style={{ flex: 1, background: 'var(--bg-3)' }}>Stay</button>
            <button onClick={() => { setLeaveConfirm(false); onLeaveClan && onLeaveClan(); }} style={{
              flex: 1, padding: '14px 16px', borderRadius: 14,
              background: 'var(--err)', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
            }}>Leave clan</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function MenuRow({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 12,
      background: 'transparent', border: 'none', color: 'inherit',
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: 'var(--bg-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-h3" style={{ fontSize: 14 }}>{label}</div>
        <div className="t-sm" style={{ marginTop: 2, fontSize: 11.5 }}>{sub}</div>
      </div>
      <I.arrow style={{ width: 14, height: 14, color: 'var(--fg-mute)' }}/>
    </button>
  );
}

function ClanTab({ clan }) {
  // Use passed clan if available, fall back to global CLAN for safety
  const C = clan || CLAN;
  return (
    <>
      {/* Founder welcome banner (only for newly-created clans) */}
      {C.isFounder && C.members <= 1 && (
        <Reveal style={{ padding: '0 18px 14px' }}>
          <div className="card-elev" style={{ padding: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'var(--accent)', opacity: 0.15, filter: 'blur(30px)' }}/>
            <div style={{ position: 'relative' }}>
              <Chip variant="acc">Founder</Chip>
              <div className="t-h2" style={{ marginTop: 8 }}>Welcome to {C.name}</div>
              <div className="t-sm" style={{ marginTop: 4 }}>Invite up to 7 friends to start your first raid.</div>
              <button className="btn btn-primary" style={{ marginTop: 12 }}>
                <I.plus style={{ width: 14, height: 14 }}/> Invite friends
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Raid card */}
      <Reveal style={{ padding: '0 18px' }}>
        <RaidCard raid={C.raid}/>
      </Reveal>

      {/* Missions */}
      <Reveal style={{ padding: '18px 18px 0' }}>
        <div className="t-xs" style={{ marginBottom: 10 }}>Weekly missions</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {C.missions.map(m => <MissionCard key={m.id} mission={m} clan={C}/>)}
        </div>
      </Reveal>

      {/* Leaderboard */}
      <Reveal style={{ padding: '20px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span className="t-xs">Season leaderboard</span>
          <span className="t-sm fg-mute">{CLAN.week}</span>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { rank: 1, name: 'Iron Crows', tag: 'CRWS', pts: 18420, you: true, rankColor: 'var(--accent)' },
            { rank: 2, name: 'Steel Pact', tag: 'STPC', pts: 17890 },
            { rank: 3, name: 'Riverside Lifters', tag: 'RVRL', pts: 16320 },
            { rank: 4, name: 'Norte Power', tag: 'NRTP', pts: 14400 },
            { rank: 5, name: 'Casa Fuerte', tag: 'CFRT', pts: 13800 },
          ].map((c, i) => (
            <div key={c.tag} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderBottom: i < 4 ? '0.5px solid var(--line)' : 'none',
              background: c.you ? 'var(--accent-soft)' : 'transparent',
            }}>
              <div className="t-mono" style={{
                fontSize: 13, fontWeight: 600, color: c.you ? 'var(--accent)' : 'var(--fg-mute)',
                width: 18, textAlign: 'center',
              }}>{c.rank}</div>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: c.you ? 'linear-gradient(135deg, var(--accent), var(--accent-deep))' : 'var(--bg-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: c.you ? 'var(--accent-fg)' : 'var(--fg-mid)',
                letterSpacing: '0.02em',
              }}>{c.tag.slice(0,3)}</div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ fontSize: 14 }}>{c.name}{c.you && <span className="t-xs" style={{ marginLeft: 6, color: 'var(--accent)' }}>YOU</span>}</div>
              </div>
              <div className="t-mono" style={{ fontSize: 14, fontWeight: 500 }}>{c.pts.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Reveal>
      {/* Clan body strength */}
      <Reveal style={{ padding: '20px 18px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span className="t-h3">Clan strength map</span>
            <span className="t-sm fg-mute">Avg of {CLAN.members}</span>
          </div>
          <div className="t-sm" style={{ fontSize: 12, marginBottom: 10 }}>
            Where your clan is collectively strong, by muscle group.
          </div>
          <BodyHeatmap values={CLAN_BODY}/>
          <HeatmapLegend/>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {CLAN_BODY.topMuscles.map(m => (
              <div key={m.name} style={{
                padding: 10, borderRadius: 10, background: 'var(--bg-3)',
              }}>
                <div className="t-xs" style={{ fontSize: 9 }}>{m.name.toUpperCase()}</div>
                <div className="t-mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{m.value}</div>
                <div className="t-xs" style={{ marginTop: 2, fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 10,
            background: 'rgba(245,181,74,0.08)', border: '0.5px solid rgba(245,181,74,0.25)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <I.warn style={{ width: 13, height: 13, color: 'var(--warn)', flexShrink: 0 }}/>
            <span className="t-sm" style={{ fontSize: 11.5 }}>
              Weak as a clan: <strong style={{ color: 'var(--warn)' }}>{CLAN_BODY.weak.join(' · ')}</strong>
            </span>
          </div>
        </div>
      </Reveal>
    </>
  );
}

function RaidCard({ raid }) {
  const pct = raid.current / raid.target;
  const size = 200;
  const cx = size/2, cy = size/2;
  return (
    <div className="card-elev" style={{
      padding: 18, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, var(--bg-3) 0%, var(--bg-2) 60%)',
    }}>
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 320, height: 240, background: 'var(--accent)', opacity: 0.12,
        filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Chip variant="acc" icon={<I.bolt style={{ width: 11, height: 11 }}/>}>Active raid</Chip>
          <div className="t-h2" style={{ marginTop: 10 }}>{raid.name}</div>
          <div className="t-sm" style={{ marginTop: 4 }}>{raid.daysLeft} days left · {raid.contributions.length} lifters</div>
        </div>
      </div>

      {/* Member orbit ring */}
      <div style={{ position: 'relative', margin: '12px auto 6px', width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="raid-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)"/>
              <stop offset="100%" stopColor="var(--accent-deep)"/>
            </linearGradient>
          </defs>
          {/* track */}
          <circle cx={cx} cy={cy} r={(size-22)/2} fill="none" stroke="var(--bg-4)" strokeWidth="3"/>
          {/* progress */}
          <circle cx={cx} cy={cy} r={(size-22)/2} fill="none" stroke="url(#raid-grad)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (size-22)/2}
            strokeDashoffset={2 * Math.PI * (size-22)/2 * (1 - pct)}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 1s ease' }}/>
          {/* member dots distributed by share of total contribution */}
          {(() => {
            const total = raid.current;
            let acc = 0;
            return raid.contributions.map((m, i) => {
              const a = (acc / total) * 2 * Math.PI - Math.PI / 2;
              acc += m.value;
              const r = (size-22)/2;
              const x = cx + r * Math.cos(a);
              const y = cy + r * Math.sin(a);
              return (
                <g key={m.name}>
                  <circle cx={x} cy={y} r={m.you ? 9 : 7} fill={m.behind ? 'var(--warn)' : m.you ? 'var(--accent)' : 'var(--bg-2)'} stroke={m.behind ? 'var(--warn)' : 'var(--accent)'} strokeWidth="1.5"/>
                  {m.behind && (
                    <text x={x} y={y+3} fontSize="9" fill="var(--bg-0)" textAnchor="middle" fontWeight="700" fontFamily="var(--font-mono)">!</text>
                  )}
                </g>
              );
            });
          })()}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="t-xs" style={{ color: 'var(--fg-mute)' }}>LIFTED</div>
          <div className="t-mono" style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {(raid.current / 1000).toFixed(1)}<span style={{ fontSize: 16, color: 'var(--fg-mute)' }}>k</span>
          </div>
          <div className="t-sm" style={{ marginTop: 2 }}>of {(raid.target/1000).toFixed(0)}k {raid.unit}</div>
        </div>
      </div>

      {/* Rescue banner */}
      <div className="anim-up" style={{
        marginTop: 6, padding: '10px 12px', borderRadius: 12,
        background: 'rgba(245,181,74,0.10)', border: '0.5px solid rgba(245,181,74,0.35)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 50, background: 'var(--warn)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1209', flexShrink: 0,
        }}>
          <I.shield style={{ width: 13, height: 13 }}/>
        </div>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--fg)' }}>
          <strong style={{ fontWeight: 600 }}>Rescue mode</strong>{' '}
          <span style={{ color: 'var(--fg-mid)' }}>active — Karim & Pia behind. Your reps count <strong style={{ color: 'var(--warn)' }}>2×</strong> until Friday.</span>
        </div>
      </div>

      {/* contributors strip */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {raid.contributions.slice(0,3).map(m => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={m.name} size={26} color={m.you ? 'linear-gradient(135deg, var(--accent), var(--accent-deep))' : undefined}/>
            <span className="t-sm" style={{ color: m.you ? 'var(--fg)' : 'var(--fg-mid)', fontWeight: m.you ? 600 : 400, minWidth: 70 }}>{m.name}{m.you && ' (you)'}</span>
            <div style={{ flex: 1 }}>
              <ProgressBar value={m.value} max={raid.contributions[0].value} height={4}/>
            </div>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-mid)', minWidth: 56, textAlign: 'right' }}>{m.value.toLocaleString()} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MissionCard({ mission, clan }) {
  const upcoming = mission.upcoming;
  const total = (clan && clan.members) || CLAN.members;
  return (
    <div className="card" style={{
      padding: 14, opacity: upcoming ? 0.55 : 1,
      borderStyle: upcoming ? 'dashed' : 'solid',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-h3" style={{ fontSize: 14 }}>{mission.title}</div>
          <div className="t-sm" style={{ marginTop: 3 }}>{mission.target || mission.subtitle}</div>
        </div>
        <div className="t-mono" style={{ fontSize: 15, fontWeight: 600, color: upcoming ? 'var(--fg-mute)' : 'var(--accent)' }}>
          {Math.round(mission.progress * 100)}%
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <ProgressBar value={mission.progress * 100} color={upcoming ? 'var(--fg-dim)' : 'var(--accent)'}/>
      </div>
      <div className="t-xs" style={{ marginTop: 8, color: 'var(--fg-mute)' }}>{mission.members}/{total} contributing</div>
    </div>
  );
}

function FeedTab() {
  const [items, setItems] = useStateO(() => FEED.map(f => ({
    ...f,
    likes: Math.floor(Math.random() * 9) + 1,
    liked: false,
    comments: f.id === 'f1' ? [
      { who: 'Mara V.', text: 'Massive — congrats!', when: '10m' },
      { who: 'Tea M.', text: 'Form looked clean too', when: '8m' },
    ] : f.id === 'f2' ? [
      { who: 'Karim O.', text: 'fast 🔥', when: '50m' },
    ] : [],
  })));
  const [expandedId, setExpandedId] = useStateO(null);
  const [draft, setDraft] = useStateO('');
  const [composeOpen, setComposeOpen] = useStateO(false);

  const toggleLike = (id) => {
    setItems(it => it.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };
  const toggleComments = (id) => {
    setExpandedId(cur => cur === id ? null : id);
    setDraft('');
  };
  const addPost = (text, video) => {
    const id = 'fnew-' + Date.now();
    const post = {
      id, who: 'You', clan: 'CRWS', when: 'now',
      action: 'posted',
      detail: text,
      mine: true,
      video: video || null,
      likes: 0, liked: false, comments: [],
    };
    setItems(it => [post, ...it]);
    setComposeOpen(false);
  };

  const addComment = (id) => {
    if (!draft.trim()) return;
    setItems(it => it.map(p => p.id === id ? {
      ...p, comments: [...p.comments, { who: 'You', text: draft.trim(), when: 'now', mine: true }],
    } : p));
    setDraft('');
  };

  return (
    <>
      {/* Clan search */}
      <div style={{ padding: '0 18px 14px' }}>
        <ClanSearch/>
      </div>

      {/* Compose post */}
      <div style={{ padding: '0 18px 14px' }}>
        <button onClick={() => setComposeOpen(true)} className="hover-lift" style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: 12, borderRadius: 14,
          background: 'var(--bg-2)', border: '0.5px solid var(--line)',
          color: 'inherit', cursor: 'pointer', textAlign: 'left',
        }}>
          <Avatar name="You" size={32} color="linear-gradient(135deg, var(--accent), var(--accent-deep))"/>
          <span className="t-sm" style={{ flex: 1, color: 'var(--fg-mute)' }}>Share something with your clan…</span>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--bg-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)',
          }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="15" height="14" rx="2"/><path d="M18 10l3-2v8l-3-2z"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Feed */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(f => {
          const expanded = expandedId === f.id;
          return (
            <div key={f.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Avatar name={f.who} size={36} color={f.mine ? 'linear-gradient(135deg, var(--accent), var(--accent-deep))' : undefined}/>
                <div style={{ flex: 1 }}>
                  <div className="t-sm" style={{ color: 'var(--fg)' }}>
                    <strong style={{ fontWeight: 600 }}>{f.who}{f.mine && <span className="t-xs" style={{ marginLeft: 6, color: 'var(--accent)', fontSize: 9 }}>YOU</span>}</strong>{' '}
                    <span className="fg-mute">{f.action} · {f.when}</span>
                  </div>
                  <div className="t-h3" style={{ marginTop: 4, fontSize: 14, fontWeight: f.mine ? 500 : 600 }}>{f.detail}</div>
                </div>
                {f.badge && (
                  <div style={{
                    padding: '6px 10px', borderRadius: 10, background: 'var(--accent-soft)',
                    color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                  }}>{f.badge}</div>
                )}
              </div>

              {/* Video attachment */}
              {f.video && (
                <div style={{
                  marginTop: 12, aspectRatio: '16 / 10', borderRadius: 12, overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a1a24, #08080a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '0.5px solid var(--line-strong)', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 12px, transparent 12px 24px)',
                  }}/>
                  <div style={{
                    width: 52, height: 52, borderRadius: 50,
                    background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-fg)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                  }}>
                    <I.play style={{ width: 20, height: 20, marginLeft: 2 }}/>
                  </div>
                  <div style={{
                    position: 'absolute', left: 10, bottom: 8, fontSize: 10,
                    color: 'var(--fg-mid)', fontFamily: 'var(--font-mono)',
                  }}>{f.video.duration || '0:24'} · {f.video.name || 'video.mp4'}</div>
                </div>
              )}

              {f.alert && (
                <button className="btn" style={{ width: '100%', marginTop: 12, background: 'var(--warn)', color: '#1a1209', fontSize: 13 }}>
                  <I.shield style={{ width: 14, height: 14 }}/> Send a rescue rep
                </button>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '0.5px solid var(--line)' }}>
                <button onClick={() => toggleLike(f.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px', borderRadius: 999,
                  background: f.liked ? 'var(--accent-soft)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: f.liked ? 'var(--accent)' : 'var(--fg-mute)', fontSize: 12, fontWeight: 500,
                }}>
                  <I.heart style={{ width: 13, height: 13 }}/> {f.likes}
                </button>
                <button onClick={() => toggleComments(f.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px', borderRadius: 999,
                  background: expanded ? 'var(--bg-3)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: 'var(--fg-mute)', fontSize: 12, fontWeight: 500,
                }}>
                  <CommentIcon/> {f.comments.length}
                </button>
              </div>

              {expanded && (
                <div className="anim-up" style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {f.comments.length === 0 && (
                    <div className="t-sm" style={{ color: 'var(--fg-mute)', fontStyle: 'italic', fontSize: 12 }}>
                      No comments yet — be the first.
                    </div>
                  )}
                  {f.comments.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <Avatar name={c.who} size={26}/>
                      <div style={{ flex: 1, padding: '8px 10px', background: 'var(--bg-3)', borderRadius: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{c.who}{c.mine && <span className="t-xs" style={{ marginLeft: 6, color: 'var(--accent)', fontSize: 9 }}>YOU</span>}</span>
                          <span className="t-xs" style={{ fontSize: 10, color: 'var(--fg-mute)' }}>{c.when}</span>
                        </div>
                        <div className="t-sm" style={{ marginTop: 3, fontSize: 12.5, color: 'var(--fg)' }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                  {/* Input */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Avatar name="You" size={26} color="linear-gradient(135deg, var(--accent), var(--accent-deep))"/>
                    <input
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addComment(f.id); }}
                      placeholder="Add a comment…"
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: 999,
                        background: 'var(--bg-3)', border: '0.5px solid var(--line)',
                        color: 'var(--fg)', fontFamily: 'inherit', fontSize: 13, outline: 'none',
                      }}/>
                    <button onClick={() => addComment(f.id)} disabled={!draft.trim()} style={{
                      width: 30, height: 30, borderRadius: 50,
                      background: draft.trim() ? 'var(--accent)' : 'var(--bg-3)',
                      border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
                      color: draft.trim() ? 'var(--accent-fg)' : 'var(--fg-dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <I.arrow style={{ width: 14, height: 14 }}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {composeOpen && <PostComposer onClose={() => setComposeOpen(false)} onPost={addPost}/>}
    </>
  );
}

function PostComposer({ onClose, onPost }) {
  const [text, setText] = useStateO('');
  const [video, setVideo] = useStateO(null);
  const fileRef = React.useRef(null);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // simulate ingest
    setVideo({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
      duration: '0:' + String(15 + Math.floor(Math.random() * 45)).padStart(2, '0'),
    });
    e.target.value = '';
  };

  const canPost = text.trim().length > 0 || !!video;

  return (
    <Sheet onClose={onClose} title="New post" subtitle="Share with Iron Crows">
      <textarea
        autoFocus
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        style={{
          width: '100%', padding: 14, borderRadius: 12,
          background: 'var(--bg-3)', border: '0.5px solid var(--line)',
          color: 'var(--fg)', fontFamily: 'inherit', fontSize: 15, outline: 'none',
          resize: 'vertical', minHeight: 100, lineHeight: 1.4,
        }}/>

      {/* Video preview */}
      {video && (
        <div style={{
          marginTop: 12, padding: 12, borderRadius: 12,
          background: 'var(--bg-3)', border: '0.5px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 10,
            background: 'linear-gradient(135deg, #1a1a24, #08080a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', flexShrink: 0,
          }}>
            <I.play style={{ width: 20, height: 20, marginLeft: 2 }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-h3" style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.name}</div>
            <div className="t-xs" style={{ marginTop: 3, fontSize: 10.5, textTransform: 'none', letterSpacing: 0 }}>
              {video.duration} · {video.size}
            </div>
          </div>
          <button onClick={() => setVideo(null)} style={{
            width: 28, height: 28, borderRadius: 50,
            background: 'var(--bg-2)', border: 'none', color: 'var(--fg-mute)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I.close style={{ width: 14, height: 14 }}/>
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="video/*" onChange={onFile} style={{ display: 'none' }}/>

      {/* Attach toolbar */}
      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <button onClick={() => fileRef.current && fileRef.current.click()} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 999,
          background: video ? 'var(--accent-soft)' : 'var(--bg-3)',
          color: video ? 'var(--accent)' : 'var(--fg-mid)',
          border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
        }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="15" height="14" rx="2"/><path d="M18 10l3-2v8l-3-2z"/>
          </svg>
          {video ? 'Change video' : 'Attach video'}
        </button>
        <div style={{ flex: 1 }}/>
        <span className="t-xs" style={{ fontSize: 11, alignSelf: 'center', color: text.length > 280 ? 'var(--warn)' : 'var(--fg-mute)' }}>
          {text.length}/280
        </span>
      </div>

      <button
        disabled={!canPost || text.length > 280}
        onClick={() => onPost(text.trim() || '🎥 New video', video)}
        className="btn btn-primary btn-block"
        style={{ marginTop: 16, opacity: (canPost && text.length <= 280) ? 1 : 0.5 }}>
        Post to clan
      </button>
    </Sheet>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11c0 4.5-4 8-9 8a10 10 0 01-3.5-.6L4 20l1.5-3.8A7.5 7.5 0 013 11c0-4.5 4-8 9-8s9 3.5 9 8z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Clan search by ID + join request
// ─────────────────────────────────────────────────────────────
const SEARCHABLE_CLANS = [
  { id: 'IRC-4892', name: 'Iron Crows', members: 6, rank: 'Diamond', region: 'Madrid' },
  { id: 'STP-1023', name: 'Steel Pact', members: 8, rank: 'Diamond', region: 'Barcelona' },
  { id: 'NRT-7711', name: 'Norte Power', members: 5, rank: 'Gold', region: 'Bilbao' },
  { id: 'CFR-4401', name: 'Casa Fuerte', members: 4, rank: 'Gold', region: 'Valencia' },
];

function ClanSearch() {
  const [q, setQ] = useStateO('');
  const [requested, setRequested] = useStateO(new Set());

  const matches = q.trim() ? SEARCHABLE_CLANS.filter(c =>
    c.id.toLowerCase().includes(q.toLowerCase()) ||
    c.name.toLowerCase().includes(q.toLowerCase())
  ) : [];

  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="t-h3" style={{ fontSize: 14, marginBottom: 8 }}>Discover clans</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 12,
        background: 'var(--bg-3)', border: '0.5px solid var(--line)',
      }}>
        <SearchIconO/>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by Clan ID (e.g. IRC-4892)"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--fg)', fontFamily: 'inherit', fontSize: 13,
            letterSpacing: '0.02em',
          }}/>
        {q && (
          <button onClick={() => setQ('')} style={{
            background: 'transparent', border: 'none', color: 'var(--fg-mute)', cursor: 'pointer', padding: 0,
          }}><I.close style={{ width: 13, height: 13 }}/></button>
        )}
      </div>

      {q.trim() && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {matches.length === 0 ? (
            <div className="t-sm" style={{ color: 'var(--fg-mute)', padding: 10, fontSize: 12 }}>
              No clan matches "{q}". Ask a friend for their Clan ID.
            </div>
          ) : matches.map(c => {
            const isRequested = requested.has(c.id);
            return (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, background: 'var(--bg-3)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-fg)', fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
                  flexShrink: 0,
                }}>{c.name.split(' ').map(w => w[0]).join('').slice(0,3)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                    <span className="t-xs" style={{ fontFamily: 'var(--font-mono)', textTransform: 'none', letterSpacing: '0.04em', fontSize: 10 }}>{c.id}</span>
                  </div>
                  <div className="t-xs" style={{ marginTop: 2, fontSize: 10.5, textTransform: 'none', letterSpacing: 0, color: 'var(--fg-mute)' }}>
                    {c.members}/8 members · {c.rank} · {c.region}
                  </div>
                </div>
                <button
                  onClick={() => setRequested(r => new Set([...r, c.id]))}
                  disabled={isRequested}
                  style={{
                    padding: '6px 12px', borderRadius: 999,
                    background: isRequested ? 'var(--bg-2)' : 'var(--accent)',
                    color: isRequested ? 'var(--fg-mute)' : 'var(--accent-fg)',
                    border: 'none', cursor: isRequested ? 'default' : 'pointer',
                    fontSize: 11.5, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                  {isRequested ? <><I.check style={{ width: 11, height: 11 }}/> Pending</> : 'Request'}
                </button>
              </div>
            );
          })}
          <div className="t-xs" style={{ marginTop: 4, padding: '4px 4px', textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'var(--fg-mute)' }}>
            Requests must be accepted by a clan member.
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIconO() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--fg-mute)" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M16 16l4 4"/>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════
// STATS
// ═════════════════════════════════════════════════════════════
function StatsScreen() {
  const [coachOpen, setCoachOpen] = useStateO(false);
  return (
    <div className="screen-in" style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Progress" subtitle="Last 12 weeks" right={
        <button style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-2)', border: '0.5px solid var(--line)', color: 'var(--fg-mid)', cursor: 'pointer' }}>
          <I.swap style={{ width: 16, height: 16 }}/>
        </button>
      }/>

      {/* AI Coach feedback card */}
      <div style={{ padding: '0 18px 14px' }}>
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
            <StatsSparklesIcon/>
          </div>
          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="t-h3" style={{ fontSize: 15 }}>AI Coach feedback</span>
              <Chip variant="acc" style={{ fontSize: 9.5 }}>Insights</Chip>
            </div>
            <div className="t-sm" style={{ marginTop: 3, fontSize: 12 }}>
              Get a personalized analysis of your last 12 weeks.
            </div>
          </div>
          <I.arrow style={{ width: 18, height: 18, color: 'var(--fg-mute)', position: 'relative' }}/>
        </button>
      </div>

      {/* Volume per muscle heatmap */}
      <Reveal style={{ padding: '0 18px' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="t-h3">Volume · weekly</span>
            <span className="t-sm fg-mute">kg × reps</span>
          </div>
          <MuscleHeatmap/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--line)' }}>
            <I.warn style={{ width: 14, height: 14, color: 'var(--warn)' }}/>
            <span className="t-sm" style={{ fontSize: 12 }}>Posterior chain volume is <strong style={{ color: 'var(--warn)' }}>32% below</strong> anterior — add a hamstring or back set this week.</span>
          </div>
        </div>
      </Reveal>

      {/* PRs */}
      <Reveal style={{ padding: '14px 18px 0' }}>
        <div className="t-xs" style={{ marginBottom: 10 }}>Recent PRs</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginLeft: -2, marginRight: -18, paddingRight: 18 }} className="hv-scroll">
          {[
            { exercise: 'Deadlift', value: '180 kg', sub: '× 3', delta: '+5 kg' },
            { exercise: 'Bench', value: '92.5 kg', sub: '× 5', delta: '+2.5 kg' },
            { exercise: 'Squat', value: '140 kg', sub: '× 4', delta: '+5 kg' },
          ].map(p => (
            <div key={p.exercise} style={{
              flexShrink: 0, width: 150, padding: 14, borderRadius: 14,
              background: 'var(--bg-2)', border: '0.5px solid var(--line)',
            }}>
              <div className="t-xs">{p.exercise}</div>
              <div className="t-mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 6 }}>{p.value}</div>
              <div className="t-sm" style={{ marginTop: 2 }}>{p.sub}</div>
              <Chip variant="acc" style={{ marginTop: 8, fontSize: 10 }}>{p.delta}</Chip>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Bodyweight trend */}
      <Reveal style={{ padding: '20px 18px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div>
              <div className="t-h3">Body weight</div>
              <div className="t-sm" style={{ marginTop: 2 }}>{USER.bodyweight} kg <span className="fg-acc">−1.1 kg</span></div>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {['1M','3M','6M','1Y'].map(p => (
                <span key={p} style={{
                  padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                  background: p === '3M' ? 'var(--bg-3)' : 'transparent',
                  color: p === '3M' ? 'var(--fg)' : 'var(--fg-mute)',
                }}>{p}</span>
              ))}
            </div>
          </div>
          <BodyweightChart data={BODYWEIGHT_SERIES}/>
        </div>
      </Reveal>

      {/* Personal body heatmap */}
      <Reveal style={{ padding: '14px 18px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span className="t-h3">Your strength map</span>
            <span className="t-sm fg-mute">e1RM · volume</span>
          </div>
          <div className="t-sm" style={{ fontSize: 12, marginBottom: 6 }}>
            Where you're personally strong, by muscle group.
          </div>
          <BodyHeatmap values={PERSONAL_BODY}/>
          <HeatmapLegend/>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PERSONAL_BODY.topLifts.map(l => (
              <div key={l.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--line)' }}>
                <span className="t-sm" style={{ color: 'var(--fg)' }}>{l.name}</span>
                <span className="t-mono" style={{ fontSize: 13, fontWeight: 500 }}>{l.value}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 10,
            background: 'rgba(245,181,74,0.08)', border: '0.5px solid rgba(245,181,74,0.25)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <I.warn style={{ width: 13, height: 13, color: 'var(--warn)', flexShrink: 0 }}/>
            <span className="t-sm" style={{ fontSize: 11.5 }}>
              Lagging: <strong style={{ color: 'var(--warn)' }}>{PERSONAL_BODY.weak.join(' · ')}</strong>
            </span>
          </div>
        </div>
      </Reveal>

      {/* Weekly summary */}
      <Reveal style={{ padding: '14px 18px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="t-h3" style={{ marginBottom: 14 }}>This week</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <SummaryStat label="Sessions" value="4" sub="of 5 planned"/>
            <SummaryStat label="Volume" value="42.1k" sub="kg, +6.2%"/>
            <SummaryStat label="PRs" value="2" sub="bench, deadlift"/>
            <SummaryStat label="Avg RPE" value="7.4" sub="prescribed 7.2"/>
          </div>
        </div>
      </Reveal>

      {coachOpen && <AICoachFeedbackSheet onClose={() => setCoachOpen(false)}/>}
    </div>
  );
}

function StatsSparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2l1.7 4.6 4.6 1.7-4.6 1.7L12 14.6 10.3 10l-4.6-1.7 4.6-1.7L12 2z"/>
      <path d="M19 13l.8 2.2 2.2.8-2.2.8L19 19l-.8-2.2-2.2-.8 2.2-.8L19 13z" opacity="0.7"/>
      <path d="M5 15l.7 1.9 1.9.6-1.9.6L5 20l-.7-1.9-1.9-.6 1.9-.6L5 15z" opacity="0.5"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// AI Coach feedback — generates insights from training data
// ─────────────────────────────────────────────────────────────
function AICoachFeedbackSheet({ onClose }) {
  const [phase, setPhase] = useStateO('loading'); // loading | ready
  const [activeFollowup, setActiveFollowup] = useStateO(null);

  React.useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 1500);
    return () => clearTimeout(t);
  }, []);

  // Derived insights from mock data
  const insights = useMemoO(() => buildInsights(), []);
  const followups = [
    { id: 'plateau',  label: 'Am I plateauing?',          answer: 'Your bench press e1RM jumped 8.4% over 12 weeks — that\'s solid for an intermediate. Squat is flat the last 3 weeks, which is the usual signal to deload one week, then push +2.5 kg microloads. Deadlift is on schedule.' },
    { id: 'priority', label: 'What should I prioritize?', answer: 'Two things: (1) hamstring volume — your posterior chain heatmap is 32% below anterior, add one Romanian DL day. (2) Calf and rear-delt work — both are in your bottom 3. A weekly accessory day fixes this in ~4 weeks.' },
    { id: 'recovery', label: 'How is my recovery?',       answer: 'Your average RPE (7.4) is just above prescribed (7.2) — you\'re pushing slightly hard. HRV is normal. Sleep is averaging 7.2h. If you bump sleep to 8h for 2 weeks, expect your RPE for the same load to drop by ~0.5.' },
    { id: 'protein',  label: 'Am I eating enough?',       answer: 'I don\'t track food yet — connect a nutrition app to get this analysis. For your bodyweight (71.3 kg) and goal (hypertrophy), target 1.6–2.2 g/kg protein = 114–157 g/day, and a 200–300 kcal surplus.' },
  ];

  return (
    <Sheet onClose={onClose}
      title={<><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><StatsSparklesIcon/> AI Coach feedback</span></>}
      subtitle={phase === 'loading' ? 'Reading your training data…' : 'Based on your last 12 weeks'}>
      {phase === 'loading' ? (
        <div className="anim-up" style={{ padding: '34px 0', textAlign: 'center' }}>
          <div className="float" style={{
            width: 56, height: 56, borderRadius: 50, margin: '0 auto',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-fg)',
          }}>
            <StatsSparklesIcon/>
          </div>
          <div className="t-h2" style={{ marginTop: 18 }}>Analyzing</div>
          <div className="t-sm" style={{ marginTop: 6 }}>312 workouts · 27 PRs · 12 weeks of data</div>

          <div style={{ marginTop: 18, maxWidth: 220, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Volume trends', 'Recovery patterns', 'Imbalances', 'Strength curves'].map((step, i) => (
              <div key={step} className="anim-up" style={{
                animationDelay: (i * 0.18) + 's',
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: 'var(--fg-mid)',
              }}>
                <span className="dot dot-on glow-pulse"/>
                <span>{step}…</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="anim-up">
          {/* Summary */}
          <div className="card-elev" style={{ padding: 14, position: 'relative', overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'var(--accent)', opacity: 0.18, filter: 'blur(36px)' }}/>
            <Chip variant="acc" style={{ fontSize: 9.5 }}>Summary</Chip>
            <div className="t-h3" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.45 }}>
              You're progressing steadily. Strength is up <span className="fg-acc">+8.4%</span> on bench and you've hit <span className="fg-acc">2 PRs</span> this week. Your main opportunity is <strong>posterior-chain volume</strong>.
            </div>
          </div>

          {/* Insight cards */}
          <div className="t-xs" style={{ marginBottom: 8 }}>Insights</div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {insights.map((ins, i) => <InsightCard key={i} insight={ins}/>)}
          </div>

          {/* Follow-up questions */}
          <div className="t-xs" style={{ marginBottom: 8 }}>Ask a follow-up</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {followups.map(f => {
              const open = activeFollowup === f.id;
              return (
                <div key={f.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <button onClick={() => setActiveFollowup(open ? null : f.id)} style={{
                    width: '100%', padding: '12px 14px',
                    background: 'transparent', border: 'none', color: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, background: 'var(--accent-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', flexShrink: 0, fontSize: 11, fontWeight: 700,
                    }}>?</div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{f.label}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--fg-mute)" strokeWidth="2" strokeLinecap="round" style={{
                      transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
                    }}><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {open && (
                    <div className="anim-up" style={{
                      padding: '0 14px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
                      borderTop: '0.5px solid var(--line)', paddingTop: 12,
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 50,
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent-fg)', flexShrink: 0,
                      }}>
                        <StatsSparklesIcon style={{ width: 13, height: 13 }}/>
                      </div>
                      <span className="t-sm" style={{ flex: 1, fontSize: 12.5, color: 'var(--fg)', lineHeight: 1.5 }}>
                        {f.answer}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 16, padding: '10px 12px', borderRadius: 10,
            background: 'var(--bg-3)', fontSize: 11.5, color: 'var(--fg-mute)',
            display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.45,
          }}>
            <I.info style={{ width: 13, height: 13, color: 'var(--accent)', marginTop: 1, flexShrink: 0 }}/>
            <span>AI Coach is a guide, not a doctor. For pain or persistent fatigue, talk to a coach or medical professional.</span>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function useMemoO(fn, deps) { return React.useMemo(fn, deps); }

function buildInsights() {
  return [
    {
      kind: 'good',
      title: 'Strong bench progression',
      body: 'Bench press e1RM is up 8.4% over the last 12 weeks (88 → 110 kg). The last 3 weeks show clean linear gains. Keep the current loading and consider adding a third weekly bench exposure.',
      metric: '+8.4%',
    },
    {
      kind: 'warn',
      title: 'Posterior chain underdosed',
      body: 'Your back, hamstrings and rear delts are 32% below anterior volume. This usually shows up as plateaued squats and lower-back tightness on deadlift. Add 8–12 sets/week of Romanian DL + face pulls.',
      metric: '−32%',
    },
    {
      kind: 'good',
      title: 'Streak + consistency',
      body: 'You logged 4 of 5 planned sessions this week. Your 47-day streak puts you in the top 8% of intermediate lifters. Consistency is the lever doing the most work right now.',
      metric: '4/5',
    },
    {
      kind: 'info',
      title: 'RPE slightly high',
      body: 'Average RPE this week was 7.4 versus a prescribed 7.2. Not concerning alone, but if HRV drops below 55 ms or sleep dips below 7h, consider a deload week.',
      metric: '7.4',
    },
  ];
}

function InsightCard({ insight }) {
  const color = insight.kind === 'good' ? 'var(--ok)'
    : insight.kind === 'warn' ? 'var(--warn)'
    : 'var(--accent)';
  const bg = insight.kind === 'good' ? 'rgba(92,214,168,0.10)'
    : insight.kind === 'warn' ? 'rgba(245,181,74,0.10)'
    : 'var(--accent-soft)';
  const icon = insight.kind === 'good'
    ? <I.check style={{ width: 14, height: 14, strokeWidth: 2.5 }}/>
    : insight.kind === 'warn'
    ? <I.warn style={{ width: 14, height: 14 }}/>
    : <I.info style={{ width: 14, height: 14 }}/>;
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, flexShrink: 0,
          }}>{icon}</div>
          <span className="t-h3" style={{ fontSize: 13.5 }}>{insight.title}</span>
        </div>
        <span className="t-mono" style={{ fontSize: 13, fontWeight: 600, color }}>{insight.metric}</span>
      </div>
      <div className="t-sm" style={{ fontSize: 12.5, color: 'var(--fg-mid)', lineHeight: 1.5 }}>
        {insight.body}
      </div>
    </div>
  );
}

function MuscleHeatmap() {
  const muscles = ['Chest','Back','Quads','Hams','Glutes','Shldrs','Biceps','Triceps'];
  const weeks = 12;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {muscles.map((m, mi) => (
        <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="t-sm" style={{ width: 50, fontSize: 11, color: 'var(--fg-mid)' }}>{m}</span>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 2 }}>
            {Array.from({ length: weeks }).map((_, wi) => {
              // pseudo-random but deterministic
              const val = (Math.sin(mi * 1.3 + wi * 0.7) + 1) / 2;
              const isPost = m === 'Hams' || m === 'Back';
              const v = isPost ? val * 0.5 : val;
              return (
                <div key={wi} style={{
                  height: 14, borderRadius: 3,
                  background: `var(--accent)`,
                  opacity: 0.15 + v * 0.85,
                }}/>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BodyweightChart({ data }) {
  const max = Math.max(...data) + 0.3, min = Math.min(...data) - 0.3;
  const w = 320, h = 110;
  const pts = data.map((v, i) => [(i / (data.length-1)) * w, h - ((v - min) / (max - min)) * (h - 16) - 8]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${w} ${h} L0 ${h} Z`;
  return (
    <div style={{ width: '100%', height: h, marginTop: 8 }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="bw-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#bw-grad)"/>
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p, i) => i === pts.length - 1 && (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--accent)" stroke="var(--bg-2)" strokeWidth="2"/>
        ))}
      </svg>
    </div>
  );
}

function LineChart() {
  // 12 points
  const data = [88, 89, 91, 89, 92, 93, 95, 97, 96, 99, 102, 110];
  const max = 115, min = 80;
  const w = 320, h = 90;
  const pts = data.map((v, i) => [(i / (data.length-1)) * w, h - ((v - min) / (max - min)) * (h - 8) - 4]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${w} ${h} L0 ${h} Z`;
  return (
    <div style={{ width: '100%', height: h, marginTop: 8 }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chart-grad)"/>
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p, i) => i === pts.length - 1 && (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--accent)" stroke="var(--bg-2)" strokeWidth="2"/>
        ))}
      </svg>
    </div>
  );
}

function SummaryStat({ label, value, sub }) {
  return (
    <div>
      <div className="t-xs">{label}</div>
      <div className="t-mono" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>{value}</div>
      <div className="t-sm" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PROFILE
// ═════════════════════════════════════════════════════════════
function ProfileScreen({ gamification = true, authedUser }) {
  const [accountOpen, setAccountOpen] = useStateO(false);
  const [dataOpen, setDataOpen] = useStateO(false);
  const [resetOpen, setResetOpen] = useStateO(false);
  const [resetDone, setResetDone] = useStateO(false);
  const name = (authedUser && authedUser.name) || USER.name;
  const handle = (authedUser && authedUser.handle) || USER.handle;

  return (
    <div className="screen-in" style={{ paddingBottom: 24 }}>
      <ScreenHeader title="You" right={
        <button onClick={() => setAccountOpen(true)} style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-2)', border: '0.5px solid var(--line)', color: 'var(--fg-mid)', cursor: 'pointer' }}>
          <I.more style={{ width: 18, height: 18 }}/>
        </button>
      }/>

      {/* Identity */}
      <div style={{ padding: '0 18px' }}>
        <div className="card-elev" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={name} size={56} color="linear-gradient(135deg, var(--accent), var(--accent-deep))"/>
          <div style={{ flex: 1 }}>
            <div className="t-h2">{name}</div>
            <div className="t-sm" style={{ marginTop: 2 }}>@{handle} · {USER.gym}</div>
            {gamification && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <Chip variant="acc">Lv {USER.level}</Chip>
                <Chip>{USER.rank}</Chip>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <MiniStat value="312" label="Workouts"/>
        <MiniStat value={USER.streak} label="Streak"/>
        <MiniStat value="27" label="PRs"/>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 18px 0' }}>
        <div className="t-xs" style={{ marginBottom: 10 }}>Body</div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div className="t-mono" style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{USER.bodyweight}<span style={{ fontSize: 16, color: 'var(--fg-mute)', marginLeft: 4 }}>kg</span></div>
              <div className="t-sm" style={{ marginTop: 2 }}>−0.4 kg this month · 14.2% BF</div>
            </div>
            <svg width="120" height="40" viewBox="0 0 120 40" preserveAspectRatio="none">
              <path d="M0 28 L20 26 L40 24 L60 25 L80 22 L100 20 L120 18" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Settings groups */}
      <div style={{ padding: '20px 18px 0' }}>
        <div className="t-xs" style={{ marginBottom: 10 }}>Settings</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { label: 'Account', sub: `${name} · @${handle}`, icon: <I.user style={{ width: 16, height: 16 }}/>, onClick: () => setAccountOpen(true) },
            { label: 'My data', sub: 'Export your workouts as CSV', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M8 12l4 4 4-4M5 21h14"/></svg>, onClick: () => setDataOpen(true) },
            { label: 'Privacy & accessibility', sub: 'VoiceOver tested', icon: <I.shield style={{ width: 16, height: 16 }}/>, onClick: () => {} },
          ].map((row, i, a) => (
            <button key={row.label} onClick={row.onClick} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: 'transparent', border: 'none',
              borderBottom: i < a.length - 1 ? '0.5px solid var(--line)' : 'none',
              color: 'inherit', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: 'var(--bg-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', flexShrink: 0,
              }}>{row.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ fontSize: 14 }}>{row.label}</div>
                <div className="t-sm" style={{ marginTop: 2 }}>{row.sub}</div>
              </div>
              <I.arrow style={{ width: 14, height: 14, color: 'var(--fg-mute)' }}/>
            </button>
          ))}
        </div>
      </div>

      {/* Reset history (destructive) */}
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={() => setResetOpen(true)} className="hover-lift" style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: 14, borderRadius: 12,
          background: 'transparent', border: '0.5px solid rgba(255,107,107,0.25)',
          color: 'var(--err)', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(255,107,107,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--err)', flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14M10 11v6M14 11v6"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-h3" style={{ fontSize: 14, color: 'var(--err)' }}>Reset all history</div>
            <div className="t-sm" style={{ marginTop: 2, color: 'var(--fg-mid)' }}>Delete all logged workouts, PRs and stats</div>
          </div>
          <I.arrow style={{ width: 14, height: 14, color: 'var(--err)' }}/>
        </button>
      </div>

      {accountOpen && <AccountSheet name={name} handle={handle} onClose={() => setAccountOpen(false)}/>}
      {dataOpen && <DataExportSheet onClose={() => setDataOpen(false)}/>}
      {resetOpen && <ResetHistorySheet done={resetDone} onConfirm={() => setResetDone(true)} onClose={() => { setResetOpen(false); setResetDone(false); }}/>}
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="card" style={{ padding: 14, textAlign: 'center' }}>
      <div className="t-mono" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="t-xs" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Account sheet — edit name / email / password
// ─────────────────────────────────────────────────────────────
function AccountSheet({ name: initName, handle, onClose }) {
  const [name, setName] = useStateO(initName);
  const [email, setEmail] = useStateO(`${handle}@hivo.app`);
  const [pwOpen, setPwOpen] = useStateO(false);
  const [pwCurrent, setPwCurrent] = useStateO('');
  const [pwNew, setPwNew] = useStateO('');
  const [pwConfirm, setPwConfirm] = useStateO('');
  const [saved, setSaved] = useStateO(null); // null | 'profile' | 'password' | 'error'

  const saveProfile = () => {
    setSaved('profile');
    setTimeout(() => setSaved(null), 2000);
  };

  const savePassword = () => {
    if (!pwCurrent || !pwNew) { setSaved('error'); setTimeout(() => setSaved(null), 2000); return; }
    if (pwNew.length < 8) { setSaved('error'); setTimeout(() => setSaved(null), 2000); return; }
    if (pwNew !== pwConfirm) { setSaved('error'); setTimeout(() => setSaved(null), 2000); return; }
    setSaved('password');
    setPwCurrent(''); setPwNew(''); setPwConfirm('');
    setPwOpen(false);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <Sheet onClose={onClose} title="Account" subtitle="Personal information">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SheetField label="Name" value={name} onChange={setName} placeholder="Your name"/>
        <SheetField label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email"/>
        <SheetField label="Handle" value={`@${handle}`} disabled/>

        {/* Password section */}
        {!pwOpen ? (
          <button onClick={() => setPwOpen(true)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12,
            background: 'var(--bg-3)', border: '0.5px solid var(--line)',
            color: 'var(--fg)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>
            <span>Change password</span>
            <I.arrow style={{ width: 14, height: 14, color: 'var(--fg-mute)' }}/>
          </button>
        ) : (
          <div style={{
            padding: 14, borderRadius: 12,
            background: 'var(--bg-3)', border: '0.5px solid var(--line)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="t-h3" style={{ fontSize: 13 }}>Change password</span>
              <button onClick={() => { setPwOpen(false); setPwCurrent(''); setPwNew(''); setPwConfirm(''); }} style={{
                background: 'transparent', border: 'none', color: 'var(--fg-mute)', cursor: 'pointer', fontSize: 12,
              }}>Cancel</button>
            </div>
            <SheetField label="Current password" type="password" value={pwCurrent} onChange={setPwCurrent} inline/>
            <SheetField label="New password" type="password" value={pwNew} onChange={setPwNew} inline help="At least 8 characters"/>
            <SheetField label="Confirm" type="password" value={pwConfirm} onChange={setPwConfirm} inline/>
            <button onClick={savePassword} className="btn btn-primary btn-block" style={{ marginTop: 4 }}>
              Update password
            </button>
          </div>
        )}

        {saved === 'error' && <div className="t-sm" style={{ color: 'var(--err)', fontSize: 12 }}>Check the password fields — at least 8 chars and both must match.</div>}
        {saved === 'profile' && <div className="anim-up t-sm" style={{ color: 'var(--ok)', fontSize: 12 }}>✓ Profile updated</div>}
        {saved === 'password' && <div className="anim-up t-sm" style={{ color: 'var(--ok)', fontSize: 12 }}>✓ Password changed</div>}

        <button onClick={saveProfile} className="btn btn-primary btn-block" style={{ marginTop: 4 }}>
          Save changes
        </button>

        <button style={{
          width: '100%', padding: 12, borderRadius: 12, background: 'transparent', border: 'none',
          color: 'var(--fg-mute)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
          marginTop: 6,
        }}>Sign out</button>
      </div>
    </Sheet>
  );
}

function SheetField({ label, value, onChange, type = 'text', placeholder, disabled, help, inline }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="t-xs" style={{ fontSize: 10 }}>{label}</div>
        {help && <div className="t-xs" style={{ fontSize: 10, color: 'var(--fg-mute)', textTransform: 'none', letterSpacing: 0 }}>{help}</div>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', padding: '11px 13px', borderRadius: 12,
          background: inline ? 'var(--bg-2)' : 'var(--bg-3)',
          border: '0.5px solid var(--line)',
          color: disabled ? 'var(--fg-mute)' : 'var(--fg)',
          fontFamily: 'inherit', fontSize: 14, outline: 'none',
        }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Data export sheet — CSV
// ─────────────────────────────────────────────────────────────
function DataExportSheet({ onClose }) {
  const [scope, setScope] = useStateO('all'); // all | last30 | year
  const [includes, setIncludes] = useStateO({ workouts: true, body: true, prs: true });
  const [downloading, setDownloading] = useStateO(false);
  const [downloaded, setDownloaded] = useStateO(false);

  const generateCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      const rows = [['date', 'workout', 'exercise', 'set_number', 'set_type', 'weight_kg', 'reps', 'rpe']];
      // Mock historical data: last 12 weeks of 4 sessions/week
      const today = new Date('2026-03-23');
      const day = 24 * 60 * 60 * 1000;
      const workouts = [
        { name: 'Push · Heavy', exercises: [
          { name: 'Barbell bench press', sets: 4, weight: 80, reps: 6, rpe: 7 },
          { name: 'Seated DB press', sets: 3, weight: 22, reps: 10, rpe: 7 },
          { name: 'Triceps pushdown', sets: 3, weight: 25, reps: 12, rpe: 7 },
        ]},
        { name: 'Pull · Heavy', exercises: [
          { name: 'Deadlift', sets: 4, weight: 160, reps: 5, rpe: 8 },
          { name: 'Pull-up', sets: 4, weight: 0, reps: 8, rpe: 8 },
          { name: 'Barbell row', sets: 4, weight: 80, reps: 6, rpe: 7 },
        ]},
        { name: 'Legs · Heavy', exercises: [
          { name: 'Back squat', sets: 5, weight: 120, reps: 5, rpe: 8 },
          { name: 'Romanian DL', sets: 4, weight: 100, reps: 8, rpe: 7 },
          { name: 'Leg curl', sets: 4, weight: 50, reps: 12, rpe: 7 },
        ]},
      ];
      const maxDays = scope === 'last30' ? 30 : scope === 'year' ? 365 : 84;
      for (let d = 0; d < maxDays; d += 2) {
        const w = workouts[d % workouts.length];
        const date = new Date(today.getTime() - d * day).toISOString().split('T')[0];
        if (includes.workouts) {
          for (const ex of w.exercises) {
            for (let s = 1; s <= ex.sets; s++) {
              const weight = ex.weight + Math.round((Math.sin(d * 0.3) * 2.5)*2)/2;
              rows.push([date, w.name, ex.name, s, 'normal', weight, ex.reps, ex.rpe]);
            }
          }
        }
      }
      // Body weight rows
      if (includes.body) {
        rows.push(['', '', '', '', '', '', '', '']);
        rows.push(['date', 'body_weight_kg', 'body_fat_pct']);
        BODYWEIGHT_SERIES.forEach((bw, i) => {
          const date = new Date(today.getTime() - (BODYWEIGHT_SERIES.length - i) * 7 * day).toISOString().split('T')[0];
          rows.push([date, bw, '14.2']);
        });
      }
      // PRs
      if (includes.prs) {
        rows.push(['', '', '']);
        rows.push(['exercise', 'pr_weight_kg', 'pr_reps', 'date']);
        rows.push(['Deadlift', 180, 3, '2026-03-19']);
        rows.push(['Back squat', 140, 4, '2026-03-22']);
        rows.push(['Bench press', 92.5, 5, '2026-03-11']);
      }
      const csv = rows.map(r => r.map(v => {
        const s = String(v);
        return s.includes(',') || s.includes('"') ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hivo-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2400);
    }, 600);
  };

  const toggleInclude = (key) => setIncludes(s => ({ ...s, [key]: !s[key] }));

  return (
    <Sheet onClose={onClose} title="My data" subtitle="Export everything you've logged">
      {/* Range */}
      <div className="t-xs" style={{ marginBottom: 8 }}>Time range</div>
      <div style={{ display: 'flex', background: 'var(--bg-3)', borderRadius: 12, padding: 3, marginBottom: 16 }}>
        {[
          { id: 'last30', label: 'Last 30d' },
          { id: 'year', label: 'Last year' },
          { id: 'all', label: 'All time' },
        ].map(o => (
          <button key={o.id} onClick={() => setScope(o.id)} style={{
            flex: 1, padding: '9px 8px', borderRadius: 10,
            background: scope === o.id ? 'var(--bg-2)' : 'transparent',
            color: scope === o.id ? 'var(--fg)' : 'var(--fg-mute)',
            border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}>{o.label}</button>
        ))}
      </div>

      {/* Includes */}
      <div className="t-xs" style={{ marginBottom: 8 }}>Include</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {[
          { key: 'workouts', label: 'Workout logs', sub: 'Every set with weight, reps, RPE' },
          { key: 'body', label: 'Body measurements', sub: 'Weight, body fat %, dates' },
          { key: 'prs', label: 'Personal records', sub: 'Top lifts per exercise' },
        ].map(opt => (
          <button key={opt.key} onClick={() => toggleInclude(opt.key)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12,
            background: 'var(--bg-3)', border: '0.5px solid ' + (includes[opt.key] ? 'var(--accent)' : 'transparent'),
            color: 'inherit', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: includes[opt.key] ? 'var(--accent)' : 'transparent',
              border: '1.5px solid ' + (includes[opt.key] ? 'var(--accent)' : 'var(--line-strong)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-fg)', flexShrink: 0,
            }}>
              {includes[opt.key] && <I.check style={{ width: 13, height: 13, strokeWidth: 3 }}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-h3" style={{ fontSize: 13 }}>{opt.label}</div>
              <div className="t-xs" style={{ marginTop: 2, fontSize: 10.5, textTransform: 'none', letterSpacing: 0 }}>{opt.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div style={{
        padding: 10, borderRadius: 10, background: 'var(--bg-3)',
        display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14,
      }}>
        <I.info style={{ width: 13, height: 13, color: 'var(--accent)', marginTop: 1, flexShrink: 0 }}/>
        <span className="t-sm" style={{ fontSize: 11.5, lineHeight: 1.4 }}>
          Your data is yours. CSV is portable to Excel, Numbers, Google Sheets and any third-party fitness app.
        </span>
      </div>

      <button onClick={generateCSV} disabled={downloading || !Object.values(includes).some(Boolean)} className="btn btn-primary btn-block">
        {downloading ? 'Generating…' : downloaded ? <><I.check style={{ width: 14, height: 14 }}/> Downloaded</> : <>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M8 12l4 4 4-4M5 21h14"/></svg>
          Download CSV
        </>}
      </button>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────
// Reset history sheet
// ─────────────────────────────────────────────────────────────
function ResetHistorySheet({ onClose, onConfirm, done }) {
  const [confirm, setConfirm] = useStateO('');
  const phrase = 'RESET';
  const canReset = confirm === phrase;

  if (done) {
    return (
      <Sheet onClose={onClose} title="History cleared" subtitle="Your account is fresh">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 50, background: 'var(--accent-soft)',
            margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)',
          }}>
            <I.check style={{ width: 30, height: 30, strokeWidth: 2.5 }}/>
          </div>
          <div className="t-h2">All clear</div>
          <div className="t-sm" style={{ marginTop: 6, maxWidth: 260, margin: '6px auto 0' }}>
            All workouts, PRs, body measurements and streak progress have been deleted.
          </div>
        </div>
        <button onClick={onClose} className="btn btn-primary btn-block" style={{ marginTop: 16 }}>Done</button>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} title="Reset all history" subtitle="This action cannot be undone">
      <div style={{
        padding: 14, borderRadius: 12,
        background: 'rgba(255,107,107,0.10)', border: '0.5px solid rgba(255,107,107,0.3)',
        display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16,
      }}>
        <I.warn style={{ width: 16, height: 16, color: 'var(--err)', flexShrink: 0, marginTop: 1 }}/>
        <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
          You're about to delete:
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: 'var(--fg-mid)' }}>
            <li>All logged workouts ({312})</li>
            <li>All PRs and 1RM records</li>
            <li>Body measurements and progress photos</li>
            <li>Streak ({USER.streak} days) and earned shields</li>
          </ul>
          <div style={{ marginTop: 8, color: 'var(--fg)' }}>
            Your account, routines and clan membership stay intact.
          </div>
        </div>
      </div>

      <div className="t-xs" style={{ marginBottom: 8, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
        Type <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--err)' }}>{phrase}</strong> to confirm
      </div>
      <input
        value={confirm}
        onChange={(e) => setConfirm(e.target.value.toUpperCase())}
        placeholder="Type RESET"
        autoCapitalize="characters"
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          background: 'var(--bg-3)', border: '0.5px solid ' + (canReset ? 'var(--err)' : 'var(--line)'),
          color: canReset ? 'var(--err)' : 'var(--fg)',
          fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.1em',
          outline: 'none', textAlign: 'center', fontWeight: 600,
        }}/>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={onClose} className="btn" style={{ flex: 1, background: 'var(--bg-3)' }}>Cancel</button>
        <button onClick={onConfirm} disabled={!canReset} style={{
          flex: 1, padding: '14px 16px', borderRadius: 14,
          background: canReset ? 'var(--err)' : 'var(--bg-3)',
          color: canReset ? '#fff' : 'var(--fg-dim)',
          border: 'none', cursor: canReset ? 'pointer' : 'default',
          fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
        }}>
          Reset history
        </button>
      </div>
    </Sheet>
  );
}

Object.assign(window, { TrainScreen, SquadScreen, StatsScreen, ProfileScreen });
