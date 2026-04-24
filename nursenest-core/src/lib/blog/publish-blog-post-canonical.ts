import "server-only";

import {
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  type Prisma,
} from "@prisma/client";
import { appendBlogAdminPublishLog, type BlogAdminPublishLogInput } from "@/lib/blog/blog-admin-publish-log";
import {
  blogPrePublishValidationSelect,
  mergeBlogPostForPrePublishPatch,
  type BlogPostPrePublishPayload,
  type BlogPostPrePublishRow,
  type PrePublishPatch,
  validateBlogPrePublish,
} from "@/lib/blog/blog-pre-publish-validation";
import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import { stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
import { generateBlogSEOFromPostRow } from "@/lib/blog/blog-generate-seo";
import { clampSerpDescription, clampSerpTitle } from "@/lib/blog/blog-seo-package";
import { classifyBlogCorpus } from "@/lib/taxonomy/content-write-taxonomy";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getPublishedBlogPostBySlug } from "@/lib/blog/safe-blog-queries";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";

const canonicalPublishSelect = {
  ...blogPrePublishValidationSelect,
  adminPublishLog: true,
  publishAt: true,
  scheduledAt: true,
  careerSlug: true,
  legacySource: true,
} as const;

export type BlogCanonicalPublishContext =
  | "admin_patch_publish_now"
  | "control_panel_immediate"
  | "automation_engine"
  | "scheduler_auto_publish"
  | "scheduler_recover_overdue"
  | "bulk_chunk_blog_publish"
  | "script_promote_control_panel_drafts"
  | "recover_missed_blog_batch";

export type PublishBlogPostCanonicalInput = {
  postId: string;
  /** Canonical go-live instant (UTC) for SEO and list ordering. */
  publishAt: Date;
  /**
   * When true (default), clears `scheduledAt` so the row is not stuck in a hybrid schedule state.
   * Recovery paths that intentionally preserve `scheduledAt` should pass false.
   */
  clearScheduledAt?: boolean;
  context: BlogCanonicalPublishContext;
  /** When pre-publish returns warnings only, must be true to proceed (admin acknowledge). */
  acknowledgePrePublishWarnings?: boolean;
  /** Merged onto the current row for validation and for persisting merged scalar fields (slug, body, …). */
  prePublishMerge?: Partial<PrePublishPatch>;
  /**
   * Extra Prisma fields applied in the same update (intent, funnel, JSON blobs, etc.).
   * Must not set postStatus, workflowStatus, publishAt, scheduledAt, or adminPublishLog — canonical owns those.
   */
  companionUpdate?: Prisma.BlogPostUpdateInput;
  /** Appended after the canonical success log entry. */
  extraLogEntries?: BlogAdminPublishLogInput[];
  /** Default true: strip broken/empty images from merged body before validate + persist. */
  stripBrokenImagesFromBody?: boolean;
  /** Cron / batch callers revalidate once at the end with promoted slugs. */
  skipRevalidate?: boolean;
  /** When set and `legacySource` is empty, persists this marker (e.g. `control_panel_ai`). */
  setLegacySourceIfEmpty?: string;
};

export type PublishBlogPostCanonicalResult = {
  id: string;
  slug: string;
  title: string;
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus;
  publishAt: Date | null;
};

export type CanonicalBlogPublishVisibilityFailure = {
  postId: string;
  slug: string;
  postStatus: string;
  workflowStatus: string;
  publishAt: string | null;
  reasons: string[];
};

export class CanonicalBlogPublishVisibilityError extends Error {
  readonly failure: CanonicalBlogPublishVisibilityFailure;

  constructor(failure: CanonicalBlogPublishVisibilityFailure) {
    super(`Canonical blog publish visibility check failed: ${failure.reasons.join("; ")}`);
    this.name = "CanonicalBlogPublishVisibilityError";
    this.failure = failure;
  }
}

export function isCanonicalBlogPublishVisibilityError(e: unknown): e is CanonicalBlogPublishVisibilityError {
  return e instanceof CanonicalBlogPublishVisibilityError;
}

const FORBIDDEN_COMPANION_KEYS = new Set([
  "postStatus",
  "workflowStatus",
  "publishAt",
  "scheduledAt",
  "adminPublishLog",
]);

function assertCompanionSafe(companion: Prisma.BlogPostUpdateInput | undefined): void {
  if (!companion) return;
  for (const k of Object.keys(companion)) {
    if (FORBIDDEN_COMPANION_KEYS.has(k)) {
      throw new Error(`publishBlogPostCanonical: companionUpdate must not set "${k}"`);
    }
  }
}

/** Persist scalar fields that participate in pre-publish so DB matches the validated merge. */
function mergedRowToPersistedScalars(merged: BlogPostPrePublishRow): Prisma.BlogPostUpdateInput {
  return {
    slug: merged.slug,
    title: merged.title,
    excerpt: merged.excerpt,
    body: merged.body,
    exam: merged.exam,
    category: merged.category,
    tags: merged.tags,
    seoTitle: merged.seoTitle,
    seoDescription: merged.seoDescription,
    metaTitleVariant: merged.metaTitleVariant,
    metaDescriptionVariant: merged.metaDescriptionVariant,
    requiresReferences: merged.requiresReferences,
    apaReferences: merged.apaReferences,
    sourcesJson: merged.sourcesJson as Prisma.InputJsonValue,
    internalLinkPlan: merged.internalLinkPlan as Prisma.InputJsonValue,
    outlineJson: merged.outlineJson as Prisma.InputJsonValue,
    faqBlock: merged.faqBlock as Prisma.InputJsonValue,
    schemaSummary: merged.schemaSummary,
    coverImage: merged.coverImage,
    coverImageAlt: merged.coverImageAlt,
    coverImageCaption: merged.coverImageCaption,
    coverImagePrompt: merged.coverImagePrompt,
    imageStatus: merged.imageStatus,
    countryTarget: merged.countryTarget,
    postTemplate: merged.postTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED,
    targetKeyword: merged.targetKeyword,
    medicalRiskFlags: merged.medicalRiskFlags,
  };
}

async function verifyPublishedPostVisibleOrThrow(
  postId: string,
  slug: string,
  now: Date,
): Promise<void> {
  const row = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: {
      postStatus: true,
      workflowStatus: true,
      publishAt: true,
      scheduledAt: true,
    },
  });
  const reasons: string[] = [];
  if (!row) {
    reasons.push("row_missing_after_update");
  } else {
    if (row.postStatus !== BlogPostStatus.PUBLISHED) {
      reasons.push(`postStatus=${row.postStatus}`);
    }
    if (row.workflowStatus !== BlogWorkflowStatus.PUBLISHED) {
      reasons.push(`workflowStatus=${row.workflowStatus}`);
    }
    if (
      row.postStatus === BlogPostStatus.DRAFT ||
      row.postStatus === BlogPostStatus.NEEDS_REVIEW ||
      row.postStatus === BlogPostStatus.FAILED
    ) {
      reasons.push("terminal_non_live_postStatus");
    }
    const listed = await prisma.blogPost.count({
      where: { AND: [{ id: postId }, blogLiveWhere(now)] },
    });
    if (listed < 1) reasons.push("blogLiveWhere_excluded");
    const detail = await getPublishedBlogPostBySlug(slug);
    if (!detail || detail.id !== postId) {
      reasons.push("getPublishedBlogPostBySlug_null_or_mismatch");
    }
  }

  if (reasons.length === 0) return;

  const snap = row
    ? {
        postId,
        slug,
        postStatus: row.postStatus,
        workflowStatus: row.workflowStatus,
        publishAt: row.publishAt?.toISOString() ?? null,
        reasons,
      }
    : {
        postId,
        slug,
        postStatus: "(missing)",
        workflowStatus: "(missing)",
        publishAt: null,
        reasons,
      };

  safeServerLog("blog_publish", "admin_blog_publish_visibility_failed", {
    stage: "admin_blog_publish_visibility_failed",
    postId: snap.postId,
    slug: snap.slug,
    postStatus: snap.postStatus,
    workflowStatus: snap.workflowStatus,
    publishAt: snap.publishAt ?? "",
    reasons_json: JSON.stringify(snap.reasons),
  });

  throw new CanonicalBlogPublishVisibilityError(snap);
}

function runRevalidateSafe(input: PublishBlogPostCanonicalInput, slug: string, tags: string[], careerSlug: string | null) {
  if (input.skipRevalidate) {
    safeServerLog("blog_publish", "blog_revalidate_skipped_batch", {
      context: input.context,
      postId: input.postId,
      slug,
      note: "caller_will_batch_revalidate",
    });
    return;
  }
  try {
    revalidateBlogPublishingSurfaces({
      slug,
      alliedProfessionKey: careerSlug,
      tags,
    });
    safeServerLog("blog_publish", "blog_revalidate_published_surfaces", {
      context: input.context,
      postId: input.postId,
      slug,
      paths: ["/blog", `/blog/${slug}`],
    });
  } catch (e) {
    safeServerLog("blog_publish", "blog_revalidate_deferred", {
      context: input.context,
      postId: input.postId,
      slug,
      targets: ["/blog", `/blog/${slug}`],
      error: e instanceof Error ? e.message : String(e),
      hint: "Call GET /api/revalidate?path=/blog and /api/revalidate?path=/blog/{slug} from an authorized context if needed.",
    });
  }
}

/**
 * Single canonical path for making a blog post **live** as `PUBLISHED` + `workflowStatus=PUBLISHED`
 * with pre-publish validation, SEO backfill, post-publish visibility checks, and ISR busts.
 *
 * Do not set publish fields ad hoc — call this helper (or extend it) so `/blog` and `/blog/{slug}` stay aligned.
 */
export async function publishBlogPostCanonical(
  input: PublishBlogPostCanonicalInput,
): Promise<PublishBlogPostCanonicalResult> {
  assertCompanionSafe(input.companionUpdate);

  const clearScheduledAt = input.clearScheduledAt !== false;
  const stripBroken = input.stripBrokenImagesFromBody !== false;
  const now = new Date();

  const row = await prisma.blogPost.findUnique({
    where: { id: input.postId },
    select: canonicalPublishSelect,
  });
  if (!row) {
    throw new Error(`publishBlogPostCanonical: post not found (${input.postId})`);
  }

  const { adminPublishLog, ...preSlice } = row;
  let merged = mergeBlogPostForPrePublishPatch(preSlice as unknown as BlogPostPrePublishPayload, input.prePublishMerge ?? {});
  if (stripBroken) {
    merged = { ...merged, body: stripBrokenOrEmptyImagesFromHtml(merged.body) };
  }

  const blogTax = classifyBlogCorpus({
    title: merged.title,
    body: merged.body,
    category: merged.category,
    tags: merged.tags,
  });
  const categoryForSave = merged.category?.trim() ? merged.category : blogTax.category;
  const mergedForValidate = { ...merged, category: categoryForSave };

  const pre = await validateBlogPrePublish(mergedForValidate, input.postId);
  if (!pre.okToPublish) {
    throw new Error(
      `publishBlogPostCanonical: pre-publish blocked (${input.context}): ${pre.blocking.map((b) => b.message).join("; ")}`,
    );
  }
  if (pre.hasWarnings && !input.acknowledgePrePublishWarnings) {
    throw new Error(
      `publishBlogPostCanonical: pre-publish warnings must be acknowledged (${input.context}); pass acknowledgePrePublishWarnings: true`,
    );
  }

  const auto = generateBlogSEOFromPostRow({
    title: mergedForValidate.title,
    slug: mergedForValidate.slug,
    category: mergedForValidate.category,
    tags: mergedForValidate.tags,
    exam: mergedForValidate.exam,
    countryTarget: mergedForValidate.countryTarget,
  });
  const manualTitle = (mergedForValidate.seoTitle ?? mergedForValidate.metaTitleVariant ?? "").trim();
  const manualDesc = (mergedForValidate.seoDescription ?? mergedForValidate.metaDescriptionVariant ?? "").trim();
  const seoTitleFinal =
    manualTitle.length >= 3 ? mergedForValidate.seoTitle : clampSerpTitle(auto.seoTitle, 70);
  const seoDescFinal =
    manualDesc.length >= 50 ? mergedForValidate.seoDescription : clampSerpDescription(auto.metaDescription, 120, 155);
  const metaTitleVariantFinal =
    (mergedForValidate.metaTitleVariant?.trim()?.length ?? 0) >= 3
      ? mergedForValidate.metaTitleVariant
      : seoTitleFinal;
  const metaDescriptionVariantFinal =
    (mergedForValidate.metaDescriptionVariant?.trim()?.length ?? 0) >= 50
      ? mergedForValidate.metaDescriptionVariant
      : seoDescFinal;

  const mergedWithSeoRow: BlogPostPrePublishRow = {
    ...mergedForValidate,
    seoTitle: seoTitleFinal,
    seoDescription: seoDescFinal,
    metaTitleVariant: metaTitleVariantFinal,
    metaDescriptionVariant: metaDescriptionVariantFinal,
    postTemplate: mergedForValidate.postTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED,
  };

  const preAfterSeo = await validateBlogPrePublish(mergedWithSeoRow, input.postId);
  if (!preAfterSeo.okToPublish) {
    throw new Error(
      `publishBlogPostCanonical: post-SEO pre-publish blocked (${input.context}): ${preAfterSeo.blocking.map((b) => b.message).join("; ")}`,
    );
  }

  let nextLog = appendBlogAdminPublishLog(adminPublishLog, {
    level: "info",
    event: "canonical_published",
    message: "Canonical publish: PUBLISHED + workflow PUBLISHED with visibility verification.",
    detail: {
      context: input.context,
      publishAt: input.publishAt.toISOString(),
      clearScheduledAt,
    },
  });
  for (const e of input.extraLogEntries ?? []) {
    nextLog = appendBlogAdminPublishLog(nextLog, e);
  }

  const legacySourceNext =
    input.setLegacySourceIfEmpty && !(row.legacySource ?? "").trim()
      ? input.setLegacySourceIfEmpty
      : undefined;

  const data: Prisma.BlogPostUpdateInput = {
    ...mergedRowToPersistedScalars(mergedWithSeoRow),
    ...input.companionUpdate,
    postStatus: BlogPostStatus.PUBLISHED,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
    publishAt: input.publishAt,
    ...(clearScheduledAt ? { scheduledAt: null } : {}),
    adminPublishLog: nextLog,
    ...(legacySourceNext ? { legacySource: legacySourceNext } : {}),
  };

  await prisma.blogPost.update({
    where: { id: input.postId },
    data,
  });

  await verifyPublishedPostVisibleOrThrow(input.postId, mergedWithSeoRow.slug, now);

  const out = await prisma.blogPost.findUnique({
    where: { id: input.postId },
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      workflowStatus: true,
      publishAt: true,
      tags: true,
      careerSlug: true,
    },
  });
  if (!out) {
    throw new Error("publishBlogPostCanonical: row missing after successful update");
  }

  runRevalidateSafe(input, out.slug, out.tags, out.careerSlug ?? null);

  return {
    id: out.id,
    slug: out.slug,
    title: out.title,
    postStatus: out.postStatus,
    workflowStatus: out.workflowStatus,
    publishAt: out.publishAt,
  };
}
