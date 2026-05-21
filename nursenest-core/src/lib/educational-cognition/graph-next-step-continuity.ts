import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import type { PersistedGraphContinuity } from "@/lib/educational-cognition/cognition-snapshot-types";
import { GRAPH_VERSION } from "@/lib/educational-cognition/cognition-version-governance";

export type GraphNextStepPresentation = {
  title: string;
  href: string;
  kind: string;
  reason?: string;
};

const GRAPH_CHECKPOINT_STALE_MS = 14 * 24 * 60 * 60 * 1000;

export function graphNextStepsFromSteps(steps: EduGraphStep[]): GraphNextStepPresentation[] {
  return steps.map((s) => ({
    title: s.title,
    href: s.href,
    kind: s.stepKind,
    reason: s.description,
  }));
}

export function buildGraphContinuityFromTraversal(args: {
  topicSlug: string;
  steps: EduGraphStep[];
  ctx: EducationalCognitionContext;
  prior?: PersistedGraphContinuity;
  dashboardPrimaryHref?: string | null;
  adaptivePrimaryHref?: string | null;
}): PersistedGraphContinuity {
  const primary = args.steps[0];
  const hrefs = args.steps.map((s) => s.href).filter(Boolean).slice(0, 8);
  const momentum = Math.max(
    0,
    Math.min(1, 1 - (args.ctx.learnerState.remediationFatigueScore ?? 0) * 0.35),
  );

  return {
    currentTopicSlug: args.topicSlug,
    remediationPathwayIds: hrefs,
    glossaryContinuityKeys: args.ctx.ontology.measurementWeaknessTags.slice(0, 12),
    interpretationContinuityKeys: args.ctx.measurement.topCategory
      ? [args.ctx.measurement.topCategory]
      : [],
    lastGraphStepId: primary?.stepId ?? null,
    lastGraphHref: primary?.href ?? null,
    reasoningMomentum: momentum,
    interruptedTraversalTopicSlug: args.prior?.interruptedTraversalTopicSlug ?? args.topicSlug,
    remediationReturnHref: primary?.href ?? args.prior?.remediationReturnHref ?? null,
    dashboardContinuationHref:
      args.dashboardPrimaryHref ?? args.prior?.dashboardContinuationHref ?? primary?.href ?? null,
    adaptiveAnchorHref:
      args.adaptivePrimaryHref ?? args.prior?.adaptiveAnchorHref ?? primary?.href ?? null,
    graphCheckpointAt: new Date().toISOString(),
    graphVersion: GRAPH_VERSION,
  };
}

export function mergeGraphContinuityWithStored(
  stored: PersistedGraphContinuity | undefined,
  next: PersistedGraphContinuity,
): PersistedGraphContinuity {
  if (!stored) return next;
  return {
    currentTopicSlug: next.currentTopicSlug ?? stored.currentTopicSlug,
    remediationPathwayIds: [...new Set([...stored.remediationPathwayIds, ...next.remediationPathwayIds])].slice(0, 12),
    glossaryContinuityKeys: [...new Set([...stored.glossaryContinuityKeys, ...next.glossaryContinuityKeys])].slice(0, 16),
    interpretationContinuityKeys: [
      ...new Set([...stored.interpretationContinuityKeys, ...next.interpretationContinuityKeys]),
    ].slice(0, 12),
    lastGraphStepId: next.lastGraphStepId ?? stored.lastGraphStepId,
    lastGraphHref: next.lastGraphHref ?? stored.lastGraphHref,
    reasoningMomentum: next.reasoningMomentum ?? stored.reasoningMomentum,
    interruptedTraversalTopicSlug:
      next.interruptedTraversalTopicSlug ?? stored.interruptedTraversalTopicSlug,
    remediationReturnHref: next.remediationReturnHref ?? stored.remediationReturnHref,
    dashboardContinuationHref: next.dashboardContinuationHref ?? stored.dashboardContinuationHref,
    adaptiveAnchorHref: next.adaptiveAnchorHref ?? stored.adaptiveAnchorHref,
    graphCheckpointAt: next.graphCheckpointAt ?? stored.graphCheckpointAt,
    graphVersion: next.graphVersion ?? stored.graphVersion ?? GRAPH_VERSION,
  };
}

/** Stale checkpoint pruning — preserves return points when still valid. */
export function pruneStaleGraphContinuity(
  continuity: PersistedGraphContinuity,
): PersistedGraphContinuity {
  if (!continuity.graphCheckpointAt) return continuity;
  const age = Date.now() - new Date(continuity.graphCheckpointAt).getTime();
  if (age <= GRAPH_CHECKPOINT_STALE_MS) return continuity;
  return {
    ...continuity,
    remediationPathwayIds: continuity.remediationPathwayIds.slice(0, 4),
    graphCheckpointAt: new Date().toISOString(),
    reasoningMomentum: Math.max(0, (continuity.reasoningMomentum ?? 0.5) * 0.85),
  };
}

export function validateGraphContinuityReplay(continuity: PersistedGraphContinuity | undefined): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!continuity) return { valid: true, warnings };
  if (continuity.graphVersion && continuity.graphVersion !== GRAPH_VERSION) {
    warnings.push("graph_version_mismatch");
  }
  if (continuity.lastGraphHref && !continuity.lastGraphHref.startsWith("/")) {
    warnings.push("invalid_last_graph_href");
  }
  return { valid: warnings.length === 0, warnings };
}
