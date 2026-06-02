/**
 * Nursing clinical scenarios (unfolding cases) — learner + marketing rollout gate.
 * Default off: learner nav + marketing sitemap omit clinical URLs; `/app` preview is staff-only.
 */
export function isClinicalScenariosPubliclyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS === "true";
}
