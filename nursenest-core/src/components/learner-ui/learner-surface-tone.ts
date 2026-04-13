/**
 * Visual tone for learner surfaces — maps to `data-nn-ls-tone` in `learner-surface-primitives.css`.
 * - primary: brand-forward emphasis (hero CTAs, key study blocks)
 * - secondary: muted structural blocks
 * - supportive: cool / informational
 * - danger: red-flag, risk, overdue
 * - success: improvement, completion, positive reinforcement
 */
export type LearnerSurfaceTone = "primary" | "secondary" | "supportive" | "warm" | "danger" | "success";

export type LearnerNoteTone = "neutral" | "info" | "success" | "danger";
