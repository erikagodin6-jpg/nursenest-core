/**
 * Pure helpers for `scripts/audit-hidden-blogs-runner.mts` — dry-run classification without side effects.
 */
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import type { PrePublishValidationResult } from "@/lib/blog/blog-pre-publish-validation";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Audit script floor (product pre-publish may still require {@link BLOG_ARTICLE_MIN_WORDS}). */
export const RECOVERY_AUDIT_DEFAULT_MIN_WORDS = 900;

export type RecoveryAuditBucket =
  | "READY_TO_PUBLISH"
  | "NEEDS_REVIEW"
  | "BLOCKED"
  | "ORPHANED"
  | "FAILED_OR_PENDING_GENERATION"
  | "LIVE";

export type RecoveryAuditBlogRowInput = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus | null;
  publishAt: Date | null;
  scheduledAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  category: string | null;
  /** Optional provenance (filters only in runner). */
  legacySource?: string | null;
};

export function recoveryAuditWordCount(body: string): number {
  return countWordsFromHtml(body ?? "");
}

export function recoveryAuditSlugValid(slug: string): boolean {
  const s = slug.trim();
  return s.length > 0 && s.length <= 200 && SLUG_RE.test(s);
}

export function classifyBlogRowForRecoveryAudit(args: {
  row: RecoveryAuditBlogRowInput;
  duplicateSlug: boolean;
  prePublish: PrePublishValidationResult | null;
  now: Date;
  minWordFloor: number;
}): { bucket: RecoveryAuditBucket; reasons: string[]; isPublicLive: boolean } {
  const { row, duplicateSlug, prePublish, now, minWordFloor } = args;
  const isPublicLive = blogPostIsLive(
    {
      postStatus: row.postStatus,
      publishAt: row.publishAt,
      scheduledAt: row.scheduledAt,
      workflowStatus: row.workflowStatus,
    },
    now,
  );
  if (isPublicLive) {
    return { bucket: "LIVE", reasons: ["matches_blogPostIsLive"], isPublicLive: true };
  }
  if (!row.slug?.trim()) {
    return { bucket: "BLOCKED", reasons: ["missing_slug"], isPublicLive: false };
  }
  if (!recoveryAuditSlugValid(row.slug)) {
    return { bucket: "BLOCKED", reasons: ["invalid_slug_format"], isPublicLive: false };
  }
  if (duplicateSlug) {
    return { bucket: "BLOCKED", reasons: ["duplicate_slug_in_database"], isPublicLive: false };
  }
  if (!row.title?.trim()) {
    return { bucket: "BLOCKED", reasons: ["missing_title"], isPublicLive: false };
  }
  if (!row.body?.trim()) {
    return { bucket: "BLOCKED", reasons: ["missing_body"], isPublicLive: false };
  }
  const wc = recoveryAuditWordCount(row.body);
  if (wc < minWordFloor) {
    return {
      bucket: "NEEDS_REVIEW",
      reasons: [`body_below_audit_min_words:${wc}<${minWordFloor}`],
      isPublicLive: false,
    };
  }
  const metaMissing = !(row.seoDescription?.trim() || row.excerpt?.trim());
  if (!prePublish) {
    return {
      bucket: "NEEDS_REVIEW",
      reasons: ["prepublish_not_evaluated"],
      isPublicLive: false,
    };
  }
  if (!prePublish.okToPublish) {
    const ids = prePublish.blocking.map((b) => b.id).join(",");
    const reasons = [`prepublish_blocking:${ids}`];
    if (metaMissing) reasons.push("missing_meta_description_and_excerpt");
    return { bucket: "NEEDS_REVIEW", reasons, isPublicLive: false };
  }
  if (metaMissing) {
    return {
      bucket: "NEEDS_REVIEW",
      reasons: ["prepublish_ok_but_missing_meta_description_and_excerpt"],
      isPublicLive: false,
    };
  }
  return {
    bucket: "READY_TO_PUBLISH",
    reasons: ["prepublish_ok_not_public_live_visibility_only"],
    isPublicLive: false,
  };
}
