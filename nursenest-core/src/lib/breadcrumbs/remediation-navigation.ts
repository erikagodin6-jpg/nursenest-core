/**
 * Remediation graph navigation — reinforces learning continuity (visible + href ladder).
 * Traversal authority: {@link orchestrateEducationalGraph}.
 */

import {
  orchestrateBreadcrumbGraph,
  remediationPathwayId,
} from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import { toRemediationNavSteps } from "@/lib/educational-graph/graph-step-adapters";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { EducationalHierarchyNode } from "@/lib/breadcrumbs/navigation-ontology";

export type RemediationNavStep = {
  kind: string;
  title: string;
  href: string;
  reason: string;
  depth: number;
};

export type RemediationNavigationLadder = {
  topic: string;
  competencyLabel: string | null;
  competencyId: string | null;
  remediationPathwayId: string;
  steps: RemediationNavStep[];
  hierarchyNodes: EducationalHierarchyNode[];
};

/**
 * Builds remediation ladder from canonical graph orchestration.
 * Breadcrumbs should surface the *current* step title; full ladder lives in study UI.
 */
export function buildRemediationNavigationLadder(args: {
  topic: string;
  pathwayId: string | null;
  coachingModel?: CoachingModel;
  exposureDepth?: number;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  sourceSurface?: GraphSourceSurface;
}): RemediationNavigationLadder {
  const topic = args.topic.trim();
  const sourceSurface = args.sourceSurface ?? "app_remediation";
  const traversal = orchestrateBreadcrumbGraph({
    topicSlug: topic,
    pathwayId: args.pathwayId,
    sourceSurface,
    coachingModel: args.coachingModel ?? "cat_adaptive",
    exposureDepth: args.exposureDepth ?? 0,
    learnerState: args.learnerState ?? null,
    persistentWeakTopics: args.persistentWeakTopics,
    currentLabel: topic.replace(/-/g, " "),
  });
  const steps = toRemediationNavSteps(traversal.steps);

  return {
    topic,
    competencyLabel: traversal.competencyLabel,
    competencyId: traversal.competencyId,
    remediationPathwayId: remediationPathwayId(args.pathwayId, topic),
    steps,
    hierarchyNodes: [
      { layer: "learner_session", label: "Remediation", href: "/app/exam-plan", slug: "remediation" },
      {
        layer: "competency",
        label: traversal.competencyLabel ?? "Competency",
        slug: traversal.competencyId ?? undefined,
      },
      { layer: "topic_cluster", label: traversal.topicLabel, slug: traversal.topicSlug },
    ],
  };
}
