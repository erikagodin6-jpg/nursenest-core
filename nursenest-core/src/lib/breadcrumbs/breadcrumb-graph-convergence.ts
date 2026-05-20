/**
 * Breadcrumb ↔ educational graph convergence — single traversal authority.
 */

import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import { LEARNER_HOME, truncateLearnerCrumbs } from "@/lib/breadcrumbs/learner-navigation";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { toRemediationNavSteps } from "@/lib/educational-graph/graph-step-adapters";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { normalizeGraphTopicSlug } from "@/lib/educational-graph/graph-href-builders";

export type BreadcrumbGraphContext = {
  topicSlug: string;
  topicLabel?: string;
  pathwayId?: string | null;
  sourceSurface: GraphSourceSurface;
  coachingModel?: CoachingModel;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  exposureDepth?: number;
  /** Current study destination (breadcrumb leaf). */
  currentLabel: string;
  currentHref?: string;
  studyPlanHref?: string;
};

/** Stable remediation pathway ID for analytics (pathway + topic). */
export function remediationPathwayId(pathwayId: string | null, topicSlug: string): string {
  const topic = normalizeGraphTopicSlug(topicSlug);
  return pathwayId ? `${pathwayId}:${topic}` : `global:${topic}`;
}

/**
 * Canonical graph traversal for breadcrumb + remediation UI (same as coaching).
 */
export function orchestrateBreadcrumbGraph(ctx: BreadcrumbGraphContext): EducationalGraphTraversal {
  return orchestrateEducationalGraph({
    topicSlug: ctx.topicSlug,
    topicLabel: ctx.topicLabel,
    pathwayId: ctx.pathwayId ?? null,
    sourceSurface: ctx.sourceSurface,
    coachingModel: ctx.coachingModel ?? "cat_adaptive",
    learnerState: ctx.learnerState ?? null,
    persistentWeakTopics: ctx.persistentWeakTopics,
    exposureDepth: ctx.exposureDepth ?? 0,
  });
}

/**
 * Learner weak-area / remediation breadcrumb trail from graph ordering.
 */
export function learnerCrumbsFromGraphTraversal(
  traversal: EducationalGraphTraversal,
  ctx: Pick<BreadcrumbGraphContext, "currentLabel" | "currentHref" | "studyPlanHref"> & {
    currentStepHref?: string;
  },
): BreadcrumbCrumb[] {
  const steps = toRemediationNavSteps(traversal.steps);
  const currentHref = ctx.currentStepHref ?? ctx.currentHref;
  const prior = steps
    .filter((s) => s.href !== currentHref)
    .slice(-2)
    .map((s) => ({ name: s.title, href: s.href }));

  const weakLabel = traversal.competencyLabel ?? traversal.topicLabel;
  const crumbs: BreadcrumbCrumb[] = [
    LEARNER_HOME,
    { name: "Study plan", href: ctx.studyPlanHref ?? "/app/exam-plan" },
    { name: weakLabel, href: "/app/account/focus-areas" },
    ...prior,
    { name: ctx.currentLabel, href: undefined },
  ];
  return truncateLearnerCrumbs(crumbs);
}

/** Full weak-area crumbs with live learner-state ordering. */
export function learnerWeakAreaCrumbsFromGraph(ctx: BreadcrumbGraphContext & { currentStepHref?: string }): {
  crumbs: BreadcrumbCrumb[];
  traversal: EducationalGraphTraversal;
  remediationPathwayId: string;
  competencyId: string | null;
} {
  const traversal = orchestrateBreadcrumbGraph(ctx);
  return {
    crumbs: learnerCrumbsFromGraphTraversal(traversal, ctx),
    traversal,
    remediationPathwayId: remediationPathwayId(ctx.pathwayId ?? null, ctx.topicSlug),
    competencyId: traversal.competencyId,
  };
}
