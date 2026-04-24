import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";

/** Workflows that must never appear on public blog lists, detail SEO, or sitemap slices. */
const BLOG_WORKFLOW_FAILURES: BlogWorkflowStatus[] = [
  BlogWorkflowStatus.FAILED_GENERATION,
  BlogWorkflowStatus.FAILED_IMAGE,
];

/**
 * When `postStatus` is **PUBLISHED** or **SCHEDULED**, require workflow to have cleared the editorial
 * pipeline so auto-generated drafts do not leak onto `/blog` after a partial save.
 */
const BLOG_WORKFLOW_PIPELINE_IN_PROGRESS: BlogWorkflowStatus[] = [
  BlogWorkflowStatus.GENERATED,
  BlogWorkflowStatus.OUTLINE_READY,
  BlogWorkflowStatus.NEEDS_SOURCE_REVIEW,
  BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW,
  BlogWorkflowStatus.NEEDS_SEO_REVIEW,
  BlogWorkflowStatus.NEEDS_METADATA,
  BlogWorkflowStatus.NEEDS_REFERENCES,
];

/** Optional filters for public index/tag queries (see {@link buildBlogPublicListWhere}). */
export type BlogPublicListScope = {
  locale?: string;
  careerSlug?: string;
  exam?: string;
};

/**
 * Builds the Prisma `where` for public blog lists (`/blog`, scoped hubs) using {@link blogLiveWhere}
 * plus optional locale/career/exam scope.
 *
 * - Omits empty `{}` fragments inside `AND` (clearer for Prisma and avoids accidental strict matching).
 * - When `careerSlug` or `exam` is scoped, rows with **NULL** in that column still match (global posts).
 */
export function buildBlogPublicListWhere(now: Date, scope?: BlogPublicListScope): Prisma.BlogPostWhereInput {
  const parts: Prisma.BlogPostWhereInput[] = [blogLiveWhere(now)];
  /**
   * Optional: keep the global `/blog` index to **global** rows only (no `careerSlug`), while scoped hubs
   * and sitemap still surface career-tagged posts. Set `BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS=1`.
   */
  if (
    process.env.BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS === "1" &&
    !scope?.careerSlug &&
    !scope?.locale &&
    !scope?.exam
  ) {
    parts.push({ OR: [{ careerSlug: null }, { careerSlug: "" }] });
  }
  if (scope?.locale) parts.push({ locale: scope.locale });
  if (scope?.careerSlug) {
    parts.push({ OR: [{ careerSlug: scope.careerSlug }, { careerSlug: null }] });
  }
  if (scope?.exam) {
    parts.push({ OR: [{ exam: scope.exam }, { exam: null }] });
  }
  return { AND: parts };
}

function workflowIsFailed(ws: BlogWorkflowStatus | null | undefined): boolean {
  return ws != null && BLOG_WORKFLOW_FAILURES.includes(ws);
}

/** Matches {@link blogLiveWhere} `workflowReleasedForTimedPosts` (PUBLISHED / due SCHEDULED). */
function workflowReleasedForPublicTimedPost(ws: BlogWorkflowStatus | null | undefined): boolean {
  if (ws == null) return true;
  return !BLOG_WORKFLOW_FAILURES.includes(ws) && !BLOG_WORKFLOW_PIPELINE_IN_PROGRESS.includes(ws);
}

/** True when the post should render on public `/blog` (scheduled posts unlock at publishAt). */
export function blogPostIsLive(
  row: {
    postStatus: BlogPostStatus;
    publishAt: Date | null;
    scheduledAt?: Date | null;
    workflowStatus?: BlogWorkflowStatus | null;
  },
  now: Date = new Date(),
): boolean {
  if (row.postStatus === BlogPostStatus.DRAFT) return false;
  if (row.postStatus === BlogPostStatus.NEEDS_REVIEW) return false;
  if (row.postStatus === BlogPostStatus.FAILED) return false;
  /**
   * Editorial **APPROVED** is treated as public-ready. Teams often stop after “Approve” without a second
   * “Publish now” click; excluding APPROVED hid large batches from `/blog` while PUBLISHED stayed rare.
   */
  if (row.postStatus === BlogPostStatus.APPROVED) {
    return !workflowIsFailed(row.workflowStatus);
  }
  /**
   * **PUBLISHED** is live only when there is no future `publishAt` embargo (null publishAt = live).
   * Aligns with {@link blogLiveWhere} and SQL `sqlBlogLiveWhere` used by diagnostics counts.
   */
  if (row.postStatus === BlogPostStatus.PUBLISHED) {
    if (!workflowReleasedForPublicTimedPost(row.workflowStatus)) return false;
    if (row.publishAt == null) return true;
    return row.publishAt.getTime() <= now.getTime();
  }
  if (row.postStatus === BlogPostStatus.SCHEDULED) {
    if (!workflowReleasedForPublicTimedPost(row.workflowStatus)) return false;
    const gate = row.publishAt ?? row.scheduledAt ?? null;
    return gate != null && gate.getTime() <= now.getTime();
  }
  return false;
}

/** True when list/metadata should treat the row as public (draft-like statuses excluded; live gate). */
export function isBlogPostMarketingMetaVisible(
  meta: { postStatus: BlogPostStatus; publishAt: Date | null; scheduledAt: Date | null },
  now: Date = new Date(),
): boolean {
  if (
    meta.postStatus === BlogPostStatus.DRAFT ||
    meta.postStatus === BlogPostStatus.NEEDS_REVIEW ||
    meta.postStatus === BlogPostStatus.FAILED
  ) {
    return false;
  }
  return blogPostIsLive(meta, now);
}

/** Prisma filter for list/count/sitemap/tag queries. */
export function blogLiveWhere(now: Date = new Date()): Prisma.BlogPostWhereInput {
  const workflowNeverPublic: Prisma.BlogPostWhereInput = {
    workflowStatus: { notIn: BLOG_WORKFLOW_FAILURES },
  };
  const workflowReleasedForTimedPosts: Prisma.BlogPostWhereInput = {
    workflowStatus: { notIn: [...BLOG_WORKFLOW_FAILURES, ...BLOG_WORKFLOW_PIPELINE_IN_PROGRESS] },
  };
  return {
    OR: [
      {
        AND: [
          { postStatus: BlogPostStatus.PUBLISHED },
          {
            OR: [{ publishAt: null }, { publishAt: { lte: now } }],
          },
          workflowReleasedForTimedPosts,
        ],
      },
      {
        AND: [{ postStatus: BlogPostStatus.APPROVED }, workflowNeverPublic],
      },
      {
        AND: [
          { postStatus: BlogPostStatus.SCHEDULED },
          {
            OR: [
              { publishAt: { lte: now } },
              { scheduledAt: { lte: now } },
            ],
          },
          workflowReleasedForTimedPosts,
        ],
      },
    ],
  };
}
