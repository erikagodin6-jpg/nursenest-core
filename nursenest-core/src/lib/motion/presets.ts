import type { Transition, Variants } from "framer-motion";
import {
  BRAND_MOTION,
  BRAND_MOTION_DISTANCE_PX,
  BRAND_HOVER_LIFT_Y,
  BRAND_PRESS_SCALE,
  BRAND_STAGGER_CHILD_MS,
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

/** Hero headline / CTA stagger items (~220ms, no overshoot). */
export const transitionHeroReveal: Transition = {
  duration: BRAND_MOTION.heroRevealSec,
  ease: EASE_LUXURY,
};

/** Card hover: shadow + translate polish. */
export const transitionCardHover: Transition = {
  duration: BRAND_MOTION.cardHoverSec,
  ease: EASE_LUXURY,
};

/** 404 leaf first paint (single entrance). */
export const transitionNotFoundLeafEntrance: Transition = {
  duration: 0.32,
  ease: EASE_LUXURY,
};

/** Success leaf scale-in (matches product spec ~220ms). */
export const successLeafTransition: Transition = {
  duration: BRAND_MOTION.heroRevealSec,
  ease: EASE_LUXURY,
};

/** Slow mirror loop for decorative leaf only. */
export const notFoundLeafFloatTransition: Transition = {
  duration: BRAND_MOTION.notFoundLeafFloatSec,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

/** @deprecated Prefer `transitionMedium` */
export const transitionEntrance: Transition = transitionMedium;

/** Opacity stays 1 — translate-only so first paint is never blank if `Fade` is used above the fold. */
export const fadeInVariants: Variants = {
  hidden: { opacity: 1, y: 6 },
  visible: { opacity: 1, y: 0 },
};

/** @deprecated Use `fadeInVariants` — same opacity-only fade. */
export const fadeVariants = fadeInVariants;

/** Opacity stays 1 so first paint / SSR is never “blank” hero lines; motion is translate only. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 1, y: yFade },
  visible: { opacity: 1, y: 0 },
};

/** Tighter vertical travel than fadeUp — section lines, captions. */
export const softRevealVariants: Variants = {
  hidden: { opacity: 1, y: ySoft },
  visible: { opacity: 1, y: 0 },
};

/** Scale-only entrance — opacity stays 1 for first paint if this variant is ever used above the fold. */
export const scaleInVariants: Variants = {
  hidden: { opacity: 1, scale: 0.992 },
  visible: { opacity: 1, scale: 1 },
};

/** Stagger container — shallow stagger only (default 65ms between children). */
export function staggerContainer(staggerMs: number = BRAND_STAGGER_CHILD_MS): Variants {
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
  duration: BRAND_MOTION.cardHoverSec,
  ease: EASE_LUXURY,
};

export const pressDownTransition: Transition = {
  duration: BRAND_MOTION.fastSec,
  ease: EASE_LUXURY,
};

/** Framer `whileHover` payload — token lift (2px). */
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
