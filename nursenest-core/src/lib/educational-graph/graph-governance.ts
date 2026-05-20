/**
 * Educational graph hygiene — density caps, duplicate-edge prevention, traversal limits.
 */

import { DENSITY_CONFIG } from "@/lib/linking/link-density-config";

export const REMEDIATION_LADDER_MAX_STEPS = 8;
export const TOPIC_HUB_GRAPH_MAX_LINKS = 6;
export const MIN_EDUCATIONAL_RELEVANCE_SCORE = 6;

export type GraphAuditIssue = {
  code:
    | "duplicate_href"
    | "exceeds_density"
    | "orphan_topic"
    | "weak_remediation"
    | "circular_hint";
  message: string;
  context?: string;
};

/** Drop duplicate hrefs while preserving first occurrence order. */
export function dedupeGraphHrefs<T extends { href: string }>(items: readonly T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const href = item.href.trim();
    if (!href || seen.has(href)) continue;
    seen.add(href);
    out.push(item);
  }
  return out;
}

export function auditRemediationSteps(hrefs: readonly string[]): GraphAuditIssue[] {
  const issues: GraphAuditIssue[] = [];
  const seen = new Set<string>();
  for (const href of hrefs) {
    if (seen.has(href)) {
      issues.push({ code: "duplicate_href", message: `Duplicate remediation href: ${href}`, context: href });
    }
    seen.add(href);
  }
  if (hrefs.length < 2) {
    issues.push({ code: "weak_remediation", message: "Remediation ladder has fewer than 2 steps." });
  }
  if (hrefs.length > REMEDIATION_LADDER_MAX_STEPS) {
    issues.push({
      code: "exceeds_density",
      message: `Remediation ladder exceeds cap (${REMEDIATION_LADDER_MAX_STEPS}).`,
    });
  }
  return issues;
}

/** Lesson-surface auto-related + hub links must respect {@link DENSITY_CONFIG.lesson}. */
export function lessonSurfaceLinkBudget(): number {
  return DENSITY_CONFIG.lesson.totalMax;
}

/**
 * Weighted relevance for educational (not SEO-spam) edges.
 * Higher = stronger pedagogical fit.
 */
export function scoreEducationalRelevance(input: {
  sameTopic: boolean;
  sameCompetency: boolean;
  remediationIntent: boolean;
  mechanismMatch: boolean;
}): number {
  let score = 0;
  if (input.sameTopic) score += 8;
  if (input.sameCompetency) score += 5;
  if (input.remediationIntent) score += 4;
  if (input.mechanismMatch) score += 6;
  return score;
}

export function passesEducationalRelevanceThreshold(score: number): boolean {
  return score >= MIN_EDUCATIONAL_RELEVANCE_SCORE;
}

export function auditGraphTraversal(steps: readonly { href: string; stepKind?: string; competencyId?: string | null }[]): GraphAuditIssue[] {
  const issues = auditRemediationSteps(steps.map((s) => s.href));
  const kinds = steps.map((s) => s.stepKind).filter(Boolean);
  if (kinds.length >= 3 && kinds[0] === kinds[kinds.length - 1] && kinds[0] === "reassessment") {
    issues.push({ code: "circular_hint", message: "Remediation path may loop reassessment without scaffold steps." });
  }
  const withoutCompetency = steps.filter((s) => s.competencyId == null).length;
  if (withoutCompetency === steps.length && steps.length > 2) {
    issues.push({ code: "orphan_topic", message: "Traversal has no competency mapping for topic cluster." });
  }
  return issues;
}

/** Detect circular or reassessment-only remediation paths (graph-loop governance). */
export function detectRemediationLoops(
  steps: readonly { href: string; stepKind?: string; competencyId?: string | null }[],
): GraphAuditIssue[] {
  return auditGraphTraversal(steps).filter((i) => i.code === "circular_hint" || i.code === "duplicate_href");
}
