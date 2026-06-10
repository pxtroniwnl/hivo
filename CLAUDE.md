# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Hivo

Hivo es una app de strength training (competidor directo de Hevy) que añade encima del logging de entrenos: **gamificación cooperativa** (clanes de 2–8 personas con misiones semanales y raids estilo boss-fight), **autorregulación adaptativa** (ajusta el peso prescrito según RPE, sueño y HRV), **recovery score** diario (0–100) y un **AI Coach** que genera workouts personalizados. La métrica norte del producto es *weekly active clan members* — la tesis es que la responsabilidad cooperativa impulsa la retención, no el feed social pasivo.

## Estado del repo y ejecución

Por ahora el repo contiene **solo el prototipo de diseño** en `hivo-design/`. No hay app real, ni build, ni tests, ni lint.

- **Ejecutar el prototipo**: abrir `hivo-design/Hivo Prototype.html` en un navegador. Es React 18 + Babel standalone por CDN; los `.jsx` se transpilan en el navegador y se cargan secuencialmente en el orden declarado en el HTML (ios-frame → tweaks-panel → ui → body → auth → home → active → train → clan-onboarding → other-screens → app). Si añades un archivo nuevo al prototipo, debe ir en ese orden de dependencias.
- Las fuentes (Geist, Manrope, JetBrains Mono) se cargan de Google Fonts; sin internet el prototipo se ve con fuentes de sistema.

## Decisiones de stack (fijadas, junio 2026)

Estas decisiones **reemplazan** lo que dice el PRD (que proponía Swift/SwiftUI iOS-only y backend Node/Fastify):

- **App móvil: React Native + Expo** — cross-platform iOS + Android desde el día uno. El prototipo ya es React; componentes, tokens y patrones se trasladan casi directo.
- **Backend: Supabase** — Auth (Apple/Google/email), Postgres con RLS, Storage (videos de feed, fotos de progreso), Realtime (progreso de raids y misiones en vivo), Edge Functions (AI Coach, autoreg server-side).

## Reglas de diseño — INMUTABLES

El diseño está cerrado. El prototipo es la fuente de verdad visual; ante cualquier duda, **copiar los valores exactos de `hivo-design/tokens.css`, nunca aproximar ni "mejorar"**.

### Valores canónicos (fijos, no configurables por el usuario)

- **Tema**: oscuro siempre. No existe modo claro.
- **Superficies**: `--bg-0 #08080a` (true black) → `--bg-1 #101014` → `--bg-2 #16161d` → `--bg-3 #1d1d26` → `--bg-4 #25252f`. Bordes hairline de **0.5px**: `--line rgba(255,255,255,0.06)`, `--line-strong rgba(255,255,255,0.12)`.
- **Texto**: `--fg #f5f5f7`, `--fg-mid #b8b8c2`, `--fg-mute #74747e`, `--fg-dim #4a4a52`.
- **Acento**: morado `#b26bff`, con `--accent-soft rgba(178,107,255,0.16)`, `--accent-deep #7a3fe0`, `--accent-fg #0a0210` (texto sobre acento).
- **Señales**: ok `#5cd6a8`, warn `#f5b54a`, err `#ff6b6b`.
- **Tipografía**: **Geist** (sans) para todo; **JetBrains Mono** con `tnum` (números tabulares) para pesos, reps, timers y cualquier dato numérico. Escala: display 34px/600, h1 26px, h2 20px, h3 17px, body 15px/400, sm 13px, xs 11px/500 uppercase con letter-spacing 0.04em. Letter-spacing **negativo** en títulos (-0.025em a -0.01em).
- **Radios**: xs 6, sm 10, md 14 (el default de cards y botones), lg 20, xl 28, pill 999.
- **Espaciado**: base 4px — escala 4/8/12/16/20/24/32. Inset horizontal de pantalla: **18px**. Densidad: comfy (`--d: 1`).
- **Logger de entreno**: layout **hybrid** (el ejercicio enfocado expandido, el resto colapsado). Los layouts `list` y `focus` de `active.jsx` fueron exploración descartada.

### Patrones de componentes

- **Cards**: fondo `--bg-2`, borde 0.5px `--line`, radio 14px, padding 16px. Elevadas: `--bg-3` + `--line-strong`.
- **Chips**: pill, 11px/500, fondo `--bg-3`; variante acento con `--accent-soft` + texto acento.
- **Botones**: 15px/600, padding 14×18, radio 14px; primario = fondo acento + texto `--accent-fg`; **press = scale(0.97–0.98)**, nunca cambio de opacidad solo.
- **Tab bar**: fondo translúcido `rgba(8,8,10,0.85)` con blur(20px) saturate(140%), borde superior hairline, iconos 22px, label 10px; tab activa en color acento con bounce.
- **Sheets**: modales bottom-up (slideUp/sheetIn), no pantallas push para acciones contextuales.
- **Animaciones**: curva firma `cubic-bezier(0.2, 0.8, 0.2, 1)`; entrada de listas con stagger (riseIn, delays de ~60ms por hijo); reveal-on-scroll; shimmer para loading; conteo animado en números. Sutiles y rápidas (0.24–0.55s), nunca aparatosas.
- **Heatmap corporal** (`body.jsx`): silueta SVG frente/espalda, 16+ grupos musculares, intensidad 0..1 de gris a acento. Se usa tanto para stats personales como para el "clan strength map".

### Lo que NO se porta a la app real

- **`tweaks-panel.jsx` y todas sus variantes** (5 acentos, 3 fondos, 3 fuentes, densidades, layouts de logger): fueron herramienta de exploración de diseño. La app real **no tiene personalización de tema**. La única opción de usuario que sobrevive es el **kill-switch de gamificación** (oculta tab Squad, streak y ranks — y debe ocultarlos también server-side: sin notificaciones de raid para quien lo apaga).
- **`ios-frame.jsx`** (marco de iPhone, dynamic island, teclado simulado): solo decorado de demo.
- Los **datos mock** globales de `ui.jsx` (USER, CLAN, ROUTINES, WORKOUTS, etc.): sirven como referencia de shapes de datos, no como contenido.

## Modelo de dominio

Jerarquía de tres niveles — no confundirlos (el naming del prototipo es la convención del proyecto):

| Entidad | Qué es | Notas |
| --- | --- | --- |
| **Exercise** | Un movimiento (press banca) con grupo muscular + equipamiento | ~400 globales + creados por usuario |
| **Routine** | La sesión de UN día ("Push · Heavy": ejercicios con sets × reps × rest × RPE) | Propiedad de un usuario; compartible por link |
| **Workout** | Un programa SEMANAL: lista ordenada de días, cada día apunta a una Routine | Solo uno puede estar `current` (activo) por usuario |

- **LoggedSet**: la unidad de historial. `set_type` ∈ warmup/normal/drop/failure/superset/cluster, weight_kg, reps, rpe, `prescribed` (lo que tocaba) y `adjusted` (si autoreg intervino). **Los warmups se excluyen de los cálculos de volumen.**
- **Clan**: 2–8 miembros, slug tipo `IRC-4892`, unirse requiere aceptación de un miembro. **Raid**: objetivo colectivo multi-día con barra de HP (daño = volumen en el lift objetivo). **Mission**: objetivos semanales (3 por semana: fácil/core/stretch). **Rescue**: si un miembro cae por debajo del ritmo, las contribuciones del resto cuentan con multiplicador — convierte frustración en agencia.
- **Glosario**: e1RM = 1RM estimado (Epley por defecto); RPE = esfuerzo percibido 1–10; autoreg = ajustar prescripción según readiness; deload = semana ligera planificada; shield = token que protege el streak ante un día fallado.

## Mapa del prototipo

| Archivo | Contenido |
| --- | --- |
| `app.jsx` | Shell: tabs (Today/Train/Squad/Stats/You), estado global, auth gate |
| `ui.jsx` | Componentes compartidos (iconos, Avatar, Chip, Ring, ProgressBar, Reveal, Counter, Sheet) + todo el mock data global |
| `home.jsx` | Pantalla Today: hero del entreno, recovery dial, week strip, streak, clan strip, warmups, feed preview, notificaciones |
| `active.jsx` | Logger del entreno activo: bloques de ejercicio, rest timer, autoreg con toast explicable, swap de ejercicio gym-aware, technique sheet |
| `train.jsx` | Biblioteca: My Workouts / Trending / My Routines, búsqueda y filtros, AI Coach (intake de 6 preguntas → workout generado), editores |
| `other-screens.jsx` | Squad (raid con órbita de miembros, misiones, leaderboard, clan heatmap, feed), Stats, Profile |
| `clan-onboarding.jsx` | Descubrir/crear clan, preview, join request |
| `auth.jsx` | Login/registro con OAuth mock |
| `body.jsx` | Heatmap muscular SVG reutilizable |

## Insights de producto (lo no obvio del PRD)

- **Offline-first es la decisión arquitectónica más importante**: los gyms tienen mala señal; todo write debe funcionar offline y sincronizar después. Si esto falla, todo lo demás da igual.
- **El logger es sagrado**: es la pantalla que se abre 3+ veces por semana. Si es un 10% más lento o torpe que Hevy, nada más importa. Keypad alcanzable con una mano; números de la sesión anterior visibles encima del input de hoy (tap para autocompletar).
- **Accesibilidad es diferenciador público**, no checkbox: el VoiceOver roto de Hevy es una queja conocida. Cada elemento interactivo con label/hint; probar con lector de pantalla antes de merge.
- **Anti-toxicidad por diseño** en clanes: porcentajes de contribución individual visibles solo para el propio usuario (nunca shaming público); contribuciones normalizadas contra el historial de cada uno; salir de un clan es sin fricción.
- **Autoreg siempre explícito y transparente**, nunca silencioso. Y siempre enmarcado como *sugerencia*, no prescripción — riesgo de rechazo en App Store por "medical advice".
- **Localización ES/EN/PT desde el día uno**: cero strings hard-coded.
- **Anti-cheat en raids**: contribución por sesión capada a 3σ sobre la media de 8 semanas del usuario; el primer workout de una cuenta nueva no puntúa (cooldown de 7 días).
- Monetización: free tier generoso (logging ilimitado, clanes de 4); Pro €4.99/mes desbloquea autoreg, recovery, clanes de 8, IA.

## Fuentes de verdad

- **Producto/features/fases**: `hivo-design/uploads/Hivo_PRD_v1.0.docx` (40 features en 6 fases; extraer texto con `unzip -p ... word/document.xml`).
- **Diseño/UX**: el prototipo. No adivinar una regla que el prototipo ya codifica — sacar las constantes de `ui.jsx` o del archivo de la pantalla correspondiente.
- **Dominio/endpoints/flujos de IA**: `BACKEND_CONTEXT.md` (borrado del árbol pero recuperable: `git show 2ee5ad0:backend/BACKEND_CONTEXT.md`). Sus recomendaciones de stack quedaron obsoletas por la decisión Supabase; el modelo de dominio y los flujos siguen vigentes.
