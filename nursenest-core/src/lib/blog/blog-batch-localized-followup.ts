import "server-only";

import { BlogAdaptationType, LocalizedBlogStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import {
  buildAdaptationSystemPrompt,
  buildAdaptationUserPrompt,
  extractCanonicalBrief,
  postProcessAiOutput,
} from "@/lib/blog/generate-localized-blog";
import type { LocalizedBlogAiOutput, LocalizedInternalLink } from "@/lib/blog/blog-localization-types";
import { createLogEntry, appendGenerationLog } from "@/lib/blog/blog-publish-workflow-localized";
import { prisma } from "@/lib/db";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { GLOBAL_REGION_SLUGS, REGION_CONFIG, isGlobalLocaleCode } from "@/lib/i18n/global-regions";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const localizedBlogAiOutputSchema = z.object({
  localizedTitle: z.string(),
  localizedExcerpt: z.string(),
  localizedBody: z.string(),
  localizedSlug: z.string(),
  localizedMetaTitle: z.string(),
  localizedMetaDescription: z.string(),
  seoKeywordPrimary: z.string().nullable().optional(),
  seoKeywordSecondary: z.array(z.string()).optional(),
  searchIntent: z.string().nullable().optional(),
  ctaVariant: z.string().nullable().optional(),
  ctaText: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
  internalLinkTargets: z
    .array(z.object({ anchorText: z.string(), href: z.string(), context: z.string().optional() }))
    .optional(),
  reviewFlags: z.array(z.string()).optional(),
  complianceReviewRequired: z.boolean().optional(),
  medicalReviewRequired: z.boolean().optional(),
  faqSuggestions: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  snippetSummary: z.string().nullable().optional(),
  referenceLines: z.array(z.string()).optional(),
  sourceSelectionNotes: z.string().nullable().optional(),
});

function normalizeLinkContext(raw: string | undefined): LocalizedInternalLink["context"] {
  if (raw === "cta" || raw === "related" || raw === "sidebar") return raw;
  return "inline";
}

function parseLocalizedAiJson(raw: string): LocalizedBlogAiOutput | null {
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z0-9]*\n?/, "").replace(/```\s*$/u, "").trim();
  }
  let data: unknown;
  try {
    data = JSON.parse(t);
  } catch {
    return null;
  }
  const p = localizedBlogAiOutputSchema.safeParse(data);
  if (!p.success) return null;
  const d = p.data;
  return {
    localizedTitle: d.localizedTitle,
    localizedExcerpt: d.localizedExcerpt,
    localizedBody: d.localizedBody,
    localizedSlug: d.localizedSlug,
    localizedMetaTitle: d.localizedMetaTitle,
    localizedMetaDescription: d.localizedMetaDescription,
    seoKeywordPrimary: d.seoKeywordPrimary ?? null,
    seoKeywordSecondary: d.seoKeywordSecondary ?? [],
    searchIntent: d.searchIntent ?? null,
    ctaVariant: d.ctaVariant ?? null,
    ctaText: d.ctaText ?? null,
    ctaHref: d.ctaHref ?? null,
    internalLinkTargets: (d.internalLinkTargets ?? []).map((x) => ({
      anchorText: x.anchorText,
      href: x.href,
      context: normalizeLinkContext(x.context),
    })),
    reviewFlags: d.reviewFlags ?? [],
    complianceReviewRequired: d.complianceReviewRequired ?? false,
    medicalReviewRequired: d.medicalReviewRequired ?? false,
    faqSuggestions: d.faqSuggestions ?? [],
    snippetSummary: d.snippetSummary ?? null,
    referenceLines: d.referenceLines ?? [],
    sourceSelectionNotes: d.sourceSelectionNotes ?? null,
  };
}

export function blogBatchDefaultRegionForLocale(locale: GlobalLocaleCode, scheduleCountry: string): GlobalRegionSlug {
  if (locale === "en") {
    return scheduleCountry === "CA" ? "canada" : "us";
  }
  for (const slug of GLOBAL_REGION_SLUGS) {
    const cfg = REGION_CONFIG[slug];
    if (cfg.allowedLocales.includes(locale)) return slug;
  }
  return "philippines";
}

/**
 * After a canonical batch post is created, generate localized variants (OpenAI + post-process + upsert).
 * Failures are logged per locale; does not throw unless the canonical row is missing.
 */
export async function runBlogBatchLocalizedFollowup(params: {
  canonicalArticleId: string;
  locales: string[];
  scheduleCountry: string;
  exam: string;
}): Promise<void> {
  const canonical = await prisma.blogPost.findUnique({
    where: { id: params.canonicalArticleId },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      body: true,
      exam: true,
      targetKeyword: true,
      apaReferences: true,
      sourcesJson: true,
    },
  });
  if (!canonical) {
    safeServerLog("blog_batch_localized", "missing_canonical", { id: params.canonicalArticleId });
    return;
  }

  const uniqLocales = [...new Set(params.locales.map((l) => l.trim().toLowerCase()))].filter(Boolean);

  for (const loc of uniqLocales) {
    if (!isGlobalLocaleCode(loc)) {
      safeServerLog("blog_batch_localized", "skip_unknown_locale", { locale: loc });
      continue;
    }
    const locale = loc as GlobalLocaleCode;
    const region = blogBatchDefaultRegionForLocale(locale, params.scheduleCountry);

    try {
      const brief = extractCanonicalBrief({
        id: canonical.id,
        title: canonical.title,
        slug: canonical.slug,
        excerpt: canonical.excerpt,
        body: canonical.body,
        exam: canonical.exam,
        targetLocale: locale,
        targetRegion: region,
        targetProfession: null,
        targetExam: params.exam,
        seoKeywordPrimary: canonical.targetKeyword,
        seoKeywordSecondary: [],
        searchIntent: null,
        targetAudience: null,
        canonicalApaReferences: canonical.apaReferences,
        canonicalSourcesJson: canonical.sourcesJson,
      });

      const systemPrompt =
        `${buildAdaptationSystemPrompt(brief)}\n\nReturn a single JSON object only (no markdown fences, no prose outside JSON).`;
      const userPrompt = buildAdaptationUserPrompt(brief);

      const completion = await openAiChatCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.45,
        maxTokens: 8192,
      });

      const aiParsed = parseLocalizedAiJson(completion.content);
      if (!aiParsed) {
        safeServerLog("blog_batch_localized", "bad_ai_json", { locale, region, snippet: completion.content.slice(0, 200) });
        continue;
      }

      const result = postProcessAiOutput(aiParsed, brief);
      if (!result.ok) {
        safeServerLog("blog_batch_localized", "post_process_failed", {
          locale,
          region,
          error: result.error,
          stage: result.stage,
        });
        continue;
      }

      const adaptationType =
        brief.adaptationType === "adapted" ? BlogAdaptationType.ADAPTED : BlogAdaptationType.LOCALIZED_REWRITE;

      const existing = await prisma.localizedBlogArticle.findUnique({
        where: {
          canonicalArticleId_locale_region: {
            canonicalArticleId: canonical.id,
            locale,
            region,
          },
        },
        select: { id: true, generationLog: true },
      });

      const logEntry = createLogEntry("generate", `Batch localized adaptation (${locale}/${region})`);

      const articleData = {
        locale,
        region,
        profession: null as string | null,
        exam: params.exam,
        sourceLanguage: "en",
        adaptationType,
        contentStatus: LocalizedBlogStatus.AI_GENERATED,
        localizedTitle: result.aiOutput.localizedTitle,
        localizedExcerpt: result.aiOutput.localizedExcerpt,
        localizedBody: result.aiOutput.localizedBody,
        canonicalSlug: brief.canonicalSlug,
        localizedSlug: result.aiOutput.localizedSlug,
        localizedMetaTitle: result.aiOutput.localizedMetaTitle,
        localizedMetaDescription: result.aiOutput.localizedMetaDescription,
        seoKeywordPrimary: result.aiOutput.seoKeywordPrimary,
        seoKeywordSecondary: result.aiOutput.seoKeywordSecondary,
        searchIntent: result.aiOutput.searchIntent,
        targetAudience: brief.targetAudience,
        ctaVariant: result.aiOutput.ctaVariant,
        ctaText: result.aiOutput.ctaText,
        ctaHref: result.aiOutput.ctaHref,
        internalLinkTargets: result.aiOutput.internalLinkTargets as Prisma.InputJsonValue,
        complianceReviewRequired: result.aiOutput.complianceReviewRequired,
        medicalReviewRequired: result.aiOutput.medicalReviewRequired,
        editorialReviewRequired: true,
        reviewFlags: result.aiOutput.reviewFlags,
      };

      if (existing) {
        const updatedLog = appendGenerationLog(existing.generationLog, logEntry);
        await prisma.localizedBlogArticle.update({
          where: { id: existing.id },
          data: { ...articleData, generationLog: updatedLog as unknown as Prisma.InputJsonValue },
        });
      } else {
        await prisma.localizedBlogArticle.create({
          data: {
            canonicalArticleId: canonical.id,
            ...articleData,
            generationLog: [logEntry] as unknown as Prisma.InputJsonValue,
          },
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      safeServerLog("blog_batch_localized", "locale_failed", { locale: loc, region: blogBatchDefaultRegionForLocale(loc as GlobalLocaleCode, params.scheduleCountry), msg });
    }
  }
}
