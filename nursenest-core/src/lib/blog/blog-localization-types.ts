/**
 * Shared types for the localized blog adaptation system.
 *
 * These types drive the pipeline from canonical article through AI adaptation
 * to localized publication. They are intentionally separate from Prisma types
 * to allow pipeline code to run without a DB import.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";

// ── Adaptation lifecycle ─────────────────────────────────────────────────────

export type LocalizedBlogLifecycle =
  | "draft"
  | "ai_generated"
  | "ai_adapted"
  | "pending_review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected";

export type BlogAdaptationKind =
  | "original"
  | "translated"
  | "adapted"
  | "localized_rewrite"
  | "market_expansion";

// ── Adaptation brief (input to the AI localization engine) ───────────────────

export type LocalizedBlogBrief = {
  canonicalArticleId: string;
  canonicalTitle: string;
  canonicalSlug: string;
  canonicalExcerpt: string;
  canonicalBody: string;
  canonicalExam: string | null;

  targetLocale: GlobalLocaleCode;
  targetRegion: GlobalRegionSlug;
  targetProfession: string | null;
  targetExam: string | null;

  adaptationType: BlogAdaptationKind;
  seoKeywordPrimary: string | null;
  seoKeywordSecondary: string[];
  searchIntent: string | null;
  targetAudience: string | null;
  /** Verified reference lines inherited from canonical source set (APA-ish). */
  evidenceReferences: string[];
};

// ── AI adaptation output ─────────────────────────────────────────────────────

export type LocalizedBlogAiOutput = {
  localizedTitle: string;
  localizedExcerpt: string;
  localizedBody: string;
  localizedSlug: string;
  localizedMetaTitle: string;
  localizedMetaDescription: string;

  seoKeywordPrimary: string | null;
  seoKeywordSecondary: string[];
  searchIntent: string | null;

  ctaVariant: string | null;
  ctaText: string | null;
  ctaHref: string | null;

  internalLinkTargets: LocalizedInternalLink[];

  reviewFlags: string[];
  complianceReviewRequired: boolean;
  medicalReviewRequired: boolean;

  faqSuggestions: { question: string; answer: string }[];
  snippetSummary: string | null;
  /** 3-8 references that must map to authoritative, verified sources. */
  referenceLines: string[];
  /** Short note on why these sources were selected for this article. */
  sourceSelectionNotes: string | null;
};

// ── Internal linking ─────────────────────────────────────────────────────────

export type LocalizedInternalLink = {
  anchorText: string;
  href: string;
  context: "inline" | "cta" | "related" | "sidebar";
};

// ── SEO metadata ─────────────────────────────────────────────────────────────

export type LocalizedBlogSeoMeta = {
  title: string;
  description: string;
  canonicalUrl: string;
  hreflangEntries: { locale: string; href: string }[];
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  breadcrumbs: { label: string; href: string }[];
  jsonLdArticle: Record<string, unknown>;
};

// ── Generation queue ─────────────────────────────────────────────────────────

export type LocalizedBlogQueueItem = {
  canonicalArticleId: string;
  targetLocale: GlobalLocaleCode;
  targetRegion: GlobalRegionSlug;
  targetProfession: string | null;
  targetExam: string | null;
  priority: number;
};

export type LocalizedBlogGenerationMode =
  | "canonical_only"
  | "canonical_plus_selected"
  | "bulk_market_expansion"
  | "refresh_existing";

// ── Validation result ────────────────────────────────────────────────────────

export type LocalizedBlogValidationIssue = {
  field: string;
  severity: "error" | "warning" | "info";
  message: string;
  code: string;
};

export type LocalizedBlogValidationResult = {
  valid: boolean;
  issues: LocalizedBlogValidationIssue[];
  reviewRequired: boolean;
};
