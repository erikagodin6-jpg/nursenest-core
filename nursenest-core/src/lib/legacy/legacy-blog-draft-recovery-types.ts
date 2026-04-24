/**
 * Legacy / export blog recovery for `scripts/legacy/*-legacy-blogs-drafts.mts`.
 * Prefer JSON v1 export; DB-driven audit always scans current drafts and scheduled rows.
 */

import type { BlogPostStatus, BlogPostTemplate, BlogWorkflowStatus, CountryCode } from "@prisma/client";

/** Import row from sanitized legacy JSON (version 1). */
export type LegacyBlogExportRow = {
  slug: string;
  title: string;
  body: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  exam?: string;
  countryTarget?: CountryCode;
  postTemplate?: BlogPostTemplate;
  legacySource?: string;
  /** When true, recovery may replace body if LEGACY_IMPORT_OVERWRITE_BLOG_BODY=1 on importer */
  seoTitle?: string;
  seoDescription?: string;
};

export type LegacyBlogExportV1 = {
  version: 1;
  posts?: LegacyBlogExportRow[];
};

export type BlogRecoveryChangeLogEntry = {
  entity: "blog_post";
  id: string;
  action: "update" | "create";
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

export type BlogDraftRecoveryAuditReport = {
  totalExportPosts: number;
  currentDraftsFound: number;
  currentScheduledFound: number;
  currentWorkflowPromotableFound: number;
  legacyPostsMissingFromDb: number;
  postsBlockedByVerification: number;
  /** One line per blocked post id (bounded in script output) */
  blockedSamples: Array<{ id: string; slug: string; reasons: string[] }>;
  postsSafeToPublish: number;
  duplicateSlugConflicts: number;
  postsWithEmptyOrThinBody: number;
  postsWithBrokenInternalLinks: number;
  postsMissingMetaTitleOrDescription: number;
  postsByCategory: Record<string, number>;
  postsByTemplate: Record<string, number>;
  postsByTopicTag: Record<string, number>;
};

export type BlogDraftRecoveryPipelineOptions = {
  apply: boolean;
  emergencySeoPublish: boolean;
  overwriteBlogBody: boolean;
};

export type BlogDraftRecoveryImportResult = {
  dryRun: boolean;
  changes: BlogRecoveryChangeLogEntry[];
  errors: string[];
  audit: BlogDraftRecoveryAuditReport;
};

export function parseLegacyBlogExportV1Json(text: string): LegacyBlogExportV1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!parsed || typeof parsed !== "object") throw new Error("Export root must be an object");
  const root = parsed as Record<string, unknown>;
  if (root.version !== 1) throw new Error('Export "version" must be 1');
  const posts = Array.isArray(root.posts) ? (root.posts as LegacyBlogExportRow[]) : [];
  return { version: 1, posts };
}
