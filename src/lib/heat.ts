// Intensidad → color del heatmap corporal (port de body.jsx:5-11).
// El prototipo usa CSS `color-mix(in oklab, accent X%, bg3)`; RN no tiene
// color-mix, así que la mezcla OKLab se implementa aquí.
import { colors } from '@/theme';

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex([r, g, b]: Rgb): string {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

// sRGB ↔ OKLab (fórmulas de Björn Ottosson, las mismas que usa CSS color-mix).
function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function linearToSrgb(x: number): number {
  const c = x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, c * 255));
}

function rgbToOklab([r, g, b]: Rgb): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]: [number, number, number]): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Mezcla `a` y `b` en espacio OKLab; ratio = proporción de `a` (0..1). */
export function mixOklab(a: string, b: string, ratio: number): string {
  if (ratio >= 1) return a;
  if (ratio <= 0) return b;
  const la = rgbToOklab(hexToRgb(a));
  const lb = rgbToOklab(hexToRgb(b));
  return rgbToHex(
    oklabToRgb([
      la[0] * ratio + lb[0] * (1 - ratio),
      la[1] * ratio + lb[1] * (1 - ratio),
      la[2] * ratio + lb[2] * (1 - ratio),
    ]),
  );
}

/** Color de un grupo muscular según intensidad 0..1 (body.jsx:6-11). */
export function heatColor(v: number): string {
  const x = Math.max(0, Math.min(1, v));
  if (x < 0.05) return colors.bg3;
  return mixOklab(colors.accent, colors.bg3, (15 + x * 80) / 100);
}
