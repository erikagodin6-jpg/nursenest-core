import { ContentStatus } from "@prisma/client";

/** Map Prisma `ContentStatus` enum to production DB lowercase strings on `content_items` / `exam_questions`. */
export function contentStatusToDb(status: ContentStatus): string {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return "published";
    case ContentStatus.DRAFT:
      return "draft";
    case ContentStatus.IN_REVIEW:
      return "in_review";
    case ContentStatus.ARCHIVED:
      return "archived";
    default:
      return "draft";
  }
}
