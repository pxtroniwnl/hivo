// Tokens de movimiento — única fuente de verdad para animaciones (Reanimated).
// Reglas destiladas de las skills emil-design-eng / impeccable / taste:
//   · UI < 300ms; entradas hasta ~420ms; salidas ~75% de la entrada.
//   · ease-out para entrar/salir, nunca ease-in ni bounce/elastic.
//   · animar solo transform/opacity.
//   · respetar reduce-motion (ReduceMotion.System salta al valor final).
// La curva firma del proyecto (CLAUDE.md) es cubic-bezier(0.2, 0.8, 0.2, 1).
import { Easing, ReduceMotion, useReducedMotion, type WithTimingConfig } from 'react-native-reanimated';

export { ReduceMotion };

export const durations = {
  /** Feedback inmediato: press, toggle, cambio de color. */
  instant: 120,
  /** Salida rápida / retorno de press. */
  fast: 180,
  /** Estado base: la mayoría de transiciones. */
  base: 240,
  /** Cambios de layout: dropdowns, sheets. */
  slow: 320,
  /** Entradas con presencia (riseIn de listas/secciones). */
  enter: 420,
} as const;

export const easing = {
  /** Curva firma del proyecto (CLAUDE.md). ease-out suave. */
  signature: Easing.bezier(0.2, 0.8, 0.2, 1),
  /** iOS drawer (emil): para sheets y movimiento en pantalla. */
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
  /** ease-out estándar. */
  out: Easing.out(Easing.cubic),
} as const;

/** Configs de muelle para `withSpring` — rebote sutil (emil: 0.1–0.3) o nulo. */
export const springs = {
  /** Sin rebote, rápido — press y toggles. */
  press: { damping: 26, stiffness: 380, mass: 0.7 },
  /** Rebote sutil — elementos que se sienten "vivos". */
  gentle: { damping: 18, stiffness: 170, mass: 0.9 },
} as const;

const STAGGER_STEP = 50; // ms entre hijos (emil: 30–80ms)
const STAGGER_MAX = 6; // cap del nº de items escalonados (impeccable: limitar el total)

export const stagger = {
  step: STAGGER_STEP,
  max: STAGGER_MAX,
  /** Delay para el hijo `i`, capado para no bloquear la interacción. */
  delayFor: (i: number) => Math.min(Math.max(i, 0), STAGGER_MAX) * STAGGER_STEP,
} as const;

/** Config de `withTiming` para press (scale), salta al final con reduce-motion. */
export const pressTiming: WithTimingConfig = {
  duration: durations.instant,
  easing: easing.signature,
  reduceMotion: ReduceMotion.System,
};

export const pressReturnTiming: WithTimingConfig = {
  duration: durations.fast,
  easing: easing.signature,
  reduceMotion: ReduceMotion.System,
};

/** Hook: true si el usuario prefiere movimiento reducido. */
export function useReduceMotion(): boolean {
  return useReducedMotion();
}
