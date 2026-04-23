/**
 * Post-generation content and SEO-structure checks for AI blog drafts.
 * Complements {@link validateBlogPrePublish} with depth, internal-linking, and citation-gating rules.
 * Prefer explicit blocks/warns over silent acceptance of thin or citation-unsafe drafts.
 */

import { BlogPostTemplate, type Prisma } from "@prisma/client";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { parsePublishingPackage } from "@/lib/blog/blog-publishing-package";
import type { BlogCitationEnvelope } from "@/lib/blog/blog-citation-safety";

/** Machine ids aligned with {@link import("./blog-pre-publish-validation").PrePublishCheckId} extensions. */
export type BlogDraftQualityCheckId =
  | "content_nursing_implications"
  | "content_clinical_mechanism"
  | "primary_keyword"
  | "internal_link_recommendations"
  | "schema_summary_opportunities"
  | "schema_contract_notes"
  | "faq_content_when_required"
  | "apa_verification_gating";

export type BlogDraftQualityIssue = {
  id: BlogDraftQualityCheckId;
  severity: "block" | "warn";
  message: string;
  fix: string;
};

export type BlogPostDraftQualityRow = {
  body: string;
  targetKeyword: string | null;
  postTemplate: BlogPostTemplate | null;
  internalLinkPlan: Prisma.JsonValue;
  faqBlock: Prisma.JsonValue;
  schemaSummary: string | null;
  /** Citation envelope v2 or legacy array — see {@link parseCitationEnvelopeForQuality}. */
  sourcesJson: Prisma.JsonValue;
  apaReferences: string[];
  medicalRiskFlags: string[];
  requiresReferences: boolean;
};

const NURSING_IMPLICATION_H2 =
  /<h2[^>]*>[^<]*(nursing\s+implication|clinical\s+implication|nursing\s+consideration|implication\s+for\s+practice|nursing\s+practice)/i;

const CLINICAL_MECHANISM_H2 =
  /<h2[^>]*>[^<]*(pathophysiology|mechanism(\s+of\s+action)?|physiology|disease\s+process|how\s+it\s+works|underlying\s+science|clinical\s+reasoning)/i;

function faqItemCount(faqBlock: Prisma.JsonValue): number {
  if (!faqBlock || typeof faqBlock !== "object") return 0;
  const items = (faqBlock as { items?: unknown }).items;
  return Array.isArray(items) ? items.length : 0;
}

function parseCitationEnvelopeForQuality(raw: Prisma.JsonValue): BlogCitationEnvelope | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 2) return null;
  if (!Array.isArray(o.verified) || !Array.isArray(o.excluded)) return null;
  return o as unknown as BlogCitationEnvelope;
}

function schemaSummaryHasOpportunities(schemaSummary: string | null): boolean {
  if (!schemaSummary?.trim()) return false;
  try {
    const j = JSON.parse(schemaSummary) as { schemaOpportunities?: unknown };
    return Array.isArray(j.schemaOpportunities) && j.schemaOpportunities.length > 0;
  } catch {
    return false;
  }
}

function readGenerationContractV1(raw: Prisma.JsonValue): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const gc = (raw as Record<string, unknown>).generationContractV1;
  if (!gc || typeof gc !== "object" || Array.isArray(gc)) return null;
  return gc as Record<string, unknown>;
}

/** Non-empty JSON-serializable hints for Article / Breadcrumb / FAQ JSON-LD planning (see blog-control-panel-schema). */
function schemaNotesContractComplete(sn: unknown): boolean {
  if (!sn || typeof sn !== "object" || Array.isArray(sn)) return false;
  const o = sn as Record<string, unknown>;
  for (const k of ["article", "breadcrumb", "faq"] as const) {
    const v = o[k];
    if (!v || typeof v !== "object" || Array.isArray(v)) return false;
    if (Object.keys(v as Record<string, unknown>).length === 0) return false;
  }
  return true;
}

function countRecommendedInternalLinksFromContract(gc: Record<string, unknown> | null): number {
  if (!gc) return 0;
  const raw = gc.recommendedInternalLinks;
  return Array.isArray(raw) ? raw.length : 0;
}

/**
 * Collects additional quality issues for persisted generator output (admin / automation).
 * Callers merge into pre-publish `issues` before computing blocking/warnings.
 */
export function collectBlogGeneratedDraftQualityIssues(row: BlogPostDraftQualityRow): BlogDraftQualityIssue[] {
  const issues: BlogDraftQualityIssue[] = [];
  const body = row.body.trim();

  if (body.length > 0 && !NURSING_IMPLICATION_H2.test(body)) {
    issues.push({
      id: "content_nursing_implications",
      severity: "block",
      message: "Missing an H2-level nursing implications / practice implications section.",
      fix: "Add a clear “Nursing implications” (or equivalent) H2 with bullets tied to practice and safety.",
    });
  }

  if (body.length > 0 && !CLINICAL_MECHANISM_H2.test(body)) {
    issues.push({
      id: "content_clinical_mechanism",
      severity: "block",
      message: "Missing a dedicated H2 for pathophysiology, mechanism, or clinical reasoning depth.",
      fix: "Add an H2 such as “Pathophysiology” or “Why this matters clinically” with substantive explanation.",
    });
  }

  const gc = readGenerationContractV1(row.internalLinkPlan);
  const gcPrimary =
    typeof gc?.primaryKeyword === "string" && gc.primaryKeyword.trim().length >= 2 ? gc.primaryKeyword.trim() : "";

  const kw =
    (row.targetKeyword && row.targetKeyword.trim()) ||
    (() => {
      const parsed = parseInternalLinkPlanJson(row.internalLinkPlan);
      const pk = parsed.seo?.primaryKeyword?.trim();
      return pk && pk.length >= 2 ? pk : "";
    })() ||
    gcPrimary;

  if (!kw) {
    issues.push({
      id: "primary_keyword",
      severity: "block",
      message: "Primary keyword is missing (no targetKeyword and no SEO bundle primaryKeyword).",
      fix: "Set target keyword on the post or regenerate so internalLinkPlan.seo.primaryKeyword is populated.",
    });
  }

  const linkPlan = parseInternalLinkPlanJson(row.internalLinkPlan);
  const pkg =
    row.internalLinkPlan && typeof row.internalLinkPlan === "object" && !Array.isArray(row.internalLinkPlan)
      ? parsePublishingPackage((row.internalLinkPlan as Record<string, unknown>).publishingPackage)
      : null;

  const lessonCount = linkPlan.lessons.filter((l) => l.reviewStatus !== "removed").length;
  const anchorCount = pkg?.internalAnchorOpportunities.length ?? 0;
  const relatedCount = pkg?.relatedBlogPosts.length ?? 0;
  const contractLinkCount = countRecommendedInternalLinksFromContract(gc);

  if (lessonCount === 0 && anchorCount === 0 && relatedCount === 0 && contractLinkCount === 0) {
    issues.push({
      id: "internal_link_recommendations",
      severity: "block",
      message: "No internal link plan: verified lessons, anchor opportunities, related posts, and contract recommended links are all empty.",
      fix: "Regenerate internal links from the control panel or add suggested lessons / anchor rows / generationContractV1.recommendedInternalLinks.",
    });
  }

  if (gc && Number(gc.version) === 1 && !schemaNotesContractComplete(gc.schemaNotes)) {
    issues.push({
      id: "schema_contract_notes",
      severity: "warn",
      message:
        "generationContractV1 is present but schemaNotes is missing substantive article, breadcrumb, and FAQ JSON-LD hint objects.",
      fix: "Regenerate from the control panel so the plan includes schemaNotes.article, .breadcrumb, and .faq with at least one key each.",
    });
  }

  if (!schemaSummaryHasOpportunities(row.schemaSummary)) {
    issues.push({
      id: "schema_summary_opportunities",
      severity: "warn",
      message: "schemaSummary has no schemaOpportunities entries (Article / FAQ / Breadcrumb JSON-LD hints missing).",
      fix: "Regenerate SEO/schema summary from the pipeline or edit schemaSummary to include schemaOpportunities.",
    });
  }

  const emitFaq =
    Boolean(linkPlan.seo?.emitFaqSchema) ||
    (() => {
      if (!row.schemaSummary?.trim()) return false;
      try {
        const j = JSON.parse(row.schemaSummary) as { emitFaqSchema?: boolean };
        return Boolean(j.emitFaqSchema);
      } catch {
        return false;
      }
    })();

  const faqCount = faqItemCount(row.faqBlock);
  if (row.postTemplate === BlogPostTemplate.DISEASE_PROCESS_EXPLAINER && faqCount < 4) {
    issues.push({
      id: "faq_content_when_required",
      severity: "block",
      message: "Pathophysiology / disease-process drafts require at least four FAQ items for FAQPage value and learner depth.",
      fix: "Regenerate FAQs from the control panel or add FAQ items until at least four substantive pairs exist.",
    });
  }
  if (row.postTemplate === BlogPostTemplate.FAQ_STYLE && faqCount < 2) {
    issues.push({
      id: "faq_content_when_required",
      severity: "block",
      message: "FAQ-style template requires at least two FAQ items in faqBlock.",
      fix: "Regenerate FAQs for this template or add FAQ items in the FAQ editor.",
    });
  } else if (emitFaq && faqCount < 2) {
    issues.push({
      id: "faq_content_when_required",
      severity: "block",
      message: "FAQ schema is enabled but fewer than two FAQ items are stored in faqBlock.",
      fix: "Add substantive FAQs or disable FAQ schema in the SEO bundle until items exist.",
    });
  }

  const envelope = parseCitationEnvelopeForQuality(row.sourcesJson);
  const excludedAi = envelope?.excluded.filter((e) => e.provenance === "ai_suggested").length ?? 0;
  if (excludedAi > 0 && !row.medicalRiskFlags.includes("apa_source_review_required")) {
    issues.push({
      id: "apa_verification_gating",
      severity: "block",
      message:
        "AI source candidates are stored for review but medicalRiskFlags is missing apa_source_review_required — citation state is not review-gated in metadata.",
      fix: "Re-save from the generator or PATCH medicalRiskFlags to include apa_source_review_required until APA is verified.",
    });
  }
  return issues;
}
