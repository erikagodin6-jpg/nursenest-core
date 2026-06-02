/**
 * Localized blog adaptation pipeline.
 *
 * Takes a canonical BlogPost and produces localized variants through a
 * multi-stage process:
 *
 * A. Canonical brief extraction
 * B. Localized adaptation brief
 * C. AI adaptation (NOT mere translation — full content adaptation)
 * D. SEO enhancement
 * E. CTA insertion
 * F. Review flag scanning
 * G. Validation
 * H. Persistence as LocalizedBlogArticle
 *
 * Each stage is independently testable and produces typed output.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import type { Prisma } from "@prisma/client";
import type {
  BlogAdaptationKind,
  LocalizedBlogAiOutput,
  LocalizedBlogBrief,
  LocalizedBlogGenerationMode,
  LocalizedBlogQueueItem,
} from "./blog-localization-types";
import { buildRegionalEditorialContext, BLOG_MARKET_STRATEGIES } from "./blog-market-strategy";
import { formatAllowedLinksForPrompt, type LocalizedLinkFamily } from "./blog-linking-localized";
import { generateCtaSuggestions } from "./blog-cta-localized";
import { scanForReviewFlags } from "./blog-review-flags";
import { deriveLocalizedSlug } from "./blog-slug-localized";
import { validateLocalizedBlogContent } from "./validate-localized-blog";
import { apaLinesFromStoredSourcesJson } from "./blog-citation-safety";

// ── Types ────────────────────────────────────────────────────────────────────

export type LocalizedBlogPipelineStage =
  | "brief"
  | "adaptation"
  | "seo"
  | "cta"
  | "review"
  | "validation"
  | "persist";

export type LocalizedBlogPipelineSuccess = {
  ok: true;
  brief: LocalizedBlogBrief;
  aiOutput: LocalizedBlogAiOutput;
  stage: "complete";
};

export type LocalizedBlogPipelineFailure = {
  ok: false;
  stage: LocalizedBlogPipelineStage;
  error: string;
  brief?: LocalizedBlogBrief;
  partialOutput?: Partial<LocalizedBlogAiOutput>;
};

export type LocalizedBlogPipelineResult = LocalizedBlogPipelineSuccess | LocalizedBlogPipelineFailure;

// ── Stage A: Extract canonical brief ─────────────────────────────────────────

export function extractCanonicalBrief(params: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  exam: string | null;
  targetLocale: GlobalLocaleCode;
  targetRegion: GlobalRegionSlug;
  targetProfession: string | null;
  targetExam: string | null;
  seoKeywordPrimary: string | null;
  seoKeywordSecondary: string[];
  searchIntent: string | null;
  targetAudience: string | null;
  canonicalApaReferences?: string[];
  canonicalSourcesJson?: Prisma.JsonValue;
}): LocalizedBlogBrief {
  const strategy = BLOG_MARKET_STRATEGIES[params.targetRegion];

  const adaptationType: BlogAdaptationKind =
    params.targetLocale === "en" ? "adapted" : "localized_rewrite";

  const verifiedReferenceLines = [
    ...apaLinesFromStoredSourcesJson(params.canonicalSourcesJson ?? []),
    ...(params.canonicalApaReferences ?? []).map((line) => line.trim()).filter(Boolean),
  ];
  const evidenceReferences = [...new Set(verifiedReferenceLines)].slice(0, 8);

  return {
    canonicalArticleId: params.id,
    canonicalTitle: params.title,
    canonicalSlug: params.slug,
    canonicalExcerpt: params.excerpt,
    canonicalBody: params.body,
    canonicalExam: params.exam,

    targetLocale: params.targetLocale,
    targetRegion: params.targetRegion,
    targetProfession: params.targetProfession,
    targetExam: params.targetExam ?? params.exam,

    adaptationType,
    seoKeywordPrimary: params.seoKeywordPrimary,
    seoKeywordSecondary: params.seoKeywordSecondary ?? [],
    searchIntent: params.searchIntent ?? strategy?.seoEmphasis[0] ?? null,
    targetAudience: params.targetAudience ?? strategy?.audienceFraming ?? null,
    evidenceReferences,
  };
}

// ── Stage B: Build adaptation system prompt ──────────────────────────────────

export function buildAdaptationSystemPrompt(brief: LocalizedBlogBrief): string {
  const regionContext = buildRegionalEditorialContext(brief.targetRegion);
  const regionConfig = REGION_CONFIG[brief.targetRegion];
  const regionName = regionConfig?.displayName ?? brief.targetRegion;
  const strategy = BLOG_MARKET_STRATEGIES[brief.targetRegion];

  const linkFamily: LocalizedLinkFamily = {
    locale: brief.targetLocale,
    region: brief.targetRegion,
    profession: brief.targetProfession ?? "rn",
    exam: brief.targetExam ?? "nclex-rn",
  };

  const allowedLinksSection = formatAllowedLinksForPrompt(linkFamily);
  const referenceBlock = brief.evidenceReferences.length > 0
    ? brief.evidenceReferences.map((line, idx) => `${idx + 1}. ${line}`).join("\n")
    : "No verified references were provided from the canonical article.";

  return `You are a nursing exam content specialist creating a localized blog article for ${regionName}.

## Your Task
Adapt the canonical article below into a MATERIALLY DIFFERENT version for the ${regionName} market in ${brief.targetLocale === "en" ? "English" : brief.targetLocale}.

## Critical Rules
- Do NOT merely translate the canonical article word-for-word.
- CHANGE examples, wording, country references, terminology, reader pain points, CTA language, and keyword emphasis.
- Frame everything for ${regionName} nursing students and their specific context.
- Use ${regionConfig?.displayName ?? brief.targetRegion}-appropriate nursing terminology.
- Reference local exam pathways (${brief.targetExam ?? "NCLEX-RN"}) appropriately.
- Do NOT make unverified regulatory, immigration, salary, or pass-rate claims.
- Follow YMYL standards: factual, clinically cautious, and exam-relevant language only.
- Do NOT reference US/Canadian regulations unless the article is explicitly about those markets.
- Do NOT invent internal links. Use ONLY the allowed link targets below.
- Do NOT fabricate citations or use low-authority references.
- Use only the verified source set listed below for references.

## Regional Context
${regionContext}

## SEO Requirements
- Primary keyword: ${brief.seoKeywordPrimary ?? "to be determined by you"}
- Secondary keywords: ${brief.seoKeywordSecondary.join(", ") || "derive from regional context"}
- Search intent: ${brief.searchIntent ?? "informational/exam_prep"}
- Target audience: ${brief.targetAudience ?? strategy?.audienceFraming ?? "nursing students"}
- Include a clean heading hierarchy with H2/H3.
- Include at least one internal link each to lessons, flashcards, and questions.

${allowedLinksSection}

## Clinical Evidence Requirements
- Article content must align with current clinical understanding and nursing exam expectations.
- Cover pathophysiology, signs, management priorities, and nursing priorities where relevant.
- Include a final "References" section in the body.
- Use 3 to 8 references from the verified list below (prefer last 5 years when possible).

### Verified Sources
${referenceBlock}

## Output Format (JSON)
Return a JSON object with these fields:
{
  "localizedTitle": "SEO-optimized title for ${regionName} audience",
  "localizedExcerpt": "Compelling 1-2 sentence excerpt",
  "localizedBody": "Full HTML article body (H2+ headings, no H1)",
  "localizedSlug": "seo-friendly-slug-for-this-market",
  "localizedMetaTitle": "Meta title (max 60 chars)",
  "localizedMetaDescription": "Meta description (max 160 chars)",
  "seoKeywordPrimary": "primary target keyword",
  "seoKeywordSecondary": ["keyword1", "keyword2"],
  "searchIntent": "informational|exam_prep|study_strategy|comparison|conversion",
  "ctaVariant": "suggested CTA variant",
  "ctaText": "CTA button or link text",
  "ctaHref": "CTA destination (from allowed targets only)",
  "internalLinkTargets": [{"anchorText": "...", "href": "...", "context": "inline|cta|related"}],
  "reviewFlags": ["any claims that should be human-reviewed"],
  "complianceReviewRequired": false,
  "medicalReviewRequired": false,
  "faqSuggestions": [{"question": "...", "answer": "..."}],
  "snippetSummary": "A 2-3 sentence summary optimized for featured snippets",
  "referenceLines": ["Reference line 1", "Reference line 2", "Reference line 3"],
  "sourceSelectionNotes": "How and why these sources were selected for this localized article"
}`;
}

// ── Stage B (cont): Build user prompt with canonical content ─────────────────

export function buildAdaptationUserPrompt(brief: LocalizedBlogBrief): string {
  const bodyPreview = brief.canonicalBody.slice(0, 6000);
  const isTruncated = brief.canonicalBody.length > 6000;

  return `## Canonical Article to Adapt

Title: ${brief.canonicalTitle}
Exam: ${brief.canonicalExam ?? "General"}
Slug: ${brief.canonicalSlug}
Excerpt: ${brief.canonicalExcerpt}

### Body${isTruncated ? " (truncated for prompt length)" : ""}
${bodyPreview}

---

### Verified source set (must be reused; do not invent new sources)
${brief.evidenceReferences.length > 0
  ? brief.evidenceReferences.map((line, idx) => `${idx + 1}. ${line}`).join("\n")
  : "No verified source set available. If fewer than 3 trustworthy sources can be supported, set review flags accordingly."}

Now produce the localized adaptation for ${brief.targetRegion} in ${brief.targetLocale}. Return valid JSON only.`;
}

// ── Stage C-F: Process AI output ─────────────────────────────────────────────

function normalizeRefLine(line: string): string {
  return line.toLowerCase().replace(/<[^>]+>/g, " ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function selectedReferenceLines(
  aiReferenceLines: string[] | null | undefined,
  fallbackReferences: string[],
): string[] {
  const candidate = (aiReferenceLines ?? []).map((line) => line.trim()).filter(Boolean);
  if (candidate.length === 0) return fallbackReferences.slice(0, 8);

  const allowedSet = new Set(fallbackReferences.map(normalizeRefLine));
  const filtered = candidate.filter((line) => {
    const normalized = normalizeRefLine(line);
    return normalized.length >= 8 && (allowedSet.size === 0 || allowedSet.has(normalized));
  });
  return [...new Set(filtered)].slice(0, 8);
}

function appendReferencesSectionIfMissing(
  body: string,
  referenceLines: string[],
): string {
  if (referenceLines.length === 0) return body;
  if (/<h2[^>]*>\s*references\s*<\/h2>/i.test(body)) return body;
  const refsHtml = referenceLines.map((line) => `  <li>${line}</li>`).join("\n");
  return `${body.trim()}\n\n<h2>References</h2>\n<ul>\n${refsHtml}\n</ul>\n`;
}

/**
 * Post-process the raw AI output: derive final slug, scan for review flags,
 * generate CTA suggestions, and validate.
 *
 * This function does NOT call the AI — it processes what the AI returned.
 * The actual AI call is the responsibility of the caller (admin API route
 * or background job) since it depends on the AI provider configuration.
 */
export function postProcessAiOutput(
  rawOutput: LocalizedBlogAiOutput,
  brief: LocalizedBlogBrief,
): LocalizedBlogPipelineSuccess | LocalizedBlogPipelineFailure {
  // Derive final slug
  const finalSlug = deriveLocalizedSlug({
    canonicalSlug: brief.canonicalSlug,
    aiLocalizedSlug: rawOutput.localizedSlug,
    region: brief.targetRegion,
    locale: brief.targetLocale,
  });

  // Keep references locked to canonical verified set.
  const effectiveReferenceLines = selectedReferenceLines(rawOutput.referenceLines, brief.evidenceReferences);
  const localizedBodyWithReferences = appendReferencesSectionIfMissing(rawOutput.localizedBody, effectiveReferenceLines);

  // Scan for review flags
  const reviewResult = scanForReviewFlags({
    title: rawOutput.localizedTitle,
    excerpt: rawOutput.localizedExcerpt,
    body: localizedBodyWithReferences,
  });

  // Merge AI-declared flags with scan results
  const mergedFlags = [
    ...new Set([
      ...rawOutput.reviewFlags,
      ...reviewResult.flags.map((f) => `[${f.category}] ${f.description}`),
    ]),
  ];

  // Generate CTA suggestions
  const ctaSuggestions = generateCtaSuggestions({
    region: brief.targetRegion,
    locale: brief.targetLocale,
    profession: brief.targetProfession,
    exam: brief.targetExam,
    funnelStage: "consideration",
  });

  const effectiveCtaText = rawOutput.ctaText ?? ctaSuggestions[0]?.text ?? null;
  const effectiveCtaHref = rawOutput.ctaHref ?? ctaSuggestions[0]?.href ?? null;
  const effectiveCtaVariant = rawOutput.ctaVariant ?? ctaSuggestions[0]?.variant ?? null;

  // Validate
  const validation = validateLocalizedBlogContent({
    title: rawOutput.localizedTitle,
    excerpt: rawOutput.localizedExcerpt,
    body: localizedBodyWithReferences,
    slug: finalSlug,
    metaTitle: rawOutput.localizedMetaTitle,
    metaDescription: rawOutput.localizedMetaDescription,
    locale: brief.targetLocale,
    region: brief.targetRegion,
    referenceLines: effectiveReferenceLines,
    internalLinkTargets: rawOutput.internalLinkTargets,
    canonicalBody: brief.canonicalBody,
  });

  if (!validation.valid && validation.issues.some((i) => i.severity === "error")) {
    return {
      ok: false,
      stage: "validation",
      error: validation.issues.filter((i) => i.severity === "error").map((i) => i.message).join("; "),
      brief,
      partialOutput: rawOutput,
    };
  }

  const processedOutput: LocalizedBlogAiOutput = {
    ...rawOutput,
    localizedBody: localizedBodyWithReferences,
    localizedSlug: finalSlug,
    reviewFlags: mergedFlags,
    complianceReviewRequired: rawOutput.complianceReviewRequired || reviewResult.complianceReviewRequired,
    medicalReviewRequired: rawOutput.medicalReviewRequired || reviewResult.medicalReviewRequired,
    ctaVariant: effectiveCtaVariant,
    ctaText: effectiveCtaText,
    ctaHref: effectiveCtaHref,
    referenceLines: effectiveReferenceLines,
  };

  return {
    ok: true,
    brief,
    aiOutput: processedOutput,
    stage: "complete",
  };
}

// ── Queue builder: bulk market expansion ─────────────────────────────────────

/**
 * Build a generation queue for bulk market expansion of a canonical article.
 *
 * Produces queue items sorted by market priority (underserved first).
 * Skips regions that don't match the article's exam relevance unless forced.
 */
export function buildExpansionQueue(params: {
  canonicalArticleId: string;
  canonicalExam: string | null;
  mode: LocalizedBlogGenerationMode;
  targetRegions?: GlobalRegionSlug[];
  targetLocales?: GlobalLocaleCode[];
  profession?: string | null;
}): LocalizedBlogQueueItem[] {
  const queue: LocalizedBlogQueueItem[] = [];

  const strategies = Object.values(BLOG_MARKET_STRATEGIES).sort(
    (a, b) => a.priority - b.priority,
  );

  for (const strategy of strategies) {
    if (params.targetRegions && !params.targetRegions.includes(strategy.region)) {
      continue;
    }

    const examRelevant =
      !params.canonicalExam ||
      strategy.examRelevance.some((e) => e.toLowerCase().includes(params.canonicalExam!.toLowerCase()));

    if (!examRelevant && params.mode !== "bulk_market_expansion") continue;

    const locales =
      params.targetLocales?.filter((l) => strategy.allowedLocales.includes(l)) ??
      [...strategy.allowedLocales];

    for (const locale of locales) {
      queue.push({
        canonicalArticleId: params.canonicalArticleId,
        targetLocale: locale,
        targetRegion: strategy.region,
        targetProfession: params.profession ?? null,
        targetExam: params.canonicalExam,
        priority: strategy.priority,
      });
    }
  }

  return queue.sort((a, b) => a.priority - b.priority);
}
