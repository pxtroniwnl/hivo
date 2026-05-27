// app.jsx — Hivo prototype shell

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#b26bff",
  "background": "#08080a",
  "fontPair": "geist",
  "density": "comfy",
  "layout": "hybrid",
  "gamification": true
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  '#b26bff': { soft: 'rgba(178,107,255,0.16)', deep: '#7a3fe0', fg: '#0a0210' },          // purple (default)
  '#e63946': { soft: 'rgba(230,57,70,0.16)', deep: '#a3242f', fg: '#1a0507' },            // blood red
  '#c9f24a': { soft: 'rgba(201,242,74,0.18)', deep: '#8fb52e', fg: '#0a1300' },           // lime
  '#ff8a3d': { soft: 'rgba(255,138,61,0.18)', deep: '#cc5a18', fg: '#1a0c00' },           // orange
  '#4d9cff': { soft: 'rgba(77,156,255,0.18)', deep: '#2a6bcc', fg: '#000a18' },           // electric blue
};

const BG_PRESETS = {
  '#08080a': { bg0: '#08080a', bg1: '#101014', bg2: '#16161d', bg3: '#1d1d26', bg4: '#25252f', name: 'True black' },
  '#15151c': { bg0: '#15151c', bg1: '#1a1a22', bg2: '#20202a', bg3: '#272732', bg4: '#30303d', name: 'Charcoal' },
  '#0a0e1f': { bg0: '#0a0e1f', bg1: '#101630', bg2: '#161e3d', bg3: '#1d2750', bg4: '#293465', name: 'Midnight' },
};

const FONT_PAIRS = {
  geist: { sans: "'Geist', ui-sans-serif, system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace", label: 'Geist + Mono' },
  manrope: { sans: "'Manrope', ui-sans-serif, system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace", label: 'Manrope' },
  mono: { sans: "'JetBrains Mono', ui-monospace, monospace", mono: "'JetBrains Mono', ui-monospace, monospace", label: 'All mono' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('home');
  const [active, setActive] = React.useState(false);
  const [activeMode, setActiveMode] = React.useState('live'); // 'live' | 'log-past'
  const [trainModal, setTrainModal] = React.useState(false);
  const [myRoutines, setMyRoutines] = React.useState(() => JSON.parse(JSON.stringify(ROUTINES.mine)));
  const [myWorkouts, setMyWorkouts] = React.useState(() => JSON.parse(JSON.stringify(WORKOUTS.mine)));
  const [authedUser, setAuthedUser] = React.useState(null);
  const [userClan, setUserClan] = React.useState(null); // null = no clan yet

  // Apply tokens to :root
  React.useEffect(() => {
    const r = document.documentElement;
    const acc = ACCENT_PRESETS[t.accent] || ACCENT_PRESETS['#b26bff'];
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-soft', acc.soft);
    r.style.setProperty('--accent-deep', acc.deep);
    r.style.setProperty('--accent-fg', acc.fg);

    const bg = BG_PRESETS[t.background] || BG_PRESETS['#08080a'];
    r.style.setProperty('--bg-0', bg.bg0);
    r.style.setProperty('--bg-1', bg.bg1);
    r.style.setProperty('--bg-2', bg.bg2);
    r.style.setProperty('--bg-3', bg.bg3);
    r.style.setProperty('--bg-4', bg.bg4);

    const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS.geist;
    r.style.setProperty('--font-sans', fp.sans);
    r.style.setProperty('--font-mono', fp.mono);

    r.style.setProperty('--d', t.density === 'compact' ? '0.85' : '1');
  }, [t.accent, t.background, t.fontPair, t.density]);

  const startWorkout = (mode) => { setActiveMode(mode === 'log-past' ? 'log-past' : 'live'); setActive(true); };
  const exitWorkout = () => setActive(false);

  // Not authed → show auth screen full-bleed inside the device frame
  if (!authedUser) {
    return (
      <div style={{ width: '100%', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IOSDevice width={402} height={874} dark={true}>
          <AuthScreen onAuthed={(u) => setAuthedUser(u)}/>
        </IOSDevice>
        <TweaksPanel>
          <TweakSection label="Accent"/>
          <TweakColor label="Color" value={t.accent}
            options={['#b26bff', '#e63946', '#c9f24a', '#ff8a3d', '#4d9cff']}
            onChange={v => setTweak('accent', v)}/>
          <TweakSection label="Background"/>
          <TweakColor label="Tone" value={t.background}
            options={['#08080a', '#15151c', '#0a0e1f']}
            onChange={v => setTweak('background', v)}/>
        </TweaksPanel>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IOSDevice width={402} height={874} dark={true}>
        <div className="hv-screen">
          {active ? (
            <ActiveWorkout onExit={exitWorkout} layout={t.layout} mode={activeMode}/>
          ) : (
            <>
              <div className="hv-scroll" style={{ paddingTop: 8 }}>
                {tab === 'home' && <HomeScreen onStart={startWorkout} onTab={setTab} gamification={t.gamification} authedUser={authedUser} userClan={userClan} myWorkouts={myWorkouts} myRoutines={myRoutines}/>}
                {tab === 'train' && <TrainScreen onStart={startWorkout} onModalChange={setTrainModal} myRoutines={myRoutines} setMyRoutines={setMyRoutines} myWorkouts={myWorkouts} setMyWorkouts={setMyWorkouts}/>}
                {tab === 'squad' && <SquadScreen userClan={userClan} onJoinClan={setUserClan} onLeaveClan={() => setUserClan(null)}/>}
                {tab === 'stats' && <StatsScreen/>}
                {tab === 'profile' && <ProfileScreen gamification={t.gamification} authedUser={authedUser}/>}
              </div>
              {!trainModal && <TabBar tab={tab} setTab={setTab} gamification={t.gamification}/>}
            </>
          )}
        </div>
      </IOSDevice>

      <TweaksPanel>
        <TweakSection label="Accent"/>
        <TweakColor label="Color" value={t.accent}
          options={['#b26bff', '#e63946', '#c9f24a', '#ff8a3d', '#4d9cff']}
          onChange={v => setTweak('accent', v)}/>

        <TweakSection label="Background"/>
        <TweakColor label="Tone" value={t.background}
          options={['#08080a', '#15151c', '#0a0e1f']}
          onChange={v => setTweak('background', v)}/>

        <TweakSection label="Typography"/>
        <TweakRadio label="Font" value={t.fontPair}
          options={['geist', 'manrope', 'mono']}
          onChange={v => setTweak('fontPair', v)}/>

        <TweakSection label="Layout"/>
        <TweakRadio label="Density" value={t.density}
          options={['compact', 'comfy']}
          onChange={v => setTweak('density', v)}/>
        <TweakRadio label="Logger" value={t.layout}
          options={['list', 'hybrid', 'focus']}
          onChange={v => setTweak('layout', v)}/>

        <TweakSection label="Gamification"/>
        <TweakToggle label="Clan / streak / ranks" value={t.gamification}
          onChange={v => setTweak('gamification', v)}/>
      </TweaksPanel>
    </div>
  );
}

function TabBar({ tab, setTab, gamification }) {
  const tabs = [
    { id: 'home',    label: 'Today', icon: I.home },
    { id: 'train',   label: 'Train', icon: I.dumb },
    ...(gamification ? [{ id: 'squad', label: 'Squad', icon: I.squad }] : []),
    { id: 'stats',   label: 'Stats', icon: I.chart },
    { id: 'profile', label: 'You',   icon: I.user },
  ];
  return (
    <div className="tabbar">
      {tabs.map(T => (
        <button key={T.id} className={'tab' + (tab === T.id ? ' on' : '')} onClick={() => setTab(T.id)}>
          <T.icon/>
          <span>{T.label}</span>
        </button>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
