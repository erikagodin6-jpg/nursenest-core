/**
 * DB-backed async queue for admin control-panel longform generation (avoids HTTP 504 on synchronous generate).
 */

import type { BlogArticleGenerationJob, Prisma } from "@prisma/client";
import type { ControlPanelGenerateInput } from "@/lib/blog/blog-control-panel-generation";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import {
  classifyBlogPipelineFailureForRepair,
} from "@/lib/blog/blog-generation-repair-classifier";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import { blogPrePublishValidationSelect, validateBlogPrePublish } from "@/lib/blog/blog-pre-publish-validation";
import { repairControlPanelArticleBodyHtml } from "@/lib/blog/blog-generation-repair-ai";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { safeParseBlogControlPanelPlan } from "@/lib/blog/blog-control-panel-plan-normalize";
import {
  logControlPanelPipelineFailure,
  logControlPanelPipelineSuccess,
} from "@/lib/admin/blog-content-automation-log";

export type BlogArticleGenerationJobStage =
  | "queued"
  | "generating_plan"
  | "generating_body"
  | "repairing_body"
  | "validating_citations"
  | "prepublish_checks"
  | "publishing"
  | "published"
  | "failed";

export type BlogArticleGenerationJobPayload = {
  jobId: string;
  status: BlogArticleGenerationJobStage | string;
  repairable: boolean;
  retryCount: number;
  lastError: string | null;
  failureCode: string | null;
  blogPostId: string | null;
  resultSlug: string | null;
  resultTitle: string | null;
  resultPostStatus: string | null;
  resultWarnings: string[] | null;
  createdAt: string;
  updatedAt: string;
};

const REQUEST_V = 1 as const;

export type BlogArticleJobStoredRequest = {
  v: typeof REQUEST_V;
  input: ControlPanelGenerateInput;
};

export function serializeBlogArticleGenerationJob(row: BlogArticleGenerationJob): BlogArticleGenerationJobPayload {
  const warnings = row.resultWarnings;
  const w =
    Array.isArray(warnings) && warnings.every((x) => typeof x === "string") ? (warnings as string[]) : null;
  return {
    jobId: row.id,
    status: row.stage,
    repairable: row.repairable,
    retryCount: row.retryCount,
    lastError: row.lastError,
    failureCode: row.failureCode,
    blogPostId: row.blogPostId,
    resultSlug: row.resultSlug,
    resultTitle: row.resultTitle,
    resultPostStatus: row.resultPostStatus,
    resultWarnings: w,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createBlogArticleGenerationJob(params: {
  createdById: string | null;
  input: ControlPanelGenerateInput;
}): Promise<BlogArticleGenerationJob> {
  const payload: BlogArticleJobStoredRequest = { v: REQUEST_V, input: params.input };
  return prisma.blogArticleGenerationJob.create({
    data: {
      createdById: params.createdById ?? null,
      stage: "queued",
      requestPayload: payload as unknown as Prisma.InputJsonValue,
      repairable: false,
    },
  });
}

async function logJobStage(jobId: string, stage: string, extra?: Record<string, unknown>) {
  await prisma.blogArticleGenerationJob.update({
    where: { id: jobId },
    data: { stage, updatedAt: new Date() },
  });
  safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage, ...extra });
}

function failureRepairable(pipeline: {
  ok: false;
  stage: string;
  error: string;
  code?: string;
  details?: unknown;
}): boolean {
  return classifyBlogPipelineFailureForRepair({
    stage: pipeline.stage,
    error: pipeline.error,
    code: pipeline.code,
    details: pipeline.details,
  }).recoverable;
}

/**
 * Atomically claims a queued job for processing. Returns false if already running or terminal.
 */
export async function claimBlogArticleGenerationJob(jobId: string): Promise<boolean> {
  const out = await prisma.blogArticleGenerationJob.updateMany({
    where: { id: jobId, stage: "queued" },
    data: { stage: "generating_plan", updatedAt: new Date() },
  });
  return out.count === 1;
}

/**
 * Runs the full article pipeline for a claimed job and persists terminal outcome.
 */
export async function runClaimedBlogArticleGenerationJob(jobId: string): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  const row = await prisma.blogArticleGenerationJob.findUnique({ where: { id: jobId } });
  if (!row) return { ok: false, error: "job_not_found" };
  if (row.stage !== "generating_plan") {
    return { ok: false, skipped: true, error: "job_not_claimed" };
  }

  const payload = row.requestPayload as unknown as BlogArticleJobStoredRequest;
  if (!payload || payload.v !== REQUEST_V || !payload.input) {
    await logJobStage(jobId, "failed");
    await prisma.blogArticleGenerationJob.update({
      where: { id: jobId },
      data: {
        lastError: "Invalid or missing requestPayload on job row.",
        failureCode: "INVALID_JOB_PAYLOAD",
        repairable: false,
      },
    });
    safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage: "failed" });
    return { ok: false, error: "invalid_payload" };
  }

  const input = payload.input;

  try {
    const result = await runBlogArticleGenerationPipeline(input, {
      persist: true,
      idempotencyKey: jobId,
      onProgressStage: async (stage) => {
        await logJobStage(jobId, stage);
      },
    });

    if (!result.ok) {
      const repairable = failureRepairable(result);
      await logJobStage(jobId, "failed");
      await prisma.blogArticleGenerationJob.update({
        where: { id: jobId },
        data: {
          lastError: result.error.slice(0, 12_000),
          failureCode: result.code ?? result.stage,
          repairable,
          planSnapshot: result.plan ? (result.plan as unknown as Prisma.InputJsonValue) : undefined,
          bodyHtmlSnapshot: result.bodyHtml ?? undefined,
          blogPostId:
            result.stage === "persist" && result.code === "PRE_PUBLISH_BLOCKED" && result.details
              ? (() => {
                  const d = result.details as { draftPost?: { id?: string } | null };
                  const id = d.draftPost && typeof d.draftPost.id === "string" ? d.draftPost.id : null;
                  return id ?? undefined;
                })()
              : undefined,
        },
      });
      safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage: "failed" });
      if (row.createdById) {
        await logControlPanelPipelineFailure({
          topic: input.topic,
          stage: result.stage,
          message: result.error,
          createdById: row.createdById,
          metadata: { jobId, code: result.code },
        });
      }
      return { ok: false, error: result.error };
    }

    if (result.persistSkipped) {
      await logJobStage(jobId, "failed");
      await prisma.blogArticleGenerationJob.update({
        where: { id: jobId },
        data: {
          lastError: `Skipped: ${result.persistSkipped.reason}`,
          failureCode: "SKIPPED",
          repairable: false,
          planSnapshot: result.plan as unknown as Prisma.InputJsonValue,
        },
      });
      safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage: "failed" });
      return { ok: false, error: "skipped" };
    }

    const p = result.persist.post;
    await logJobStage(jobId, "published");
    await prisma.blogArticleGenerationJob.update({
      where: { id: jobId },
      data: {
        stage: "published",
        resultSlug: p.slug,
        resultTitle: p.title,
        resultPostStatus: p.postStatus,
        resultWarnings: result.persist.warnings as unknown as Prisma.InputJsonValue,
        blogPostId: p.id,
        lastError: null,
        failureCode: null,
        repairable: false,
        planSnapshot: result.plan as unknown as Prisma.InputJsonValue,
        bodyHtmlSnapshot: result.bodyHtml,
      },
    });
    safeServerLog("admin", "blog_article_generation_job_stage", {
      jobId,
      stage: "published",
      slug: p.slug,
    });
    if (row.createdById) {
      await logControlPanelPipelineSuccess({
        topic: input.topic,
        blogPostId: p.id,
        slug: p.slug,
        plan: result.plan,
        createdById: row.createdById,
      });
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logJobStage(jobId, "failed");
    await prisma.blogArticleGenerationJob.update({
      where: { id: jobId },
      data: {
        lastError: msg.slice(0, 12_000),
        failureCode: "UNEXPECTED",
        repairable: false,
      },
    });
    safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage: "failed", message: msg });
    return { ok: false, error: msg };
  }
}

/**
 * Admin retry: re-queue a repairable failed job (body/plan snapshot) or expand + publish a draft blocked on pre-publish.
 */
export async function retryRepairBlogArticleGenerationJob(jobId: string): Promise<{ ok: boolean; error?: string }> {
  const row = await prisma.blogArticleGenerationJob.findUnique({ where: { id: jobId } });
  if (!row) return { ok: false, error: "not_found" };
  if (row.stage !== "failed" || !row.repairable) {
    return { ok: false, error: "not_retryable" };
  }

  const payload = row.requestPayload as unknown as BlogArticleJobStoredRequest;
  if (!payload?.input) return { ok: false, error: "invalid_payload" };
  const input = payload.input;

  if (row.blogPostId && row.failureCode === "PRE_PUBLISH_BLOCKED") {
    const post = await prisma.blogPost.findUnique({
      where: { id: row.blogPostId },
      select: {
        id: true,
        body: true,
        title: true,
        exam: true,
        postTemplate: true,
        intent: true,
        funnelStage: true,
        countryTarget: true,
      },
    });
    if (!post || !post.exam) return { ok: false, error: "post_missing" };

    const planParsed = row.planSnapshot ? safeParseBlogControlPanelPlan(row.planSnapshot) : null;
    if (!planParsed.success || !planParsed.plan) {
      return { ok: false, error: "plan_snapshot_invalid" };
    }
    const plan = planParsed.plan;
    const country =
      post.countryTarget === "US" ? "US" : post.countryTarget === "CA" ? "CA" : ("unspecified" as const);

    let bodyHtml = post.body;
    const wc = countWordsFromHtml(bodyHtml);
    if (wc < BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH) {
      await logJobStage(jobId, "repairing_body");
      bodyHtml = await repairControlPanelArticleBodyHtml({
        plan,
        topic: input.topic,
        exam: post.exam,
        country,
        template: post.postTemplate ?? input.template,
        intent: post.intent ?? input.intent,
        funnelStage: post.funnelStage ?? input.funnelStage,
        tone: input.tone,
        keywords: input.keywords,
        selectedTitle: plan.h1,
        currentHtml: bodyHtml,
        validationMessages: [
          `Expand substantive teaching depth to at least ${BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH} words (currently ${wc}).`,
        ],
        targetWordMin: BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH,
        openAiUser: `${jobId}:retry-repair`,
      });
    }

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { body: bodyHtml },
    });

    await logJobStage(jobId, "prepublish_checks");
    const preRow = await prisma.blogPost.findUnique({
      where: { id: post.id },
      select: blogPrePublishValidationSelect,
    });
    if (!preRow) return { ok: false, error: "post_missing_after_update" };
    const pre = await validateBlogPrePublish(preRow, post.id);
    if (!pre.okToPublish) {
      await prisma.blogArticleGenerationJob.update({
        where: { id: jobId },
        data: {
          stage: "failed",
          lastError: pre.blocking.map((b) => b.message).join("; ").slice(0, 12_000),
          failureCode: "PRE_PUBLISH_BLOCKED",
          repairable: classifyBlogPipelineFailureForRepair({
            stage: "persist",
            error: pre.blocking.map((b) => b.message).join("; "),
            code: "PRE_PUBLISH_BLOCKED",
            details: { prePublish: pre },
          }).recoverable,
          bodyHtmlSnapshot: bodyHtml,
        },
      });
      safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage: "failed" });
      return { ok: false, error: "pre_publish_still_blocked" };
    }

    await logJobStage(jobId, "publishing");
    const published = await publishBlogPostCanonical({
      postId: post.id,
      publishAt: new Date(),
      context: "control_panel_immediate",
      acknowledgePrePublishWarnings: true,
      setLegacySourceIfEmpty: "control_panel_ai",
    });

    await logJobStage(jobId, "published");
    await prisma.blogArticleGenerationJob.update({
      where: { id: jobId },
      data: {
        stage: "published",
        resultSlug: published.slug,
        resultTitle: published.title,
        resultPostStatus: published.postStatus,
        lastError: null,
        failureCode: null,
        repairable: false,
        retryCount: { increment: 1 },
      },
    });
    return { ok: true };
  }

  const planParsed = row.planSnapshot ? safeParseBlogControlPanelPlan(row.planSnapshot) : null;
  if (!planParsed.success || !planParsed.plan) {
    return { ok: false, error: "plan_snapshot_required" };
  }

  await prisma.blogArticleGenerationJob.update({
    where: { id: jobId },
    data: {
      stage: "queued",
      lastError: null,
      failureCode: null,
      retryCount: { increment: 1 },
    },
  });
  safeServerLog("admin", "blog_article_generation_job_retry_queued", { jobId });

  const claimed = await claimBlogArticleGenerationJob(jobId);
  if (!claimed) return { ok: false, error: "claim_failed" };

  const result = await runBlogArticleGenerationPipeline(input, {
    persist: true,
    idempotencyKey: `${jobId}:retry`,
    initialPlan: planParsed.plan,
    initialBodyHtml: row.bodyHtmlSnapshot ?? undefined,
    onProgressStage: async (stage) => {
      await logJobStage(jobId, stage);
    },
  });

  if (!result.ok) {
    const repairable = failureRepairable(result);
    await logJobStage(jobId, "failed");
    await prisma.blogArticleGenerationJob.update({
      where: { id: jobId },
      data: {
        lastError: result.error.slice(0, 12_000),
        failureCode: result.code ?? result.stage,
        repairable,
        planSnapshot: result.plan ? (result.plan as unknown as Prisma.InputJsonValue) : undefined,
        bodyHtmlSnapshot: result.bodyHtml ?? undefined,
      },
    });
    safeServerLog("admin", "blog_article_generation_job_stage", { jobId, stage: "failed" });
    return { ok: false, error: result.error };
  }

  if (!result.persist || result.persistSkipped) {
    await logJobStage(jobId, "failed");
    await prisma.blogArticleGenerationJob.update({
      where: { id: jobId },
      data: { lastError: "retry_missing_persist", repairable: false, failureCode: "PERSIST_MISSING" },
    });
    return { ok: false, error: "persist_missing" };
  }

  const p = result.persist.post;
  await logJobStage(jobId, "published");
  await prisma.blogArticleGenerationJob.update({
    where: { id: jobId },
    data: {
      stage: "published",
      resultSlug: p.slug,
      resultTitle: p.title,
      resultPostStatus: p.postStatus,
      resultWarnings: result.persist.warnings as unknown as Prisma.InputJsonValue,
      blogPostId: p.id,
      lastError: null,
      failureCode: null,
      repairable: false,
      planSnapshot: result.plan as unknown as Prisma.InputJsonValue,
      bodyHtmlSnapshot: result.bodyHtml,
    },
  });
  return { ok: true };
}

export async function tickBlogArticleGenerationJob(jobId: string): Promise<{
  ok: boolean;
  claimed: boolean;
  ran: boolean;
  error?: string;
}> {
  const claimed = await claimBlogArticleGenerationJob(jobId);
  if (!claimed) {
    const j = await prisma.blogArticleGenerationJob.findUnique({ where: { id: jobId } });
    if (!j) return { ok: false, claimed: false, ran: false, error: "not_found" };
    if (j.stage !== "queued") return { ok: true, claimed: false, ran: false };
    return { ok: false, claimed: false, ran: false, error: "concurrent_claim" };
  }
  const out = await runClaimedBlogArticleGenerationJob(jobId);
  return { ok: out.ok, claimed: true, ran: true, error: out.error };
}

/** Cron: process the oldest queued job (one per invocation). */
export async function pumpBlogArticleGenerationJobs(): Promise<{
  processed: boolean;
  jobId?: string;
  ok?: boolean;
  error?: string;
}> {
  const job = await prisma.blogArticleGenerationJob.findFirst({
    where: { stage: "queued" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!job) return { processed: false };
  const tick = await tickBlogArticleGenerationJob(job.id);
  return { processed: tick.ran, jobId: job.id, ok: tick.ok, error: tick.error };
}
