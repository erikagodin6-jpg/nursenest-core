/**
 * NurseNest brand motion — calm, soft, premium; clinical clarity without playfulness.
 *
 * Principles (see `docs` in repo standards): minimal travel, no bounce/spin/cartoon springs,
 * no infinite decorative loops unless explicitly approved. Prefer opacity + light translate.
 *
 * Durations are in **seconds** for Framer Motion. CSS mirrors: `globals.css` `:root`
 * `--brand-motion-fast|normal|medium|slow` and `--brand-motion-ease*`.
 */
export const BRAND_MOTION = {
  /** 140–180ms — hovers, taps, small UI */
  fastSec: 0.16,
  /** 180–240ms — default entrance, tab swap, dropdowns */
  normalSec: 0.2,
  /** 240–320ms — modals, sheets, larger panels */
  mediumSec: 0.28,
  /** 320–420ms — deliberate section reveals only */
  slowSec: 0.36,
} as const;

/** Maximum vertical travel for reveals (px). */
export const BRAND_MOTION_DISTANCE_PX = {
  fadeUp: 8,
  softReveal: 5,
  modal: 10,
  sheet: 12,
  dropdown: 6,
  tab: 3,
  carouselCrossfade: 0,
} as const;

/** Hover lift clamp: 1–3px (Framer whileHover). */
export const BRAND_HOVER_LIFT_Y = -2;

/** Subtle press scale (never below 0.96 for brand surfaces). */
export const BRAND_PRESS_SCALE = 0.98;

/** Soft, expensive easing — not playful overshoot. */
export const EASE_LUXURY: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
/** Calm deceleration on exits and opacity-led motion. */
export const EASE_CALM_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Slightly quicker settle for small components. */
export const EASE_SOFT_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * @deprecated Use `BRAND_MOTION.*Sec` — kept for older imports.
 * Maps legacy names to brand tiers.
 */
export const LEGACY_TIMING = {
  fast: BRAND_MOTION.fastSec,
  normal: BRAND_MOTION.normalSec,
  entrance: BRAND_MOTION.mediumSec,
  slow: BRAND_MOTION.slowSec,
} as const;
