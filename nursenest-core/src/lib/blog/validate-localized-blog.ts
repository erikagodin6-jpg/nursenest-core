/**
 * Pre-publish validation for localized blog articles.
 *
 * Checks content quality, SEO compliance, localization completeness,
 * and safety flags before a localized article can be approved/published.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG, isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { LocalizedBlogValidationIssue, LocalizedBlogValidationResult, LocalizedInternalLink } from "./blog-localization-types";
import { validateLocalizedSlug } from "./blog-slug-localized";

const MIN_TITLE_LENGTH = 20;
const MAX_TITLE_LENGTH = 120;
const MIN_EXCERPT_LENGTH = 40;
const MAX_EXCERPT_LENGTH = 320;
const MIN_BODY_LENGTH = 800;
const MAX_META_TITLE_LENGTH = 70;
const MAX_META_DESCRIPTION_LENGTH = 170;
const MIN_REFERENCES = 3;
const MAX_REFERENCES = 8;

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
  referenceLines?: string[];
  internalLinkTargets?: LocalizedInternalLink[];
  canonicalBody?: string;
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

  // ── Heading structure (SEO + readability) ─────────────────────────────────
  const h2Count = (params.body.match(/<h2[^>]*>/gi) ?? []).length;
  const h3Count = (params.body.match(/<h3[^>]*>/gi) ?? []).length;
  if (h2Count < 2) {
    issues.push({
      field: "body",
      severity: "error",
      message: "Body requires at least 2 H2 sections for clear structure.",
      code: "BODY_H2_REQUIRED",
    });
  }
  if (h3Count < 1) {
    issues.push({
      field: "body",
      severity: "warning",
      message: "Add at least one H3 subsection for scannable depth.",
      code: "BODY_H3_RECOMMENDED",
    });
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
  issues.push(...checkReferenceQuality(params.body, params.referenceLines ?? []));
  issues.push(...checkRequiredStudyLinks(params.body, params.internalLinkTargets ?? []));
  if (params.canonicalBody?.trim() && params.locale !== "en") {
    issues.push(...checkCrossLanguageDuplication(params.body, params.canonicalBody));
  }

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

function extractReferencesFromBody(body: string): string[] {
  const heading = /<h2[^>]*>\s*references\s*<\/h2>/i;
  const h2Matches = [...body.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/gi)];
  let startIndex = -1;
  for (const m of h2Matches) {
    if (heading.test(m[0])) {
      startIndex = (m.index ?? -1) + m[0].length;
      break;
    }
  }
  if (startIndex < 0) return [];
  const rest = body.slice(startIndex);
  const nextH2 = rest.search(/<h2[^>]*>/i);
  const refSection = (nextH2 >= 0 ? rest.slice(0, nextH2) : rest).replace(/\n+/g, "\n");
  const liMatches = [...refSection.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (liMatches.length > 0) {
    return liMatches.map((m) => m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean);
  }
  const pMatches = [...refSection.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  return pMatches.map((m) => m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean);
}

function checkReferenceQuality(body: string, providedReferenceLines: string[]): LocalizedBlogValidationIssue[] {
  const issues: LocalizedBlogValidationIssue[] = [];
  const refsInBody = extractReferencesFromBody(body);
  const refs = refsInBody.length > 0 ? refsInBody : providedReferenceLines;

  if (!/<h2[^>]*>\s*references\s*<\/h2>/i.test(body)) {
    issues.push({
      field: "body",
      severity: "error",
      message: "Missing References section (H2 heading required).",
      code: "REFERENCES_HEADING_MISSING",
    });
  }
  if (refs.length < MIN_REFERENCES) {
    issues.push({
      field: "references",
      severity: "error",
      message: `Provide ${MIN_REFERENCES}-${MAX_REFERENCES} references; found ${refs.length}.`,
      code: "REFERENCES_TOO_FEW",
    });
  }
  if (refs.length > MAX_REFERENCES) {
    issues.push({
      field: "references",
      severity: "warning",
      message: `Reference count is high (${refs.length}); keep to ${MAX_REFERENCES} max for readability.`,
      code: "REFERENCES_TOO_MANY",
    });
  }
  for (const line of refs) {
    if (!/\b(19|20)\d{2}\b/.test(line)) {
      issues.push({
        field: "references",
        severity: "warning",
        message: `Reference line may be missing year: "${line.slice(0, 80)}"`,
        code: "REFERENCE_YEAR_MISSING",
      });
    }
  }
  return issues;
}

function checkRequiredStudyLinks(body: string, links: LocalizedInternalLink[]): LocalizedBlogValidationIssue[] {
  const issues: LocalizedBlogValidationIssue[] = [];
  const hrefsFromBody = [...body.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]?.trim() ?? "");
  const hrefs = [...hrefsFromBody, ...links.map((l) => l.href)].filter(Boolean);
  const hasLessons = hrefs.some((href) => href.includes("/lessons"));
  const hasFlashcards = hrefs.some((href) => href.includes("/flashcards"));
  const hasQuestions = hrefs.some((href) => href.includes("/questions"));

  if (!hasLessons) {
    issues.push({
      field: "internalLinks",
      severity: "error",
      message: "At least one lessons internal link is required.",
      code: "LINK_LESSONS_REQUIRED",
    });
  }
  if (!hasFlashcards) {
    issues.push({
      field: "internalLinks",
      severity: "error",
      message: "At least one flashcards internal link is required.",
      code: "LINK_FLASHCARDS_REQUIRED",
    });
  }
  if (!hasQuestions) {
    issues.push({
      field: "internalLinks",
      severity: "error",
      message: "At least one questions internal link is required.",
      code: "LINK_QUESTIONS_REQUIRED",
    });
  }
  return issues;
}

function normalizedTokenSet(html: string): Set<string> {
  const text = html.toLowerCase().replace(/<[^>]*>/g, " ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const tokens = text.split(" ").filter((t) => t.length >= 5);
  return new Set(tokens);
}

function checkCrossLanguageDuplication(localizedBody: string, canonicalBody: string): LocalizedBlogValidationIssue[] {
  const issues: LocalizedBlogValidationIssue[] = [];
  const localized = normalizedTokenSet(localizedBody);
  const canonical = normalizedTokenSet(canonicalBody);
  if (localized.size === 0 || canonical.size === 0) return issues;
  let overlap = 0;
  for (const t of localized) {
    if (canonical.has(t)) overlap += 1;
  }
  const ratio = overlap / Math.max(1, localized.size);
  if (ratio > 0.72) {
    issues.push({
      field: "body",
      severity: "error",
      message: "Localized content is too similar to canonical text; rewrite for native-language originality.",
      code: "LOCALIZATION_DUPLICATE_CONTENT",
    });
  }
  return issues;
}
