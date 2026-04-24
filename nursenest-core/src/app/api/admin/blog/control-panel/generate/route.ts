import { BlogFunnelStage, BlogPostIntent, BlogPostStatus, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  logControlPanelPipelineFailure,
  logControlPanelPipelineSuccess,
  logPipelineDuplicateTopic,
  logPipelinePersistSkipped,
  logReferenceGate,
} from "@/lib/admin/blog-content-automation-log";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { coerceBlogSourceRows } from "@/lib/blog/apa7";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { normalizeBlogControlPanelGenerateRequestBody } from "@/lib/blog/blog-admin-control-panel-generate-body";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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
  /** When true (recommended from control panel), run pre-publish validation after save and set PUBLISHED so `/blog` lists the post. */
  publishImmediately: z.boolean().optional(),
  fixedSlug: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().max(500).optional(),
  ),
});

/**
 * Full control-panel pipeline: structured editorial JSON plan → HTML article → persisted `BlogPost`.
 * When `publishImmediately` is true and pre-publish checks pass, the row is set live for `/blog`.
 */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  let rawJson: unknown;
  try {
    rawJson = await req.json();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("admin", "blog_control_panel_generate_json_invalid", { message: msg });
    return NextResponse.json(
      { error: "Invalid JSON body", code: "INVALID_JSON", details: { message: msg } },
      { status: 400 },
    );
  }

  const payloadForLog =
    rawJson && typeof rawJson === "object" && !Array.isArray(rawJson)
      ? (() => {
          const o = { ...(rawJson as Record<string, unknown>) };
          if (Array.isArray(o.sourceRecords)) {
            o.sourceRecords = { kind: "array", length: o.sourceRecords.length } as unknown;
          }
          return o;
        })()
      : rawJson;
  safeServerLog("admin", "blog_control_panel_generate_request", {
    payloadJson: JSON.stringify(payloadForLog).slice(0, 12_000),
  });

  const norm = normalizeBlogControlPanelGenerateRequestBody(rawJson);
  if (!norm.ok) {
    safeServerLog("admin", "blog_control_panel_generate_body_normalize_failed", {
      code: norm.code,
      path: norm.path,
      message: norm.message,
    });
    return NextResponse.json(
      {
        error: norm.message,
        code: norm.code,
        details: norm.path ? { path: norm.path } : undefined,
      },
      { status: 400 },
    );
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(norm.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("admin", "blog_control_panel_generate_zod_exception", { message: msg });
    return NextResponse.json(
      { error: "Request validation failed unexpectedly", code: "VALIDATION_EXCEPTION", details: { message: msg } },
      { status: 500 },
    );
  }
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      path: i.path.length ? i.path.join(".") : "(root)",
      code: i.code,
      message: i.message,
    }));
    safeServerLog("admin", "blog_control_panel_generate_validation_failed", {
      issuesJson: JSON.stringify(issues).slice(0, 8000),
    });
    return NextResponse.json(
      {
        error: "Invalid payload after normalization",
        code: "VALIDATION_FAILED",
        details: { issues },
      },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const normalizedTopic = normalizeBlogTopicKey(d.targetKeyword ?? d.topic);
  if (normalizedTopic) {
    const dup = await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic });
    if (dup) {
      await logPipelineDuplicateTopic({
        topic: d.topic,
        existingSlug: dup.slug,
        createdById: gate.admin.userId,
        source: "control_panel_generate",
      });
      return NextResponse.json(
        {
          error: "duplicate_topic",
          code: "duplicate_topic",
          message: "A draft or published post already targets this topic intent.",
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
    publishImmediately: d.publishImmediately === true,
  };

  const pipelineResult = await runBlogArticleGenerationPipeline(input, { persist: true });
  if (!pipelineResult.ok) {
    if (pipelineResult.stage === "plan") {
      await logControlPanelPipelineFailure({
        topic: d.topic,
        stage: "plan",
        message: pipelineResult.error,
        createdById: gate.admin.userId,
      });
      const status = pipelineResult.code === "PLAN_LONGFORM_CONTRACT" ? 422 : 502;
      return NextResponse.json(
        {
          error: "plan_generation_failed",
          code: pipelineResult.code ?? "plan_generation_failed",
          message: pipelineResult.error,
          details: pipelineResult.details ?? null,
        },
        { status },
      );
    }
    if (pipelineResult.stage === "body") {
      await logControlPanelPipelineFailure({
        topic: d.topic,
        stage: "body",
        message: pipelineResult.error,
        createdById: gate.admin.userId,
        metadata: { hasPlan: Boolean(pipelineResult.plan) },
      });
      const bodyStatus = pipelineResult.code === "BODY_LONGFORM_ENFORCEMENT" ? 422 : 502;
      return NextResponse.json(
        {
          error: "body_generation_failed",
          code: pipelineResult.code ?? "body_generation_failed",
          message: pipelineResult.error,
          details: pipelineResult.details ?? null,
          plan: pipelineResult.plan,
          hint: "Plan may be usable; retry body from the control panel.",
        },
        { status: bodyStatus },
      );
    }
    if (pipelineResult.stage === "citations") {
      await logReferenceGate({
        topic: d.topic,
        message: pipelineResult.error,
        riskFlags: pipelineResult.riskFlags ?? [],
        source: "control_panel_pipeline",
        createdById: gate.admin.userId,
      });
      return NextResponse.json(
        {
          error: "insufficient_citations",
          code: pipelineResult.code ?? "INSUFFICIENT_CITATIONS",
          message: pipelineResult.error,
          details: pipelineResult.details ?? { riskFlags: pipelineResult.riskFlags ?? [] },
          riskFlags: pipelineResult.riskFlags ?? [],
          plan: pipelineResult.plan,
          bodyHtml: pipelineResult.bodyHtml,
          hint: "Add admin-verified source JSON (HTTPS URL or valid DOI + title + year) and use Persist draft, or enable override in the control panel.",
        },
        { status: 422 },
      );
    }
    if (pipelineResult.stage === "persist" && pipelineResult.code === "PRE_PUBLISH_BLOCKED") {
      await logControlPanelPipelineFailure({
        topic: d.topic,
        stage: "persist",
        message: pipelineResult.error,
        createdById: gate.admin.userId,
        metadata: { code: "PRE_PUBLISH_BLOCKED" },
      });
      return NextResponse.json(
        {
          error: "pre_publish_blocked",
          code: "PRE_PUBLISH_BLOCKED",
          message: pipelineResult.error,
          details: pipelineResult.details ?? null,
          draftPost:
            pipelineResult.details &&
            typeof pipelineResult.details === "object" &&
            pipelineResult.details !== null &&
            "draftPost" in pipelineResult.details
              ? (pipelineResult.details as { draftPost?: unknown }).draftPost
              : null,
          plan: pipelineResult.plan,
          bodyHtml: pipelineResult.bodyHtml,
          hint: "Draft was saved. Fix blocking issues in the admin editor, then publish from the post detail — or disable “Publish to live blog” to keep drafts only.",
        },
        { status: 422 },
      );
    }
    await logControlPanelPipelineFailure({
      topic: d.topic,
      stage: "persist",
      message: pipelineResult.error,
      createdById: gate.admin.userId,
    });
    return NextResponse.json(
      {
        error: "persist_failed",
        code: "persist_failed",
        message: pipelineResult.error,
        details: pipelineResult.details ?? null,
        plan: pipelineResult.plan,
        bodyHtml: pipelineResult.bodyHtml,
      },
      { status: 500 },
    );
  }

  if (pipelineResult.persistSkipped) {
    const sk = pipelineResult.persistSkipped;
    await logPipelinePersistSkipped({
      topic: d.topic,
      reason: sk.reason,
      existingSlug: sk.existingSlug,
      normalizedTopic: sk.normalizedTopic,
      createdById: gate.admin.userId,
    });
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
    await logControlPanelPipelineFailure({
      topic: d.topic,
      stage: "persist_missing",
      message: "Pipeline returned no persist result",
      createdById: gate.admin.userId,
    });
    return NextResponse.json(
      { error: "persist_missing", code: "persist_missing", message: "Pipeline returned no persist result" },
      { status: 500 },
    );
  }

  await logControlPanelPipelineSuccess({
    topic: d.topic,
    blogPostId: result.post.id,
    slug: result.post.slug,
    plan: pipelineResult.plan,
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
      category: true,
      careerSlug: true,
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

  /** Immediate publish uses {@link publishBlogPostCanonical} which already revalidates `/blog` + `/blog/{slug}`. */

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
