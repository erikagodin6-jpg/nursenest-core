import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { UnifiedEducationalSubstrate } from "@/lib/educational-graph/unified-educational-substrate";
import { logGraphGovernanceViolation } from "@/lib/educational-graph/graph-governance-observability";

export type GraphSubstrateIntegrityTier =
  | "healthy"
  | "degraded"
  | "conflicting"
  | "orphaned"
  | "replay_divergent";

export type GraphSubstrateIntegrityReport = {
  tier: GraphSubstrateIntegrityTier;
  issues: string[];
  salvageSteps: EduGraphStep[];
};

export function assessGraphSubstrateIntegrity(
  substrate: UnifiedEducationalSubstrate,
): GraphSubstrateIntegrityReport {
  const issues: string[] = [];
  const salvage: EduGraphStep[] = [];

  for (const [topicSlug, traversal] of Object.entries(substrate.traversalsByTopic)) {
    if (traversal.steps.length === 0) {
      issues.push(`orphaned:${topicSlug}`);
      continue;
    }
    for (const step of traversal.steps) {
      if (!step.href?.startsWith("/")) issues.push(`invalid_href:${step.stepId}`);
      else salvage.push(step);
    }
  }

  const seen = new Set<string>();
  for (const step of salvage) {
    if (seen.has(step.href)) issues.push(`duplicate_href:${step.href}`);
    seen.add(step.href);
  }

  let tier: GraphSubstrateIntegrityTier = "healthy";
  if (issues.some((i) => i.startsWith("orphaned"))) tier = "orphaned";
  else if (issues.some((i) => i.startsWith("duplicate"))) tier = "conflicting";
  else if (issues.length > 0) tier = "degraded";

  if (tier !== "healthy") {
    logGraphGovernanceViolation({
      code: tier === "orphaned" ? "glossary_graph.orphaned" : "dashboard_graph.divergence",
      surface: "cognition_substrate",
      pathwayId: substrate.cognition.pathwayId,
      detail: issues.slice(0, 3).join("; "),
    });
  }

  return { tier, issues, salvageSteps: salvage.slice(0, substrate.cognition.remediation.maxRecommendations) };
}

export function resurrectGraphStep(
  steps: readonly EduGraphStep[],
  stepId: string,
): EduGraphStep | null {
  return steps.find((s) => s.stepId === stepId) ?? steps[0] ?? null;
}
