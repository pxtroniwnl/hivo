import { colors } from '@/theme';

import { heatColor, mixOklab } from '../heat';

describe('mixOklab', () => {
  it('returns the first color at ratio 1', () => {
    expect(mixOklab(colors.accent, colors.bg3, 1)).toBe(colors.accent);
  });

  it('returns the second color at ratio 0', () => {
    expect(mixOklab(colors.accent, colors.bg3, 0)).toBe(colors.bg3);
  });

  it('produces an intermediate color at 0.5', () => {
    const mid = mixOklab('#000000', '#ffffff', 0.5);
    expect(mid).toMatch(/^#[0-9a-f]{6}$/);
    const ch = parseInt(mid.slice(1, 3), 16);
    expect(ch).toBeGreaterThan(0x30);
    expect(ch).toBeLessThan(0xd0);
  });
});

describe('heatColor', () => {
  // Port de body.jsx:6-11: <0.05 → bg3; resto color-mix(accent 15+x*80 %, bg3).
  it('returns bg3 for intensity below 0.05', () => {
    expect(heatColor(0)).toBe(colors.bg3);
    expect(heatColor(0.04)).toBe(colors.bg3);
  });

  it('clamps out-of-range values', () => {
    expect(heatColor(-1)).toBe(colors.bg3);
    expect(heatColor(2)).toBe(heatColor(1));
  });

  it('matches the prototype mix ratio (15 + v*80)%', () => {
    expect(heatColor(0.5)).toBe(mixOklab(colors.accent, colors.bg3, 0.55));
    expect(heatColor(1)).toBe(mixOklab(colors.accent, colors.bg3, 0.95));
  });

  it('moves toward the accent as intensity grows', () => {
    // El canal rojo del acento (#b2) domina sobre el de bg3 (#1d).
    const r = (c: string) => parseInt(c.slice(1, 3), 16);
    expect(r(heatColor(0.9))).toBeGreaterThan(r(heatColor(0.2)));
  });
});
