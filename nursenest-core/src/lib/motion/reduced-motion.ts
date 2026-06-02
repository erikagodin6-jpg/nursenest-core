import type { Transition, Variants } from "framer-motion";

/**
 * Instant, fully-visible state — use when `prefers-reduced-motion: reduce`.
 * Content is never hidden behind animation.
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1 },
};

export const instantTransition: Transition = { duration: 0 };

/**
 * Pick full variants vs reduced-motion-safe variants.
 */
export function pickVariants(reduced: boolean, full: Variants): Variants {
  return reduced ? reducedMotionVariants : full;
}

/**
 * Pick transition vs instant (reduced motion).
 */
export function pickTransition(reduced: boolean, full: Transition): Transition {
  return reduced ? instantTransition : full;
}
