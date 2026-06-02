/**
 * SERP quality audit for programmatic SEO definitions — CTR-risk heuristics (not GSC replacement).
 */

import type { SeoPageDefinition } from "@/lib/seo/programmatic-seo-definitions";
import {
  auditMetaDescriptionQuality,
  normalizeMetaDescription,
} from "@/lib/seo/clinical-meta-description-patterns";
import {
  inferSerpIntentFromTitle,
  looksLikeBareTopicTitle,
  normalizeClinicalTitle,
  titleTruncationRiskMobile,
} from "@/lib/seo/clinical-title-patterns";

export type SerpAuditSeverity = "error" | "warn" | "info";

export type SerpAuditFinding = {
  slug: string;
  severity: SerpAuditSeverity;
  code: string;
  message: string;
};

export function titleH1SimilarityRisk(title: string, h1: string): "low" | "medium" | "high" {
  const t = normalizeClinicalTitle(title).toLowerCase();
  const h = normalizeClinicalTitle(h1).toLowerCase();
  if (t === h) return "high";
  if (t.startsWith(h.slice(0, Math.min(h.length, 40))) || h.startsWith(t.slice(0, Math.min(t.length, 40)))) {
    return "medium";
  }
  return "low";
}

export function auditProgrammaticSerpPage(page: SeoPageDefinition): SerpAuditFinding[] {
  const slug = page.slug;
  const findings: SerpAuditFinding[] = [];
  const title = normalizeClinicalTitle(page.title ?? "");
  const desc = normalizeMetaDescription(page.description ?? "");
  const h1 = normalizeClinicalTitle(page.h1 ?? "");

  if (!title) findings.push({ slug, severity: "error", code: "empty_title", message: "Missing title" });
  if (!desc) findings.push({ slug, severity: "error", code: "empty_description", message: "Missing meta description" });

  if (title && looksLikeBareTopicTitle(title)) {
    findings.push({
      slug,
      severity: "warn",
      code: "bare_topic_title",
      message: "Title looks like a bare topic label; prefer mechanism/interpretation/exam specificity",
    });
  }

  const trunc = titleTruncationRiskMobile(title);
  if (trunc === "high") {
    findings.push({
      slug,
      severity: "warn",
      code: "title_truncation_mobile",
      message: `Title length ${title.length} — elevated mobile truncation risk`,
    });
  } else if (trunc === "medium") {
    findings.push({
      slug,
      severity: "info",
      code: "title_truncation_mobile",
      message: `Title length ${title.length} — watch mobile truncation`,
    });
  }

  for (const flag of auditMetaDescriptionQuality(desc)) {
    const severity: SerpAuditSeverity =
      flag === "too_short" || flag === "missing_clinical_anchor" ? "warn" : flag === "too_long" ? "info" : "warn";
    findings.push({
      slug,
      severity,
      code: `meta_${flag}`,
      message: `Meta description flag: ${flag}`,
    });
  }

  const intent = inferSerpIntentFromTitle(title);
  if (intent === "unknown") {
    findings.push({
      slug,
      severity: "info",
      code: "intent_unknown",
      message: "Could not infer SERP intent bucket from title (mechanism/interpretation/exam/etc.)",
    });
  }

  const sim = titleH1SimilarityRisk(title, h1);
  if (sim === "high" && title.length > 0 && h1.length > 0) {
    findings.push({
      slug,
      severity: "info",
      code: "title_h1_duplicate",
      message: "Title and H1 are identical — consider differentiated SERP title vs on-page H1",
    });
  }

  return findings;
}

/** Priority slugs for CTR remediation (editorial queue — not exhaustive). */
export const HIGH_CTR_PRIORITY_SLUG_HINTS = [
  "hyperkalemia",
  "hypokalemia",
  "copd",
  "acute-kidney-injury",
  "aki",
  "siadh",
  "diabetes-insipidus",
  "abg",
  "arterial-blood-gas",
  "ecg",
  "chest-x-ray",
  "electrolyte",
  "med-math",
  "nclex",
  "cat",
  "study-plan",
  "sepsis",
  "fluid",
] as const;

export function slugMatchesCtrPriorityHint(slug: string): boolean {
  const s = slug.toLowerCase();
  return HIGH_CTR_PRIORITY_SLUG_HINTS.some((h) => s.includes(h));
}
