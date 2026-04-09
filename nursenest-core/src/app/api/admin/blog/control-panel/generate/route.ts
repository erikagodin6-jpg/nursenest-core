import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { coerceBlogSourceRows } from "@/lib/blog/apa7";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  topic: z.string().min(3).max(200),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).default("unspecified"),
  keywords: z.string().max(500).optional(),
  targetKeyword: z.string().max(200).optional(),
  keywordCluster: z.string().max(200).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  includeImage: z.boolean().optional(),
  includeAiImage: z.boolean().optional(),
  sourceRecords: z.array(z.unknown()).max(30).optional(),
  allowInsufficientCitations: z.boolean().optional(),
  fixedSlug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

/**
 * Full control-panel pipeline: structured editorial JSON plan → HTML article → persisted DRAFT BlogPost.
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "AI admin generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const normalizedTopic = normalizeBlogTopicKey(d.targetKeyword ?? d.topic);
  if (normalizedTopic) {
    const dup = await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic });
    if (dup) {
      return NextResponse.json(
        {
          error: "duplicate_topic",
          existingSlug: dup.slug,
          normalizedTopic,
          hint: "Open the existing post or change topic / primary keyword.",
        },
        { status: 409 },
      );
    }
  }

  const input = {
    topic: d.topic,
    exam: d.exam,
    country: d.country,
    keywords: d.keywords,
    targetKeyword: d.targetKeyword,
    keywordCluster: d.keywordCluster,
    template: d.template,
    intent: d.intent ?? BlogPostIntent.EXAM_PREP,
    funnelStage: d.funnelStage ?? BlogFunnelStage.CONSIDERATION,
    tone: d.tone ?? "professional",
    includeImage: d.includeImage ?? true,
    includeAiImage: d.includeAiImage ?? false,
    sourceRecordsJson: d.sourceRecords?.length ? coerceBlogSourceRows(d.sourceRecords) : undefined,
    fixedSlug: d.fixedSlug,
    allowInsufficientCitations: d.allowInsufficientCitations,
  };

  const pipelineResult = await runBlogArticleGenerationPipeline(input, { persist: true });
  if (!pipelineResult.ok) {
    if (pipelineResult.stage === "plan") {
      return NextResponse.json({ error: "plan_generation_failed", message: pipelineResult.error }, { status: 502 });
    }
    if (pipelineResult.stage === "body") {
      return NextResponse.json(
        {
          error: "body_generation_failed",
          message: pipelineResult.error,
          plan: pipelineResult.plan,
          hint: "Plan may be usable; retry body from the control panel.",
        },
        { status: 502 },
      );
    }
    if (pipelineResult.stage === "citations") {
      return NextResponse.json(
        {
          error: "insufficient_citations",
          code: pipelineResult.code,
          message: pipelineResult.error,
          riskFlags: pipelineResult.riskFlags ?? [],
          plan: pipelineResult.plan,
          bodyHtml: pipelineResult.bodyHtml,
          hint: "Add admin-verified source JSON (HTTPS URL or valid DOI + title + year) and use Persist draft, or enable override in the control panel.",
        },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: "persist_failed", message: pipelineResult.error, plan: pipelineResult.plan, bodyHtml: pipelineResult.bodyHtml },
      { status: 500 },
    );
  }

  if (pipelineResult.persistSkipped) {
    const sk = pipelineResult.persistSkipped;
    return NextResponse.json(
      {
        skipped: true,
        reason: sk.reason,
        existingSlug: sk.existingSlug,
        normalizedTopic: sk.normalizedTopic,
        slug: sk.slug,
        plan: pipelineResult.plan,
      },
      { status: 200 },
    );
  }

  const result = pipelineResult.persist;
  if (!result) {
    return NextResponse.json({ error: "persist_missing" }, { status: 500 });
  }

  const full = await prisma.blogPost.findUnique({
    where: { id: result.post.id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      exam: true,
      postStatus: true,
      seoTitle: true,
      seoDescription: true,
      targetKeyword: true,
      keywordCluster: true,
      countryTarget: true,
      intent: true,
      funnelStage: true,
      postTemplate: true,
      outlineJson: true,
      faqBlock: true,
      internalLinkPlan: true,
      titleAlternates: true,
      keyTakeaways: true,
      relatedLessonPaths: true,
      schemaSummary: true,
      metaTitleVariant: true,
      metaDescriptionVariant: true,
      featuredSnippet: true,
      apaReferences: true,
      tags: true,
      keyQuestions: true,
      updatedAt: true,
      sourcesJson: true,
      requiresReferences: true,
      medicalRiskFlags: true,
      sourceReliabilityScore: true,
      coverImage: true,
      coverImageAlt: true,
      coverImageCaption: true,
      coverImagePrompt: true,
      imageStatus: true,
      adminPublishLog: true,
    },
  });

  if (!full) {
    return NextResponse.json(
      { ok: true, postId: result.post.id, slug: result.post.slug, warnings: result.warnings, plan: result.plan, post: null },
      { status: 201 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      postId: result.post.id,
      slug: result.post.slug,
      title: result.post.title,
      postStatus: result.post.postStatus,
      warnings: result.warnings,
      plan: result.plan,
      post: full,
    },
    { status: 201 },
  );
}
