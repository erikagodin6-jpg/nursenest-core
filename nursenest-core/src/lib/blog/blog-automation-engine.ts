import {
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  type Prisma,
} from "@prisma/client";
import { z } from "zod";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import {
  buildAdaptationSystemPrompt,
  buildAdaptationUserPrompt,
  extractCanonicalBrief,
  postProcessAiOutput,
} from "@/lib/blog/generate-localized-blog";
import type { LocalizedBlogAiOutput } from "@/lib/blog/blog-localization-types";
import { prisma } from "@/lib/db";
import {
  GLOBAL_LOCALE_CODES,
  GLOBAL_REGION_SLUGS,
  isAllowedLocaleForRegion,
  type GlobalLocaleCode,
  type GlobalRegionSlug,
} from "@/lib/i18n/global-regions";

type AutomationInput = {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  keywords?: string;
  targetKeyword?: string;
  keywordCluster?: string;
  template: BlogPostTemplate;
  intent?: BlogPostIntent;
  funnelStage?: BlogFunnelStage;
  tone?: "professional" | "supportive" | "direct";
  includeImage?: boolean;
  includeAiImage?: boolean;
  sourceRecords?: Prisma.JsonValue;
  fixedSlug?: string;
  autoPublish?: boolean;
  publishAt?: Date;
  generateTranslations?: boolean;
  translationLocales?: GlobalLocaleCode[];
  translationRegion?: GlobalRegionSlug;
  translationProfession?: string;
  translationExam?: string;
};

export type AutomationResult =
  | {
      ok: true;
      skipped: true;
      reason: "duplicate_topic" | "duplicate_slug" | "duplicate_slug_race";
      existingSlug?: string;
      slug?: string;
    }
  | {
      ok: true;
      skipped: false;
      post: {
        id: string;
        slug: string;
        title: string;
        postStatus: BlogPostStatus;
        updatedAt: Date;
      };
      warnings: string[];
      localized: Array<{ locale: string; region: string; localizedSlug: string; mode: "created" | "updated" }>;
      localizationErrors: string[];
    }
  | { ok: false; error: string };

const localizedAiOutputSchema = z.object({
  localizedTitle: z.string().min(10),
  localizedExcerpt: z.string().min(40),
  localizedBody: z.string().min(400),
  localizedSlug: z.string().min(3),
  localizedMetaTitle: z.string().min(10),
  localizedMetaDescription: z.string().min(20),
  seoKeywordPrimary: z.string().nullable(),
  seoKeywordSecondary: z.array(z.string()).default([]),
  searchIntent: z.string().nullable(),
  ctaVariant: z.string().nullable(),
  ctaText: z.string().nullable(),
  ctaHref: z.string().nullable(),
  internalLinkTargets: z
    .array(
      z.object({
        anchorText: z.string(),
        href: z.string(),
        context: z.enum(["inline", "cta", "related", "sidebar"]),
      }),
    )
    .default([]),
  reviewFlags: z.array(z.string()).default([]),
  complianceReviewRequired: z.boolean().default(false),
  medicalReviewRequired: z.boolean().default(false),
  faqSuggestions: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .default([]),
  snippetSummary: z.string().nullable(),
  referenceLines: z.array(z.string()).default([]),
  sourceSelectionNotes: z.string().nullable(),
});

function toJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI response did not contain JSON object.");
  return JSON.parse(trimmed.slice(start, end + 1));
}

function resolvePublishState(
  autoPublish: boolean | undefined,
  publishAt: Date | undefined,
  now: Date,
): { postStatus: BlogPostStatus; publishAt: Date | null; workflowStatus: BlogWorkflowStatus } {
  if (!autoPublish) {
    return {
      postStatus: BlogPostStatus.DRAFT,
      publishAt: null,
      workflowStatus: BlogWorkflowStatus.GENERATED,
    };
  }
  if (publishAt && publishAt.getTime() > now.getTime()) {
    return {
      postStatus: BlogPostStatus.SCHEDULED,
      publishAt,
      workflowStatus: BlogWorkflowStatus.SCHEDULED,
    };
  }
  return {
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: publishAt ?? now,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
  };
}

function countryToRegion(country: "US" | "CA" | "unspecified"): GlobalRegionSlug {
  if (country === "CA") return "canada";
  return "us";
}

async function upsertLocalizedVariant(params: {
  canonicalPostId: string;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
}): Promise<{ localizedSlug: string; mode: "created" | "updated" }> {
  const canonical = await prisma.blogPost.findUnique({
    where: { id: params.canonicalPostId },
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
  if (!canonical) throw new Error("Canonical post missing during localization.");

  const brief = extractCanonicalBrief({
    id: canonical.id,
    title: canonical.title,
    slug: canonical.slug,
    excerpt: canonical.excerpt,
    body: canonical.body,
    exam: canonical.exam,
    targetLocale: params.locale,
    targetRegion: params.region,
    targetProfession: params.profession,
    targetExam: params.exam,
    seoKeywordPrimary: canonical.targetKeyword ?? null,
    seoKeywordSecondary: [],
    searchIntent: "exam_prep",
    targetAudience: "nursing students",
    canonicalApaReferences: canonical.apaReferences,
    canonicalSourcesJson: canonical.sourcesJson,
  });

  const ai = await openAiChatCompletion({
    messages: [
      { role: "system", content: buildAdaptationSystemPrompt(brief) },
      { role: "user", content: buildAdaptationUserPrompt(brief) },
    ],
    temperature: 0.35,
    maxTokens: 8192,
  });
  const parsed = localizedAiOutputSchema.parse(toJsonObject(ai.content)) as LocalizedBlogAiOutput;
  const processed = postProcessAiOutput(parsed, brief);
  if (!processed.ok) {
    throw new Error(`Localization validation failed (${params.locale}): ${processed.error}`);
  }

  // @ts-expect-error model available in runtime after prisma generate/migrations
  const localizedModel = prisma.localizedBlogArticle as {
    findUnique: (args: Record<string, unknown>) => Promise<{ id: string } | null>;
    create: (args: Record<string, unknown>) => Promise<{ localizedSlug: string }>;
    update: (args: Record<string, unknown>) => Promise<{ localizedSlug: string }>;
  };
  const existing = await localizedModel.findUnique({
    where: {
      canonicalArticleId_locale_region: {
        canonicalArticleId: params.canonicalPostId,
        locale: params.locale,
        region: params.region,
      },
    },
    select: { id: true },
  });

  const data = {
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    sourceLanguage: "en",
    adaptationType: "LOCALIZED_REWRITE",
    contentStatus: "PUBLISHED",
    localizedTitle: processed.aiOutput.localizedTitle,
    localizedExcerpt: processed.aiOutput.localizedExcerpt,
    localizedBody: processed.aiOutput.localizedBody,
    canonicalSlug: canonical.slug,
    localizedSlug: processed.aiOutput.localizedSlug,
    localizedMetaTitle: processed.aiOutput.localizedMetaTitle,
    localizedMetaDescription: processed.aiOutput.localizedMetaDescription,
    seoKeywordPrimary: processed.aiOutput.seoKeywordPrimary,
    seoKeywordSecondary: processed.aiOutput.seoKeywordSecondary,
    searchIntent: processed.aiOutput.searchIntent,
    targetAudience: brief.targetAudience,
    ctaVariant: processed.aiOutput.ctaVariant,
    ctaText: processed.aiOutput.ctaText,
    ctaHref: processed.aiOutput.ctaHref,
    internalLinkTargets: processed.aiOutput.internalLinkTargets as unknown,
    complianceReviewRequired: processed.aiOutput.complianceReviewRequired,
    medicalReviewRequired: processed.aiOutput.medicalReviewRequired,
    editorialReviewRequired: false,
    reviewFlags: processed.aiOutput.reviewFlags,
    publishedAt: new Date(),
  };

  if (existing?.id) {
    const updated = await localizedModel.update({
      where: { id: existing.id },
      data,
      select: { localizedSlug: true },
    });
    return { localizedSlug: updated.localizedSlug, mode: "updated" };
  }
  const created = await localizedModel.create({
    data: {
      canonicalArticleId: params.canonicalPostId,
      ...data,
    },
    select: { localizedSlug: true },
  });
  return { localizedSlug: created.localizedSlug, mode: "created" };
}

export async function generateAutomatedBlogPost(input: AutomationInput): Promise<AutomationResult> {
  const pipelineResult = await runBlogArticleGenerationPipeline(
    {
      topic: input.topic,
      exam: input.exam,
      country: input.country,
      keywords: input.keywords,
      targetKeyword: input.targetKeyword,
      keywordCluster: input.keywordCluster,
      template: input.template,
      intent: input.intent ?? BlogPostIntent.EXAM_PREP,
      funnelStage: input.funnelStage ?? BlogFunnelStage.CONSIDERATION,
      tone: input.tone ?? "professional",
      includeImage: input.includeImage ?? true,
      includeAiImage: input.includeAiImage ?? false,
      sourceRecordsJson: (input.sourceRecords as Prisma.JsonValue | undefined) ?? undefined,
      fixedSlug: input.fixedSlug,
      allowInsufficientCitations: true,
    },
    { persist: true },
  );

  if (!pipelineResult.ok) return { ok: false, error: pipelineResult.error };
  if (pipelineResult.persistSkipped) {
    return {
      ok: true,
      skipped: true,
      reason: pipelineResult.persistSkipped.reason,
      existingSlug: pipelineResult.persistSkipped.existingSlug,
      slug: pipelineResult.persistSkipped.slug,
    };
  }
  const persisted = pipelineResult.persist;
  if (!persisted) return { ok: false, error: "No persisted post returned from generation pipeline." };

  const publish = resolvePublishState(input.autoPublish ?? true, input.publishAt, new Date());
  const post = await prisma.blogPost.update({
    where: { id: persisted.post.id },
    data: {
      postStatus: publish.postStatus,
      publishAt: publish.publishAt,
      workflowStatus: publish.workflowStatus,
    },
    select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
  });

  const localized: Array<{ locale: string; region: string; localizedSlug: string; mode: "created" | "updated" }> = [];
  const localizationErrors: string[] = [];
  if (input.generateTranslations) {
    const region = input.translationRegion ?? countryToRegion(input.country);
    const defaultLocales = GLOBAL_LOCALE_CODES.filter((code) => code !== "en");
    const locales = (input.translationLocales ?? defaultLocales).slice(0, 4);
    for (const locale of locales) {
      if (!GLOBAL_LOCALE_CODES.includes(locale)) continue;
      if (!isAllowedLocaleForRegion(locale, region)) continue;
      try {
        const out = await upsertLocalizedVariant({
          canonicalPostId: post.id,
          locale,
          region,
          profession: input.translationProfession ?? "rn",
          exam: input.translationExam ?? input.exam,
        });
        localized.push({ locale, region, localizedSlug: out.localizedSlug, mode: out.mode });
      } catch (error) {
        localizationErrors.push(error instanceof Error ? error.message : String(error));
      }
    }
  }

  return {
    ok: true,
    skipped: false,
    post,
    warnings: persisted.warnings,
    localized,
    localizationErrors,
  };
}

