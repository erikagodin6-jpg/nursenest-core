import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";

const localizedModel = () => prisma.localizedBlogArticle as Record<string, (...args: unknown[]) => Promise<unknown>>;
import {
  extractCanonicalBrief,
  buildAdaptationSystemPrompt,
  buildAdaptationUserPrompt,
  postProcessAiOutput,
} from "@/lib/blog/generate-localized-blog";
import { createLogEntry, appendGenerationLog } from "@/lib/blog/blog-publish-workflow-localized";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { GLOBAL_LOCALE_CODES, GLOBAL_REGION_SLUGS } from "@/lib/i18n/global-regions";
import type { LocalizedBlogAiOutput } from "@/lib/blog/blog-localization-types";

const generateSchema = z.object({
  canonicalArticleId: z.string().min(1),
  targetLocale: z.string().refine((v): v is GlobalLocaleCode => (GLOBAL_LOCALE_CODES as readonly string[]).includes(v)),
  targetRegion: z.string().refine((v): v is GlobalRegionSlug => (GLOBAL_REGION_SLUGS as readonly string[]).includes(v)),
  targetProfession: z.string().max(32).nullable().optional(),
  targetExam: z.string().max(48).nullable().optional(),
  seoKeywordPrimary: z.string().max(200).nullable().optional(),
  seoKeywordSecondary: z.array(z.string().max(200)).max(10).optional(),
  searchIntent: z.string().max(48).nullable().optional(),
  targetAudience: z.string().max(64).nullable().optional(),
  promptOnly: z.boolean().optional(),
  /** Pre-computed AI output — skip AI call and go straight to post-processing. */
  precomputedAiOutput: z.unknown().optional(),
});

/**
 * POST /api/admin/blog/localized/generate
 *
 * Two modes:
 * 1. With `precomputedAiOutput`: skips AI call, runs post-processing + persistence only.
 * 2. Without: runs AI adaptation internally and persists the localized variant.
 *
 * Set `promptOnly=true` to return prompts without making an AI call.
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const d = parsed.data;

  const canonical = await prisma.blogPost.findUnique({
    where: { id: d.canonicalArticleId },
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
      postStatus: true,
      publishAt: true,
    },
  });

  if (!canonical) {
    return NextResponse.json({ error: "Canonical article not found" }, { status: 404 });
  }

  const brief = extractCanonicalBrief({
    id: canonical.id,
    title: canonical.title,
    slug: canonical.slug,
    excerpt: canonical.excerpt,
    body: canonical.body,
    exam: canonical.exam,
    targetLocale: d.targetLocale as GlobalLocaleCode,
    targetRegion: d.targetRegion as GlobalRegionSlug,
    targetProfession: d.targetProfession ?? null,
    targetExam: d.targetExam ?? null,
    seoKeywordPrimary: d.seoKeywordPrimary ?? canonical.targetKeyword ?? null,
    seoKeywordSecondary: d.seoKeywordSecondary ?? [],
    searchIntent: d.searchIntent ?? null,
    targetAudience: d.targetAudience ?? null,
    canonicalApaReferences: canonical.apaReferences,
    canonicalSourcesJson: canonical.sourcesJson,
  });

  // Mode 1: pre-computed AI output — post-process and persist
  if (d.precomputedAiOutput) {
    const aiOutput = d.precomputedAiOutput as LocalizedBlogAiOutput;
    const result = postProcessAiOutput(aiOutput, brief);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, stage: result.stage, partialOutput: result.partialOutput },
        { status: 422 },
      );
    }

    // Check for existing variant
    const existing = await localizedModel().findUnique({
      where: {
        canonicalArticleId_locale_region: {
          canonicalArticleId: d.canonicalArticleId,
          locale: d.targetLocale,
          region: d.targetRegion,
        },
      },
      select: { id: true, generationLog: true },
    });

    const logEntry = createLogEntry(
      "generate",
      `AI adaptation generated for ${d.targetRegion}/${d.targetLocale}`,
    );

    const articleData = {
      locale: d.targetLocale,
      region: d.targetRegion,
      profession: d.targetProfession ?? null,
      exam: d.targetExam ?? null,
      sourceLanguage: "en",
      adaptationType: brief.adaptationType === "adapted" ? "ADAPTED" as const : "LOCALIZED_REWRITE" as const,
      contentStatus: "AI_GENERATED" as const,
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
      internalLinkTargets: result.aiOutput.internalLinkTargets as unknown,
      complianceReviewRequired: result.aiOutput.complianceReviewRequired,
      medicalReviewRequired: result.aiOutput.medicalReviewRequired,
      editorialReviewRequired: true,
      reviewFlags: result.aiOutput.reviewFlags,
    };

    if (existing) {
      const ex = existing as { id: string; generationLog: unknown };
      const updatedLog = appendGenerationLog(ex.generationLog, logEntry);
      const updated = await localizedModel().update({
        where: { id: ex.id },
        data: { ...articleData, generationLog: updatedLog },
      });
      return NextResponse.json({ article: updated, mode: "updated" });
    }

    const created = await localizedModel().create({
      data: {
        canonicalArticleId: d.canonicalArticleId,
        ...articleData,
        generationLog: [logEntry],
      },
    });

    return NextResponse.json({ article: created, mode: "created" }, { status: 201 });
  }

  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  // Mode 2: prompt preview only (no AI call)
  const systemPrompt = buildAdaptationSystemPrompt(brief);
  const userPrompt = buildAdaptationUserPrompt(brief);
  if (d.promptOnly) {
    return NextResponse.json({
      brief,
      systemPrompt,
      userPrompt,
      instructions: "Prompt preview mode only. Re-send without promptOnly to generate and persist.",
    });
  }

  // Mode 3: run AI adaptation and persist immediately
  let generatedOutput: LocalizedBlogAiOutput;
  try {
    const completion = await openAiChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.35,
      maxTokens: 8192,
    });
    const raw = completion.content.trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) {
      return NextResponse.json({ error: "Localized generation did not return JSON." }, { status: 502 });
    }
    generatedOutput = JSON.parse(raw.slice(start, end + 1)) as LocalizedBlogAiOutput;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 502 },
    );
  }

  const result = postProcessAiOutput(generatedOutput, brief);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, stage: result.stage, partialOutput: result.partialOutput },
      { status: 422 },
    );
  }

  const existing = await localizedModel().findUnique({
    where: {
      canonicalArticleId_locale_region: {
        canonicalArticleId: d.canonicalArticleId,
        locale: d.targetLocale,
        region: d.targetRegion,
      },
    },
    select: { id: true, generationLog: true },
  });

  const canonicalStatus = canonical.postStatus;
  const canonicalPublishAt = canonical.publishAt ?? new Date();
  const localizedStatus =
    canonicalStatus === "SCHEDULED" && canonicalPublishAt.getTime() > Date.now()
      ? ("SCHEDULED" as const)
      : ("PUBLISHED" as const);

  const articleData = {
    locale: d.targetLocale,
    region: d.targetRegion,
    profession: d.targetProfession ?? null,
    exam: d.targetExam ?? null,
    sourceLanguage: "en",
    adaptationType: brief.adaptationType === "adapted" ? ("ADAPTED" as const) : ("LOCALIZED_REWRITE" as const),
    contentStatus: localizedStatus,
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
    internalLinkTargets: result.aiOutput.internalLinkTargets as unknown,
    complianceReviewRequired: result.aiOutput.complianceReviewRequired,
    medicalReviewRequired: result.aiOutput.medicalReviewRequired,
    editorialReviewRequired: true,
    reviewFlags: result.aiOutput.reviewFlags,
    scheduledAt: localizedStatus === "SCHEDULED" ? canonicalPublishAt : null,
    publishedAt: localizedStatus === "PUBLISHED" ? new Date() : null,
  };

  if (existing) {
    const ex = existing as { id: string; generationLog: unknown };
    const updatedLog = appendGenerationLog(
      ex.generationLog,
      createLogEntry("generate", `AI adaptation generated for ${d.targetRegion}/${d.targetLocale}`),
    );
    const updated = await localizedModel().update({
      where: { id: ex.id },
      data: { ...articleData, generationLog: updatedLog },
    });
    return NextResponse.json({ article: updated, mode: "updated" });
  }

  const created = await localizedModel().create({
    data: {
      canonicalArticleId: d.canonicalArticleId,
      ...articleData,
      generationLog: [
        createLogEntry("generate", `AI adaptation generated for ${d.targetRegion}/${d.targetLocale}`),
      ],
    },
  });

  return NextResponse.json({ article: created, mode: "created" }, { status: 201 });
}
