import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { logPipelineDuplicateTopic } from "@/lib/admin/blog-content-automation-log";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { coerceBlogSourceRows } from "@/lib/blog/apa7";
import { createBlogArticleGenerationJob } from "@/lib/blog/blog-article-generation-job";
import { normalizeBlogControlPanelGenerateRequestBody } from "@/lib/blog/blog-admin-control-panel-generate-body";
import {
  AdminBlogValidationError,
  findDuplicateAdminBlogIntent,
  prepareAdminBlogGenerationInput,
} from "@/lib/blog/admin-blog-generation-service";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const adminBlogTopicSchema = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : v),
  z.string().min(3, "Topic must be at least 3 non-whitespace characters.").max(500),
);

const bodySchema = z.object({
  topic: adminBlogTopicSchema,
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

  try {
    let rawJson: unknown;
    try {
      rawJson = await req.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      safeServerLog("admin", "blog_control_panel_generate_json_invalid", { message: msg });
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", code: "INVALID_JSON", details: { message: msg } },
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
          success: false,
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
        {
          success: false,
          error: "Request validation failed unexpectedly",
          code: "VALIDATION_EXCEPTION",
          details: { message: msg },
        },
        { status: 400 },
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
          success: false,
          error: "Invalid payload after normalization",
          code: "VALIDATION_FAILED",
          details: { issues },
        },
        { status: 400 },
      );
    }
    const d = parsed.data;

    let prepared;
    try {
      prepared = await prepareAdminBlogGenerationInput({
        rawTitle: d.topic,
        exam: d.exam,
        targetKeyword: d.targetKeyword,
        fixedSlug: d.fixedSlug,
        publishMode: d.publishImmediately === true ? "publish_now" : "draft",
      });
    } catch (error) {
      if (error instanceof AdminBlogValidationError) {
        return NextResponse.json(
          { success: false, error: error.message, fieldErrors: [error.fieldError] },
          { status: 400 },
        );
      }
      throw error;
    }

    const dup = await findDuplicateAdminBlogIntent({ exam: d.exam, normalizedTopic: prepared.normalizedTopic });
    if (dup) {
      await logPipelineDuplicateTopic({
        topic: prepared.topic,
        existingSlug: dup.slug,
        createdById: gate.admin.userId,
        source: "control_panel_generate",
      });
      return NextResponse.json(
        {
          success: false,
          error: "duplicate_topic",
          code: "duplicate_topic",
          message: "A draft or published post already targets this topic intent.",
          existingSlug: dup.slug,
          normalizedTopic: prepared.normalizedTopic,
          hint: "Open the existing post or change topic / primary keyword.",
        },
        { status: 409 },
      );
    }

    const input = {
      topic: prepared.topic,
      exam: d.exam,
      country: d.country,
      keywords: d.keywords,
      targetKeyword: prepared.targetKeyword,
      keywordCluster: d.keywordCluster,
      template: d.template,
      intent: d.intent ?? BlogPostIntent.EXAM_PREP,
      funnelStage: d.funnelStage ?? BlogFunnelStage.CONSIDERATION,
      tone: d.tone ?? "professional",
      includeImage: d.includeImage ?? true,
      includeAiImage: d.includeAiImage ?? false,
      sourceRecordsJson: d.sourceRecords?.length ? coerceBlogSourceRows(d.sourceRecords) : undefined,
      fixedSlug: prepared.uniqueSlug,
      allowInsufficientCitations: d.allowInsufficientCitations,
      publishImmediately: d.publishImmediately === true,
    };

    const job = await createBlogArticleGenerationJob({
      createdById: gate.admin.userId,
      input,
    });

    safeServerLog("admin", "blog_article_generation_job_enqueued", {
      jobId: job.id,
      topic: prepared.topic,
      publishImmediately: input.publishImmediately,
    });

    return NextResponse.json(
      {
        success: true,
        jobId: job.id,
        status: "queued" as const,
        message:
          "Generation queued. Poll GET /api/admin/blog/control-panel/article-jobs/{jobId} and POST …/tick to run the worker, or wait for the blog-article-generation cron.",
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("[BLOG_GENERATION_ERROR]", error);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    const message = error instanceof Error ? error.message : String(error);
    safeServerLog("admin", "blog_control_panel_generate_unexpected", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
