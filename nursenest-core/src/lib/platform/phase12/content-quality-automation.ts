/**
 * Phase 12 — automated content quality **check kinds** (orchestration hooks only; no auto-publish).
 *
 * Findings route to human/admin review — never silently rewrite production content.
 *
 * See reports/phase-12-platform-intelligence.md
 */

export const ContentQualityCheckKind = {
  staleContent: "content.stale",
  thinContent: "content.thin",
  translationQuality: "content.translation_quality",
  brokenInternalLink: "content.broken_internal_link",
  seoRegression: "content.seo_regression",
  duplicateCandidate: "content.duplicate_candidate",
  examBlueprintGap: "content.exam_blueprint_gap",
  rationaleQuality: "content.rationale_quality",
} as const;

export type ContentQualityCheckKind = (typeof ContentQualityCheckKind)[keyof typeof ContentQualityCheckKind];

export const ContentQualityFindingSeverity = {
  info: "info",
  warn: "warn",
  blockPublish: "block_publish",
} as const;

export type ContentQualityFindingSeverity =
  (typeof ContentQualityFindingSeverity)[keyof typeof ContentQualityFindingSeverity];

export type ContentQualityFinding = {
  check: ContentQualityCheckKind;
  severity: ContentQualityFindingSeverity;
  resourceKey: string;
  pathwayId?: string;
  /** Stable fingerprint of rule version for audit. */
  ruleSetVersion: string;
};
