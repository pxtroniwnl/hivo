// Hook de número animado (conteo ascendente) — CLAUDE.md: "conteo animado en
// números". ease-out cúbico vía requestAnimationFrame (web + nativo). Respeta
// reduce-motion (devuelve el valor final al instante).
import { useEffect, useRef, useState } from 'react';

import { durations, useReduceMotion } from '@/theme/motion';

type Options = {
  /** Duración total en ms (default ~900). */
  duration?: number;
  /** Si es false, no anima y muestra el target. */
  enabled?: boolean;
};

export function useCountUp(target: number, { duration = 900, enabled = true }: Options = {}): number {
  const reduce = useReduceMotion();
  const animate = enabled && !reduce;
  const [value, setValue] = useState(animate ? 0 : target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    // Cuando no se anima, el hook devuelve `target` directamente (sin setState).
    if (!animate) return;
    const start = Date.now();
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / Math.max(1, duration));
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cúbico
      setValue(target * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, animate]);

  return animate ? value : target;
}

// Re-exporta la duración por defecto para callers que quieran alinearla.
export const COUNT_UP_DURATION = Math.max(durations.enter, 900);
