import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  logControlPanelPersistFailure,
  logControlPanelPersistSkipped,
  logControlPanelPersistSuccess,
  logPipelineDuplicateTopic,
  logReferenceGate,
} from "@/lib/admin/blog-content-automation-log";
import { coerceBlogSourceRows } from "@/lib/blog/apa7";
import { blogControlPanelPlanSchema, type BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { persistControlPanelDraft } from "@/lib/blog/blog-control-panel-generation";
import { annotateBlogInternalLinkRowsWithVerification } from "@/lib/blog/blog-internal-link-verify";
import { normalizePlanSuggestedLessonRows } from "@/lib/blog/blog-internal-lesson-links";
import { BLOG_ARTICLE_MIN_BODY_CHARS } from "@/lib/blog/blog-article-generation-pipeline";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
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
  fixedSlug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  allowInsufficientCitations: z.boolean().optional(),
  plan: z.unknown(),
  bodyHtml: z.string().min(BLOG_ARTICLE_MIN_BODY_CHARS),
});

/**
 * Persist a control-panel draft without re-running LLM (e.g. after citation gate blocked full generate).
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const planParsed = blogControlPanelPlanSchema.safeParse(d.plan);
  if (!planParsed.success) {
    await logControlPanelPersistFailure({
      topic: d.topic,
      code: "INVALID_PLAN",
      message: "Plan JSON failed schema validation",
      createdById: gate.admin.userId,
    });
    return NextResponse.json(
      { error: "Invalid plan", details: planParsed.error.flatten() },
      { status: 400 },
    );
  }

  const normalizedTopic = normalizeBlogTopicKey(d.targetKeyword ?? d.topic);
  if (normalizedTopic) {
    const dup = await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic });
    if (dup) {
      await logPipelineDuplicateTopic({
        topic: d.topic,
        existingSlug: dup.slug,
        createdById: gate.admin.userId,
        source: "persist_draft",
      });
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

  const planVerified = {
    ...planParsed.data,
    suggestedInternalLessons: normalizePlanSuggestedLessonRows(
      await annotateBlogInternalLinkRowsWithVerification(planParsed.data.suggestedInternalLessons, d.country),
    ) as BlogControlPanelPlan["suggestedInternalLessons"],
  };

  const persistResult = await persistControlPanelDraft(input, planVerified, d.bodyHtml);

  if (!persistResult.ok) {
    if (persistResult.code === "INSUFFICIENT_CITATIONS") {
      await logReferenceGate({
        topic: d.topic,
        message: persistResult.error,
        riskFlags: persistResult.riskFlags ?? [],
        source: "persist_draft",
        createdById: gate.admin.userId,
      });
      return NextResponse.json(
        {
          error: "insufficient_citations",
          code: persistResult.code,
          message: persistResult.error,
          riskFlags: persistResult.riskFlags ?? [],
        },
        { status: 422 },
      );
    }
    await logControlPanelPersistFailure({
      topic: d.topic,
      code: "PERSIST_FAILED",
      message: persistResult.error,
      createdById: gate.admin.userId,
    });
    return NextResponse.json({ error: "persist_failed", message: persistResult.error }, { status: 500 });
  }

  if (persistResult.skipped) {
    const sk = persistResult;
    await logControlPanelPersistSkipped({
      topic: d.topic,
      reason: sk.reason,
      existingSlug: sk.existingSlug,
      createdById: gate.admin.userId,
    });
    return NextResponse.json(
      {
        skipped: true,
        reason: sk.reason,
        existingSlug: sk.existingSlug,
        normalizedTopic: sk.normalizedTopic,
        slug: sk.slug,
        plan: planParsed.data,
      },
      { status: 200 },
    );
  }

  const result = persistResult;
  await logControlPanelPersistSuccess({
    topic: d.topic,
    blogPostId: result.post.id,
    slug: result.post.slug,
    plan: planVerified,
    createdById: gate.admin.userId,
  });

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
