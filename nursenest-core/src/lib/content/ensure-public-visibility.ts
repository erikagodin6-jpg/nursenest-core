import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";

const BLOG_SLUG_SAFE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugifyForPublicBlog(raw: string, fallback: string): string {
  const base = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  const s = base.length >= 3 ? base : fallback;
  return BLOG_SLUG_SAFE.test(s) ? s : fallback;
}

/**
 * Normalizes blog upsert/create payloads so marketing imports do not persist **DRAFT** / future-only
 * schedule rows that never appear on `/blog`. Runs **before** Prisma `create` / `upsert` in seed scripts.
 *
 * Does **not** write to the database by itself — callers merge the returned fields into their payload.
 */
export function ensurePublicBlogPostVisibilityForSeed<T extends Record<string, unknown>>(
  row: T & {
    slug: string;
    title?: string;
    postStatus?: BlogPostStatus;
    publishAt?: Date | null;
    scheduledAt?: Date | null;
    workflowStatus?: BlogWorkflowStatus;
  },
): T & {
  slug: string;
  postStatus: BlogPostStatus;
  publishAt: Date;
  scheduledAt: Date | null;
  workflowStatus: BlogWorkflowStatus;
} {
  const now = new Date();
  let slug = row.slug.trim().toLowerCase();
  if (!BLOG_SLUG_SAFE.test(slug)) {
    const fb = `post-${Math.random().toString(36).slice(2, 10)}`;
    slug = slugifyForPublicBlog(typeof row.title === "string" ? row.title : slug, fb);
  }

  let postStatus = row.postStatus ?? BlogPostStatus.PUBLISHED;
  if (
    postStatus === BlogPostStatus.DRAFT ||
    postStatus === BlogPostStatus.NEEDS_REVIEW ||
    postStatus === BlogPostStatus.FAILED
  ) {
    postStatus = BlogPostStatus.PUBLISHED;
  }

  let publishAt = row.publishAt ?? null;
  if (publishAt == null) {
    publishAt = now;
  } else if (publishAt.getTime() > now.getTime()) {
    publishAt = now;
  }

  let scheduledAt = row.scheduledAt ?? null;
  if (scheduledAt != null && scheduledAt.getTime() > now.getTime()) {
    scheduledAt = now;
  }

  let workflowStatus = row.workflowStatus ?? BlogWorkflowStatus.PUBLISHED;
  if (
    workflowStatus === BlogWorkflowStatus.NEEDS_SOURCE_REVIEW ||
    workflowStatus === BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW ||
    workflowStatus === BlogWorkflowStatus.NEEDS_SEO_REVIEW ||
    workflowStatus === BlogWorkflowStatus.GENERATED ||
    workflowStatus === BlogWorkflowStatus.OUTLINE_READY ||
    workflowStatus === BlogWorkflowStatus.NEEDS_METADATA ||
    workflowStatus === BlogWorkflowStatus.NEEDS_REFERENCES
  ) {
    workflowStatus = BlogWorkflowStatus.PUBLISHED;
  }

  if (postStatus === BlogPostStatus.SCHEDULED) {
    postStatus = BlogPostStatus.PUBLISHED;
  }

  /**
   * Immediate **PUBLISHED** rows: clear `scheduledAt` so public list gates (`blogLiveWhere`) never
   * combine stale schedule metadata with PUBLISHED status.
   */
  if (postStatus === BlogPostStatus.PUBLISHED) {
    scheduledAt = null;
  }

  return {
    ...row,
    slug,
    postStatus,
    publishAt,
    scheduledAt,
    workflowStatus,
  } as T & {
    slug: string;
    postStatus: BlogPostStatus;
    publishAt: Date;
    scheduledAt: Date | null;
    workflowStatus: BlogWorkflowStatus;
  };
}
