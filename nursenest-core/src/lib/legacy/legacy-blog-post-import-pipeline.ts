import type { PrismaClient } from "@prisma/client";
import { BlogPostStatus, BlogPostTemplate, BlogWorkflowStatus } from "@prisma/client";

import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import type { LegacyBlogPostExportRow, LegacyBlogPostExportV1 } from "@/lib/legacy/legacy-blog-post-export-types";
import {
  initialPostStatusForCreate,
  legacyBlogPostMissingPathoPharmClassificationReason,
  legacyBlogPostTitleHash,
  mergeLegacyBlogPostSource,
  mergePostStatusForUpdate,
  parseBlogPostTemplate,
  pickBlogBodyForImport,
  suggestPathoPharmClassificationFromContent,
  normalizeBlogSlug,
} from "@/lib/legacy/legacy-blog-post-import-merge";
import { textHasClinicalPathoPharmSignal } from "@/lib/blog/blog-patho-pharm-detection";

const DB_INDEX_LIMIT = 15_000;

export type BlogPostImportIndexRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  tags: string[];
  postTemplate: BlogPostTemplate | null;
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  legacySource: string | null;
  workflowStatus: BlogWorkflowStatus;
};

export type LegacyBlogPostAuditReport = {
  legacyBlogPostsFound: number;
  currentBlogPostsMatchedBySlug: number;
  currentBlogPostsMatchedByTitleHash: number;
  currentBlogPostsMissing: number;
  duplicateSlugCandidates: Array<{ slug: string; legacyIds: string[] }>;
  duplicateTitleHashCandidates: Array<{ titleHash: string; legacyIds: string[] }>;
  postsByCategory: Record<string, number>;
  postsByTemplate: Record<string, number>;
  postsByStatus: Record<string, number>;
  postsThatWouldBecomePublicVisible: number;
  pathoPharmDetected: number;
  pathoPharmMissingClassification: number;
};

export type LegacyBlogPostImportSummary = {
  dryRun: boolean;
  apply: boolean;
  wouldCreate: number;
  wouldUpdate: number;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ legacyId: string; message: string }>;
};

function countBy<T extends string | null | undefined>(
  rows: LegacyBlogPostExportRow[],
  pick: (r: LegacyBlogPostExportRow) => T,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = String(pick(r) ?? "(none)");
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function duplicateGroups(
  rows: LegacyBlogPostExportRow[],
  key: (r: LegacyBlogPostExportRow) => string,
  id: (r: LegacyBlogPostExportRow) => string,
): Array<{ key: string; legacyIds: string[] }> {
  const m = new Map<string, string[]>();
  for (const r of rows) {
    const k = key(r);
    const arr = m.get(k) ?? [];
    arr.push(id(r));
    m.set(k, arr);
  }
  const out: Array<{ key: string; legacyIds: string[] }> = [];
  for (const [k, ids] of m) {
    if (ids.length > 1) out.push({ key: k, legacyIds: ids });
  }
  return out;
}

async function loadBlogPostIndex(prisma: PrismaClient): Promise<{
  bySlug: Map<string, BlogPostImportIndexRow>;
  byTitleHash: Map<string, BlogPostImportIndexRow[]>;
}> {
  const rows = await prisma.blogPost.findMany({
    take: DB_INDEX_LIMIT,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      category: true,
      tags: true,
      postTemplate: true,
      postStatus: true,
      publishAt: true,
      scheduledAt: true,
      legacySource: true,
      workflowStatus: true,
    },
  });

  const bySlug = new Map<string, BlogPostImportIndexRow>();
  const byTitleHash = new Map<string, BlogPostImportIndexRow[]>();
  for (const r of rows) {
    const row: BlogPostImportIndexRow = { ...r };
    bySlug.set(r.slug.toLowerCase(), row);
    const h = legacyBlogPostTitleHash(r.title);
    const bucket = byTitleHash.get(h) ?? [];
    bucket.push(row);
    byTitleHash.set(h, bucket);
  }
  return { bySlug, byTitleHash };
}

function matchExisting(
  legacy: LegacyBlogPostExportRow,
  index: { bySlug: Map<string, BlogPostImportIndexRow>; byTitleHash: Map<string, BlogPostImportIndexRow[]> },
): { row: BlogPostImportIndexRow | null; match: "slug" | "titleHash" | null } {
  const slug = normalizeBlogSlug(legacy.slug);
  if (!slug) return { row: null, match: null };
  const bySlugHit = index.bySlug.get(slug);
  if (bySlugHit) return { row: bySlugHit, match: "slug" };

  const th = legacyBlogPostTitleHash(legacy.title);
  const bucket = index.byTitleHash.get(th) ?? [];
  const sameTitle = bucket.find((b) => b.title.trim().toLowerCase() === legacy.title.trim().toLowerCase());
  if (sameTitle) return { row: sameTitle, match: "titleHash" };
  return { row: null, match: null };
}

function mergeTags(existing: string[], incoming: string[]): string[] {
  const set = new Set<string>();
  for (const t of existing) {
    const x = t.trim();
    if (x) set.add(x);
  }
  for (const t of incoming) {
    const x = t.trim();
    if (x) set.add(x);
  }
  return Array.from(set);
}

export type MergePreview = {
  slug: string;
  title: string;
  body: string;
  excerpt: string;
  category: string | null;
  tags: string[];
  postTemplate: BlogPostTemplate | null;
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  legacySource: string | null;
};

export function buildMergedBlogPostPreview(input: {
  legacy: LegacyBlogPostExportRow;
  existing: BlogPostImportIndexRow | null;
  legacyImportOverwriteBody: boolean;
}): MergePreview {
  const { legacy, existing } = input;
  const normalizedLegacySlug = normalizeBlogSlug(legacy.slug) || legacy.slug.trim();
  const slug = existing?.slug ?? normalizedLegacySlug;

  const body = pickBlogBodyForImport({
    existingBody: existing?.body,
    legacyBody: legacy.body,
    legacyImportOverwriteBody: input.legacyImportOverwriteBody,
  });

  const excerpt = existing?.excerpt?.trim()
    ? existing.excerpt
    : (legacy.excerpt?.trim() ?? existing?.excerpt ?? "");

  let category = existing?.category?.trim() ? existing.category : null;
  if (!category?.trim() && legacy.category?.trim()) category = legacy.category;

  let tags = mergeTags(existing?.tags ?? [], legacy.tags ?? []);

  const legacyTpl = parseBlogPostTemplate(legacy.template);
  let postTemplate = legacyTpl ?? existing?.postTemplate ?? null;

  const patho = suggestPathoPharmClassificationFromContent({
    title: legacy.title,
    excerpt: excerpt || legacy.excerpt || "",
    body,
    category,
    tags,
    template: postTemplate,
  });
  if (patho) {
    postTemplate = patho.postTemplate;
    category = patho.category;
    tags = mergeTags(tags, patho.tagsToAdd);
  }

  let postStatus: BlogPostStatus;
  let publishAt: Date | null;
  let scheduledAt: Date | null = existing?.scheduledAt ?? null;

  if (existing) {
    const st = mergePostStatusForUpdate({
      existingStatus: existing.postStatus,
      existingPublishAt: existing.publishAt,
      legacyStatus: legacy.status,
      legacyPublishAtRaw: legacy.publishAt,
    });
    postStatus = st.postStatus;
    publishAt = st.publishAt;
  } else {
    const st = initialPostStatusForCreate({
      legacyStatus: legacy.status,
      legacyPublishAtRaw: legacy.publishAt,
    });
    postStatus = st.postStatus;
    publishAt = st.publishAt;
  }

  const legacySource = mergeLegacyBlogPostSource(existing?.legacySource, legacy.legacyId, legacy.legacySource);

  return {
    slug,
    title: legacy.title.trim() || existing?.title || slug,
    body,
    excerpt: excerpt || "",
    category,
    tags,
    postTemplate,
    postStatus,
    publishAt,
    scheduledAt,
    legacySource,
  };
}

export async function auditLegacyBlogPosts(
  prisma: PrismaClient,
  exportDoc: LegacyBlogPostExportV1,
  now: Date = new Date(),
): Promise<LegacyBlogPostAuditReport> {
  const index = await loadBlogPostIndex(prisma);
  const rows = exportDoc.blogPosts;

  let matchedSlug = 0;
  let matchedHash = 0;
  let missing = 0;

  for (const legacy of rows) {
    const { row, match } = matchExisting(legacy, index);
    if (match === "slug") matchedSlug += 1;
    else if (match === "titleHash") matchedHash += 1;
    else missing += 1;
    void row;
  }

  const slugDupes = duplicateGroups(rows, (r) => normalizeBlogSlug(r.slug) || r.slug, (r) => r.legacyId).map(
    (g) => ({ slug: g.key, legacyIds: g.legacyIds }),
  );
  const hashDupes = duplicateGroups(rows, (r) => legacyBlogPostTitleHash(r.title), (r) => r.legacyId).map((g) => ({
    titleHash: g.key,
    legacyIds: g.legacyIds,
  }));

  let wouldVisible = 0;
  let pathoDetected = 0;
  let pathoMissing = 0;

  for (const legacy of rows) {
    const { row } = matchExisting(legacy, index);
    const preview = buildMergedBlogPostPreview({
      legacy,
      existing: row,
      legacyImportOverwriteBody: false,
    });
    const workflowForLive = row?.workflowStatus ?? BlogWorkflowStatus.GENERATED;
    if (
      blogPostIsLive(
        {
          postStatus: preview.postStatus,
          publishAt: preview.publishAt,
          scheduledAt: preview.scheduledAt,
          workflowStatus: workflowForLive,
        },
        now,
      )
    ) {
      wouldVisible += 1;
    }
    const blob = `${legacy.title}\n${legacy.excerpt}\n${legacy.body}`.slice(0, 80_000);
    if (textHasClinicalPathoPharmSignal(blob)) pathoDetected += 1;
    const pathoGap = legacyBlogPostMissingPathoPharmClassificationReason({
      title: preview.title,
      excerpt: preview.excerpt,
      body: preview.body,
      category: preview.category,
      tags: preview.tags,
      template: preview.postTemplate,
    });
    if (pathoGap && pathoGap.length > 0) pathoMissing += 1;
  }

  return {
    legacyBlogPostsFound: rows.length,
    currentBlogPostsMatchedBySlug: matchedSlug,
    currentBlogPostsMatchedByTitleHash: matchedHash,
    currentBlogPostsMissing: missing,
    duplicateSlugCandidates: slugDupes,
    duplicateTitleHashCandidates: hashDupes,
    postsByCategory: countBy(rows, (r) => r.category),
    postsByTemplate: countBy(rows, (r) => r.template),
    postsByStatus: countBy(rows, (r) => r.status),
    postsThatWouldBecomePublicVisible: wouldVisible,
    pathoPharmDetected: pathoDetected,
    pathoPharmMissingClassification: pathoMissing,
  };
}

export async function importLegacyBlogPosts(
  prisma: PrismaClient,
  exportDoc: LegacyBlogPostExportV1,
  opts: { apply: boolean; legacyImportOverwriteBody: boolean },
): Promise<LegacyBlogPostImportSummary> {
  const summary: LegacyBlogPostImportSummary = {
    dryRun: !opts.apply,
    apply: opts.apply,
    wouldCreate: 0,
    wouldUpdate: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  const index = await loadBlogPostIndex(prisma);

  const removeRowFromTitleBuckets = (rowId: string) => {
    for (const [h, bucket] of index.byTitleHash.entries()) {
      const filtered = bucket.filter((b) => b.id !== rowId);
      if (filtered.length !== bucket.length) {
        if (filtered.length === 0) index.byTitleHash.delete(h);
        else index.byTitleHash.set(h, filtered);
      }
    }
  };

  const refreshRowInIndex = (updated: BlogPostImportIndexRow) => {
    removeRowFromTitleBuckets(updated.id);
    index.bySlug.set(updated.slug.toLowerCase(), updated);
    const th = legacyBlogPostTitleHash(updated.title);
    const next = index.byTitleHash.get(th) ?? [];
    next.push(updated);
    index.byTitleHash.set(th, next);
  };

  for (const legacy of exportDoc.blogPosts) {
    try {
      const slug = normalizeBlogSlug(legacy.slug);
      if (!slug) {
        summary.skipped += 1;
        summary.errors.push({ legacyId: legacy.legacyId, message: "empty slug" });
        continue;
      }

      const { row } = matchExisting(legacy, index);
      const preview = buildMergedBlogPostPreview({
        legacy,
        existing: row,
        legacyImportOverwriteBody: opts.legacyImportOverwriteBody,
      });

      if (row) {
        summary.wouldUpdate += 1;
      } else if (legacy.body?.trim()) {
        summary.wouldCreate += 1;
      } else {
        summary.skipped += 1;
        summary.errors.push({ legacyId: legacy.legacyId, message: "missing body for create" });
        continue;
      }

      if (!opts.apply) continue;

      if (row) {
        await prisma.blogPost.update({
          where: { id: row.id },
          data: {
            title: preview.title,
            body: preview.body,
            excerpt: preview.excerpt?.trim() ? preview.excerpt : row.excerpt,
            category: preview.category,
            tags: preview.tags,
            postTemplate: preview.postTemplate,
            postStatus: preview.postStatus,
            publishAt: preview.publishAt,
            legacySource: preview.legacySource,
          },
        });
        summary.updated += 1;
        refreshRowInIndex({
          ...row,
          title: preview.title,
          body: preview.body,
          excerpt: preview.excerpt?.trim() ? preview.excerpt : row.excerpt,
          category: preview.category,
          tags: preview.tags,
          postTemplate: preview.postTemplate,
          postStatus: preview.postStatus,
          publishAt: preview.publishAt,
          legacySource: preview.legacySource,
        });
      } else {
        const excerptOut =
          preview.excerpt?.trim() || `${preview.title}`.slice(0, 240) || "Legacy import";
        const created = await prisma.blogPost.create({
          data: {
            slug: normalizeBlogSlug(legacy.slug) || preview.slug,
            title: preview.title,
            body: preview.body,
            excerpt: excerptOut,
            category: preview.category,
            tags: preview.tags,
            postTemplate: preview.postTemplate,
            postStatus: preview.postStatus,
            publishAt: preview.publishAt,
            legacySource: preview.legacySource,
          },
        });
        summary.created += 1;
        refreshRowInIndex({
          id: created.id,
          slug: created.slug,
          title: created.title,
          excerpt: created.excerpt,
          body: created.body,
          category: created.category,
          tags: created.tags,
          postTemplate: created.postTemplate,
          postStatus: created.postStatus,
          publishAt: created.publishAt,
          scheduledAt: created.scheduledAt,
          legacySource: created.legacySource,
          workflowStatus: created.workflowStatus,
        });
      }
    } catch (e) {
      summary.errors.push({
        legacyId: legacy.legacyId,
        message: e instanceof Error ? e.message : String(e),
      });
      summary.skipped += 1;
    }
  }

  return summary;
}
