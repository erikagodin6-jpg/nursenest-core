import { auditGraphTraversal, type GraphAuditIssue } from "@/lib/educational-graph/graph-governance";
import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";

export type GraphGovernanceObservation = {
  ok: boolean;
  issues: GraphAuditIssue[];
};

export function observeGraphGovernance(traversal: EducationalGraphTraversal): GraphGovernanceObservation {
  const issues = auditGraphTraversal(traversal.steps);
  return { ok: issues.length === 0, issues };
}
