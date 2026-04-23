/**
 * Tier-scoped routing for Practice Questions (`/app/questions`), CAT start (`/app/practice-tests/cat-launch` / `start`),
 * and Flashcards (`/app/flashcards`) when `pathwayId` is present.
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
}): ResolvedQuestionBankPathways {
  const { requestedPathwayId, compatible, learnerPath } = args;
  const byId = new Map(compatible.map((p) => [p.id, p]));

  if (requestedPathwayId?.trim()) {
    const req = requestedPathwayId.trim();
    const hit = byId.get(req);
    if (!hit) return { state: "invalid_requested", requestedPathwayId: req };
    return { state: "scoped", defaultPathwayId: hit.id, pathwayOptions: [hit] };
  }

  const lp = learnerPath?.trim() || null;
  if (lp && byId.has(lp)) {
    const hit = byId.get(lp)!;
    return { state: "scoped", defaultPathwayId: hit.id, pathwayOptions: [hit] };
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

const PATHWAY_ID_PARAM = /^[a-z][a-z0-9-]{5,80}$/i;

/**
 * Marketing auth may allow returning to these app routes when `pathwayId` is present,
 * so sign-in from a tier hub can resume the same exam track (still same-origin, path-only).
 *
 * Includes `/app/flashcards` so hub “Flashcards” deep links survive login the same way as
 * Practice Questions and CAT start.
 */
export function parseTierScopedAppStudyCallbackPath(raw: string | null): string | null {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.trim(), "http://localhost");
    if (
      u.pathname !== "/app/questions" &&
      u.pathname !== "/app/practice-tests/start" &&
      u.pathname !== "/app/practice-tests/cat-launch" &&
      u.pathname !== "/app/flashcards"
    ) {
      return null;
    }
    const pid = u.searchParams.get("pathwayId")?.trim() ?? "";
    if (!PATHWAY_ID_PARAM.test(pid)) return null;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
