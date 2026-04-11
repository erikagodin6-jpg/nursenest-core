import type { Transition, Variants } from "framer-motion";

/**
 * Timing constants -- short, calm durations for a premium feel.
 * Interaction: 160-280ms, Entrance: 280-420ms.
 */
export const TIMING = {
  fast: 0.16,
  normal: 0.24,
  entrance: 0.36,
  slow: 0.42,
} as const;

export const EASE_SOFT: number[] = [0.25, 0.1, 0.25, 1.0];
export const EASE_OUT: number[] = [0.0, 0.0, 0.2, 1.0];

export const transitionEntrance: Transition = {
  duration: TIMING.entrance,
  ease: EASE_SOFT,
};

export const transitionFast: Transition = {
  duration: TIMING.fast,
  ease: EASE_OUT,
};

export const transitionNormal: Transition = {
  duration: TIMING.normal,
  ease: EASE_SOFT,
};

/** Fade up from 12px below with opacity. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/** Simple opacity fade. */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Subtle scale-in from 97%. */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};

/** Stagger container -- children animate in sequence. */
export function staggerContainer(staggerMs = 60): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerMs / 1000,
        delayChildren: 0.04,
      },
    },
  };
}

/** Reduced-motion safe: instantly visible, no spatial movement. */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
