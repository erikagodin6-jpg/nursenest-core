/**
 * Pre-publish validation for localized blog articles.
 *
 * Checks content quality, SEO compliance, localization completeness,
 * and safety flags before a localized article can be approved/published.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG, isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { LocalizedBlogValidationIssue, LocalizedBlogValidationResult } from "./blog-localization-types";
import { validateLocalizedSlug } from "./blog-slug-localized";

const MIN_TITLE_LENGTH = 20;
const MAX_TITLE_LENGTH = 120;
const MIN_EXCERPT_LENGTH = 40;
const MAX_EXCERPT_LENGTH = 320;
const MIN_BODY_LENGTH = 800;
const MAX_META_TITLE_LENGTH = 70;
const MAX_META_DESCRIPTION_LENGTH = 170;

/**
 * Validate a localized blog article before publish.
 * Returns structured issues with severity levels.
 */
export function validateLocalizedBlogContent(params: {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
}): LocalizedBlogValidationResult {
  const issues: LocalizedBlogValidationIssue[] = [];

  // ── Title ────────────────────────────────────────────────────────────────
  if (!params.title?.trim()) {
    issues.push({ field: "title", severity: "error", message: "Title is empty", code: "TITLE_EMPTY" });
  } else {
    if (params.title.length < MIN_TITLE_LENGTH) {
      issues.push({ field: "title", severity: "warning", message: `Title is short (${params.title.length} chars, minimum ${MIN_TITLE_LENGTH})`, code: "TITLE_SHORT" });
    }
    if (params.title.length > MAX_TITLE_LENGTH) {
      issues.push({ field: "title", severity: "warning", message: `Title is long (${params.title.length} chars, maximum ${MAX_TITLE_LENGTH})`, code: "TITLE_LONG" });
    }
  }

  // ── Excerpt ──────────────────────────────────────────────────────────────
  if (!params.excerpt?.trim()) {
    issues.push({ field: "excerpt", severity: "error", message: "Excerpt is empty", code: "EXCERPT_EMPTY" });
  } else {
    if (params.excerpt.length < MIN_EXCERPT_LENGTH) {
      issues.push({ field: "excerpt", severity: "warning", message: `Excerpt is short (${params.excerpt.length} chars)`, code: "EXCERPT_SHORT" });
    }
    if (params.excerpt.length > MAX_EXCERPT_LENGTH) {
      issues.push({ field: "excerpt", severity: "warning", message: `Excerpt is long (${params.excerpt.length} chars)`, code: "EXCERPT_LONG" });
    }
  }

  // ── Body ─────────────────────────────────────────────────────────────────
  if (!params.body?.trim()) {
    issues.push({ field: "body", severity: "error", message: "Body is empty", code: "BODY_EMPTY" });
  } else {
    const bodyTextLength = params.body.replace(/<[^>]*>/g, "").trim().length;
    if (bodyTextLength < MIN_BODY_LENGTH) {
      issues.push({
        field: "body",
        severity: "error",
        message: `Body text is too short (${bodyTextLength} chars, minimum ${MIN_BODY_LENGTH}). May be flagged as thin content.`,
        code: "BODY_THIN",
      });
    }
  }

  // ── Slug ─────────────────────────────────────────────────────────────────
  const slugValidation = validateLocalizedSlug(params.slug);
  if (!slugValidation.valid) {
    issues.push({ field: "slug", severity: "error", message: slugValidation.reason!, code: "SLUG_INVALID" });
  }

  // ── Meta title ───────────────────────────────────────────────────────────
  if (params.metaTitle) {
    if (params.metaTitle.length > MAX_META_TITLE_LENGTH) {
      issues.push({
        field: "metaTitle",
        severity: "warning",
        message: `Meta title is long (${params.metaTitle.length} chars, max ${MAX_META_TITLE_LENGTH})`,
        code: "META_TITLE_LONG",
      });
    }
  } else {
    issues.push({ field: "metaTitle", severity: "info", message: "No meta title set — will use article title", code: "META_TITLE_MISSING" });
  }

  // ── Meta description ─────────────────────────────────────────────────────
  if (params.metaDescription) {
    if (params.metaDescription.length > MAX_META_DESCRIPTION_LENGTH) {
      issues.push({
        field: "metaDescription",
        severity: "warning",
        message: `Meta description is long (${params.metaDescription.length} chars, max ${MAX_META_DESCRIPTION_LENGTH})`,
        code: "META_DESC_LONG",
      });
    }
  } else {
    issues.push({
      field: "metaDescription",
      severity: "info",
      message: "No meta description set — will use excerpt",
      code: "META_DESC_MISSING",
    });
  }

  // ── Region validity ──────────────────────────────────────────────────────
  if (!isGlobalRegionSlug(params.region)) {
    issues.push({ field: "region", severity: "error", message: `Unknown region: ${params.region}`, code: "REGION_INVALID" });
  } else {
    const regionConfig = REGION_CONFIG[params.region];
    if (regionConfig && !regionConfig.allowedLocales.includes(params.locale)) {
      issues.push({
        field: "locale",
        severity: "warning",
        message: `Locale "${params.locale}" is not in the allowed locales for ${params.region} (${regionConfig.allowedLocales.join(", ")})`,
        code: "LOCALE_MISMATCH",
      });
    }
  }

  // ── Cross-region leakage check ───────────────────────────────────────────
  const crossRegionIssues = checkCrossRegionLeakage(params.body, params.region);
  issues.push(...crossRegionIssues);

  // ── Duplicate / thin content signals ─────────────────────────────────────
  const thinContentIssues = checkThinContentSignals(params.body, params.title);
  issues.push(...thinContentIssues);

  const hasErrors = issues.some((i) => i.severity === "error");
  const reviewRequired = issues.some((i) => i.severity === "error" || i.severity === "warning");

  return { valid: !hasErrors, issues, reviewRequired };
}

// ── Cross-region leakage detector ────────────────────────────────────────────

function checkCrossRegionLeakage(body: string, targetRegion: GlobalRegionSlug): LocalizedBlogValidationIssue[] {
  const issues: LocalizedBlogValidationIssue[] = [];
  const lowerBody = body.toLowerCase();

  const US_SIGNALS = ["state board of nursing", "ncsbn", "nclex-rn passing standard", "pearson vue"];
  const CA_SIGNALS = ["nnas", "sec registration", "cno registration", "clpnbc"];

  if (targetRegion !== "us" && targetRegion !== "canada") {
    for (const signal of US_SIGNALS) {
      if (lowerBody.includes(signal)) {
        issues.push({
          field: "body",
          severity: "warning",
          message: `US-specific reference "${signal}" found in ${targetRegion} article — review for relevance`,
          code: "CROSS_REGION_US",
        });
      }
    }
  }

  if (targetRegion !== "canada") {
    for (const signal of CA_SIGNALS) {
      if (lowerBody.includes(signal)) {
        issues.push({
          field: "body",
          severity: "warning",
          message: `Canada-specific reference "${signal}" found in ${targetRegion} article — review for relevance`,
          code: "CROSS_REGION_CA",
        });
      }
    }
  }

  return issues;
}

// ── Thin content / doorway page detector ─────────────────────────────────────

function checkThinContentSignals(body: string, title: string): LocalizedBlogValidationIssue[] {
  const issues: LocalizedBlogValidationIssue[] = [];
  const textOnly = body.replace(/<[^>]*>/g, "").trim();

  // Check for suspiciously high heading-to-content ratio (sign of thin content)
  const headingCount = (body.match(/<h[2-6][^>]*>/gi) ?? []).length;
  const paragraphCount = (body.match(/<p[^>]*>/gi) ?? []).length;

  if (headingCount > 0 && paragraphCount > 0 && headingCount / paragraphCount > 0.8) {
    issues.push({
      field: "body",
      severity: "warning",
      message: "High heading-to-paragraph ratio — may indicate thin, list-heavy content",
      code: "THIN_CONTENT_RATIO",
    });
  }

  // Check for excessive boilerplate phrases (sign of generic AI output)
  const boilerplate = [
    "in this article we will",
    "let's dive in",
    "without further ado",
    "it's no secret that",
    "in today's world",
    "whether you're a seasoned",
    "look no further",
  ];
  const boilerplateCount = boilerplate.filter((bp) => textOnly.toLowerCase().includes(bp)).length;
  if (boilerplateCount >= 3) {
    issues.push({
      field: "body",
      severity: "warning",
      message: `${boilerplateCount} boilerplate phrases detected — content may need humanization`,
      code: "BOILERPLATE_HEAVY",
    });
  }

  return issues;
}
