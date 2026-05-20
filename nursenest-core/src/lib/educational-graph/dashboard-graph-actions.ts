/**
 * Dashboard next-best actions — orchestration consumer only (no parallel recommendation author).
 */
import type { UnifiedEducationalSubstrate } from "@/lib/educational-graph/unified-educational-substrate";
import { primaryGraphNextBestAction } from "@/lib/educational-graph/unified-educational-substrate";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

export type DashboardGraphAction = {
  title: string;
  href: string;
  topicSlug: string;
  stepId: string;
  stepKind: EduGraphStep["stepKind"];
  competencyId: string | null;
  remediationPriority: number;
  /** Canonical step for telemetry wrappers. */
  step: EduGraphStep;
};

export function buildDashboardGraphActions(
  substrate: UnifiedEducationalSubstrate,
  maxActions = substrate.cognition.remediation.maxRecommendations,
): DashboardGraphAction[] {
  const actions: DashboardGraphAction[] = [];
  const seen = new Set<string>();

  for (const [topicSlug, traversal] of Object.entries(substrate.traversalsByTopic)) {
    for (const step of traversal.steps) {
      if (seen.has(step.href)) continue;
      seen.add(step.href);
      actions.push({
        title: step.title,
        href: step.href,
        topicSlug,
        stepId: step.stepId,
        stepKind: step.stepKind,
        competencyId: step.competencyId,
        remediationPriority: step.remediationPriority,
        step,
      });
      if (actions.length >= maxActions) return actions.sort((a, b) => b.remediationPriority - a.remediationPriority);
    }
  }

  const primary = primaryGraphNextBestAction(substrate);
  if (primary && !seen.has(primary.href)) {
    const step = substrate.traversalsByTopic[primary.topicSlug]?.steps.find((s) => s.stepId === primary.stepId);
    if (step) {
      actions.unshift({
        title: primary.title,
        href: primary.href,
        topicSlug: primary.topicSlug,
        stepId: primary.stepId,
        stepKind: step.stepKind,
        competencyId: step.competencyId,
        remediationPriority: step.remediationPriority,
        step,
      });
    }
  }

  return actions.sort((a, b) => b.remediationPriority - a.remediationPriority).slice(0, maxActions);
}
