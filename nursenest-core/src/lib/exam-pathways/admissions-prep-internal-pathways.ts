import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Internal admissions prep — HESI A2 / HESI Exit / ATI TEAS.
 *
 * **Launch:** Do not remove `hidden`, enable public URLs, checkout, or indexing until
 * `docs/governance/admissions-prep-launch-gate.md` is fully satisfied (no partial launches).
 * Production stays flag-off + hidden until then.
 */

/** Stable registry IDs for internal admissions-prep scaffolding (must match segment F rows). */
export const INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS = [
  "us-allied-hesi-a2",
  "us-allied-hesi-exit",
  "us-allied-ati-teas",
] as const;

export type InternalAdmissionsPrepPathwayId = (typeof INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS)[number];

const INTERNAL_SET = new Set<string>(INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS);

/**
 * Phase 1 hidden scaffold only exposes the overview page for HESI A2 + ATI TEAS.
 * HESI Exit remains hidden and unresolved at the route layer until a later phase.
 */
export const PHASE_ONE_HIDDEN_ADMISSIONS_SCAFFOLD_PATHWAY_IDS = [
  "us-allied-hesi-a2",
  "us-allied-ati-teas",
] as const;

export type PhaseOneHiddenAdmissionsScaffoldPathwayId =
  (typeof PHASE_ONE_HIDDEN_ADMISSIONS_SCAFFOLD_PATHWAY_IDS)[number];

const PHASE_ONE_SET = new Set<string>(PHASE_ONE_HIDDEN_ADMISSIONS_SCAFFOLD_PATHWAY_IDS);

/**
 * When `true`, hidden admissions-prep pathways resolve via {@link resolveExamPathwaySafe}
 * so local/staging QA can hit `/us/allied/hesi-a2` style URLs without public sitemap/nav exposure.
 *
 * Server-only; never enable in production until admissions product launches publicly.
 */
export function isInternalAdmissionsPrepPathwaysEnabled(): boolean {
  return process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS === "1";
}

export function isInternalAdmissionsPrepPathwayId(pathwayId: string): pathwayId is InternalAdmissionsPrepPathwayId {
  return INTERNAL_SET.has(pathwayId);
}

export function isPhaseOneHiddenAdmissionsScaffoldPathwayId(
  pathwayId: string,
): pathwayId is PhaseOneHiddenAdmissionsScaffoldPathwayId {
  return PHASE_ONE_SET.has(pathwayId);
}

function normalizeRequestPath(path: string): string {
  const noQuery = path.split("?")[0]?.trim() ?? "";
  if (!noQuery) return "/";
  return noQuery.length > 1 ? noQuery.replace(/\/+$/, "") : noQuery;
}

/**
 * Hidden admissions routes are allowed only for the exact overview path in local/staging QA.
 * Sibling pages (`/pricing`, `/questions`, `/cat`, `/lessons`, ...) stay blocked.
 */
export function shouldAllowInternalAdmissionsOverviewRoute(
  pathway: ExamPathwayDefinition,
  routePathname: string,
  requestPathname: string,
): boolean {
  return (
    isInternalAdmissionsPrepPathwaysEnabled() &&
    pathway.status === "hidden" &&
    isPhaseOneHiddenAdmissionsScaffoldPathwayId(pathway.id) &&
    normalizeRequestPath(routePathname) === normalizeRequestPath(requestPathname)
  );
}

/** Omit regional hreflang alternates on internal admissions-prep hubs (not publicly indexable). */
export function shouldOmitRegionalHreflangForInternalAdmissionsPrep(pathway: ExamPathwayDefinition): boolean {
  return isInternalAdmissionsPrepPathwayId(pathway.id);
}

/** Marketing robots: hidden pathways must never be indexed when URLs resolve (e.g. internal QA flag). */
export function marketingRobotsForExamPathway(
  pathway: ExamPathwayDefinition,
  opts?: { suppressIndexForSearchQuery?: boolean },
): { index: boolean; follow: boolean } {
  if (pathway.status === "hidden") return { index: false, follow: false };
  if (opts?.suppressIndexForSearchQuery) return { index: false, follow: true };
  return { index: true, follow: true };
}
