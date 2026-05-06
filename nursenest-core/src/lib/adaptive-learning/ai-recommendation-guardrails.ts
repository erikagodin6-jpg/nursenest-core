/**
 * Phase 5 — Adaptive / AI-adjacent recommendation guardrails (documentation + types).
 *
 * **Pathway scope:** Every surfaced recommendation must be scoped to the learner's
 * active exam pathway (`pathwayId` / catalog row). Never blend RN vs PN vs NP pools.
 *
 * **Entitlement / paywall:** Callers must enforce server-side entitlements before
 * showing any “next step” that hits premium surfaces (question bank, CAT, decks).
 * This library does not perform auth checks — it is fail-closed by returning
 * conservative hints only; routes remain responsible for `requireEntitlement` etc.
 *
 * **No fabricated progress:** Outputs describe study *directions* from caller-supplied
 * metrics only. Never invent completion %, streaks, or mastery not present in inputs.
 *
 * **Deterministic fallback chain:** Ranking and ordering use pure functions with
 * explicit tie-breakers (numeric score, then lexical `topicKey`). If inputs are empty
 * or contradictory, return empty arrays / `fallbackReason` — never random picks.
 *
 * **Optional AI hooks:** Future LLM planners must consume these DTOs as *constraints*
 * (max topics, allowed surfaces, pathway metadata) and must not create feedback loops
 * that write learner state without explicit user actions.
 */

/** Surfaces an optional future “AI study coach” may suggest; server still gates access. */
export type AdaptiveAiAssistMode = "off" | "explain_only" | "plan_with_human_review";

export type AdaptiveAiOptionalPlannerInput = {
  mode: AdaptiveAiAssistMode;
  /** Same pathway id used for catalog + bank filters — AI output must not change this. */
  pathwayId: string;
  /** Ranked weak topics from deterministic engine — AI may reorder only with documented policy. */
  rankedWeakTopicKeys: readonly string[];
};
