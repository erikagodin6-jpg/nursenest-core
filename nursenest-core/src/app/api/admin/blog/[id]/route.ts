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
  type BlogAdminPublishLogInput,
} from "@/lib/blog/blog-admin-publish-log";
import { stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
import {
  logMarkFailed,
  logPublishBlocked,
  logPublishSucceeded,
} from "@/lib/admin/blog-content-automation-log";
import {
  blogPrePublishValidationSelect,
  mergeBlogPostForPrePublishPatch,
  type BlogPostPrePublishPayload,
  type PrePublishPatch,
  validateBlogPrePublish,
} from "@/lib/blog/blog-pre-publish-validation";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import {
  isCanonicalBlogPublishVisibilityError,
  publishBlogPostCanonical,
} from "@/lib/blog/publish-blog-post-canonical";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { classifyBlogCorpus, collectClassificationViolations } from "@/lib/taxonomy/content-write-taxonomy";

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
  /** When pre-publish returns warnings only, set true to proceed with publish_now or schedule. */
  acknowledgePrePublishWarnings: z.boolean().optional(),
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
  careerSlug: true,
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
  scheduledAt: true,
} as const;

type Props = { params: Promise<{ id: string }> };

function partialPrePublishFromPatch(d: z.infer<typeof patchSchema>): Partial<PrePublishPatch> {
  const p: Partial<PrePublishPatch> = {};
  if (d.slug !== undefined) p.slug = d.slug;
  if (d.title !== undefined) p.title = d.title;
  if (d.excerpt !== undefined) p.excerpt = d.excerpt;
  if (d.body !== undefined) p.body = d.body;
  if (d.seoTitle !== undefined) p.seoTitle = d.seoTitle;
  if (d.seoDescription !== undefined) p.seoDescription = d.seoDescription;
  if (d.metaTitleVariant !== undefined) p.metaTitleVariant = d.metaTitleVariant;
  if (d.metaDescriptionVariant !== undefined) p.metaDescriptionVariant = d.metaDescriptionVariant;
  if (d.requiresReferences !== undefined) p.requiresReferences = d.requiresReferences;
  if (d.apaReferences !== undefined) p.apaReferences = d.apaReferences;
  if (d.sourcesJson !== undefined) p.sourcesJson = d.sourcesJson;
  if (d.internalLinkPlan !== undefined) p.internalLinkPlan = d.internalLinkPlan;
  if (d.outlineJson !== undefined) p.outlineJson = d.outlineJson;
  if (d.faqBlock !== undefined) p.faqBlock = d.faqBlock;
  if (d.schemaSummary !== undefined) p.schemaSummary = d.schemaSummary;
  if (d.coverImage !== undefined) p.coverImage = d.coverImage;
  if (d.coverImageAlt !== undefined) p.coverImageAlt = d.coverImageAlt;
  if (d.coverImageCaption !== undefined) p.coverImageCaption = d.coverImageCaption;
  if (d.coverImagePrompt !== undefined) p.coverImagePrompt = d.coverImagePrompt;
  if (d.imageStatus !== undefined) p.imageStatus = d.imageStatus;
  if (d.exam !== undefined) p.exam = d.exam;
  if (d.category !== undefined) p.category = d.category;
  if (d.tags !== undefined) p.tags = d.tags;
  if (d.postTemplate !== undefined) p.postTemplate = d.postTemplate;
  return p;
}

export async function GET(req: Request, { params }: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: adminBlogPostSelect });
  if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  return NextResponse.json({ post });
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
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (process.env.NODE_ENV !== "production") {
    const keys =
      rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
        ? Object.keys(rawBody as Record<string, unknown>)
        : [];
    console.info("[admin-blog PATCH] incoming keys", keys);
  }
  const parsed = patchSchema.safeParse(rawBody);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[admin-blog PATCH] zod failed", parsed.error.flatten(), parsed.error.issues);
    }
    return NextResponse.json(
      {
        error: "Invalid payload",
        details: parsed.error.flatten(),
        validationIssues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
          code: i.code,
        })),
      },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const where = { id };
  const current = await prisma.blogPost.findUnique({
    where,
    select: {
      ...blogPrePublishValidationSelect,
      adminPublishLog: true,
      publishAt: true,
      scheduledAt: true,
    },
  });
  if (!current) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  let bodyForUpdate: string | undefined;
  if (d.action === "publish_now") {
    bodyForUpdate = stripBrokenOrEmptyImagesFromHtml(d.body ?? current.body);
  } else if (d.body !== undefined) {
    bodyForUpdate = d.body;
  }

  if (d.slug !== undefined) {
    const clash = await prisma.blogPost.findFirst({
      where: { slug: d.slug, NOT: { id } },
      select: { id: true },
    });
    if (clash) {
      return NextResponse.json({ error: "That slug is already used by another post" }, { status: 409 });
    }
  }

  const logQueue: BlogAdminPublishLogInput[] = [];
  const now = new Date();

  const runPrePublishGate = async (): Promise<NextResponse | null> => {
    const { adminPublishLog, ...postSlice } = current;
    const mergePatch: Partial<PrePublishPatch> = {
      ...partialPrePublishFromPatch(d),
      ...(d.action === "publish_now" && bodyForUpdate ? { body: bodyForUpdate } : {}),
    };
    const merged = mergeBlogPostForPrePublishPatch(postSlice as unknown as BlogPostPrePublishPayload, mergePatch);
    const prePublish = await validateBlogPrePublish(merged, id);
    if (!prePublish.okToPublish) {
      const nextLog = appendBlogAdminPublishLog(adminPublishLog, {
        level: "error",
        event: "publish_blocked",
        message: "Publish blocked — pre-publish validation failed",
        detail: {
          prePublish: {
            blocking: prePublish.blocking,
            warnings: prePublish.warnings.slice(0, 20),
          },
        },
      });
      await prisma.blogPost.update({ where, data: { adminPublishLog: nextLog } });
      await logPublishBlocked({
        blogPostId: current.id,
        title: current.title,
        reasons: prePublish.blocking.map((i) => i.message),
        createdById: gate.admin.userId,
      });
      return NextResponse.json(
        {
          error: "Publish blocked — fix validation issues.",
          prePublish,
          reasons: prePublish.blocking.map((i) => i.message),
        },
        { status: 422 },
      );
    }
    if (prePublish.hasWarnings && !d.acknowledgePrePublishWarnings) {
      return NextResponse.json(
        {
          error: "Pre-publish warnings — review and acknowledge to continue.",
          prePublish,
          needsAcknowledgement: true,
          reasons: prePublish.warnings.map((w) => w.message),
        },
        { status: 422 },
      );
    }
    return null;
  };

  type ActionPatch = {
    postStatus?: BlogPostStatus;
    publishAt?: Date | null;
    workflowStatus?: BlogWorkflowStatus;
  };
  let actionPatch: ActionPatch = {};

  if (d.action === "publish_now") {
    const taxonomyTouchPublish =
      d.title !== undefined || d.body !== undefined || d.tags !== undefined || d.category !== undefined;
    if (taxonomyTouchPublish) {
      const mergedTitle = d.title ?? current.title;
      const mergedBody = bodyForUpdate ?? current.body;
      const mergedTags = d.tags ?? current.tags;
      const mergedCategory = d.category !== undefined ? d.category : current.category;
      const blogTax = classifyBlogCorpus({
        title: mergedTitle,
        body: mergedBody,
        category: mergedCategory,
        tags: mergedTags,
      });
      const viol = collectClassificationViolations(blogTax);
      if (viol.length > 0) {
        return NextResponse.json(
          { error: "Taxonomy classifier rejected merged content", violations: viol, code: "taxonomy_invalid" },
          { status: 422 },
        );
      }
      if (d.category !== undefined && d.category !== null && d.category !== blogTax.category) {
        return NextResponse.json(
          {
            error: "category does not match classifier output",
            code: "taxonomy_override_mismatch",
            expected: blogTax.category,
          },
          { status: 422 },
        );
      }
    }

    const blocked = await runPrePublishGate();
    if (blocked) return blocked;

    const companionUpdate: Prisma.BlogPostUpdateInput = {
      ...(d.targetKeyword !== undefined ? { targetKeyword: d.targetKeyword } : {}),
      ...(d.keywordCluster !== undefined ? { keywordCluster: d.keywordCluster } : {}),
      ...(d.intent !== undefined ? { intent: d.intent } : {}),
      ...(d.funnelStage !== undefined ? { funnelStage: d.funnelStage } : {}),
      ...(d.titleAlternates !== undefined ? { titleAlternates: d.titleAlternates } : {}),
      ...(d.keyTakeaways !== undefined ? { keyTakeaways: d.keyTakeaways } : {}),
      ...(d.relatedLessonPaths !== undefined ? { relatedLessonPaths: d.relatedLessonPaths } : {}),
      ...(d.featuredSnippet !== undefined ? { featuredSnippet: d.featuredSnippet } : {}),
      ...(d.keyQuestions !== undefined ? { keyQuestions: d.keyQuestions } : {}),
      ...(d.reviewDueAt !== undefined ? { reviewDueAt: d.reviewDueAt ? new Date(d.reviewDueAt) : null } : {}),
      ...(d.lastReviewedAt !== undefined ? { lastReviewedAt: d.lastReviewedAt ? new Date(d.lastReviewedAt) : null } : {}),
    };

    try {
      await publishBlogPostCanonical({
        postId: id,
        publishAt: now,
        clearScheduledAt: true,
        context: "admin_patch_publish_now",
        acknowledgePrePublishWarnings: Boolean(d.acknowledgePrePublishWarnings),
        prePublishMerge: {
          ...partialPrePublishFromPatch(d),
          ...(bodyForUpdate ? { body: bodyForUpdate } : {}),
        },
        companionUpdate,
        extraLogEntries: [{ level: "info", event: "published", message: "Post published live." }],
      });
    } catch (e) {
      safeServerLog("admin", "blog_publish_now_failed", {
        postId: id,
        error: e instanceof Error ? e.message : String(e),
        visibility_json: isCanonicalBlogPublishVisibilityError(e) ? JSON.stringify(e.failure) : "",
      });
      if (isCanonicalBlogPublishVisibilityError(e)) {
        return NextResponse.json(
          {
            error: "Published row failed public visibility checks — post was not left in a false-published state.",
            visibility: e.failure,
          },
          { status: 502 },
        );
      }
      if (e instanceof Error && e.message.includes("publishBlogPostCanonical: pre-publish")) {
        return NextResponse.json({ error: e.message }, { status: 422 });
      }
      throw e;
    }

    const updatedEarly = await prisma.blogPost.findUnique({ where, select: adminBlogPostSelect });
    if (!updatedEarly) {
      return NextResponse.json({ error: "Blog post not found after publish" }, { status: 500 });
    }
    await logPublishSucceeded({
      blogPostId: updatedEarly.id,
      title: updatedEarly.title,
      slug: updatedEarly.slug,
      createdById: gate.admin.userId,
    });
    return NextResponse.json({ post: updatedEarly });
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
    const schedGate = await runPrePublishGate();
    if (schedGate) return schedGate;
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
    d.action === "submit_for_review" || d.action === "approve" || d.action === "mark_failed"
      ? actionPatch.workflowStatus
      : d.workflowStatus !== undefined
        ? d.workflowStatus
        : undefined;

  const taxonomyTouch =
    d.title !== undefined || d.body !== undefined || d.tags !== undefined || d.category !== undefined;
  let categoryForUpdate: string | null | undefined;
  if (taxonomyTouch) {
    const mergedTitle = d.title ?? current.title;
    const mergedBody = bodyForUpdate ?? current.body;
    const mergedTags = d.tags ?? current.tags;
    const mergedCategory = d.category !== undefined ? d.category : current.category;
    const blogTax = classifyBlogCorpus({
      title: mergedTitle,
      body: mergedBody,
      category: mergedCategory,
      tags: mergedTags,
    });
    const viol = collectClassificationViolations(blogTax);
    if (viol.length > 0) {
      return NextResponse.json(
        { error: "Taxonomy classifier rejected merged content", violations: viol, code: "taxonomy_invalid" },
        { status: 422 },
      );
    }
    if (d.category !== undefined && d.category !== null && d.category !== blogTax.category) {
      return NextResponse.json(
        {
          error: "category does not match classifier output",
          code: "taxonomy_override_mismatch",
          expected: blogTax.category,
        },
        { status: 422 },
      );
    }
    categoryForUpdate = blogTax.category;
  }

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
      ...(categoryForUpdate !== undefined ? { category: categoryForUpdate } : {}),
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

  if (d.action === "mark_failed") {
    const failMsg = d.failureReason?.trim() || "Marked as failed (incomplete draft or generation issue).";
    await logMarkFailed({
      blogPostId: updated.id,
      title: updated.title,
      reason: failMsg,
      createdById: gate.admin.userId,
    });
  }

  /**
   * ISR: `/blog` uses `revalidate` (see marketing blog index). Approving or toggling public visibility
   * must bust cache immediately — previously only publish/schedule/unpublish revalidated, so
   * bulk APPROVED posts stayed invisible until the hourly window.
   */
  const revalidateActions = new Set([
    "schedule",
    "unpublish",
    "revert_to_draft",
    "mark_failed",
    "approve",
    "reject_review",
    "submit_for_review",
  ]);
  const actionTriggersRevalidate = Boolean(d.action && revalidateActions.has(d.action));
  const wasPublicLive = blogPostIsLive(
    { postStatus: current.postStatus, publishAt: current.publishAt, scheduledAt: current.scheduledAt },
    now,
  );
  const nowPublicLive = blogPostIsLive(
    { postStatus: updated.postStatus, publishAt: updated.publishAt, scheduledAt: updated.scheduledAt },
    now,
  );
  const visibilityChanged = wasPublicLive !== nowPublicLive;
  const publishAtChanged =
    (current.publishAt?.getTime() ?? null) !== (updated.publishAt?.getTime() ?? null) ||
    (current.scheduledAt?.getTime() ?? null) !== (updated.scheduledAt?.getTime() ?? null);
  const shouldRevalidateSurfaces =
    actionTriggersRevalidate ||
    visibilityChanged ||
    (publishAtChanged && (updated.postStatus === BlogPostStatus.SCHEDULED || current.postStatus === BlogPostStatus.SCHEDULED));

  if (shouldRevalidateSurfaces) {
    try {
      revalidateBlogPublishingSurfaces({
        slug: updated.slug,
        alliedProfessionKey: updated.careerSlug ?? null,
        tags: updated.tags,
      });
    } catch (e) {
      safeServerLog("admin", "blog_patch_revalidate_failed", {
        message: e instanceof Error ? e.message : String(e),
        slug: updated.slug,
      });
    }
  }

  return NextResponse.json({ post: updated });
}

export async function DELETE(req: Request, { params }: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const row = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, postStatus: true, slug: true },
  });
  if (!row) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  if (row.postStatus === BlogPostStatus.PUBLISHED) {
    return NextResponse.json(
      { error: "Unpublish this post before deleting it from the library." },
      { status: 400 },
    );
  }
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true, deletedId: id, slug: row.slug });
}
