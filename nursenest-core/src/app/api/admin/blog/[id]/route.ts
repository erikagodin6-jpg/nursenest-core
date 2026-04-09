import {
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  Prisma,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  appendBlogAdminPublishLogMany,
  appendBlogAdminPublishLog,
  type BlogAdminPublishLogEntry,
} from "@/lib/blog/blog-admin-publish-log";
import { stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
import { evaluateBlogPublishReadiness, type BlogPublishReadinessRow } from "@/lib/blog/blog-publish-readiness";
import { prisma } from "@/lib/db";

const slugSchema = z
  .string()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case (lowercase letters, numbers, hyphens)");

const patchSchema = z.object({
  /** URL slug; must stay unique. */
  slug: slugSchema.optional(),
  title: z.string().min(3).max(220).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  body: z.string().min(20).optional(),
  exam: z.string().max(80).nullable().optional(),
  category: z.string().max(120).nullable().optional(),
  tags: z.array(z.string().min(1).max(80)).max(20).optional(),
  seoTitle: z.string().max(220).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  targetKeyword: z.string().max(200).nullable().optional(),
  keywordCluster: z.string().max(200).nullable().optional(),
  intent: z.nativeEnum(BlogPostIntent).nullable().optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).nullable().optional(),
  workflowStatus: z.nativeEnum(BlogWorkflowStatus).optional(),
  coverImage: z.string().url().nullable().optional(),
  coverImageAlt: z.string().max(240).nullable().optional(),
  coverImageCaption: z.string().max(300).nullable().optional(),
  coverImagePrompt: z.string().max(2000).nullable().optional(),
  imageStatus: z.nativeEnum(BlogImageStatus).optional(),
  apaReferences: z.array(z.string().max(600)).max(40).optional(),
  requiresReferences: z.boolean().optional(),
  sourcesJson: z.unknown().optional(),
  reviewDueAt: z.string().datetime().nullable().optional(),
  lastReviewedAt: z.string().datetime().nullable().optional(),
  postStatus: z.nativeEnum(BlogPostStatus).optional(),
  publishAt: z.string().datetime().nullable().optional(),
  action: z
    .enum([
      "publish_now",
      "unpublish",
      "schedule",
      "revert_to_draft",
      "submit_for_review",
      "approve",
      "reject_review",
      "mark_failed",
    ])
    .optional(),
  /** Shown in admin log when action is mark_failed */
  failureReason: z.string().max(2000).optional(),
  postTemplate: z.nativeEnum(BlogPostTemplate).nullable().optional(),
  titleAlternates: z.array(z.string().max(220)).max(8).optional(),
  keyTakeaways: z.array(z.string().max(500)).max(16).optional(),
  relatedLessonPaths: z.array(z.string().max(500)).max(40).optional(),
  featuredSnippet: z.string().max(4000).nullable().optional(),
  metaTitleVariant: z.string().max(220).nullable().optional(),
  metaDescriptionVariant: z.string().max(500).nullable().optional(),
  schemaSummary: z.string().max(8000).nullable().optional(),
  outlineJson: z.unknown().optional(),
  faqBlock: z.unknown().optional(),
  internalLinkPlan: z.unknown().optional(),
  keyQuestions: z.array(z.string().max(400)).max(20).optional(),
});

const adminBlogPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  exam: true,
  postStatus: true,
  publishAt: true,
  seoTitle: true,
  seoDescription: true,
  targetKeyword: true,
  keywordCluster: true,
  countryTarget: true,
  intent: true,
  funnelStage: true,
  postTemplate: true,
  workflowStatus: true,
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
  coverImage: true,
  coverImageAlt: true,
  coverImageCaption: true,
  coverImagePrompt: true,
  imageStatus: true,
  requiresReferences: true,
  sourcesJson: true,
  medicalRiskFlags: true,
  sourceReliabilityScore: true,
  category: true,
  adminPublishLog: true,
} as const;

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: adminBlogPostSelect });
  if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  return NextResponse.json({ post });
}

function mergedReadinessRow(
  current: {
    title: string;
    excerpt: string;
    body: string;
    slug: string;
    seoTitle: string | null;
    seoDescription: string | null;
    requiresReferences: boolean;
    apaReferences: string[];
  },
  d: z.infer<typeof patchSchema>,
): BlogPublishReadinessRow {
  return {
    title: d.title ?? current.title,
    excerpt: d.excerpt ?? current.excerpt,
    body: d.body ?? current.body,
    slug: d.slug ?? current.slug,
    seoTitle: d.seoTitle !== undefined ? d.seoTitle : current.seoTitle,
    seoDescription: d.seoDescription !== undefined ? d.seoDescription : current.seoDescription,
    requiresReferences: d.requiresReferences !== undefined ? d.requiresReferences : current.requiresReferences,
    apaReferences: d.apaReferences ?? current.apaReferences,
  };
}

function contentFieldsTouched(d: z.infer<typeof patchSchema>): boolean {
  return (
    d.slug !== undefined ||
    d.title !== undefined ||
    d.excerpt !== undefined ||
    d.body !== undefined ||
    d.seoTitle !== undefined ||
    d.seoDescription !== undefined ||
    d.apaReferences !== undefined ||
    d.outlineJson !== undefined ||
    d.faqBlock !== undefined ||
    d.internalLinkPlan !== undefined ||
    d.titleAlternates !== undefined ||
    d.keyTakeaways !== undefined ||
    d.relatedLessonPaths !== undefined ||
    d.schemaSummary !== undefined ||
    d.featuredSnippet !== undefined ||
    d.metaTitleVariant !== undefined ||
    d.metaDescriptionVariant !== undefined ||
    d.keyQuestions !== undefined
  );
}

export async function PATCH(req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const where = { id };
  const current = await prisma.blogPost.findUnique({
    where,
    select: {
      id: true,
      adminPublishLog: true,
      title: true,
      excerpt: true,
      body: true,
      slug: true,
      seoTitle: true,
      seoDescription: true,
      requiresReferences: true,
      apaReferences: true,
      postStatus: true,
    },
  });
  if (!current) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  if (d.slug !== undefined) {
    const clash = await prisma.blogPost.findFirst({
      where: { slug: d.slug, NOT: { id } },
      select: { id: true },
    });
    if (clash) {
      return NextResponse.json({ error: "That slug is already used by another post" }, { status: 409 });
    }
  }

  const logQueue: { level?: "info" | "warn" | "error"; event: string; message: string; detail?: Record<string, unknown> }[] =
    [];
  const now = new Date();

  type ActionPatch = {
    postStatus?: BlogPostStatus;
    publishAt?: Date | null;
    workflowStatus?: BlogWorkflowStatus;
  };
  let actionPatch: ActionPatch = {};

  if (d.action === "publish_now") {
    const readiness = evaluateBlogPublishReadiness(mergedReadinessRow(current, d));
    if (!readiness.ok) {
      const nextLog = appendBlogAdminPublishLog(current.adminPublishLog, {
        level: "error",
        event: "publish_blocked",
        message: "Publish blocked — fix validation issues",
        detail: { reasons: readiness.reasons },
      });
      await prisma.blogPost.update({ where, data: { adminPublishLog: nextLog } });
      return NextResponse.json(
        { error: "Publish blocked — content is not ready to go live.", reasons: readiness.reasons },
        { status: 422 },
      );
    }
    const prevBody = d.body ?? current.body;
    actionPatch = {
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: now,
      workflowStatus: BlogWorkflowStatus.PUBLISHED,
    };
    logQueue.push({ level: "info", event: "published", message: "Post published live." });
  } else if (d.action === "unpublish") {
    actionPatch = { postStatus: BlogPostStatus.DRAFT };
    logQueue.push({ level: "warn", event: "unpublished", message: "Post unpublished to draft." });
  } else if (d.action === "revert_to_draft") {
    actionPatch = { postStatus: BlogPostStatus.DRAFT, publishAt: null };
    logQueue.push({ level: "info", event: "revert_draft", message: "Reverted to draft (schedule cleared)." });
  } else if (d.action === "schedule") {
    if (!d.publishAt) {
      return NextResponse.json({ error: "schedule requires publishAt (ISO datetime)" }, { status: 400 });
    }
    if (current.postStatus === BlogPostStatus.PUBLISHED) {
      return NextResponse.json({ error: "Cannot schedule a post that is already published — unpublish first." }, { status: 400 });
    }
    const when = new Date(d.publishAt);
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json({ error: "Invalid publishAt" }, { status: 400 });
    }
    actionPatch = { postStatus: BlogPostStatus.SCHEDULED, publishAt: when };
    logQueue.push({
      level: "info",
      event: "scheduled",
      message: `Scheduled for ${when.toISOString()}`,
    });
  } else if (d.action === "submit_for_review") {
    if (current.postStatus === BlogPostStatus.PUBLISHED) {
      return NextResponse.json({ error: "Published posts cannot be submitted for review." }, { status: 400 });
    }
    if (current.postStatus !== BlogPostStatus.NEEDS_REVIEW) {
      actionPatch = {
        postStatus: BlogPostStatus.NEEDS_REVIEW,
        workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
      };
      logQueue.push({ level: "info", event: "submit_for_review", message: "Submitted for editorial review." });
    }
  } else if (d.action === "approve") {
    if (current.postStatus === BlogPostStatus.PUBLISHED) {
      return NextResponse.json({ error: "Post is already published." }, { status: 400 });
    }
    if (current.postStatus !== BlogPostStatus.APPROVED) {
      actionPatch = { postStatus: BlogPostStatus.APPROVED, workflowStatus: BlogWorkflowStatus.APPROVED };
      logQueue.push({ level: "info", event: "approved", message: "Approved — ready to schedule or publish." });
    }
  } else if (d.action === "reject_review") {
    if (current.postStatus !== BlogPostStatus.NEEDS_REVIEW) {
      return NextResponse.json({ error: "Only posts in needs review can be rejected back to draft." }, { status: 400 });
    }
    actionPatch = { postStatus: BlogPostStatus.DRAFT };
    logQueue.push({ level: "warn", event: "review_rejected", message: "Review rejected — returned to draft." });
  } else if (d.action === "mark_failed") {
    if (current.postStatus === BlogPostStatus.PUBLISHED) {
      return NextResponse.json({ error: "Unpublish before marking a live post as failed." }, { status: 400 });
    }
    actionPatch = {
      postStatus: BlogPostStatus.FAILED,
      workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
      publishAt: null,
    };
    const msg = d.failureReason?.trim() || "Marked as failed (incomplete draft or generation issue).";
    logQueue.push({
      level: "error",
      event: "marked_failed",
      message: msg.slice(0, 500),
      detail: d.failureReason?.trim() ? { reason: d.failureReason.trim().slice(0, 2000) } : undefined,
    });
  }

  let bodyForUpdate: string | undefined;
  if (d.action === "publish_now") {
    bodyForUpdate = stripBrokenOrEmptyImagesFromHtml(d.body ?? current.body);
  } else if (d.body !== undefined) {
    bodyForUpdate = d.body;
  }

  const effectivePostStatus: BlogPostStatus | undefined =
    d.action !== undefined && actionPatch.postStatus !== undefined
      ? actionPatch.postStatus
      : d.action === undefined && d.postStatus !== undefined
        ? d.postStatus
        : undefined;

  let effectivePublishAt: Date | null | undefined;
  if (d.action === "schedule") {
    effectivePublishAt = actionPatch.publishAt;
  } else if (d.action === "revert_to_draft" || d.action === "mark_failed") {
    effectivePublishAt = actionPatch.publishAt ?? null;
  } else if (d.action === "publish_now") {
    effectivePublishAt = now;
  } else if (d.publishAt !== undefined) {
    effectivePublishAt = d.publishAt ? new Date(d.publishAt) : null;
  } else {
    effectivePublishAt = undefined;
  }

  if (!d.action && d.postStatus !== undefined && d.postStatus !== current.postStatus) {
    logQueue.push({
      level: "info",
      event: "post_status_changed",
      message: `postStatus set to ${d.postStatus}`,
    });
  }

  if (!d.action && contentFieldsTouched(d)) {
    logQueue.push({ level: "info", event: "content_saved", message: "Draft content saved." });
  }

  let adminPublishLogUpdate: Prisma.InputJsonValue | undefined;
  if (logQueue.length > 0) {
    adminPublishLogUpdate = appendBlogAdminPublishLogMany(current.adminPublishLog, logQueue);
  }

  const workflowStatusUpdate =
    d.action === "publish_now" ||
    d.action === "submit_for_review" ||
    d.action === "approve" ||
    d.action === "mark_failed"
      ? actionPatch.workflowStatus
      : d.workflowStatus !== undefined
        ? d.workflowStatus
        : undefined;

  const updated = await prisma.blogPost.update({
    where,
    data: {
      ...(effectivePostStatus !== undefined ? { postStatus: effectivePostStatus } : {}),
      ...(effectivePublishAt !== undefined ? { publishAt: effectivePublishAt } : {}),
      ...(workflowStatusUpdate !== undefined ? { workflowStatus: workflowStatusUpdate } : {}),
      ...(adminPublishLogUpdate !== undefined ? { adminPublishLog: adminPublishLogUpdate } : {}),
      ...(d.slug !== undefined ? { slug: d.slug } : {}),
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.excerpt !== undefined ? { excerpt: d.excerpt } : {}),
      ...(bodyForUpdate !== undefined ? { body: bodyForUpdate } : {}),
      ...(d.exam !== undefined ? { exam: d.exam } : {}),
      ...(d.category !== undefined ? { category: d.category } : {}),
      ...(d.tags !== undefined ? { tags: d.tags } : {}),
      ...(d.seoTitle !== undefined ? { seoTitle: d.seoTitle } : {}),
      ...(d.seoDescription !== undefined ? { seoDescription: d.seoDescription } : {}),
      ...(d.targetKeyword !== undefined ? { targetKeyword: d.targetKeyword } : {}),
      ...(d.keywordCluster !== undefined ? { keywordCluster: d.keywordCluster } : {}),
      ...(d.intent !== undefined ? { intent: d.intent } : {}),
      ...(d.funnelStage !== undefined ? { funnelStage: d.funnelStage } : {}),
      ...(d.coverImage !== undefined ? { coverImage: d.coverImage } : {}),
      ...(d.coverImageAlt !== undefined ? { coverImageAlt: d.coverImageAlt } : {}),
      ...(d.coverImageCaption !== undefined ? { coverImageCaption: d.coverImageCaption } : {}),
      ...(d.coverImagePrompt !== undefined ? { coverImagePrompt: d.coverImagePrompt } : {}),
      ...(d.imageStatus !== undefined ? { imageStatus: d.imageStatus } : {}),
      ...(d.apaReferences !== undefined ? { apaReferences: d.apaReferences } : {}),
      ...(d.requiresReferences !== undefined ? { requiresReferences: d.requiresReferences } : {}),
      ...(d.sourcesJson !== undefined
        ? { sourcesJson: d.sourcesJson === null ? Prisma.JsonNull : (d.sourcesJson as Prisma.InputJsonValue) }
        : {}),
      ...(d.reviewDueAt !== undefined ? { reviewDueAt: d.reviewDueAt ? new Date(d.reviewDueAt) : null } : {}),
      ...(d.lastReviewedAt !== undefined ? { lastReviewedAt: d.lastReviewedAt ? new Date(d.lastReviewedAt) : null } : {}),
      ...(d.postTemplate !== undefined ? { postTemplate: d.postTemplate } : {}),
      ...(d.titleAlternates !== undefined ? { titleAlternates: d.titleAlternates } : {}),
      ...(d.keyTakeaways !== undefined ? { keyTakeaways: d.keyTakeaways } : {}),
      ...(d.relatedLessonPaths !== undefined ? { relatedLessonPaths: d.relatedLessonPaths } : {}),
      ...(d.featuredSnippet !== undefined ? { featuredSnippet: d.featuredSnippet } : {}),
      ...(d.metaTitleVariant !== undefined ? { metaTitleVariant: d.metaTitleVariant } : {}),
      ...(d.metaDescriptionVariant !== undefined ? { metaDescriptionVariant: d.metaDescriptionVariant } : {}),
      ...(d.schemaSummary !== undefined ? { schemaSummary: d.schemaSummary } : {}),
      ...(d.keyQuestions !== undefined ? { keyQuestions: d.keyQuestions } : {}),
      ...(d.outlineJson !== undefined
        ? { outlineJson: d.outlineJson === null ? Prisma.JsonNull : (d.outlineJson as Prisma.InputJsonValue) }
        : {}),
      ...(d.faqBlock !== undefined
        ? { faqBlock: d.faqBlock === null ? Prisma.JsonNull : (d.faqBlock as Prisma.InputJsonValue) }
        : {}),
      ...(d.internalLinkPlan !== undefined
        ? {
            internalLinkPlan:
              d.internalLinkPlan === null ? Prisma.JsonNull : (d.internalLinkPlan as Prisma.InputJsonValue),
          }
        : {}),
    },
    select: adminBlogPostSelect,
  });

  return NextResponse.json({ post: updated });
}
