/**
 * Reasoning-chain convergence — navigable educational cognition pathways from graph primitives.
 */

import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import { orchestrateBreadcrumbGraph } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import type { ClinicalReasoningRelation } from "@/lib/educational-graph/rn-competency-ontology";
import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";
import { recordReasoningChainInvalid } from "@/lib/breadcrumbs/graph-navigation-observability";

const RELATION_LABELS: Record<ClinicalReasoningRelation, string> = {
  symptom_to_mechanism: "Symptom → mechanism",
  mechanism_to_assessment: "Mechanism → assessment",
  assessment_to_intervention: "Assessment → intervention",
  intervention_to_monitoring: "Intervention → monitoring",
  medication_to_safety_risk: "Medication → safety risk",
  lab_abnormality_to_prioritization: "Lab → prioritization",
  disease_to_delegation_risk: "Delegation risk",
  instability_to_escalation: "Instability → escalation",
  prerequisite_to_advanced: "Prerequisite → advanced",
  remediation_reinforces: "Remediation reinforcement",
};

export type ReasoningChainNavStep = {
  id: string;
  label: string;
  href?: string;
  relation: ClinicalReasoningRelation;
};

export type ReasoningChainNavigationFrame = {
  topicSlug: string;
  competencyId: string | null;
  steps: ReasoningChainNavStep[];
  traversal: EducationalGraphTraversal;
  depth: number;
  valid: boolean;
  invalidReason?: string;
};

/**
 * Build navigable reasoning chain from graph orchestration (prioritization, escalation, reassessment).
 */
export function buildReasoningChainNavigation(args: {
  topicSlug: string;
  topicLabel?: string;
  pathwayId?: string | null;
  pathname?: string;
  sourceSurface?:
    | "topic_hub_public"
    | "app_remediation"
    | "dashboard_feed"
    | "post_exam_coaching"
    | "glossary_traversal";
}): ReasoningChainNavigationFrame {
  const topicSlug =
    typeof args.topicSlug === "string" && args.topicSlug.trim().length > 0
      ? args.topicSlug
      : "focus-areas";
  const topicLabel = args.topicLabel?.trim() ? args.topicLabel : "Focus areas";
  const traversal = orchestrateBreadcrumbGraph({
    topicSlug,
    topicLabel,
    pathwayId: args.pathwayId ?? null,
    sourceSurface: args.sourceSurface ?? "topic_hub_public",
    currentLabel: topicLabel,
  });

  const chain = traversal.reasoningChain ?? [];
  const hrefSteps = traversal.steps.filter((s) => s.href);
  const steps: ReasoningChainNavStep[] = chain.map((relation, i) => ({
    id: `${topicSlug}-${relation}-${i}`,
    label: RELATION_LABELS[relation] ?? relation.replace(/_/g, " "),
    href: hrefSteps[i]?.href,
    relation,
  }));

  const valid = steps.length >= 2 && steps.every((s) => s.label.trim().length > 0);
  const invalidReason = !valid
    ? steps.length < 2
      ? "reasoning_chain_too_shallow"
      : "reasoning_chain_empty_label"
    : undefined;

  if (!valid && args.pathname) {
    recordReasoningChainInvalid(args.pathname, invalidReason ?? "invalid");
  }

  return {
    topicSlug,
    competencyId: traversal.competencyId,
    steps,
    traversal,
    depth: steps.length,
    valid,
    invalidReason,
  };
}

/** Compact breadcrumb slice from reasoning chain (bounded — max 2 middle steps). */
export function reasoningChainBreadcrumbCrumbs(
  frame: ReasoningChainNavigationFrame,
  terminalLabel: string,
): BreadcrumbCrumb[] {
  const middle = frame.steps
    .filter((s) => s.href)
    .slice(-2)
    .map((s) => ({ name: s.label, href: s.href }));
  return [...middle, { name: terminalLabel, href: undefined }];
}

/** Known exemplar chains for governance tests (hyperkalemia, sepsis). */
export const REASONING_CHAIN_EXEMPLARS = {
  hyperkalemia: ["ecg changes", "cardiac instability", "calcium", "monitoring", "reassessment"],
  sepsis: ["lactate", "perfusion", "escalation", "prioritization", "reassessment"],
} as const;
