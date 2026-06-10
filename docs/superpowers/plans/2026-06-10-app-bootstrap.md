# Hivo App Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la app Expo de Hivo en la raíz del repo con el tema portado de `hivo-design/tokens.css`, kit de UI base, navegación de 5 tabs y la pantalla Today (Home) completa con datos mock.

**Architecture:** expo-router para navegación, `src/theme` como única fuente de tokens (valores exactos del prototipo), componentes UI puros en `src/components/ui`, componentes de Home en `src/components/home`, lógica de fecha/programa extraída a funciones puras testeables en `src/lib`.

**Tech Stack:** Expo SDK actual + TypeScript estricto, expo-router, react-native-svg, expo-blur, expo-font (Geist + JetBrains Mono), jest-expo para unit tests de lógica.

**Spec:** `docs/superpowers/specs/2026-06-10-app-bootstrap-design.md`

**Regla transversal de fidelidad:** cada componente se porta leyendo su contraparte en el prototipo y copiando los valores exactos. Mapeo CSS→RN:

| Prototipo | React Native |
| --- | --- |
| `div`/`span` | `View`/`Text` |
| clases `t-*` de tokens.css | estilos de `src/theme/typography.ts` |
| `var(--bg-2)` etc. | `colors.bg2` etc. de `src/theme/tokens.ts` |
| `border: 0.5px solid` | `borderWidth: StyleSheet.hairlineWidth` |
| `:active scale(0.97)` | `Pressable` + `transform: [{scale: pressed ? 0.97 : 1}]` |
| `backdrop-filter` (tab bar) | `expo-blur` `BlurView` (iOS) / fondo `rgba(8,8,10,0.92)` (Android) |
| SVG inline | `react-native-svg` (`Svg`, `Path`, `Circle`) |
| animaciones CSS (reveal/stagger) | `react-native-reanimated` `FadeInDown.delay(n)` |

**Bug conocido del prototipo que NO se replica:** `hivo-design/home.jsx:461-464` (`ClanStrip` tiene el objeto style duplicado como texto hijo). Implementar con un solo style.

---

### Task 1: Scaffold Expo en la raíz

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `app/`, `assets/` (generados por create-expo-app)
- Modify: `.gitignore`

- [ ] **Step 1: Generar proyecto en dir temporal y fusionar a la raíz** (create-expo-app rechaza dirs no vacíos)

```bash
cd /tmp && rm -rf hivo-scaffold && npx create-expo-app@latest hivo-scaffold --template default --no-install
# Copiar todo menos .git y README al repo
rsync -a --exclude='.git' /tmp/hivo-scaffold/ /home/pxtroniwnl/Documents/projects/personal/hivo/
cd /home/pxtroniwnl/Documents/projects/personal/hivo && npm install
```

- [ ] **Step 2: Limpiar pantallas de ejemplo del template** (dejar `app/_layout.tsx` y un `app/index.tsx` mínimo; el template trae tabs de ejemplo que se reescriben en Task 4)

- [ ] **Step 3: tsconfig estricto + alias `@/`**

`tsconfig.json` debe contener `"strict": true` y paths `"@/*": ["./src/*"]` (el template ya trae `@/*` → raíz; ajustar a `./src/*` o usar el de raíz — mantener el del template si funciona, no pelearse con él).

- [ ] **Step 4: Verificar**

```bash
npx tsc --noEmit   # esperado: sin errores
npx expo lint      # esperado: sin errores (instalar eslint-config-expo si pregunta)
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Expo app with TypeScript and expo-router"
```

---

### Task 2: Tema — tokens + tipografía + fuentes

**Files:**
- Create: `src/theme/tokens.ts`, `src/theme/typography.ts`, `src/theme/index.ts`
- Create: `assets/fonts/` (TTFs de Geist 400/500/600/700 y JetBrains Mono 400/500/600)
- Modify: `app/_layout.tsx`

- [ ] **Step 1: `src/theme/tokens.ts`** — valores EXACTOS de `hivo-design/tokens.css:3-51`:

```ts
// Tokens canónicos de hivo-design/tokens.css — NO modificar sin actualizar el prototipo.
export const colors = {
  bg0: '#08080a', bg1: '#101014', bg2: '#16161d', bg3: '#1d1d26', bg4: '#25252f',
  line: 'rgba(255,255,255,0.06)', lineStrong: 'rgba(255,255,255,0.12)',
  fg: '#f5f5f7', fgMid: '#b8b8c2', fgMute: '#74747e', fgDim: '#4a4a52',
  accent: '#b26bff', accentSoft: 'rgba(178,107,255,0.16)', accentDeep: '#7a3fe0', accentFg: '#0a0210',
  ok: '#5cd6a8', warn: '#f5b54a', err: '#ff6b6b',
} as const;

export const radii = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;
export const space = { s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24, s7: 32 } as const;
/** Inset horizontal estándar de pantalla (tokens.css usa 18px en todos los paddings de pantalla). */
export const screenInset = 18;
```

- [ ] **Step 2: `src/theme/typography.ts`** — escala exacta de `tokens.css:86-93`:

```ts
import { TextStyle } from 'react-native';
import { colors } from './tokens';

export const fonts = {
  sans: 'Geist-Regular', sansMedium: 'Geist-Medium', sansSemiBold: 'Geist-SemiBold',
  mono: 'JetBrainsMono-Regular', monoMedium: 'JetBrainsMono-Medium', monoSemiBold: 'JetBrainsMono-SemiBold',
} as const;

export const type: Record<string, TextStyle> = {
  display: { fontFamily: fonts.sansSemiBold, fontSize: 34, letterSpacing: 34 * -0.025, lineHeight: 34 * 1.05, color: colors.fg },
  h1: { fontFamily: fonts.sansSemiBold, fontSize: 26, letterSpacing: 26 * -0.02, lineHeight: 26 * 1.15, color: colors.fg },
  h2: { fontFamily: fonts.sansSemiBold, fontSize: 20, letterSpacing: 20 * -0.015, lineHeight: 20 * 1.2, color: colors.fg },
  h3: { fontFamily: fonts.sansSemiBold, fontSize: 17, letterSpacing: 17 * -0.01, lineHeight: 17 * 1.25, color: colors.fg },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 15 * 1.4, color: colors.fg },
  sm: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 13 * 1.35, color: colors.fgMid },
  xs: { fontFamily: fonts.sansMedium, fontSize: 11, lineHeight: 11 * 1.3, color: colors.fgMute, letterSpacing: 11 * 0.04, textTransform: 'uppercase' },
};
// Nota RN: letterSpacing en px (CSS usa em) → multiplicar em × fontSize.
// Números siempre con fonts.mono* + fontVariant: ['tabular-nums'].
```

- [ ] **Step 3: Fuentes** — intentar `npx expo install @expo-google-fonts/geist @expo-google-fonts/jetbrains-mono expo-font`; si el paquete de Geist no existe, descargar TTFs del repo oficial de Vercel (licencia OFL) a `assets/fonts/` y cargarlos con `useFonts` de expo-font con los nombres `Geist-Regular` etc.

- [ ] **Step 4: `app/_layout.tsx`** — cargar fuentes, fondo `colors.bg0`, status bar `light`, sin header. Pantalla de carga = `View` negro mientras `!fontsLoaded`.

- [ ] **Step 5: Verificar y commit**

```bash
npx tsc --noEmit && npx expo lint
git add -A && git commit -m "feat(theme): port design tokens and typography from prototype"
```

---

### Task 3: Kit UI base

**Files:**
- Create: `src/components/ui/icons.tsx` — TODOS los iconos de `hivo-design/ui.jsx:7-32` (home, dumb, squad, chart, user, bell, plus, check, arrow, back, more, flame, shield, timer, play, pause, swap, bolt, warn, info, pin, close, heart, trophy) con react-native-svg. Firma: `Icon.home({ size?: number; color?: string })`, viewBox 24, strokeWidth fiel al original (1.6/1.8/2 según icono).
- Create: `src/components/ui/Card.tsx`, `Chip.tsx`, `Button.tsx`, `Avatar.tsx`, `ProgressBar.tsx`, `Ring.tsx`, `ScreenHeader.tsx`, `Sheet.tsx`, `Stat.tsx`
- Create: `src/components/ui/index.ts` (barrel export)

Specs por componente (fuente exacta en el prototipo):

| Componente | Fuente | Notas de port |
| --- | --- | --- |
| `Card` | tokens.css:100-113 | variant `default`(bg2/line) / `elev`(bg3/lineStrong), padding `space.s4`, radio `radii.md` |
| `Chip` | tokens.css:116-139 + ui.jsx:50-53 | variants default/acc/solid; 11px/500, padding 4×9, pill |
| `Button` | tokens.css:142-154 | variants default/primary/ghost, block; Pressable con scale 0.98 |
| `Avatar` | ui.jsx:37-48 + tokens.css:167-174 | iniciales, size prop, gradiente → usar color sólido `bg3` con borde (RN no tiene linear-gradient nativo; NO añadir expo-linear-gradient aquí — YAGNI, el avatar del proto es casi plano) |
| `ProgressBar` | ui.jsx:55-65 | View anidado, width % |
| `Ring` | ui.jsx:67-84 | react-native-svg Circle con strokeDasharray/offset, children centrados |
| `ScreenHeader` | ui.jsx:87-103 | title/subtitle/right |
| `Sheet` | active.jsx:657-692 | RN `Modal transparent animationType="slide"`, scrim rgba(0,0,0,0.5), panel bg2 radio 20 arriba, handle 36×4, botón close 30px |
| `Stat` | home.jsx:445-452 | label xs + valor mono 15/500 |

- [ ] **Step 1: Instalar deps**

```bash
npx expo install react-native-svg expo-blur react-native-reanimated
```

- [ ] **Step 2: Implementar `icons.tsx`** (copiar paths SVG literales de ui.jsx)
- [ ] **Step 3: Implementar los 9 componentes** según tabla
- [ ] **Step 4: Verificar y commit**

```bash
npx tsc --noEmit && npx expo lint
git add -A && git commit -m "feat(ui): base component kit ported from prototype (icons, Card, Chip, Button, Ring, Sheet...)"
```

---

### Task 4: Shell de navegación — 5 tabs

**Files:**
- Create/Replace: `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx` (placeholder por ahora), `app/(tabs)/train.tsx`, `app/(tabs)/squad.tsx`, `app/(tabs)/stats.tsx`, `app/(tabs)/profile.tsx`
- Modify: `app/_layout.tsx` (Stack → ruta `(tabs)`)

Spec del tab bar (tokens.css:177-195 + app.jsx:143-161): 5 tabs `Today/Train/Squad/Stats/You` con iconos `home/dumb/squad/chart/user`; fondo glass — `BlurView intensity={40} tint="dark"` sobre `rgba(8,8,10,0.85)` en iOS, fallback `rgba(8,8,10,0.92)` en Android; borde superior hairline `colors.line`; icono 22px, label 10px/500; activo = `colors.accent`, inactivo = `colors.fgMute`; respetar safe-area inferior.

Cada placeholder: `ScreenHeader` con el título + texto `t-sm` "Coming soon".

- [ ] **Step 1: Implementar `(tabs)/_layout.tsx`** con `tabBarBackground` custom
- [ ] **Step 2: Placeholders de las 5 pantallas**
- [ ] **Step 3: Probar en navegador** (`npx expo start` → `w`) — los 5 tabs navegan, estética correcta
- [ ] **Step 4: Verificar y commit**

```bash
npx tsc --noEmit && npx expo lint
git add -A && git commit -m "feat(nav): five-tab shell with glass tab bar"
```

---

### Task 5: Datos mock tipados

**Files:**
- Create: `src/data/types.ts` — interfaces `User`, `Clan`, `Raid`, `Mission`, `WeekDay`, `WorkoutSummary`, `Warmup`, `FeedItem`, `Notification`, `Routine`, `Workout`, `WorkoutDay`
- Create: `src/data/mock.ts` — portar de `hivo-design/ui.jsx`: `USER` (l.169-180), `CLAN` (l.182-210), `WARMUPS` (l.233-299), `FEED` (l.358-362), `WEEK` (l.364-397), `ROUTINES` (l.403-470), `WORKOUTS` (l.473-544), `NOTIFICATIONS` (l.637-643). Copiar literal.

- [ ] **Step 1: Escribir types.ts** (derivar interfaces de las shapes literales)
- [ ] **Step 2: Escribir mock.ts** tipado contra types.ts
- [ ] **Step 3: Verificar y commit**

```bash
npx tsc --noEmit
git add -A && git commit -m "feat(data): typed mock data ported from prototype"
```

---

### Task 6: Lógica de Today — funciones puras con TDD

**Files:**
- Create: `src/lib/today.ts`
- Test: `src/lib/__tests__/today.test.ts`

Funciones (extraídas de `hivo-design/home.jsx:314-399,524-529`):
- `getGreeting(hour: number): 'Morning' | 'Afternoon' | 'Evening'` — <12 / <18 / resto
- `findTodaySlot(workout: Workout, dayName: string): WorkoutDay | undefined`
- `isRestSlot(slot: WorkoutDay): boolean` — sin routineId o nombre /rest/i
- `estimateMinutes(routine: Routine): number` — `round(Σ sets × (rest/60 + 1))`
- `totalSets(routine: Routine): number`

- [ ] **Step 1: Instalar jest**

```bash
npx expo install jest-expo jest @types/jest
# package.json: "test": "jest", "jest": { "preset": "jest-expo" }
```

- [ ] **Step 2: Escribir tests que fallan** (casos: greeting en 0/11/12/17/18/23h; estimateMinutes con la rutina r-m1 del mock = round(5×(150/60+1) + 3×(90/60+1) + 3×(75/60+1) + 3×(60/60+1) + 3×(90/60+1)); slot de rest; día fuera del programa)
- [ ] **Step 3: Run** `npx jest` — esperado: FAIL (módulo no existe)
- [ ] **Step 4: Implementar `today.ts`**
- [ ] **Step 5: Run** `npx jest` — esperado: PASS
- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(home): today-slot logic as tested pure functions"
```

---

### Task 7: Componentes de Home — parte 1 (hero + semana + detalle de día)

**Files:**
- Create: `src/components/home/TodayHero.tsx` (home.jsx:314-443 — 4 estados: sin programa / rest / off-day / rutina con glow radial accent — el glow `blur(40px)` se aproxima con un círculo `accent` opacity 0.15 sin blur, documentar), `WeekStrip.tsx` (home.jsx:43-71), `DayDetail.tsx` (home.jsx:844-891 wrapper + PastWorkoutDetail l.137-199 + PlannedWorkoutDetail l.201-230 + RestDayCard l.232-252)

- [ ] **Step 1: WeekStrip** — 7 botones flex, estados done/rest/today/planned/selected, dot de 5px
- [ ] **Step 2: TodayHero** — usa `getGreeting`/`findTodaySlot`/`estimateMinutes` de Task 6
- [ ] **Step 3: DayDetail** (Past/Planned/Rest)
- [ ] **Step 4: Verificar y commit**

```bash
npx tsc --noEmit && npx expo lint
git add -A && git commit -m "feat(home): today hero, week strip and day detail"
```

---

### Task 8: Componentes de Home — parte 2 (streak, clan, warmups, notifs, feed)

**Files:**
- Create: `src/components/home/StreakSpiral.tsx` (home.jsx:254-312 — espiral de Arquímedes en react-native-svg Path, gradiente con `Defs/LinearGradient`, shields orbitando), `ClanStrip.tsx` + `JoinClanStrip.tsx` (home.jsx:454-515, corrigiendo el bug del style duplicado), `WarmupCarousel.tsx` (WarmupCard home.jsx:663-692 en `ScrollView horizontal` con `snapToInterval`), `WarmupSheet.tsx` (home.jsx:694-792), `NotificationsSheet.tsx` (home.jsx:797-841), `FeedPreview.tsx` (home.jsx:621-644), `RecoveryDial.tsx` (home.jsx:4-41 — se exporta pero NO se monta en Home, igual que el prototipo; lo usará Stats)

- [ ] **Step 1: StreakSpiral** (generar path con el mismo algoritmo: 80 puntos, turns = min(6, floor(days/10)+2))
- [ ] **Step 2: ClanStrip / JoinClanStrip**
- [ ] **Step 3: WarmupCarousel + WarmupSheet** (selector de ejercicio, CTA "Next/Finish")
- [ ] **Step 4: NotificationsSheet** (estado read/unread, "Mark all read")
- [ ] **Step 5: FeedPreview + RecoveryDial**
- [ ] **Step 6: Verificar y commit**

```bash
npx tsc --noEmit && npx expo lint
git add -A && git commit -m "feat(home): streak spiral, clan strip, warmups, notifications and feed preview"
```

---

### Task 9: Ensamblar pantalla Today

**Files:**
- Replace: `app/(tabs)/index.tsx` — HomeScreen (home.jsx:517-650): topbar (Avatar + greeting + bell con dot), TodayHero, carrusel warmups, "This week" + WeekStrip (selección ≠ hoy → DayDetail), StreakSpiral, JoinClanStrip (estado inicial sin clan, como app.jsx:41 `userClan = null`), sheets condicionales. Entradas animadas con `FadeInDown` escalonado (equivale a Reveal/stagger).

- [ ] **Step 1: Implementar pantalla completa con estado (selectedIdx, notifsOpen, warmupOpen)**
- [ ] **Step 2: Probar interacciones en navegador**: tap día pasado → detalle con resumen y PRs; volver a hoy; abrir warmup sheet y avanzar ejercicios; abrir notificaciones y marcar leídas
- [ ] **Step 3: Verificación final completa**

```bash
npx tsc --noEmit && npx expo lint && npx jest
# npx expo start → comparar lado a lado con hivo-design/Hivo Prototype.html
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(home): assemble Today screen"
```

---

## Self-review (hecho al escribir)

- **Cobertura del spec:** estructura ✓ (T1), tema ✓ (T2), kit UI ✓ (T3), tabs ✓ (T4), Home completa ✓ (T5-T9), verificación ✓ (T9.3). Fuera de alcance respetado.
- **Consistencia de tipos:** nombres `colors.bg0..bg4`, `radii.md`, `type.h1` usados igual en T2-T9; tipos de datos definidos en T5 y consumidos en T6-T9.
- **Sin placeholders:** las referencias a líneas del prototipo son la fuente de código real (el port es transcripción con el mapeo CSS→RN dado arriba).
