/**
 * Pure eligibility rules for {@link scripts/recover-blog-visibility-runner.mts} — no Prisma side effects.
 */
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { recoveryAuditSlugValid } from "@/lib/blog/blog-recovery-audit";

/** User spec: body longer than 800 words (strictly greater). */
export const RECOVER_BLOG_VISIBILITY_MIN_WORDS_EXCLUSIVE = 800;

/**
 * Workflow rows that may be promoted to `PUBLISHED` when content is long and post is already `PUBLISHED`/`APPROVED`.
 * Note: `BlogWorkflowStatus` has no `NEEDS_REVIEW` (that is {@link BlogPostStatus}); pipeline review stages map here.
 */
export const RECOVER_BLOG_VISIBILITY_SOURCE_WORKFLOWS: readonly BlogWorkflowStatus[] = [
  BlogWorkflowStatus.OUTLINE_READY,
  BlogWorkflowStatus.GENERATED,
  /** Closest editorial “needs review” stage on the workflow enum (user wording). */
  BlogWorkflowStatus.NEEDS_SEO_REVIEW,
];

export type RecoverBlogVisibilitySkipReason =
  | "wrong_post_status"
  | "wrong_workflow_status"
  | "failed_workflow"
  | "empty_or_invalid_slug"
  | "body_too_short"
  | "duplicate_slug";

export function classifyRecoverBlogVisibilityRow(args: {
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus | null;
  slug: string;
  body: string | null;
  duplicateSlug: boolean;
}): { ok: true } | { ok: false; reason: RecoverBlogVisibilitySkipReason } {
  if (args.duplicateSlug) return { ok: false, reason: "duplicate_slug" };
  if (args.postStatus !== BlogPostStatus.PUBLISHED && args.postStatus !== BlogPostStatus.APPROVED) {
    return { ok: false, reason: "wrong_post_status" };
  }
  const ws = args.workflowStatus;
  if (ws === BlogWorkflowStatus.FAILED_GENERATION || ws === BlogWorkflowStatus.FAILED_IMAGE) {
    return { ok: false, reason: "failed_workflow" };
  }
  if (!ws || !RECOVER_BLOG_VISIBILITY_SOURCE_WORKFLOWS.includes(ws)) {
    return { ok: false, reason: "wrong_workflow_status" };
  }
  const slug = args.slug?.trim() ?? "";
  if (!slug || !recoveryAuditSlugValid(slug)) {
    return { ok: false, reason: "empty_or_invalid_slug" };
  }
  const words = countWordsFromHtml(args.body ?? "");
  if (words <= RECOVER_BLOG_VISIBILITY_MIN_WORDS_EXCLUSIVE) {
    return { ok: false, reason: "body_too_short" };
  }
  return { ok: true };
}
