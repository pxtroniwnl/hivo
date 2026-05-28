// auth.jsx — Login + Register screens
const { useState: useStateAu, useEffect: useEffectAu } = React;

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useStateAu('login'); // login | register
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--bg-0)', color: 'var(--fg)',
      paddingTop: 58,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 380, height: 380, borderRadius: '50%',
        background: 'var(--accent)', opacity: 0.15, filter: 'blur(80px)',
        pointerEvents: 'none',
      }}/>
      {/* Logo watermark — large, faded, drifting */}
      <img
        src="assets/hivo-mark.png"
        alt=""
        aria-hidden="true"
        className="float"
        style={{
          position: 'absolute',
          top: 230, right: -90,
          width: 320, height: 320,
          opacity: 0.06,
          pointerEvents: 'none',
        }}/>

      {/* Logo + hero */}
      <div style={{ padding: '24px 24px 0', position: 'relative' }}>
        <HivoMark/>
        <div className="t-display" style={{ marginTop: 28, fontSize: 36, lineHeight: 1.02 }}>
          Train hard.<br/>
          <span style={{ color: 'var(--accent)' }}>Together.</span>
        </div>
        <div className="t-sm" style={{ marginTop: 10, maxWidth: 280 }}>
          A strength training app with adaptive coaching and clans that lift with you.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{
          display: 'flex', background: 'var(--bg-2)', borderRadius: 12, padding: 3,
          border: '0.5px solid var(--line)',
        }}>
          {[
            { id: 'login', label: 'Sign in' },
            { id: 'register', label: 'Create account' },
          ].map(t => (
            <button key={t.id} onClick={() => setMode(t.id)} style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: mode === t.id ? 'var(--bg-3)' : 'transparent',
              color: mode === t.id ? 'var(--fg)' : 'var(--fg-mute)',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="hv-scroll" style={{ flex: 1, padding: '20px 24px 24px' }}>
        {mode === 'login' ? <LoginForm onAuthed={onAuthed}/> : <RegisterForm onAuthed={onAuthed}/>}

        {/* OAuth */}
        <div style={{
          marginTop: 18, display: 'flex', alignItems: 'center', gap: 10,
          color: 'var(--fg-mute)',
        }}>
          <div style={{ flex: 1, height: 0.5, background: 'var(--line)' }}/>
          <span className="t-xs" style={{ fontSize: 10 }}>OR</span>
          <div style={{ flex: 1, height: 0.5, background: 'var(--line)' }}/>
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <OAuthButton kind="apple" onAuthed={onAuthed}/>
          <OAuthButton kind="google" onAuthed={onAuthed}/>
        </div>

        {/* Skip */}
        <button onClick={() => onAuthed({ name: 'Demo User', handle: 'demo' })} style={{
          marginTop: 22, width: '100%', padding: 12,
          background: 'transparent', border: 'none',
          color: 'var(--fg-mute)', fontSize: 12, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Skip — try the demo
        </button>
      </div>
    </div>
  );
}

function HivoMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img
        src="assets/hivo-mark.png"
        alt="Hivo"
        style={{
          width: 56, height: 56,
          filter: 'drop-shadow(0 8px 24px var(--accent-soft))',
        }}/>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>Hivo</div>
        <div className="t-xs" style={{ marginTop: -2, fontSize: 10 }}>strength · together</div>
      </div>
    </div>
  );
}

function LoginForm({ onAuthed }) {
  const [email, setEmail] = useStateAu('');
  const [pw, setPw] = useStateAu('');
  const [showPw, setShowPw] = useStateAu(false);
  const [error, setError] = useStateAu(null);
  const [loading, setLoading] = useStateAu(false);

  const submit = () => {
    setError(null);
    if (!email || !pw) { setError('Email and password required'); return; }
    if (!email.includes('@')) { setError('Email must include @'); return; }
    setLoading(true);
    setTimeout(() => {
      const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      onAuthed({ name, handle: email.split('@')[0] });
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@gym.com"/>
      <Field
        label="Password" type={showPw ? 'text' : 'password'} value={pw} onChange={setPw} placeholder="••••••••"
        right={
          <button onClick={() => setShowPw(s => !s)} style={{
            background: 'transparent', border: 'none', color: 'var(--fg-mute)',
            fontSize: 11, cursor: 'pointer', padding: 0,
          }}>{showPw ? 'Hide' : 'Show'}</button>
        }
      />
      {error && <div className="t-sm" style={{ color: 'var(--err)', fontSize: 12 }}>{error}</div>}
      <button onClick={submit} disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: 6 }}>
        {loading ? 'Signing in…' : 'Sign in'} <I.arrow style={{ width: 15, height: 15 }}/>
      </button>
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--fg-mid)', fontSize: 12, cursor: 'pointer' }}>
          Forgot password?
        </button>
      </div>
    </div>
  );
}

function RegisterForm({ onAuthed }) {
  const [name, setName] = useStateAu('');
  const [email, setEmail] = useStateAu('');
  const [pw, setPw] = useStateAu('');
  const [showPw, setShowPw] = useStateAu(false);
  const [agree, setAgree] = useStateAu(false);
  const [error, setError] = useStateAu(null);
  const [loading, setLoading] = useStateAu(false);

  const strength = (() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  })();

  const submit = () => {
    setError(null);
    if (!name || !email || !pw) { setError('All fields required'); return; }
    if (!email.includes('@')) { setError('Email must include @'); return; }
    if (pw.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!agree) { setError('You must accept the terms'); return; }
    setLoading(true);
    setTimeout(() => {
      onAuthed({ name, handle: email.split('@')[0] });
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Name" value={name} onChange={setName} placeholder="Mara Vidal"/>
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@gym.com"/>
      <Field
        label="Password" type={showPw ? 'text' : 'password'} value={pw} onChange={setPw} placeholder="At least 8 characters"
        right={
          <button onClick={() => setShowPw(s => !s)} style={{
            background: 'transparent', border: 'none', color: 'var(--fg-mute)',
            fontSize: 11, cursor: 'pointer', padding: 0,
          }}>{showPw ? 'Hide' : 'Show'}</button>
        }
      />
      {/* Strength meter */}
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: n <= strength
              ? (strength <= 1 ? 'var(--err)' : strength === 2 ? 'var(--warn)' : strength === 3 ? '#f5d54a' : 'var(--ok)')
              : 'var(--bg-3)',
            transition: 'background 0.15s',
          }}/>
        ))}
      </div>

      {/* Terms */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4, cursor: 'pointer' }}>
        <button onClick={() => setAgree(a => !a)} style={{
          width: 18, height: 18, borderRadius: 5,
          background: agree ? 'var(--accent)' : 'transparent',
          border: '1.5px solid ' + (agree ? 'var(--accent)' : 'var(--line-strong)'),
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-fg)',
        }}>
          {agree && <I.check style={{ width: 12, height: 12, strokeWidth: 3 }}/>}
        </button>
        <span className="t-sm" style={{ fontSize: 11.5, lineHeight: 1.4 }}>
          I agree to the <span style={{ color: 'var(--accent)' }}>Terms</span> and <span style={{ color: 'var(--accent)' }}>Privacy Policy</span>.
        </span>
      </label>

      {error && <div className="t-sm" style={{ color: 'var(--err)', fontSize: 12 }}>{error}</div>}
      <button onClick={submit} disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: 4 }}>
        {loading ? 'Creating account…' : 'Create account'} <I.arrow style={{ width: 15, height: 15 }}/>
      </button>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, right }) {
  return (
    <div>
      <div className="t-xs" style={{ marginBottom: 6, fontSize: 10 }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 14px', borderRadius: 12,
        background: 'var(--bg-2)', border: '0.5px solid var(--line)',
      }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
          }}/>
        {right}
      </div>
    </div>
  );
}

function OAuthButton({ kind, onAuthed }) {
  const config = {
    apple:  { label: 'Continue with Apple', icon: <AppleIcon/>, bg: '#fff', fg: '#000' },
    google: { label: 'Continue with Google', icon: <GoogleIcon/>, bg: 'var(--bg-2)', fg: 'var(--fg)' },
  }[kind];
  return (
    <button onClick={() => onAuthed({ name: 'Demo User', handle: 'demo' })} style={{
      width: '100%', padding: '13px 16px', borderRadius: 12,
      background: config.bg, color: config.fg,
      border: '0.5px solid var(--line)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    }}>
      {config.icon} {config.label}
    </button>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M17.05 12.74c-.04-3.6 2.94-5.32 3.08-5.41-1.68-2.46-4.3-2.8-5.23-2.83-2.22-.22-4.34 1.31-5.47 1.31-1.15 0-2.88-1.28-4.74-1.25-2.43.04-4.7 1.42-5.95 3.6C-3.78 12.51-1.83 19.04.62 22.66c1.2 1.77 2.61 3.75 4.47 3.68 1.8-.07 2.48-1.16 4.65-1.16 2.15 0 2.77 1.16 4.66 1.12 1.93-.03 3.15-1.79 4.32-3.57.13-.21 2.5-3.42.05-6.99zM13.6 2.93c.99-1.21 1.66-2.88 1.48-4.55-1.43.06-3.16.95-4.18 2.15-.92 1.06-1.72 2.77-1.51 4.4 1.6.13 3.23-.81 4.21-2z"/>
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.59 6.59 0 015.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 001 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

Object.assign(window, { AuthScreen });
