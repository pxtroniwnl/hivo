// clan-onboarding.jsx — Screen shown when user has no clan
const { useState: useStateC, useEffect: useEffectC } = React;

// Rich clan dataset for discovery
const DISCOVER_CLANS = [
  {
    id: 'IRC-4892', name: 'Iron Crows', tag: 'CRWS',
    members: 6, max: 8, rank: 'Diamond', region: 'Madrid',
    description: 'High-volume strength clan. Six lifters running PPL with a focus on big compounds. Spanish + English.',
    color: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
    trending: true, openToJoin: true,
    weeklyVolume: 92400, prs: 14, ageRange: '24–32',
    sample: ['Mara V.', 'Diego R.', 'Tea M.', 'Yuki S.'],
  },
  {
    id: 'STP-1023', name: 'Steel Pact', tag: 'STPC',
    members: 8, max: 8, rank: 'Diamond', region: 'Barcelona',
    description: 'Full clan focused on powerlifting. Members run 5/3/1 and Conjugate. Weekly meets, strict accountability.',
    color: 'linear-gradient(135deg, #5a5a5a, #2a2a2a)',
    trending: true, openToJoin: false,
    weeklyVolume: 118200, prs: 22, ageRange: '28–40',
    sample: ['Pablo G.', 'Inés R.', 'Alex F.'],
  },
  {
    id: 'GLT-2208', name: 'Glúteas Power', tag: 'GLT',
    members: 5, max: 8, rank: 'Gold', region: 'Valencia',
    description: 'Glute & posterior chain hypertrophy. Twice-weekly hip thrust raids. Mujeres + amigos.',
    color: 'linear-gradient(135deg, #ff7b9c, #c2185b)',
    trending: true, openToJoin: true,
    weeklyVolume: 71800, prs: 9, ageRange: '22–30',
    sample: ['Lucía A.', 'Marta T.', 'Sofía R.'],
  },
  {
    id: 'NRT-7711', name: 'Norte Power', tag: 'NRT',
    members: 5, max: 8, rank: 'Gold', region: 'Bilbao',
    description: 'Casual but consistent. Mostly first-year lifters supporting each other. New members welcome.',
    color: 'linear-gradient(135deg, #4d9cff, #1a3d80)',
    trending: false, openToJoin: true,
    weeklyVolume: 42100, prs: 5, ageRange: '18–24',
    sample: ['Iker M.', 'Aitor B.'],
  },
  {
    id: 'CFR-4401', name: 'Casa Fuerte', tag: 'CFR',
    members: 4, max: 8, rank: 'Gold', region: 'Sevilla',
    description: 'Home-gym lifters. Equipment-light routines, lots of bodyweight + dumbbells. Calm + supportive.',
    color: 'linear-gradient(135deg, #c9a16e, #6b4422)',
    trending: false, openToJoin: true,
    weeklyVolume: 38500, prs: 7, ageRange: '30–45',
    sample: ['Javier P.', 'Rocío L.'],
  },
  {
    id: 'WHL-9020', name: 'Wheel House', tag: 'WHL',
    members: 7, max: 8, rank: 'Platinum', region: 'Berlin',
    description: 'English-speaking clan with a leg-day obsession. "Don\'t skip leg day, even on holiday."',
    color: 'linear-gradient(135deg, #c9f24a, #6b8e1e)',
    trending: true, openToJoin: true,
    weeklyVolume: 86700, prs: 11, ageRange: '26–35',
    sample: ['Lukas H.', 'Anya P.', 'Mike T.', 'Sara K.'],
  },
];

// ─────────────────────────────────────────────────────────────
// Main onboarding screen
// ─────────────────────────────────────────────────────────────
function ClanOnboarding({ onJoined }) {
  const [query, setQuery] = useStateC('');
  const [tab, setTab] = useStateC('trending'); // trending | all
  const [previewing, setPreviewing] = useStateC(null);
  const [creating, setCreating] = useStateC(false);
  const [requestedIds, setRequestedIds] = useStateC(new Set());

  const allMatches = query.trim()
    ? DISCOVER_CLANS.filter(c =>
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.tag.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const trending = DISCOVER_CLANS.filter(c => c.trending);
  const all = DISCOVER_CLANS;

  return (
    <div className="screen-in" style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Find your clan" subtitle="Hivo is better with 2–8 lifters"/>

      {/* No-clan banner */}
      <div style={{ padding: '0 18px 14px' }}>
        <div className="card-elev" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 140, height: 140,
            borderRadius: '50%', background: 'var(--accent)', opacity: 0.12, filter: 'blur(40px)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <I.squad style={{ width: 18, height: 18, color: 'var(--accent)' }}/>
              <span className="t-h3" style={{ fontSize: 14 }}>You're flying solo</span>
            </div>
            <div className="t-sm" style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.45 }}>
              Clans share weekly missions, raids and rescues. Find one by name or ID, browse trending, or create your own.
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 18px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 12,
          background: 'var(--bg-2)', border: '0.5px solid var(--line)',
        }}>
          <SearchIconC/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or ID (e.g. IRC-4892)"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
            }}/>
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: 'transparent', border: 'none', color: 'var(--fg-mute)', cursor: 'pointer', padding: 0,
            }}><I.close style={{ width: 14, height: 14 }}/></button>
          )}
        </div>
      </div>

      {/* Create clan CTA */}
      <div style={{ padding: '0 18px 14px' }}>
        <button onClick={() => setCreating(true)} style={{
          width: '100%', padding: 14, borderRadius: 12,
          background: 'transparent', border: '0.5px dashed var(--line-strong)',
          color: 'var(--fg)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', flexShrink: 0,
          }}>
            <I.plus style={{ width: 18, height: 18 }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-h3" style={{ fontSize: 14 }}>Create a new clan</div>
            <div className="t-sm" style={{ marginTop: 2 }}>Be the founder · invite up to 7 friends</div>
          </div>
          <I.arrow style={{ width: 16, height: 16, color: 'var(--fg-mute)' }}/>
        </button>
      </div>

      {allMatches ? (
        <div style={{ padding: '0 18px' }}>
          <div className="t-xs" style={{ marginBottom: 10 }}>{allMatches.length} match{allMatches.length !== 1 ? 'es' : ''}</div>
          {allMatches.length === 0 ? (
            <div className="card" style={{ padding: 22, textAlign: 'center' }}>
              <div className="t-sm" style={{ fontSize: 13 }}>No clan matches "{query}".</div>
              <button onClick={() => setCreating(true)} className="btn" style={{ marginTop: 12, background: 'var(--bg-3)' }}>
                <I.plus style={{ width: 14, height: 14 }}/> Create "{query}" clan
              </button>
            </div>
          ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allMatches.map(c => (
                <ClanCard key={c.id} clan={c} onTap={() => setPreviewing(c)} requested={requestedIds.has(c.id)}/>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Segmented */}
          <div style={{ padding: '0 18px 14px' }}>
            <div style={{
              display: 'flex', background: 'var(--bg-2)', borderRadius: 12, padding: 3,
              border: '0.5px solid var(--line)',
            }}>
              {[
                { id: 'trending', label: 'Trending' },
                { id: 'all', label: 'All clans' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: '9px 12px', borderRadius: 10,
                  background: tab === t.id ? 'var(--bg-3)' : 'transparent',
                  color: tab === t.id ? 'var(--fg)' : 'var(--fg-mute)',
                  border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          <div className="stagger" style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(tab === 'trending' ? trending : all).map(c => (
              <ClanCard key={c.id} clan={c} onTap={() => setPreviewing(c)} requested={requestedIds.has(c.id)}/>
            ))}
          </div>
        </>
      )}

      {/* Preview sheet */}
      {previewing && (
        <ClanPreviewSheet
          clan={previewing}
          requested={requestedIds.has(previewing.id)}
          onClose={() => setPreviewing(null)}
          onRequest={() => {
            setRequestedIds(s => new Set([...s, previewing.id]));
          }}
          onSimulateAccept={() => {
            const c = previewing;
            setPreviewing(null);
            onJoined({
              id: c.id, name: c.name, tag: c.tag,
              members: c.members + 1, rank: c.rank, rankProgress: 0.62,
              week: 'Week 3 of season', online: 3,
              raid: CLAN.raid, missions: CLAN.missions,
              fromOnboarding: true,
            });
          }}
        />
      )}

      {creating && <CreateClanSheet onClose={() => setCreating(false)} onCreate={(clan) => onJoined(clan)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Clan card
// ─────────────────────────────────────────────────────────────
function ClanCard({ clan, onTap, requested }) {
  return (
    <button onClick={onTap} className="card hover-lift" style={{
      width: '100%', padding: 14, textAlign: 'left', cursor: 'pointer',
      border: '0.5px solid var(--line)', color: 'inherit',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: clan.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: '#fff',
        fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
      }}>{clan.tag.slice(0,3)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span className="t-h3" style={{ fontSize: 14 }}>{clan.name}</span>
          {clan.trending && <Chip variant="acc" style={{ fontSize: 9, padding: '2px 7px' }}>Trending</Chip>}
          {requested && <Chip style={{ fontSize: 9, padding: '2px 7px', background: 'rgba(245,181,74,0.15)', color: 'var(--warn)' }}>Pending</Chip>}
        </div>
        <div className="t-sm" style={{ marginTop: 3, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-mute)' }}>{clan.id}</span>
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>{clan.members}/{clan.max}</span>
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>{clan.rank}</span>
        </div>
      </div>
      <I.arrow style={{ width: 16, height: 16, color: 'var(--fg-mute)', flexShrink: 0 }}/>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Preview sheet — full info + Request to join
// ─────────────────────────────────────────────────────────────
function ClanPreviewSheet({ clan, requested, onClose, onRequest, onSimulateAccept }) {
  return (
    <Sheet onClose={onClose} title={clan.name} subtitle={
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{clan.id}</span>
        <span>·</span>
        <span>{clan.rank}</span>
        <span>·</span>
        <span>{clan.region}</span>
      </span>
    }>
      {/* Photo / banner */}
      <div style={{
        height: 110, borderRadius: 14, overflow: 'hidden',
        background: clan.color, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.02em',
          textShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>{clan.tag}</div>
        {clan.trending && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            padding: '4px 8px', borderRadius: 999,
            background: 'rgba(0,0,0,0.4)', color: '#fff',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
            backdropFilter: 'blur(8px)',
          }}>TRENDING</div>
        )}
      </div>

      {/* Members */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex' }}>
          {clan.sample.map((name, i) => (
            <div key={name} style={{
              marginLeft: i === 0 ? 0 : -8,
              border: '2px solid var(--bg-2)', borderRadius: 50,
            }}>
              <Avatar name={name} size={30}/>
            </div>
          ))}
          {clan.members > clan.sample.length && (
            <div style={{
              marginLeft: -8, width: 30, height: 30, borderRadius: 50,
              border: '2px solid var(--bg-2)', background: 'var(--bg-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, color: 'var(--fg-mid)',
            }}>+{clan.members - clan.sample.length}</div>
          )}
        </div>
        <span className="t-sm">{clan.members}/{clan.max} members · ages {clan.ageRange}</span>
      </div>

      {/* Description */}
      <div className="t-sm" style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--fg)', marginBottom: 14 }}>
        {clan.description}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
        <PreviewStat label="Weekly volume" value={`${(clan.weeklyVolume/1000).toFixed(0)}k`} unit="kg"/>
        <PreviewStat label="PRs / month" value={clan.prs}/>
        <PreviewStat label="Rank" value={clan.rank}/>
      </div>

      {/* Join CTA */}
      {!clan.openToJoin ? (
        <div style={{
          padding: 14, borderRadius: 12, background: 'var(--bg-3)',
          textAlign: 'center', marginBottom: 8,
        }}>
          <div className="t-h3" style={{ fontSize: 13 }}>Clan is full</div>
          <div className="t-sm" style={{ marginTop: 4, fontSize: 12 }}>Check back when a spot opens up.</div>
        </div>
      ) : requested ? (
        <div style={{
          padding: 14, borderRadius: 12,
          background: 'rgba(245,181,74,0.10)', border: '0.5px solid rgba(245,181,74,0.3)',
          marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <I.timer style={{ width: 16, height: 16, color: 'var(--warn)' }}/>
            <span className="t-h3" style={{ fontSize: 13 }}>Request sent</span>
          </div>
          <div className="t-sm" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4 }}>
            Waiting for a clan member to approve your request. You'll get a notification when it's accepted.
          </div>
          <button onClick={onSimulateAccept} style={{
            marginTop: 12, width: '100%', padding: 10, borderRadius: 10,
            background: 'var(--accent-soft)', border: '0.5px dashed var(--accent)',
            color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            ▶ Simulate approval (demo)
          </button>
        </div>
      ) : (
        <button onClick={onRequest} className="btn btn-primary btn-block">
          <I.squad style={{ width: 15, height: 15 }}/> Request to join
        </button>
      )}
    </Sheet>
  );
}

function PreviewStat({ label, value, unit }) {
  return (
    <div style={{ padding: 10, borderRadius: 10, background: 'var(--bg-3)' }}>
      <div className="t-xs" style={{ fontSize: 9 }}>{label}</div>
      <div className="t-mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 4, letterSpacing: '-0.02em' }}>
        {value}{unit && <span style={{ fontSize: 10, color: 'var(--fg-mute)', marginLeft: 2 }}>{unit}</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Create clan sheet
// ─────────────────────────────────────────────────────────────
const CLAN_COLORS = [
  'linear-gradient(135deg, var(--accent), var(--accent-deep))',
  'linear-gradient(135deg, #4d9cff, #1a3d80)',
  'linear-gradient(135deg, #c9f24a, #6b8e1e)',
  'linear-gradient(135deg, #ff8a3d, #cc5a18)',
  'linear-gradient(135deg, #c9a16e, #6b4422)',
  'linear-gradient(135deg, #b26bff, #5e3aa6)',
];

function CreateClanSheet({ onClose, onCreate }) {
  const [name, setName] = useStateC('');
  const [description, setDescription] = useStateC('');
  const [colorIdx, setColorIdx] = useStateC(0);
  const [privacy, setPrivacy] = useStateC('open'); // open | invite
  const tag = (name.trim().slice(0,3) || 'NEW').toUpperCase();
  const id = useEffectFakeId(name);

  const canCreate = name.trim().length >= 3;

  return (
    <Sheet onClose={onClose} title="Create a clan" subtitle="You'll be the founder">
      {/* Preview banner */}
      <div style={{
        height: 90, borderRadius: 14, overflow: 'hidden',
        background: CLAN_COLORS[colorIdx],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14, position: 'relative',
      }}>
        <div style={{
          fontSize: 36, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em', textShadow: '0 4px 18px rgba(0,0,0,0.25)',
        }}>{tag}</div>
        <div style={{
          position: 'absolute', bottom: 8, right: 10,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em',
        }}>{id}</div>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FieldC label="Clan name" value={name} onChange={setName} placeholder="e.g. Bench Brigade" max={24}/>
        <FieldC label="Description" value={description} onChange={setDescription} placeholder="What is your clan about? (optional)" multi/>

        {/* Color */}
        <div>
          <div className="t-xs" style={{ marginBottom: 8, fontSize: 10 }}>Color</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {CLAN_COLORS.map((c, i) => (
              <button key={i} onClick={() => setColorIdx(i)} style={{
                width: 32, height: 32, borderRadius: 8,
                background: c, border: i === colorIdx ? '2px solid var(--fg)' : '0.5px solid var(--line)',
                cursor: 'pointer', padding: 0,
              }}/>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div>
          <div className="t-xs" style={{ marginBottom: 8, fontSize: 10 }}>Joining</div>
          <div style={{
            display: 'flex', background: 'var(--bg-3)', borderRadius: 12, padding: 3,
          }}>
            {[
              { id: 'open', label: 'Open · approve' },
              { id: 'invite', label: 'Invite only' },
            ].map(p => (
              <button key={p.id} onClick={() => setPrivacy(p.id)} style={{
                flex: 1, padding: '8px 10px', borderRadius: 10,
                background: privacy === p.id ? 'var(--bg-2)' : 'transparent',
                color: privacy === p.id ? 'var(--fg)' : 'var(--fg-mute)',
                border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Create CTA */}
      <button
        onClick={() => {
          const newClan = {
            id, name: name.trim(), tag,
            members: 1, max: 8, rank: 'Bronze', rankProgress: 0,
            week: 'Week 1 · founding', online: 1,
            color: CLAN_COLORS[colorIdx], description,
            raid: { name: 'First Raid · Choose target', target: 10000, current: 0, unit: 'kg', daysLeft: 7, contributions: [
              { name: 'You', value: 0, you: true },
            ]},
            missions: [
              { id: 'm1', title: 'Onboard the founders', subtitle: 'Invite at least 1 friend this week', progress: 0, members: 0 },
            ],
            isFounder: true,
          };
          onCreate(newClan);
        }}
        disabled={!canCreate}
        className="btn btn-primary btn-block"
        style={{ marginTop: 18, opacity: canCreate ? 1 : 0.4 }}>
        Create clan <I.arrow style={{ width: 15, height: 15 }}/>
      </button>
      <div className="t-xs" style={{ marginTop: 8, textAlign: 'center', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>
        You'll be able to invite friends after creating.
      </div>
    </Sheet>
  );
}

function FieldC({ label, value, onChange, placeholder, multi, max }) {
  const Tag = multi ? 'textarea' : 'input';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="t-xs" style={{ fontSize: 10 }}>{label}</div>
        {max && <div className="t-xs" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--fg-mute)' }}>{value.length}/{max}</div>}
      </div>
      <Tag
        value={value}
        onChange={e => onChange(max ? e.target.value.slice(0, max) : e.target.value)}
        placeholder={placeholder}
        rows={multi ? 2 : undefined}
        style={{
          width: '100%', padding: '11px 13px', borderRadius: 12,
          background: 'var(--bg-3)', border: '0.5px solid var(--line)',
          color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
          outline: 'none', resize: multi ? 'vertical' : 'none',
        }}/>
    </div>
  );
}

// Generate deterministic-looking ID based on name
function useEffectFakeId(name) {
  const tag = (name.trim().slice(0,3) || 'NEW').toUpperCase();
  // hash-based 4-digit
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0x7fff;
  const num = String((h % 9000) + 1000);
  return `${tag}-${num}`;
}

function SearchIconC() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--fg-mute)" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M16 16l4 4"/>
    </svg>
  );
}

Object.assign(window, { ClanOnboarding });
