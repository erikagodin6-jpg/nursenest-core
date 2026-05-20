import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { generateBlogSEOFromPostRow } from "@/lib/blog/blog-generate-seo";
import { emptyPublishingPackageV1, mergePublishingPackageIntoLinkPlanJson, parsePublishingPackage } from "@/lib/blog/blog-publishing-package";
import { findRelatedPublishedBlogPosts } from "@/lib/blog/blog-related-published-posts";
import {
  clampSerpDescription,
  clampSerpTitle,
  rebuildSeoBundleFromStoredBlogPost,
} from "@/lib/blog/blog-seo-package";

function faqItemsLen(faqBlock: unknown): number {
  if (!faqBlock || typeof faqBlock !== "object") return 0;
  const items = (faqBlock as { items?: unknown }).items;
  return Array.isArray(items) ? items.length : 0;
}

export type RegenerateBlogPostSeoByIdResult =
  | { ok: true; postId: string; slug: string }
  | { ok: false; postId: string; error: string };

/**
 * Shared implementation for `/api/admin/blog/[id]/seo/regenerate` and bulk SEO jobs.
 * Refreshes structured SEO bundle inside `internalLinkPlan` and optionally overwrites SERP columns.
 */
export async function regenerateBlogPostSeoById(
  postId: string,
  opts: { overwriteColumns: boolean },
): Promise<RegenerateBlogPostSeoByIdResult> {
  const row = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      tags: true,
      category: true,
      exam: true,
      countryTarget: true,
      coverImage: true,
      targetKeyword: true,
      faqBlock: true,
      internalLinkPlan: true,
    },
  });
  if (!row) return { ok: false, postId, error: "not_found" };

  const overwrite = opts.overwriteColumns;
  const faqCount = faqItemsLen(row.faqBlock);
  const bundle = rebuildSeoBundleFromStoredBlogPost(
    {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      tags: row.tags,
      category: row.category,
      exam: row.exam,
      countryTarget: row.countryTarget,
      coverImage: row.coverImage,
      targetKeyword: row.targetKeyword,
      faqItemCount: faqCount,
    },
    { ignoreStoredMeta: overwrite },
  );

  const planJson = row.internalLinkPlan;
  const base =
    planJson && typeof planJson === "object" && planJson !== null && !Array.isArray(planJson)
      ? { ...(planJson as Record<string, unknown>) }
      : {};
  const parsedPlan = parseInternalLinkPlanJson(row.internalLinkPlan);
  const relatedBlogPosts = await findRelatedPublishedBlogPosts({
    excludeId: row.id,
    tags: row.tags ?? [],
    targetKeyword: row.targetKeyword,
    exam: row.exam,
  });

  const prevPkg = parsePublishingPackage((base as Record<string, unknown>).publishingPackage) ?? emptyPublishingPackageV1();
  const mergedPlanCore = {
    ...base,
    lessons: parsedPlan.lessons,
    imagePlacements: parsedPlan.imagePlacements,
    imageAttachments: parsedPlan.imageAttachments,
    seo: bundle,
  } as Record<string, unknown>;
  const mergedPlan = mergePublishingPackageIntoLinkPlanJson(mergedPlanCore, {
    ...prevPkg,
    relatedBlogPosts,
    updatedAt: new Date().toISOString(),
  }) as unknown as Prisma.InputJsonValue;

  const schemaSummary = buildSchemaSummaryPayload(bundle);

  const auto = generateBlogSEOFromPostRow({
    title: row.title,
    slug: row.slug,
    category: row.category,
    tags: row.tags,
    exam: row.exam,
    countryTarget: row.countryTarget,
  });

  const data: Prisma.BlogPostUpdateInput = {
    internalLinkPlan: mergedPlan,
    schemaSummary,
  };
  if (overwrite) {
    const st = clampSerpTitle(auto.seoTitle, 70);
    const sd = clampSerpDescription(auto.metaDescription, 120, 155);
    data.seoTitle = st;
    data.seoDescription = sd;
    data.metaTitleVariant = st;
    data.metaDescriptionVariant = sd;
  }

  await prisma.blogPost.update({
    where: { id: postId },
    data,
  });

  return { ok: true, postId: row.id, slug: row.slug };
}
