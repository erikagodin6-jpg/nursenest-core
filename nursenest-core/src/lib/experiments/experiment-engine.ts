/**
 * Lightweight A/B testing engine.
 *
 * Persists variant assignments in localStorage (client) and exposes
 * a server-side deterministic assignment from user ID.
 *
 * Design constraints:
 *   - No external service required (works with or without PostHog feature flags)
 *   - Deterministic: same user always gets same variant (hash-based)
 *   - Assignments persist across sessions via localStorage
 *   - Analytics integration: every assignment fires a PostHog event
 *   - Zero runtime cost for server components (hash only, no network)
 */

// ── Experiment definitions ──────────────────────────────────────────────────

export interface ExperimentVariant {
  id: string;
  weight: number;
}

export interface ExperimentDef {
  id: string;
  variants: ExperimentVariant[];
}

export const EXPERIMENTS = {
  hero_cta: {
    id: "hero_cta",
    variants: [
      { id: "start_free_trial", weight: 50 },
      { id: "start_studying_smarter", weight: 50 },
    ],
  },
  paywall_headline: {
    id: "paywall_headline",
    variants: [
      { id: "unlock_full_access", weight: 50 },
      { id: "get_your_study_plan", weight: 50 },
    ],
  },
  trial_messaging: {
    id: "trial_messaging",
    variants: [
      { id: "3_day_free_trial", weight: 50 },
      { id: "try_it_free", weight: 50 },
    ],
  },
} as const satisfies Record<string, ExperimentDef>;

export type ExperimentId = keyof typeof EXPERIMENTS;

// ── Deterministic assignment (server-safe) ────────────────────────────────

/**
 * Simple FNV-1a hash that maps a string to [0, 100).
 * Deterministic: same input always produces the same bucket.
 */
function hashToBucket(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h % 100);
}

/**
 * Assigns a variant deterministically from a user identifier and experiment ID.
 * Works on both server and client — no localStorage, no side effects.
 */
export function assignVariant(experimentId: ExperimentId, userId: string): string {
  const exp = EXPERIMENTS[experimentId];
  const bucket = hashToBucket(`${experimentId}:${userId}`);

  let cumulative = 0;
  for (const v of exp.variants) {
    cumulative += v.weight;
    if (bucket < cumulative) return v.id;
  }
  return exp.variants[exp.variants.length - 1]!.id;
}

// ── Variant copy maps ───────────────────────────────────────────────────────

export const HERO_CTA_COPY: Record<string, string> = {
  start_free_trial: "Start Free Trial",
  start_studying_smarter: "Start Studying Smarter",
};

export const PAYWALL_HEADLINE_COPY: Record<string, string> = {
  unlock_full_access: "Unlock Full Access",
  get_your_study_plan: "Get Your Study Plan",
};

export const TRIAL_MESSAGING_COPY: Record<string, string> = {
  "3_day_free_trial": "3-day free trial",
  try_it_free: "Try it free — cancel anytime",
};
