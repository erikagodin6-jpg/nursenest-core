/**
 * TEMP / diagnostics: canonical `BlogPost` public visibility reasons (default `/blog/*`).
 * Enable with `BLOG_PUBLIC_SKIP_TRACE=1`. Does not log unless that env is set.
 */
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import type { BlogPost } from "@prisma/client";

const FAILED_WORKFLOWS: BlogWorkflowStatus[] = [
  BlogWorkflowStatus.FAILED_GENERATION,
  BlogWorkflowStatus.FAILED_IMAGE,
];

const PIPELINE_IN_PROGRESS: BlogWorkflowStatus[] = [
  BlogWorkflowStatus.GENERATED,
  BlogWorkflowStatus.OUTLINE_READY,
  BlogWorkflowStatus.NEEDS_SOURCE_REVIEW,
  BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW,
  BlogWorkflowStatus.NEEDS_SEO_REVIEW,
  BlogWorkflowStatus.NEEDS_METADATA,
  BlogWorkflowStatus.NEEDS_REFERENCES,
];

export type BlogPublicLiveRow = Pick<
  BlogPost,
  "postStatus" | "publishAt" | "scheduledAt" | "workflowStatus" | "slug" | "locale" | "careerSlug" | "exam"
>;

/** Single-line machine reason for why {@link blogPostIsLive} is false (canonical marketing blog). */
export function describeCanonicalBlogNotLiveReason(row: BlogPublicLiveRow, now: Date): string {
  if (row.postStatus === BlogPostStatus.DRAFT) return "post_status_draft";
  if (row.postStatus === BlogPostStatus.NEEDS_REVIEW) return "post_status_needs_review";
  if (row.postStatus === BlogPostStatus.FAILED) return "post_status_failed";
  if (row.postStatus === BlogPostStatus.APPROVED) {
    /** `blogPostIsLive` is false for APPROVED only when workflow is a terminal failure. */
    if (row.workflowStatus != null && FAILED_WORKFLOWS.includes(row.workflowStatus)) {
      return `approved_workflow_terminal_failure:${row.workflowStatus}`;
    }
    return "approved_invariant_not_live";
  }
  if (row.postStatus === BlogPostStatus.PUBLISHED) {
    if (row.workflowStatus !== BlogWorkflowStatus.PUBLISHED) {
      return `published_workflow_not_published:${row.workflowStatus ?? "null"}`;
    }
    if (row.publishAt != null && row.publishAt.getTime() > now.getTime()) {
      return "published_future_publish_at_embargo";
    }
    return "published_invariant_not_live";
  }
  if (row.postStatus === BlogPostStatus.SCHEDULED) {
    if (row.workflowStatus != null && FAILED_WORKFLOWS.includes(row.workflowStatus)) {
      return `scheduled_workflow_failed:${row.workflowStatus}`;
    }
    if (row.workflowStatus != null && PIPELINE_IN_PROGRESS.includes(row.workflowStatus)) {
      return `scheduled_workflow_pipeline_in_progress:${row.workflowStatus}`;
    }
    const gate = row.publishAt ?? row.scheduledAt ?? null;
    if (gate == null) return "scheduled_missing_publish_and_schedule_gate";
    if (gate.getTime() > now.getTime()) return "scheduled_future_gate";
    return "scheduled_invariant_not_live";
  }
  return `post_status_unhandled:${row.postStatus}`;
}
