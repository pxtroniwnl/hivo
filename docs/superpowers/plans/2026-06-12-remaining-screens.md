# Hivo Remaining Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Portar al app Expo todas las pantallas restantes del prototipo: estado global, auth, Train (lista + editores + AI Coach), logger activo, Squad + clan onboarding, Stats, Profile y heatmap corporal.

**Architecture:** El prototipo (`hivo-design/*.jsx`) es la fuente de verdad — cada componente se porta transcribiendo los valores exactos con el mapeo CSS→RN del plan anterior (`2026-06-10-app-bootstrap.md`). Estado compartido (`authedUser`, `userClan`, `gamification`, `myRoutines`, `myWorkouts`, drafts de editores) en un React Context (`src/state/app-state.tsx`) montado en el root layout — sin librería de estado (YAGNI). Pantallas full-screen que en el prototipo ocultan el tab bar (editores, logger, auth) son rutas Stack de expo-router **fuera** de `(tabs)`; las acciones contextuales siguen siendo `Sheet`s. Lógica con reglas de negocio se extrae a funciones puras en `src/lib/` con tests (TDD).

**Tech Stack:** Lo ya instalado: expo-router, react-native-svg, expo-blur, react-native-reanimated, jest-expo. **No se añaden dependencias nuevas.**

**Spec:** El prototipo + `CLAUDE.md` (reglas de diseño inmutables, modelo de dominio, qué NO se porta).

---

## Estado actual del proyecto (al 2026-06-12)

**Hecho** (plan `2026-06-10-app-bootstrap.md`, tasks 1–9 completas, commits hasta `faa54d1`):

- Scaffold Expo SDK 56 + TypeScript estricto + expo-router, alias `@/` → `src/`.
- `src/theme/` — tokens y tipografía exactos de `tokens.css`; fuentes Geist + JetBrains Mono vía `@expo-google-fonts`.
- `src/components/ui/` — kit completo: icons (24 iconos SVG), Card, Chip, Button, Avatar, ProgressBar, Ring, ScreenHeader, Sheet, Stat, PlaceholderScreen.
- `src/app/(tabs)/` — shell de 5 tabs con tab bar glass (BlurView iOS / rgba Android).
- `src/data/types.ts` + `mock.ts` — tipos y datos portados de `ui.jsx`.
- `src/lib/today.ts` — lógica de Today con tests (`npx jest` en verde).
- `src/components/home/` — pantalla **Today completa**: TodayHero, WeekStrip, DayDetail, StreakSpiral, ClanStrip/JoinClanStrip, WarmupCarousel/WarmupSheet, NotificationsSheet, FeedPreview, RecoveryDial (exportado, sin montar — lo usa Stats).

**Falta** (este plan): los tabs Train/Squad/Stats/You son `PlaceholderScreen`; no hay auth, ni logger activo, ni estado global (Home usa estado local), ni heatmap corporal.

**Cómo retomar en otra sesión:** los checkboxes de abajo reflejan el progreso real; cada task termina en commit propio, así que `git log` confirma qué quedó hecho. Ejecutar con superpowers:executing-plans.

---

### Task 1: Estado global — AppStateProvider

El shell del prototipo (`app.jsx:32-141`) mantiene `authedUser`, `userClan`, `myRoutines`, `myWorkouts` y el flag `gamification`. En Expo eso vive en un Context.

**Files:**
- Create: `src/state/app-state.tsx`
- Modify: `src/app/_layout.tsx` (envolver con provider)
- Modify: `src/app/(tabs)/_layout.tsx` (ocultar tab Squad si `!gamification` — `app.jsx:147`)
- Modify: `src/app/(tabs)/index.tsx` (leer `userClan` del context en vez de estado local, si aplica)

- [x] **Step 1: Implementar `src/state/app-state.tsx`**

Context + provider con: `authedUser: User | null` (inicial `null`), `userClan: Clan | null` (inicial `null`), `gamification: boolean` (inicial `true`), `myRoutines: Routine[]` (inicial copia profunda de `ROUTINES.mine`), `myWorkouts: Workout[]` (inicial copia profunda de `WORKOUTS.mine`), `draftRoutine: Routine | null`, `draftWorkout: Workout | null` (para los editores, Task 5-6) y sus setters. Hook `useAppState()` que lanza si no hay provider. Fuente: `app.jsx:34-41`.

- [x] **Step 2: Montar provider en `src/app/_layout.tsx`** (dentro, el `Stack` actual)
- [x] **Step 3: Tab Squad condicional** en `(tabs)/_layout.tsx`: si `!gamification`, ocultar el tab (con expo-router: `<Tabs.Screen name="squad" options={{ href: null }} />` condicional)
- [x] **Step 4: Verificar**

```bash
npx tsc --noEmit && npx expo lint && npx jest
```

- [x] **Step 5: Commit** — `feat(state): global app state provider`

---

### Task 2: Auth — login/registro mock

**Files:**
- Create: `src/app/auth.tsx` (ruta fuera de tabs), `src/components/auth/AuthScreen.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `Field.tsx`, `OAuthButton.tsx`, `HivoMark.tsx`
- Modify: `src/app/(tabs)/_layout.tsx` (gate: `if (!authedUser) return <Redirect href="/auth" />`)

Fuentes en `hivo-design/auth.jsx`: AuthScreen l.4-97, HivoMark l.99-115, LoginForm l.117-158, RegisterForm l.160-239, Field l.241-263, OAuthButton l.265-281 (con AppleIcon l.283-289 y GoogleIcon l.290-301). Port notes: inputs → `TextInput` con `placeholderTextColor={colors.fgDim}`; usar `KeyboardAvoidingView`; `onAuthed(user)` → `setAuthedUser` del context + `router.replace('/')`. OAuth es mock (autentica directo con el usuario mock), igual que el prototipo.

- [x] **Step 1: Portar componentes de auth** (leer `auth.jsx` completo y transcribir)
- [x] **Step 2: Ruta `auth.tsx` + Redirect gate en tabs**
- [x] **Step 3: Probar en navegador**: arranca en /auth, login y OAuth llevan a Today, register valida campos
- [x] **Step 4: Verificar** `npx tsc --noEmit && npx expo lint`
- [x] **Step 5: Commit** — `feat(auth): login and register screens with mock OAuth`

---

### Task 3: BodyHeatmap — silueta muscular SVG reutilizable

**Files:**
- Create: `src/components/body/BodyHeatmap.tsx`
- Test: `src/lib/__tests__/heat.test.ts`, Create: `src/lib/heat.ts`

Fuentes en `hivo-design/body.jsx`: BodyHeatmap l.4-21, BodyView l.23-100, BodyOutline l.102-135, HeatmapLegend l.137-150. Frente/espalda lado a lado, 16+ grupos musculares con intensidad 0..1. La interpolación de color gris→acento se extrae como función pura `heatColor(v: number): string` en `src/lib/heat.ts` (copiar la fórmula exacta del prototipo).

- [x] **Step 1 (TDD): Test de `heatColor`** — casos v=0 (gris base), v=1 (acento pleno), v=0.5 (mezcla), clamp fuera de rango. Run `npx jest heat` → FAIL
- [x] **Step 2: Implementar `src/lib/heat.ts`** → `npx jest heat` PASS
- [x] **Step 3: Portar BodyHeatmap con react-native-svg** (paths literales de BodyOutline)
- [x] **Step 4: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 5: Commit** — `feat(body): reusable SVG muscle heatmap`

---

### Task 4: Train — lista (My Workouts / Trending / My Routines)

**Files:**
- Test: `src/lib/__tests__/library.test.ts`, Create: `src/lib/library.ts`
- Create: `src/components/train/LevelChip.tsx`, `KindBadge.tsx`, `TrainList.tsx`, `FilterBar.tsx`, `MyWorkoutsSection.tsx`, `SavedWorkoutCard.tsx`, `TrendingSection.tsx`, `MyRoutinesSection.tsx`, `ProgramCard.tsx`
- Replace: `src/app/(tabs)/train.tsx`
- Create (placeholders, se completan en T5/T6): `src/app/routine-editor.tsx`, `src/app/workout-editor.tsx`

Fuentes en `hivo-design/train.jsx`: LEVELS/LEVEL_COLORS l.4-9, LevelChip l.11-28, KindBadge l.30-55, TrainScreen l.57-167 (la lógica de open/save de drafts pasa al context + router), TrainList l.172-298, FilterBar l.300-343, MyWorkoutsSection l.345-443 (incl. set-active toggle `onSetActive` — solo un workout `current`), SavedWorkoutCard l.445-490, TrendingSection l.492-569, MyRoutinesSection l.571-594, ProgramCard l.596-658, SearchIcon l.1634-1644.

Navegación: abrir rutina/workout = `setDraftRoutine(copia profunda)` / `setDraftWorkout(...)` en context + `router.push('/routine-editor')` / `'/workout-editor'`. "Build new" crea el draft en blanco (shapes exactos de `train.jsx:69-76,89-102`).

Lógica pura en `src/lib/library.ts`: `filterTrending(items, { level, type, query })` (la de TrendingSection) y `setActiveWorkout(workouts, id)` (toggle exclusivo de `current`, `train.jsx:162`).

- [x] **Step 1 (TDD): Tests de `filterTrending` y `setActiveWorkout`** → FAIL
- [x] **Step 2: Implementar `src/lib/library.ts`** → PASS
- [x] **Step 3: Portar componentes de lista** + reemplazar tab Train
- [x] **Step 4: Rutas placeholder de editores** (ScreenHeader con back, leen el draft del context y muestran el nombre)
- [x] **Step 5: Probar en navegador**: tabs internas, búsqueda y filtros de Trending, set active, navegar a placeholders
- [x] **Step 6: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 7: Commit** — `feat(train): library list with search, filters and active workout toggle`

---

### Task 5: Train — editor de Routine

**Files:**
- Replace: `src/app/routine-editor.tsx`
- Create: `src/components/train/RoutineDetail.tsx`, `EditableExerciseRow.tsx`, `EditableField.tsx`, `NumberRow.tsx`, `TextRow.tsx`, `MetaCard.tsx`, `AddExerciseSheet.tsx`, `src/data/exercise-library.ts`

Fuentes en `hivo-design/train.jsx`: RoutineDetail l.972-1158, EditableExerciseRow l.1160-1233 (reordenar con up/down, eliminar), EditableField l.1235-1286, NumberRow l.1288-1307 (stepper −/+ con min/max/step), TextRow l.1309-1325, MetaCard l.1327-1337, EXERCISE_LIBRARY l.1339-1360 (→ `src/data/exercise-library.ts`, tipado), AddExerciseSheet l.1362-1418 (búsqueda + preview técnica). Guardar = upsert en `myRoutines` (`train.jsx:77-85`) + `router.back()`. "Start" arranca el logger (ruta de Task 8; hasta entonces, deshabilitado o `router.push('/active')` si ya existe).

- [x] **Step 1: Portar RoutineDetail + subcomponentes + AddExerciseSheet**
- [x] **Step 2: Probar en navegador**: editar nombre/sets/reps/rest/RPE, añadir/quitar/reordenar ejercicios, guardar nueva y existente
- [x] **Step 3: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 4: Commit** — `feat(train): routine editor with exercise picker`

---

### Task 6: Train — editor de Workout

**Files:**
- Replace: `src/app/workout-editor.tsx`
- Create: `src/components/train/WorkoutDetail.tsx`, `DayPicker.tsx`, `LevelPicker.tsx`

Fuentes en `hivo-design/train.jsx`: WorkoutDetail l.660-914 (días de la semana, cada día apunta a una Routine de `myRoutines` o rest; abrir routine desde un día → draftRoutine + push), DayPicker l.916-931, LevelPicker l.933-970. Guardar = upsert en `myWorkouts` (`train.jsx:103-111`) + back.

- [x] **Step 1: Portar WorkoutDetail + pickers**
- [x] **Step 2: Probar en navegador**: crear workout nuevo, asignar rutinas a días, marcar rest, guardar
- [x] **Step 3: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 4: Commit** — `feat(train): weekly workout editor`

---

### Task 7: Train — ShareSheet + AI Coach

**Files:**
- Test: `src/lib/__tests__/coach.test.ts`, Create: `src/lib/coach.ts`
- Create: `src/components/train/ShareSheet.tsx`, `AICoachSheet.tsx`
- Modify: `src/components/train/TrainList.tsx` (botón AI Coach + share), `src/app/routine-editor.tsx` y `workout-editor.tsx` (share)

Fuentes en `hivo-design/train.jsx`: ShareSheet l.1420-1608 + ShareTarget l.1610-1622 (link mock + targets), SparklesIcon l.1624-1632, COACH_QUESTIONS l.1646-1695, AICoachSheet l.1697-2021 (intake de 6 preguntas → genera workout con rutinas embebidas `_routineData`), StarIcon l.2023-2031. La generación del workout a partir de las respuestas se extrae a `src/lib/coach.ts` (`generateCoachWorkout(answers): Workout` — transcribir la lógica exacta del prototipo). Al añadir: extraer `_routineData` embebidas a `myRoutines` y limpiar los días (`train.jsx:146-161`) — también función pura `absorbCoachWorkout(myRoutines, myWorkouts, w)` en `coach.ts`.

- [x] **Step 1 (TDD): Tests de `generateCoachWorkout` y `absorbCoachWorkout`** → FAIL
- [x] **Step 2: Implementar `src/lib/coach.ts`** → PASS
- [x] **Step 3: Portar AICoachSheet (flujo de 6 preguntas + loading + resultado) y ShareSheet**
- [x] **Step 4: Probar en navegador**: completar intake, añadir workout generado, verlo en My Workouts con sus rutinas en My Routines
- [x] **Step 5: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 6: Commit** — `feat(train): AI coach intake and share sheet`

---

### Task 8: Logger de entreno activo

**Files:**
- Test: `src/lib/__tests__/active.test.ts`, Create: `src/lib/active.ts`
- Create: `src/app/active.tsx` (ruta full-screen, param `mode: 'live' | 'log-past'`)
- Create: `src/components/active/ActiveWorkout.tsx`, `ExerciseBlock.tsx`, `SetRow.tsx`, `Cell.tsx`, `RestTimer.tsx`, `SwapSheet.tsx`, `TechniqueSheet.tsx`, `AutoregSheet.tsx`
- Modify: `src/components/home/TodayHero.tsx` (CTA Start → `router.push('/active')`), `src/app/(tabs)/index.tsx`, `src/components/train/TrainList.tsx` (Start/Log past → `/active?mode=...`), `src/components/train/RoutineDetail.tsx` (Start)

Fuentes en `hivo-design/active.jsx`: SET_TYPE_LABEL/COLOR l.4-20, ActiveWorkout l.22-199 — **SOLO layout `hybrid`** (los layouts `list` y `focus` fueron exploración descartada, CLAUDE.md), ExerciseBlock l.201-313, SetRow l.315-396 (última sesión visible encima del input, tap para autocompletar), Cell l.398-420, RestTimer l.422-473 (cuenta atrás, +30s, skip), SwapSheet l.475-508 (alternativas gym-aware), TechniqueSheet l.511-620 (con preferencia persistida — usar `@react-native-async-storage/async-storage`? NO: mantener en memoria/context, YAGNI sin backend), AutoregSheet l.622-655 + Row l.642-655 (explicación del ajuste: sueño/HRV/RPE). El `Sheet` genérico ya existe en el kit UI.

Lógica pura en `src/lib/active.ts`: `formatClock(seconds)` (mm:ss), `sessionProgress(exercises)` (sets hechos / totales, excluyendo warmups según CLAUDE.md si el prototipo lo hace — verificar en la fuente), `adjustedWeight(...)` (el cálculo de autoreg que muestre el prototipo). Transcribir las fórmulas exactas.

- [x] **Step 1 (TDD): Tests de helpers de `active.ts`** → FAIL
- [x] **Step 2: Implementar `src/lib/active.ts`** → PASS
- [x] **Step 3: Portar ActiveWorkout (hybrid) + ExerciseBlock + SetRow + Cell**
- [x] **Step 4: Portar RestTimer + sheets (Swap, Technique, Autoreg)**
- [x] **Step 5: Ruta `/active` + wiring de los CTAs (Home hero, Train, RoutineDetail)**
- [x] **Step 6: Probar en navegador**: arrancar desde Home, loguear sets, autocompletar desde última sesión, rest timer al completar set, swap, finish → vuelve a Home
- [x] **Step 7: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 8: Commit** — `feat(active): hybrid workout logger with rest timer, autoreg and swap`

---

### Task 9: Clan onboarding

**Files:**
- Create: `src/components/clan/ClanOnboarding.tsx`, `ClanCard.tsx`, `ClanPreviewSheet.tsx`, `CreateClanSheet.tsx`, `src/data/discover-clans.ts`
- Replace: `src/app/(tabs)/squad.tsx` (renderiza ClanOnboarding cuando `userClan == null`; con clan, placeholder hasta Task 10)

Fuentes en `hivo-design/clan-onboarding.jsx`: DISCOVER_CLANS l.5-63 (→ `src/data/discover-clans.ts`), ClanOnboarding l.65-230 (descubrir + buscar + crear), ClanCard l.232-266, ClanPreviewSheet l.268-374 + PreviewStat l.376-388 (request → simulate accept → `onJoined(clan)`), CLAN_COLORS l.390-397, CreateClanSheet l.399-497 + FieldC l.499-530, SearchIconC l.532-541. `onJoined` → `setUserClan` del context.

- [x] **Step 1: Portar onboarding completo + datos**
- [x] **Step 2: Probar en navegador**: explorar clanes, preview, request+accept te une; crear clan propio también
- [x] **Step 3: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 4: Commit** — `feat(clan): discover, preview and create clan onboarding`

---

### Task 10: Squad — clan, raid, misiones y feed

**Files:**
- Replace: `src/app/(tabs)/squad.tsx`
- Create: `src/components/squad/SquadScreen.tsx`, `MenuRow.tsx`, `ClanTab.tsx`, `RaidCard.tsx`, `MissionCard.tsx`, `FeedTab.tsx`, `PostComposer.tsx`, `ClanSearch.tsx`
- Modify: `src/components/home/JoinClanStrip.tsx` o `index.tsx` (CTA → tab Squad)

Fuentes en `hivo-design/other-screens.jsx`: SquadScreen l.7-109 (segmented Clan/Feed, menú ⋯ con invite/members/settings/ID, leave con confirmación destructiva), MenuRow l.111-131, ClanTab l.133-243 (incluye clan strength map con `BodyHeatmap` de Task 3), RaidCard l.245-348 (HP bar + órbita de miembros), MissionCard l.350-373, FeedTab l.375-576 (posts con datos locales del archivo), PostComposer l.578-674, CommentIcon l.676-685, SEARCHABLE_CLANS l.687-692, ClanSearch l.694-780. Leave clan → `setUserClan(null)` → vuelve al onboarding (Task 9). Anti-toxicidad (CLAUDE.md): el % de contribución individual solo del propio usuario.

- [x] **Step 1: Portar SquadScreen + ClanTab (raid, misiones, leaderboard, heatmap)**
- [x] **Step 2: Portar FeedTab + PostComposer + ClanSearch**
- [x] **Step 3: Probar en navegador**: unirse vía onboarding → ver clan; tabs Clan/Feed; postear; leave → onboarding otra vez; JoinClanStrip de Home lleva a Squad
- [x] **Step 4: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 5: Commit** — `feat(squad): clan screen with raid, missions, feed and leave flow`

---

### Task 11: Stats

**Files:**
- Replace: `src/app/(tabs)/stats.tsx`
- Create: `src/components/stats/StatsScreen.tsx`, `InsightCard.tsx`, `MuscleHeatmap.tsx`, `BodyweightChart.tsx`, `LineChart.tsx`, `SummaryStat.tsx`, `AICoachFeedbackSheet.tsx`

Fuentes en `hivo-design/other-screens.jsx`: StatsScreen l.794-949 (resumen, recovery — monta el `RecoveryDial` ya hecho en home/, charts, insights), StatsSparklesIcon l.951-962, AICoachFeedbackSheet l.964-1117, InsightCard l.1119-1149, MuscleHeatmap l.1151-1178 (usa `BodyHeatmap`), BodyweightChart l.1180-1203 y LineChart l.1205-1230 (SVG puro con react-native-svg), SummaryStat l.1232-1243. Números siempre en mono con tabular-nums.

- [x] **Step 1: Portar StatsScreen + charts + heatmap + insights**
- [x] **Step 2: Portar AICoachFeedbackSheet**
- [x] **Step 3: Probar en navegador** y comparar con el prototipo
- [x] **Step 4: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [x] **Step 5: Commit** — `feat(stats): stats screen with charts, muscle heatmap and insights`

---

### Task 12: Profile (You)

**Files:**
- Replace: `src/app/(tabs)/profile.tsx`
- Create: `src/components/profile/ProfileScreen.tsx`, `MiniStat.tsx`, `AccountSheet.tsx`, `DataExportSheet.tsx`, `ResetHistorySheet.tsx`

Fuentes en `hivo-design/other-screens.jsx`: ProfileScreen l.1245-1360 (header con avatar/rank, mini stats, menú de settings — **incluye el kill-switch de gamificación**, la única personalización que sobrevive: togglearlo debe ocultar el tab Squad vía context de Task 1 y el streak en Home), MiniStat l.1362-1372, AccountSheet l.1374-1453 + SheetField l.1455-1480, DataExportSheet l.1482-1637, ResetHistorySheet l.1639-1719 (confirmación destructiva). Logout → `setAuthedUser(null)` → Redirect a /auth.

- [ ] **Step 1: Portar ProfileScreen + sheets**
- [ ] **Step 2: Wire kill-switch → context** (tab Squad desaparece; Home oculta streak/clan si `!gamification` — comprobar cómo lo hace `home.jsx` con el prop `gamification` y replicar)
- [ ] **Step 3: Probar en navegador**: toggle gamification, account sheet, export, reset, logout
- [ ] **Step 4: Verificar** `npx tsc --noEmit && npx expo lint && npx jest`
- [ ] **Step 5: Commit** — `feat(profile): profile screen with gamification kill-switch and account sheets`

---

### Task 13: Verificación final + docs

- [ ] **Step 1: Suite completa**

```bash
npx tsc --noEmit && npx expo lint && npx jest
```

- [ ] **Step 2: Screenshots de las pantallas nuevas** con la receta de chrome-headless-shell + puppeteer-core (ver memoria `ui-verification-recipe`) a `docs/screenshots/`, comparando lado a lado con `hivo-design/Hivo Prototype.html`
- [ ] **Step 3: Actualizar README** (mapa de navegación + screenshots nuevos)
- [ ] **Step 4: Commit** — `docs: README update with full navigation map and new screenshots`

---

## Self-review (hecho al escribir)

- **Cobertura:** todas las pantallas del prototipo quedan cubiertas (auth T2, train T4-7, active T8, clan-onboarding T9, squad T10, stats T11, profile T12, body T3). Excluido a propósito (CLAUDE.md): tweaks-panel, ios-frame, layouts list/focus del logger.
- **Dependencias entre tasks:** T1 (context) antes de todo; T3 (BodyHeatmap) antes de T10/T11; T4 crea las rutas que T5/T6 completan; T9 antes de T10 (Squad sin clan = onboarding); T8 toca CTAs creados en T4/T5.
- **Consistencia de tipos:** `useAppState()` definido en T1 y consumido en T2,T4-T10,T12; `heatColor` en T3 usado por BodyHeatmap; tipos nuevos (`ExerciseInfo` para library, `DiscoverClan`, `CoachAnswer`) se definen en la task que los introduce, en `src/data/types.ts`.
- **Sin placeholders:** el código fuente de cada componente son las líneas citadas del prototipo (transcripción con el mapeo CSS→RN del plan anterior) — mismo patrón validado en tasks 1-9 del bootstrap.
