# Spec: Arranque de la app Hivo (Expo + tema + shell + Home)

**Fecha:** 2026-06-10 · **Estado:** aprobado por el usuario

## Objetivo

Crear la app real de Hivo con React Native + Expo en la raíz de este repo, portando el sistema de diseño del prototipo (`hivo-design/`) con fidelidad exacta, hasta tener: tema completo, kit de componentes base, navegación de 5 tabs y la pantalla Today (Home) funcional con datos mock.

## Decisiones (confirmadas con el usuario)

| Decisión | Valor |
| --- | --- |
| Framework | React Native + Expo (SDK actual) + TypeScript estricto + expo-router |
| Ubicación | Raíz del repo (`hivo-design/` permanece intocable como referencia) |
| Estilos | `StyleSheet` nativo + módulo `src/theme/` con los valores exactos de `tokens.css`. Sin librerías de theming: el diseño es fijo |
| Backend | Supabase — **fuera de alcance en este paso** |
| Flujo de trabajo | Un commit por feature (conventional commits), typecheck + lint antes de cada commit |

## Estructura

```
app/                  # rutas expo-router
  _layout.tsx         # raíz: fuentes (Geist, JetBrains Mono), dark fijo, status bar
  (tabs)/
    _layout.tsx       # tab bar custom: blur/glass, acento, 5 tabs
    index.tsx         # Today (Home completa)
    train.tsx         # placeholder
    squad.tsx         # placeholder
    stats.tsx         # placeholder
    profile.tsx       # placeholder
src/
  theme/              # tokens.ts (colores, spacing, radii), typography.ts
  components/ui/      # Card, Chip, Button, Avatar, Ring, ProgressBar, ScreenHeader
  components/home/    # HeroCard, RecoveryDial, WeekStrip, StreakCard, ClanStrip,
                      # WarmupCarousel, FeedPreview (+ sheets de notificaciones/warmup)
  data/mock.ts        # USER, WEEK, WARMUPS, FEED, CLAN portados de ui.jsx
```

## Dependencias

- `react-native-svg` — Ring / RecoveryDial / iconos (porteados de los SVG de `ui.jsx`).
- `expo-blur` — tab bar glass (fallback Android: fondo `rgba(8,8,10,0.92)`).
- `react-native-reanimated` — animaciones de entrada (stagger riseIn) con la curva firma `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- `expo-font` + TTFs de Geist y JetBrains Mono (vía `@expo-google-fonts/*` si existen los paquetes; si no, TTFs vendorizados en `assets/fonts/`).

## Reglas de fidelidad

1. Cada componente se construye leyendo su contraparte en el prototipo y copiando valores exactos de `tokens.css` / `home.jsx`. Nunca aproximar.
2. Diferencias de plataforma inevitables (sin hover, blur limitado en Android, bordes 0.5px → `StyleSheet.hairlineWidth`) se documentan con un comentario en el código.
3. No se porta: panel de tweaks, marco iOS de demo, layouts de logger `list`/`focus`.
4. Números (pesos, reps, streak, timers) siempre en JetBrains Mono con tabular numbers.

## Fuera de alcance

Supabase/auth, logger activo, pantallas Train/Squad/Stats/Profile reales, i18n, tests E2E.

## Verificación

- `npx tsc --noEmit` y `npx expo lint` en verde antes de cada commit.
- `npx expo start` → comparación visual lado a lado contra `hivo-design/Hivo Prototype.html` abierto en navegador.
