"use client";

import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { buildRemediationNavigationLadder } from "@/lib/breadcrumbs/remediation-navigation";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

/**
 * Governed post-exam remediation breadcrumb — graph-orchestrated, bounded depth.
 */
export function PostExamRemediationBreadcrumb({
  topicSlug,
  topicLabel,
  pathwayId,
  currentStepTitle,
  currentStepHref,
  learnerState,
  persistentWeakTopics,
}: {
  topicSlug: string;
  topicLabel?: string;
  pathwayId: string | null;
  currentStepTitle: string;
  currentStepHref?: string;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
}) {
  const ladder = buildRemediationNavigationLadder({
    topic: topicSlug,
    pathwayId,
    learnerState: learnerState ?? null,
    persistentWeakTopics,
    sourceSurface: "post_exam_coaching",
  });

  return (
    <LearnerBreadcrumbTrail
      kind="remediation-ladder"
      topic={topicSlug}
      pathwayId={pathwayId}
      currentStepTitle={currentStepTitle}
      currentStepHref={currentStepHref}
      persistentWeakTopics={persistentWeakTopics}
      pathname="/app/practice-tests"
      topicSlug={topicSlug}
      competencyId={ladder.competencyId ?? undefined}
    />
  );
}

export function postExamRemediationPathwayId(pathwayId: string | null, topicSlug: string): string {
  const topic = topicSlug.trim().toLowerCase();
  return pathwayId ? `${pathwayId}:${topic}` : `global:${topic}`;
}
