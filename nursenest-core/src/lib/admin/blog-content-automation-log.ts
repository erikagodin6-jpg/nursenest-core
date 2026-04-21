import { ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";
import { createContentAutomationLogSafe } from "@/lib/admin/content-automation-log";
import type { BlogSimpleAiDraftBody } from "@/lib/admin/blog-simple-ai-draft-schema";
import type { AutomationResult } from "@/lib/blog/blog-automation-engine";
import type { GenerateBlogAiDraftResult } from "@/lib/blog/generate-blog-ai-draft";
import { summarizeBrokenInternalLessonLinks } from "@/lib/blog/blog-automation-internal-links";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";

export const BLOG_AUTOMATION_LOG_JOB_TYPES = {
  GENERATE_AI: "generate_ai",
  GENERATE_AI_LEGACY: "legacy_generate_ai",
  GENERATE_LOCALIZED: "generate_localized",
  DRAFT_BATCH_ITEM: "draft_batch_item",
  UPGRADE_WEAK: "upgrade_weak",
} as const;

/** Control-panel pipeline + `/generate-ai` automation share this log entry shape. */
export type SimpleAiDraftLogResult = GenerateBlogAiDraftResult | AutomationResult;

export async function logSimpleAiDraftRun(opts: {
  createdById: string;
  body: BlogSimpleAiDraftBody;
  result: SimpleAiDraftLogResult;
  retryOfId?: string | null;
}): Promise<void> {
  const { createdById, body, result, retryOfId } = opts;
  const meta = { retryPayload: body };

  if (!result.ok) {
    await createContentAutomationLogSafe({
      category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
      jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_AI,
      status: ContentAutomationLogStatus.FAILED,
      topic: body.topic,
      summary: "AI draft generation error",
      error: result.error,
      metadata: meta,
      createdById,
      retryOfId: retryOfId ?? null,
    });
    return;
  }

  if (result.skipped) {
    await createContentAutomationLogSafe({
      category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
      jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_AI,
      status: ContentAutomationLogStatus.SKIPPED,
      topic: body.topic,
      summary: result.reason,
      error: result.reason === "duplicate_topic" ? `existing:${result.existingSlug ?? "?"}` : result.reason,
      metadata: {
        ...meta,
        existingSlug: result.existingSlug,
        normalizedTopic: "normalizedTopic" in result ? result.normalizedTopic : undefined,
      },
      blogPostId: null,
      createdById,
      retryOfId: retryOfId ?? null,
    });
    return;
  }

  const seoReadiness = "seoReadiness" in result ? result.seoReadiness : undefined;
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
    jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_AI,
    status: ContentAutomationLogStatus.SUCCEEDED,
    topic: body.topic,
    summary: result.post.slug,
    error: seoReadiness?.publishHeldAsDraft ? "publish_withheld_seo_quality" : null,
    metadata: { ...meta, seoReadiness },
    blogPostId: result.post.id,
    createdById,
    retryOfId: retryOfId ?? null,
  });
}

export async function logDraftBatchItemRun(opts: {
  batchId: string;
  itemId: string;
  ordinal: number;
  topicRaw: string;
  outcome: "completed" | "failed" | "skipped";
  blogPostId?: string | null;
  message?: string | null;
  createdById?: string | null;
}): Promise<void> {
  const st =
    opts.outcome === "completed" ? ContentAutomationLogStatus.SUCCEEDED
    : opts.outcome === "failed" ? ContentAutomationLogStatus.FAILED
    : ContentAutomationLogStatus.SKIPPED;

  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_AI_BATCH_ITEM,
    jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.DRAFT_BATCH_ITEM,
    status: st,
    topic: opts.topicRaw,
    summary: `batch ${opts.batchId.slice(0, 8)}… #${opts.ordinal + 1}`,
    error: opts.message ?? null,
    metadata: { ordinal: opts.ordinal, batchId: opts.batchId },
    blogPostId: opts.blogPostId ?? null,
    correlationId: opts.batchId,
    sourceItemId: opts.itemId,
    createdById: opts.createdById ?? null,
  });
}

export async function logLocalizedGenerationRun(opts: {
  createdById: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  status: "SUCCEEDED" | "FAILED" | "SKIPPED";
  summary: string;
  error?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  const status =
    opts.status === "FAILED" ? ContentAutomationLogStatus.FAILED
    : opts.status === "SKIPPED" ? ContentAutomationLogStatus.SKIPPED
    : ContentAutomationLogStatus.SUCCEEDED;

  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
    jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_LOCALIZED,
    status,
    topic: `localized:${opts.locale}/${opts.region}`,
    summary: opts.summary.slice(0, 480),
    error: opts.error?.slice(0, 4000) ?? null,
    metadata: {
      canonicalArticleId: opts.canonicalArticleId,
      locale: opts.locale,
      region: opts.region,
      ...(opts.metadata ?? {}),
    },
    blogPostId: opts.canonicalArticleId,
    createdById: opts.createdById,
  });
}

export async function logInternalLinkCheck(opts: {
  topic: string;
  blogPostId?: string | null;
  plan: Pick<BlogControlPanelPlan, "suggestedInternalLessons">;
  source: "control_panel_pipeline" | "control_panel_persist";
  createdById?: string | null;
}): Promise<void> {
  const broken = summarizeBrokenInternalLessonLinks(opts.plan.suggestedInternalLessons);
  if (broken.length === 0) return;

  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_INTERNAL_LINK_CHECK,
    jobType: opts.source,
    status: ContentAutomationLogStatus.WARNING,
    topic: opts.topic,
    summary: `${broken.length} internal path issue(s)`,
    error: broken.map((b) => `${b.path} (${b.pathStatus})`).join("; ").slice(0, 4000),
    metadata: { brokenLinks: broken },
    blogPostId: opts.blogPostId ?? null,
    createdById: opts.createdById ?? null,
  });
}

export async function logReferenceGate(opts: {
  topic: string;
  message: string;
  riskFlags?: string[];
  source: "persist_draft" | "control_panel_pipeline";
  createdById?: string | null;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_REFERENCE_GATE,
    jobType: opts.source,
    status: ContentAutomationLogStatus.FAILED,
    topic: opts.topic,
    summary: "Missing or insufficient references",
    error: opts.message.slice(0, 4000),
    metadata: { riskFlags: opts.riskFlags ?? [] },
    createdById: opts.createdById ?? null,
  });
}

export async function logControlPanelPipelineFailure(opts: {
  topic: string;
  stage: string;
  message: string;
  createdById?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
    jobType: `pipeline_${opts.stage}`,
    status: ContentAutomationLogStatus.FAILED,
    topic: opts.topic,
    summary: opts.stage,
    error: opts.message.slice(0, 4000),
    metadata: opts.metadata ?? null,
    createdById: opts.createdById ?? null,
  });
}

export async function logControlPanelPipelineSuccess(opts: {
  topic: string;
  blogPostId: string;
  slug: string;
  plan: BlogControlPanelPlan;
  createdById?: string | null;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
    jobType: "pipeline_persisted",
    status: ContentAutomationLogStatus.SUCCEEDED,
    topic: opts.topic,
    summary: opts.slug,
    error: null,
    metadata: { slug: opts.slug },
    blogPostId: opts.blogPostId,
    createdById: opts.createdById ?? null,
  });
  await logInternalLinkCheck({
    topic: opts.topic,
    blogPostId: opts.blogPostId,
    plan: opts.plan,
    source: "control_panel_pipeline",
    createdById: opts.createdById ?? null,
  });
}

export async function logControlPanelPersistSkipped(opts: {
  topic: string;
  reason: string;
  existingSlug?: string;
  createdById?: string | null;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
    jobType: "persist_skipped",
    status: ContentAutomationLogStatus.SKIPPED,
    topic: opts.topic,
    summary: opts.reason,
    error: opts.existingSlug ? `existing:${opts.existingSlug}` : opts.reason,
    createdById: opts.createdById ?? null,
  });
}

export async function logControlPanelPersistFailure(opts: {
  topic: string;
  code: string;
  message: string;
  createdById?: string | null;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
    jobType: opts.code.toLowerCase(),
    status: ContentAutomationLogStatus.FAILED,
    topic: opts.topic,
    summary: opts.code,
    error: opts.message.slice(0, 4000),
    createdById: opts.createdById ?? null,
  });
}

export async function logControlPanelPersistSuccess(opts: {
  topic: string;
  blogPostId: string;
  slug: string;
  plan: BlogControlPanelPlan;
  createdById?: string | null;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
    jobType: "persist_draft",
    status: ContentAutomationLogStatus.SUCCEEDED,
    topic: opts.topic,
    summary: opts.slug,
    blogPostId: opts.blogPostId,
    createdById: opts.createdById ?? null,
  });
  await logInternalLinkCheck({
    topic: opts.topic,
    blogPostId: opts.blogPostId,
    plan: opts.plan,
    source: "control_panel_persist",
    createdById: opts.createdById ?? null,
  });
}

export async function logPublishBlocked(opts: {
  blogPostId: string;
  title: string;
  reasons: string[];
  createdById: string;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_PUBLISH_BLOCKED,
    jobType: "publish_now",
    status: ContentAutomationLogStatus.FAILED,
    topic: opts.title,
    summary: "Publish blocked",
    error: opts.reasons.join(" | ").slice(0, 4000),
    metadata: { reasons: opts.reasons },
    blogPostId: opts.blogPostId,
    createdById: opts.createdById,
  });
}

export async function logPublishSucceeded(opts: {
  blogPostId: string;
  title: string;
  slug: string;
  createdById: string;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_PUBLISH,
    jobType: "publish_now",
    status: ContentAutomationLogStatus.SUCCEEDED,
    topic: opts.title,
    summary: opts.slug,
    blogPostId: opts.blogPostId,
    createdById: opts.createdById,
  });
}

export async function logPipelinePersistSkipped(opts: {
  topic: string;
  reason: string;
  existingSlug?: string;
  normalizedTopic?: string;
  createdById: string;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
    jobType: "pipeline_persist_skipped",
    status: ContentAutomationLogStatus.SKIPPED,
    topic: opts.topic,
    summary: opts.reason,
    error: opts.existingSlug ? `existing:${opts.existingSlug}` : opts.reason,
    metadata: { normalizedTopic: opts.normalizedTopic },
    createdById: opts.createdById,
  });
}

export async function logPipelineDuplicateTopic(opts: {
  topic: string;
  existingSlug: string;
  createdById: string;
  source: "control_panel_generate" | "persist_draft";
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
    jobType: `duplicate_topic_${opts.source}`,
    status: ContentAutomationLogStatus.SKIPPED,
    topic: opts.topic,
    summary: "Duplicate canonical topic",
    error: `existing:${opts.existingSlug}`,
    metadata: { existingSlug: opts.existingSlug },
    createdById: opts.createdById,
  });
}

export async function logMarkFailed(opts: {
  blogPostId: string;
  title: string;
  reason: string;
  createdById: string;
}): Promise<void> {
  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_MARK_FAILED,
    jobType: "mark_failed",
    status: ContentAutomationLogStatus.FAILED,
    topic: opts.title,
    summary: "Marked failed",
    error: opts.reason.slice(0, 4000),
    blogPostId: opts.blogPostId,
    createdById: opts.createdById,
  });
}

export async function logWeakUpgradeRun(opts: {
  createdById: string;
  status: "SUCCEEDED" | "FAILED" | "SKIPPED";
  summary: string;
  error?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  const status =
    opts.status === "FAILED" ? ContentAutomationLogStatus.FAILED
    : opts.status === "SKIPPED" ? ContentAutomationLogStatus.SKIPPED
    : ContentAutomationLogStatus.SUCCEEDED;

  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
    jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.UPGRADE_WEAK,
    status,
    topic: "weak_post_upgrade",
    summary: opts.summary.slice(0, 480),
    error: opts.error?.slice(0, 4000) ?? null,
    metadata: opts.metadata ?? null,
    createdById: opts.createdById,
  });
}
