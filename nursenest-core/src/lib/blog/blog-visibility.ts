import { BlogPostStatus, type Prisma } from "@prisma/client";

/** True when the post should render on public `/blog` (scheduled posts unlock at publishAt). */
export function blogPostIsLive(
  row: { postStatus: BlogPostStatus; publishAt: Date | null; scheduledAt?: Date | null },
  now: Date = new Date(),
): boolean {
  if (row.postStatus === BlogPostStatus.DRAFT) return false;
  if (row.postStatus === BlogPostStatus.NEEDS_REVIEW) return false;
  if (row.postStatus === BlogPostStatus.FAILED) return false;
  /**
   * Editorial **APPROVED** is treated as public-ready. Teams often stop after “Approve” without a second
   * “Publish now” click; excluding APPROVED hid large batches from `/blog` while PUBLISHED stayed rare.
   */
  if (row.postStatus === BlogPostStatus.APPROVED) return true;
  if (row.postStatus === BlogPostStatus.PUBLISHED) return true;
  if (row.postStatus === BlogPostStatus.SCHEDULED) {
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
  return {
    OR: [
      { postStatus: BlogPostStatus.PUBLISHED },
      { postStatus: BlogPostStatus.APPROVED },
      {
        AND: [
          { postStatus: BlogPostStatus.SCHEDULED },
          {
            OR: [
              { publishAt: { lte: now } },
              { scheduledAt: { lte: now } },
            ],
          },
        ],
      },
    ],
  };
}
