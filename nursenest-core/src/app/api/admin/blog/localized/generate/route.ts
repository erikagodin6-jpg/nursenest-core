import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
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
  /** Pre-computed AI output — skip AI call and go straight to post-processing. */
  precomputedAiOutput: z.unknown().optional(),
});

/**
 * POST /api/admin/blog/localized/generate
 *
 * Two modes:
 * 1. With `precomputedAiOutput`: skips AI call, runs post-processing + persistence only.
 * 2. Without: returns the system+user prompts so the caller (admin UI or background job)
 *    can make the AI call with their preferred provider, then POST again with the output.
 *
 * This separation keeps the AI provider choice out of the route handler and allows
 * the admin to preview/edit prompts before sending.
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
    const existing = await prisma.localizedBlogArticle.findUnique({
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
      const updatedLog = appendGenerationLog(existing.generationLog, logEntry);
      const updated = await prisma.localizedBlogArticle.update({
        where: { id: existing.id },
        data: { ...articleData, generationLog: updatedLog },
      });
      return NextResponse.json({ article: updated, mode: "updated" });
    }

    const created = await prisma.localizedBlogArticle.create({
      data: {
        canonicalArticleId: d.canonicalArticleId,
        ...articleData,
        generationLog: [logEntry],
      },
    });

    return NextResponse.json({ article: created, mode: "created" }, { status: 201 });
  }

  // Mode 2: return prompts for the caller to run through their AI provider
  const systemPrompt = buildAdaptationSystemPrompt(brief);
  const userPrompt = buildAdaptationUserPrompt(brief);

  return NextResponse.json({
    brief,
    systemPrompt,
    userPrompt,
    instructions: "Send these prompts to your AI provider, then POST the JSON output back as `precomputedAiOutput`.",
  });
}
