import type { Transition, Variants } from "framer-motion";
import {
  BRAND_MOTION,
  BRAND_MOTION_DISTANCE_PX,
  BRAND_HOVER_LIFT_Y,
  BRAND_PRESS_SCALE,
  EASE_LUXURY,
  EASE_CALM_OUT,
  EASE_SOFT_OUT,
  LEGACY_TIMING,
} from "./tokens";

/** @deprecated Use `BRAND_MOTION` from `./tokens` */
export const TIMING = LEGACY_TIMING;

export const EASE_SOFT = EASE_LUXURY;
export const EASE_OUT = EASE_SOFT_OUT;

const yFade = BRAND_MOTION_DISTANCE_PX.fadeUp;
const ySoft = BRAND_MOTION_DISTANCE_PX.softReveal;

export const transitionFast: Transition = {
  duration: BRAND_MOTION.fastSec,
  ease: EASE_LUXURY,
};

export const transitionNormal: Transition = {
  duration: BRAND_MOTION.normalSec,
  ease: EASE_LUXURY,
};

export const transitionMedium: Transition = {
  duration: BRAND_MOTION.mediumSec,
  ease: EASE_LUXURY,
};

export const transitionSlow: Transition = {
  duration: BRAND_MOTION.slowSec,
  ease: EASE_LUXURY,
};

/** @deprecated Prefer `transitionMedium` */
export const transitionEntrance: Transition = transitionMedium;

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: yFade },
  visible: { opacity: 1, y: 0 },
};

/** Tighter vertical travel than fadeUp — section lines, captions. */
export const softRevealVariants: Variants = {
  hidden: { opacity: 0, y: ySoft },
  visible: { opacity: 1, y: 0 },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.992 },
  visible: { opacity: 1, scale: 1 },
};

/** Stagger container — shallow stagger only. */
export function staggerContainer(staggerMs = 50): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerMs / 1000,
        delayChildren: 0.03,
      },
    },
  };
}

export const modalEnterVariants: Variants = {
  hidden: { opacity: 0, y: BRAND_MOTION_DISTANCE_PX.modal },
  visible: { opacity: 1, y: 0 },
};

export const modalExitVariants: Variants = {
  hidden: { opacity: 0, y: BRAND_MOTION_DISTANCE_PX.modal },
  visible: { opacity: 1, y: 0 },
};

export const sheetEnterVariants: Variants = {
  hidden: { opacity: 0, y: BRAND_MOTION_DISTANCE_PX.sheet },
  visible: { opacity: 1, y: 0 },
};

export const dropdownRevealVariants: Variants = {
  hidden: { opacity: 0, y: BRAND_MOTION_DISTANCE_PX.dropdown },
  visible: { opacity: 1, y: 0 },
};

export const tabSwapVariants: Variants = {
  hidden: { opacity: 0, x: BRAND_MOTION_DISTANCE_PX.tab },
  visible: { opacity: 1, x: 0 },
};

export const skeletonFadeVariants: Variants = {
  hidden: { opacity: 0.35 },
  visible: { opacity: 1 },
};

export const gentleCarouselTransition: Transition = {
  duration: BRAND_MOTION.mediumSec,
  ease: EASE_CALM_OUT,
};

/** Re-export for components that still import from `presets`. */
export { reducedMotionVariants } from "./reduced-motion";

export const hoverLiftTransition: Transition = {
  duration: BRAND_MOTION.fastSec,
  ease: EASE_LUXURY,
};

export const pressDownTransition: Transition = {
  duration: BRAND_MOTION.fastSec,
  ease: EASE_LUXURY,
};

/** Framer `whileHover` payload — max 3px lift. */
export const hoverLiftMotion = {
  y: BRAND_HOVER_LIFT_Y,
  transition: hoverLiftTransition,
} as const;

/** Framer `whileTap` / press. */
export const pressDownMotion = {
  scale: BRAND_PRESS_SCALE,
  transition: pressDownTransition,
} as const;

/** Card polish: tiny lift + no overshoot. */
export const cardHoverMotion = {
  y: BRAND_HOVER_LIFT_Y,
  transition: hoverLiftTransition,
} as const;
