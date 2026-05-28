// body.jsx — Front + Back body silhouette with muscle-group heatmap

// values: { chest: 0.8, shoulders: 0.5, ... } 0..1 intensity
function BodyHeatmap({ values = {}, scale = 1, showLabels = false }) {
  const v = (k) => Math.max(0, Math.min(1, values[k] ?? 0));
  const fill = (k) => {
    const x = v(k);
    if (x < 0.05) return 'var(--bg-3)';
    // accent at growing opacity
    return `color-mix(in oklab, var(--accent) ${Math.round(15 + x * 80)}%, var(--bg-3))`;
  };
  const stroke = 'rgba(255,255,255,0.08)';
  const strokeW = 0.8;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '6px 0' }}>
      <BodyView side="front" v={v} fill={fill} stroke={stroke} strokeW={strokeW} scale={scale} showLabels={showLabels}/>
      <BodyView side="back" v={v} fill={fill} stroke={stroke} strokeW={strokeW} scale={scale} showLabels={showLabels}/>
    </div>
  );
}

function BodyView({ side, v, fill, stroke, strokeW, scale = 1, showLabels }) {
  const w = 110, h = 280;
  const label = side === 'front' ? 'FRONT' : 'BACK';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w * scale} height={h * scale}>
        {/* Body outline (silhouette underlay) */}
        <BodyOutline w={w} h={h} side={side}/>

        {/* Front muscle regions */}
        {side === 'front' && (
          <>
            {/* Trapezius (upper) */}
            <path d="M40 38 Q55 32 70 38 L66 52 L55 50 L44 52 Z" fill={fill('traps')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Shoulders */}
            <path d="M28 50 Q24 60 30 75 Q40 78 44 70 L44 52 Q35 50 28 50 Z" fill={fill('shoulders')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M82 50 Q86 60 80 75 Q70 78 66 70 L66 52 Q75 50 82 50 Z" fill={fill('shoulders')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Chest (pecs) */}
            <path d="M44 52 L55 50 L55 88 Q49 92 42 88 Q40 80 41 70 Z" fill={fill('chest')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M66 52 L55 50 L55 88 Q61 92 68 88 Q70 80 69 70 Z" fill={fill('chest')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Biceps */}
            <path d="M25 75 Q20 88 26 108 Q34 110 38 100 L38 78 Q32 75 25 75 Z" fill={fill('biceps')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M85 75 Q90 88 84 108 Q76 110 72 100 L72 78 Q78 75 85 75 Z" fill={fill('biceps')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Forearms */}
            <path d="M24 110 Q20 130 22 148 Q28 150 32 142 L34 110 Q28 108 24 110 Z" fill={fill('forearms')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M86 110 Q90 130 88 148 Q82 150 78 142 L76 110 Q82 108 86 110 Z" fill={fill('forearms')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Abs */}
            <path d="M44 92 L66 92 L65 138 Q55 142 45 138 Z" fill={fill('abs')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Obliques (sides) */}
            <path d="M42 92 L44 92 L45 138 L40 134 Q38 120 42 100 Z" fill={fill('obliques')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M68 92 L66 92 L65 138 L70 134 Q72 120 68 100 Z" fill={fill('obliques')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Hip area */}
            <path d="M42 140 L68 140 L70 158 L40 158 Z" fill="var(--bg-3)" stroke={stroke} strokeWidth={strokeW}/>
            {/* Quads */}
            <path d="M40 158 L54 158 L52 220 Q44 222 40 218 Q36 190 40 158 Z" fill={fill('quads')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M70 158 L56 158 L58 220 Q66 222 70 218 Q74 190 70 158 Z" fill={fill('quads')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Calves (front: tibialis area, subdued) */}
            <path d="M42 222 L52 222 L52 268 Q46 270 42 268 Z" fill="var(--bg-3)" stroke={stroke} strokeWidth={strokeW}/>
            <path d="M68 222 L58 222 L58 268 Q64 270 68 268 Z" fill="var(--bg-3)" stroke={stroke} strokeWidth={strokeW}/>
          </>
        )}

        {/* Back muscle regions */}
        {side === 'back' && (
          <>
            {/* Traps (large back trap) */}
            <path d="M38 38 Q55 30 72 38 L68 76 Q55 80 42 76 Z" fill={fill('traps')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Rear delts (shoulders) */}
            <path d="M28 50 Q24 60 30 75 Q40 78 42 70 L42 52 Q35 50 28 50 Z" fill={fill('rearDelts')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M82 50 Q86 60 80 75 Q70 78 68 70 L68 52 Q75 50 82 50 Z" fill={fill('rearDelts')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Lats */}
            <path d="M42 70 L42 130 Q34 130 30 122 Q26 100 32 80 Z" fill={fill('lats')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M68 70 L68 130 Q76 130 80 122 Q84 100 78 80 Z" fill={fill('lats')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Mid back (rhomboids) */}
            <path d="M42 76 L68 76 L66 130 L44 130 Z" fill={fill('midBack')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Triceps */}
            <path d="M25 75 Q20 90 26 108 Q34 110 38 100 L38 78 Q32 75 25 75 Z" fill={fill('triceps')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M85 75 Q90 90 84 108 Q76 110 72 100 L72 78 Q78 75 85 75 Z" fill={fill('triceps')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Forearms */}
            <path d="M24 110 Q20 130 22 148 Q28 150 32 142 L34 110 Q28 108 24 110 Z" fill={fill('forearms')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M86 110 Q90 130 88 148 Q82 150 78 142 L76 110 Q82 108 86 110 Z" fill={fill('forearms')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Lower back */}
            <path d="M44 130 L66 130 L66 152 L44 152 Z" fill={fill('lowerBack')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Glutes */}
            <path d="M38 152 L72 152 Q74 178 68 188 L42 188 Q36 178 38 152 Z" fill={fill('glutes')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Hamstrings */}
            <path d="M40 188 L54 188 L52 240 Q44 242 40 238 Q36 210 40 188 Z" fill={fill('hamstrings')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M70 188 L56 188 L58 240 Q66 242 70 238 Q74 210 70 188 Z" fill={fill('hamstrings')} stroke={stroke} strokeWidth={strokeW}/>
            {/* Calves */}
            <path d="M42 240 L52 240 L52 268 Q46 270 42 268 Z" fill={fill('calves')} stroke={stroke} strokeWidth={strokeW}/>
            <path d="M68 240 L58 240 L58 268 Q64 270 68 268 Z" fill={fill('calves')} stroke={stroke} strokeWidth={strokeW}/>
          </>
        )}
      </svg>
      <div className="t-xs" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--fg-mute)' }}>{label}</div>
    </div>
  );
}

function BodyOutline({ w, h, side }) {
  // Head + neck (gray, non-muscle)
  return (
    <>
      {/* Head */}
      <ellipse cx={w/2} cy="18" rx="11" ry="14" fill="var(--bg-3)"/>
      {/* Neck */}
      <rect x={w/2 - 7} y="30" width="14" height="9" fill="var(--bg-3)"/>
      {/* Subtle outline behind body */}
      <path d={`
        M ${w/2 - 32} 50
        Q ${w/2 - 42} 70 ${w/2 - 38} 90
        L ${w/2 - 38} 148
        L ${w/2 - 28} 158
        L ${w/2 - 30} 220
        L ${w/2 - 30} 268
        L ${w/2 - 18} 272
        L ${w/2 - 6} 268
        L ${w/2 - 4} 158
        L ${w/2 + 4} 158
        L ${w/2 + 6} 268
        L ${w/2 + 18} 272
        L ${w/2 + 30} 268
        L ${w/2 + 30} 220
        L ${w/2 + 28} 158
        L ${w/2 + 38} 148
        L ${w/2 + 38} 90
        Q ${w/2 + 42} 70 ${w/2 + 32} 50
        Z
      `} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
    </>
  );
}

// Legend for heatmap intensity
function HeatmapLegend({ label = 'Intensity' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
      <span className="t-xs" style={{ fontSize: 10 }}>{label}</span>
      <div style={{
        flex: 1, height: 6, borderRadius: 999,
        background: 'linear-gradient(90deg, var(--bg-3), color-mix(in oklab, var(--accent) 50%, var(--bg-3)), var(--accent))',
      }}/>
      <span className="t-xs" style={{ fontSize: 10 }}>strong</span>
    </div>
  );
}

Object.assign(window, { BodyHeatmap, HeatmapLegend });
