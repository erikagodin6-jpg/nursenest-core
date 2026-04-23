import { BlogPostStatus, ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";
import { createContentAutomationLogSafe } from "@/lib/admin/content-automation-log";
import type { BlogBulkChunkPayload } from "@/lib/admin/content-bulk/blog-bulk-schema";
import { prisma } from "@/lib/db";
import { extractPrimaryKeyword } from "@/lib/blog/blog-generate-seo";
import { generateBlogSEOFromPostRow } from "@/lib/blog/blog-generate-seo";
import { regenerateBlogPostSeoById } from "@/lib/blog/blog-post-seo-regenerate-by-id";
import { clampSerpDescription, clampSerpTitle, normalizeBlogTagsForStorage } from "@/lib/blog/blog-seo-package";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type BlogBulkChunkRunResult = {
  ok: number;
  skipped: number;
  failed: number;
  errors: string[];
};

async function fillMissingSerpColumns(postId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const row = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      tags: true,
      exam: true,
      countryTarget: true,
      seoTitle: true,
      seoDescription: true,
    },
  });
  if (!row) return { ok: false, error: "not_found" };
  const hasTitle = Boolean(row.seoTitle?.trim());
  const hasDesc = Boolean(row.seoDescription?.trim());
  if (hasTitle && hasDesc) return { ok: true }; // treat as no-op success

  const auto = generateBlogSEOFromPostRow({
    title: row.title,
    slug: row.slug,
    category: row.category,
    tags: row.tags,
    exam: row.exam,
    countryTarget: row.countryTarget,
  });
  const st = clampSerpTitle(auto.seoTitle, 70);
  const sd = clampSerpDescription(auto.metaDescription, 120, 155);
  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      ...(hasTitle ? {} : { seoTitle: st, metaTitleVariant: st }),
      ...(hasDesc ? {} : { seoDescription: sd, metaDescriptionVariant: sd }),
    },
  });
  return { ok: true };
}

async function metadataBackfillLight(postId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const row = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      category: true,
      targetKeyword: true,
      keywordCluster: true,
    },
  });
  if (!row) return { ok: false, error: "not_found" };
  const data: { targetKeyword?: string; keywordCluster?: string } = {};
  if (!(row.targetKeyword?.trim()) && row.title.trim().length >= 3) {
    data.targetKeyword = extractPrimaryKeyword(row.title, row.category ?? undefined).slice(0, 120);
  }
  if (!(row.keywordCluster?.trim()) && row.category?.trim()) {
    data.keywordCluster = row.category.trim().slice(0, 80);
  }
  if (Object.keys(data).length === 0) return { ok: true };
  await prisma.blogPost.update({ where: { id: postId }, data });
  return { ok: true };
}

export async function executeBlogBulkChunk(payload: BlogBulkChunkPayload): Promise<BlogBulkChunkRunResult> {
  const { operation, postIds, correlationId, chunkIndex, totalChunks, createdById, taxonomy } = payload;
  const errors: string[] = [];
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  safeServerLog("content_bulk", "chunk_start", {
    operation,
    correlationId,
    chunkIndex,
    totalChunks,
    batchSize: postIds.length,
  });

  for (const postId of postIds) {
    try {
      if (operation === "blog_seo_bundle_refresh") {
        const r = await regenerateBlogPostSeoById(postId, { overwriteColumns: false });
        if (!r.ok) {
          failed += 1;
          errors.push(`${postId}:${r.error}`);
        } else ok += 1;
        continue;
      }
      if (operation === "blog_seo_columns_force") {
        const r = await regenerateBlogPostSeoById(postId, { overwriteColumns: true });
        if (!r.ok) {
          failed += 1;
          errors.push(`${postId}:${r.error}`);
        } else ok += 1;
        continue;
      }
      if (operation === "blog_seo_columns_fill_missing") {
        const row = await prisma.blogPost.findUnique({
          where: { id: postId },
          select: { seoTitle: true, seoDescription: true },
        });
        if (!row) {
          failed += 1;
          errors.push(`${postId}:not_found`);
          continue;
        }
        if (row.seoTitle?.trim() && row.seoDescription?.trim()) {
          skipped += 1;
          continue;
        }
        const r = await fillMissingSerpColumns(postId);
        if (!r.ok) {
          failed += 1;
          errors.push(`${postId}:${r.error}`);
        } else ok += 1;
        continue;
      }
      if (operation === "blog_publish") {
        await prisma.blogPost.update({
          where: { id: postId },
          data: { postStatus: BlogPostStatus.PUBLISHED },
        });
        ok += 1;
        continue;
      }
      if (operation === "blog_unpublish_draft") {
        await prisma.blogPost.update({
          where: { id: postId },
          data: { postStatus: BlogPostStatus.DRAFT },
        });
        ok += 1;
        continue;
      }
      if (operation === "blog_assign_taxonomy") {
        if (!taxonomy) {
          failed += 1;
          errors.push(`${postId}:missing_taxonomy_payload`);
          continue;
        }
        const existing = await prisma.blogPost.findUnique({
          where: { id: postId },
          select: { tags: true, category: true },
        });
        if (!existing) {
          failed += 1;
          errors.push(`${postId}:not_found`);
          continue;
        }
        const nextTags =
          taxonomy.mode === "append"
            ? normalizeBlogTagsForStorage(existing.tags ?? [], taxonomy.tags ?? [])
            : normalizeBlogTagsForStorage(taxonomy.tags ?? [], []);
        const data: { tags: string[]; category?: string | null } = { tags: nextTags };
        if (taxonomy.category !== undefined) {
          data.category = taxonomy.category;
        }
        await prisma.blogPost.update({
          where: { id: postId },
          data,
        });
        ok += 1;
        continue;
      }
      if (operation === "blog_metadata_backfill_light") {
        const r = await metadataBackfillLight(postId);
        if (!r.ok) {
          failed += 1;
          errors.push(`${postId}:${r.error}`);
        } else ok += 1;
        continue;
      }
      failed += 1;
      errors.push(`${postId}:unknown_operation`);
    } catch (e) {
      failed += 1;
      errors.push(`${postId}:${e instanceof Error ? e.message.slice(0, 200) : "error"}`);
    }
  }

  const status =
    failed > 0 && ok === 0 && skipped === 0 ? ContentAutomationLogStatus.FAILED
    : failed > 0 ? ContentAutomationLogStatus.WARNING
    : ContentAutomationLogStatus.SUCCEEDED;

  await createContentAutomationLogSafe({
    category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
    jobType: `bulk_${operation}`,
    status,
    topic: `bulk chunk ${chunkIndex + 1}/${totalChunks}`,
    summary: `ok=${ok} skipped=${skipped} failed=${failed}`,
    error: errors.length ? errors.slice(0, 12).join(" | ").slice(0, 3900) : null,
    metadata: {
      correlationId,
      chunkIndex,
      totalChunks,
      operation,
      ok,
      skipped,
      failed,
    },
    correlationId,
    createdById,
  });

  safeServerLog("content_bulk", "chunk_done", {
    operation,
    correlationId,
    chunkIndex,
    ok,
    skipped,
    failed,
  });

  return { ok, skipped, failed, errors };
}
