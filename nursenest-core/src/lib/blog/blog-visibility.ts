import { BlogPostStatus, type Prisma } from "@prisma/client";

/** True when the post should render on public `/blog` (scheduled posts unlock at publishAt). */
export function blogPostIsLive(
  row: { postStatus: BlogPostStatus; publishAt: Date | null },
  now: Date = new Date(),
): boolean {
  if (row.postStatus === BlogPostStatus.DRAFT) return false;
  if (row.postStatus === BlogPostStatus.NEEDS_REVIEW) return false;
  if (row.postStatus === BlogPostStatus.APPROVED) return false;
  if (row.postStatus === BlogPostStatus.FAILED) return false;
  if (row.postStatus === BlogPostStatus.PUBLISHED) return true;
  if (row.postStatus === BlogPostStatus.SCHEDULED) {
    return row.publishAt != null && row.publishAt.getTime() <= now.getTime();
  }
  return false;
}

/** Prisma filter for list/count/sitemap/tag queries. */
export function blogLiveWhere(now: Date = new Date()): Prisma.BlogPostWhereInput {
  return {
    OR: [
      { postStatus: BlogPostStatus.PUBLISHED },
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: { lte: now },
      },
    ],
  };
}
