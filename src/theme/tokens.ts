// Tokens canónicos de hivo-design/tokens.css — NO modificar sin actualizar el prototipo.

export const colors = {
  bg0: '#08080a',
  bg1: '#101014',
  bg2: '#16161d',
  bg3: '#1d1d26',
  bg4: '#25252f',
  line: 'rgba(255,255,255,0.06)',
  lineStrong: 'rgba(255,255,255,0.12)',

  fg: '#f5f5f7',
  fgMid: '#b8b8c2',
  fgMute: '#74747e',
  fgDim: '#4a4a52',

  accent: '#b26bff',
  accentSoft: 'rgba(178,107,255,0.16)',
  accentDeep: '#7a3fe0',
  accentFg: '#0a0210',

  ok: '#5cd6a8',
  warn: '#f5b54a',
  err: '#ff6b6b',
} as const;

export const radii = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const space = { s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24, s7: 32 } as const;

/** Inset horizontal estándar de pantalla (el prototipo usa 18px en todos los paddings de pantalla). */
export const screenInset = 18;
