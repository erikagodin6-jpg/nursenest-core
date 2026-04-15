/**
 * Operational classification for paid-access durability (see `durability-flags.ts`).
 *
 * **Core (must not block paid study access)** — auth, session, entitlement resolution,
 * lesson / question bank / flashcard content reads for entitled subscribers.
 *
 * **Non-critical (safe to skip under degraded / emergency)** — analytics, recommendations,
 * coach/AI panels, secondary dashboard widgets, marketing calls, optional reporting.
 *
 * Non-critical work must never prevent rendering the learner shell or loading core study routes.
 */

export const DURABILITY_CORE_SUBSYSTEMS = [
  "auth",
  "session",
  "entitlement",
  "lesson_content",
  "question_bank",
  "flashcard",
] as const;

export type DurabilityCoreSubsystem = (typeof DURABILITY_CORE_SUBSYSTEMS)[number];
