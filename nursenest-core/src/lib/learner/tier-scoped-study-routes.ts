/**
 * Tier-scoped routing for Practice Questions (`/app/questions`), the practice-tests hub (`/app/practice-tests`),
 * CAT start (`/app/practice-tests/cat-launch` / `start`), and Flashcards (`/app/flashcards`) when `pathwayId` is present.
 * Prevents silent fallbacks to another exam track when a pathway is already known from URL or profile.
 */

import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

export type CompatiblePathwayRow = { id: string; shortName: string };

export type ResolvedQuestionBankPathways =
  | { state: "scoped"; defaultPathwayId: string; pathwayOptions: CompatiblePathwayRow[] }
  | { state: "invalid_requested"; requestedPathwayId: string }
  | { state: "no_pathway_context" };

/**
 * Resolve which pathway(s) the question bank may use for the current subscriber.
 *
 * - `requestedPathwayId` from the URL wins when it matches the entitlement-compatible list.
 * - Otherwise, if `learnerPath` matches a compatible pathway, lock to that single track.
 * - If exactly one compatible pathway exists, lock to it.
 * - If several pathways are entitled but none is selected (no URL, no learnerPath), return
 *   `no_pathway_context` — callers should show an account / study-settings empty state, not a mixed-tier picker.
 */
export function resolveSubscribedQuestionBankPathways(args: {
  requestedPathwayId: string | null;
  compatible: CompatiblePathwayRow[];
  learnerPath: string | null;
  /** Study hubs can require an explicit `?pathwayId=` instead of silently inferring one. */
  requireExplicitRequestedPathwayId?: boolean;
}): ResolvedQuestionBankPathways {
  const { requestedPathwayId, compatible, learnerPath, requireExplicitRequestedPathwayId = false } = args;
  const byId = new Map(compatible.map((p) => [p.id, p]));

  if (requestedPathwayId?.trim()) {
    const req = requestedPathwayId.trim();
    const hit = byId.get(req);
    if (!hit) return { state: "invalid_requested", requestedPathwayId: req };
    return { state: "scoped", defaultPathwayId: hit.id, pathwayOptions: [hit] };
  }

  // learnerPath overrides the explicit-pathwayId gate — if the user has a profile pathway
  // that matches the entitlement, use it directly rather than forcing a picker.
  const lp = learnerPath?.trim() || null;
  if (lp && byId.has(lp)) {
    const hit = byId.get(lp)!;
    return { state: "scoped", defaultPathwayId: hit.id, pathwayOptions: [hit] };
  }

  if (requireExplicitRequestedPathwayId) {
    return { state: "no_pathway_context" };
  }

  if (compatible.length === 1) {
    const only = compatible[0]!;
    return { state: "scoped", defaultPathwayId: only.id, pathwayOptions: [only] };
  }

  return { state: "no_pathway_context" };
}

/**
 * Maps resolver output to a single href. Never falls back to unscoped `/app/questions` when the
 * subscriber has ambiguous multi-pathway access — that would reopen mixed-tier discovery.
 */
export function hrefForResolvedQuestionBankEntry(resolved: ResolvedQuestionBankPathways): string {
  if (resolved.state === "scoped") return pathwayHubAppQuestionsHref(resolved.defaultPathwayId);
  return "/app/account/study-preferences";
}

// Callback URL validation for study routes has moved to:
//   src/lib/auth/protected-study-routes.ts  →  normalizeStudyCallback()
//
// Adding a new study route: update STUDY_ROUTE_PREFIXES in protected-study-routes.ts.
// No changes needed here or in auth-flow-governance.ts.
