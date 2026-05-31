import { auditContentRelationshipNode, type ContentRelationshipNode } from "./content-relationship-engine";
import { GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE } from "@/lib/content-quality/global-content-quality-governance";

export type ContentGovernanceInput = {
  readonly id: string;
  readonly text: string;
  readonly relationshipNode: ContentRelationshipNode;
  readonly hasClinicalPearl: boolean;
  readonly hasHint: boolean;
  readonly hasRationale: boolean;
  readonly duplicateScore: number;
};

export type ContentGovernanceIssue =
  | "placeholder"
  | "duplicate_content"
  | "weak_rationale"
  | "missing_clinical_pearl"
  | "missing_hint"
  | "missing_related_content";

export type ContentGovernanceResult = {
  readonly pass: boolean;
  readonly score: number;
  readonly issues: readonly ContentGovernanceIssue[];
};

const PLACEHOLDER_PATTERN = /\b(todo|lorem ipsum|placeholder|coming soon|tbd)\b/i;

export function runContentGovernanceEngine(input: ContentGovernanceInput): ContentGovernanceResult {
  const issues: ContentGovernanceIssue[] = [];
  if (PLACEHOLDER_PATTERN.test(input.text)) issues.push("placeholder");
  if (input.duplicateScore >= 0.86) issues.push("duplicate_content");
  if (!input.hasRationale) issues.push("weak_rationale");
  if (!input.hasClinicalPearl) issues.push("missing_clinical_pearl");
  if (!input.hasHint) issues.push("missing_hint");
  if (auditContentRelationshipNode(input.relationshipNode).some((issue) => issue.code === "missing_related_content")) {
    issues.push("missing_related_content");
  }
  const score = Math.max(0, 100 - issues.length * 15 - Math.round(input.duplicateScore * 10));
  return { pass: issues.length === 0 && score >= GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE, score, issues };
}
