import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { BlogBulkFilters } from "@/lib/admin/content-bulk/blog-bulk-schema";
import { BLOG_BULK_MAX_RESOLVE } from "@/lib/admin/content-bulk/blog-bulk-schema";

export type ResolvedBlogBulkRow = { id: string; slug: string; title: string; postStatus: string };

export async function resolveBlogBulkTargets(
  filters: BlogBulkFilters,
  take = BLOG_BULK_MAX_RESOLVE,
): Promise<ResolvedBlogBulkRow[]> {
  const cap = Math.min(take, filters.maxPosts ?? BLOG_BULK_MAX_RESOLVE);
  const where: Prisma.BlogPostWhereInput = {};

  if (filters.postIds?.length) {
    where.id = { in: filters.postIds.slice(0, cap) };
  } else {
    if (filters.slugs?.length) {
      where.slug = { in: filters.slugs };
    }
    if (filters.postStatusIn?.length) {
      where.postStatus = { in: filters.postStatusIn };
    }
    if (filters.exam?.length) {
      where.exam = filters.exam;
    }
    if (filters.missingSerpFieldsOnly) {
      where.OR = [
        { seoTitle: null },
        { seoTitle: "" },
        { seoDescription: null },
        { seoDescription: "" },
      ];
    }
  }

  return prisma.blogPost.findMany({
    where,
    take: cap,
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, postStatus: true },
  });
}

export async function countBlogBulkTargets(filters: BlogBulkFilters): Promise<number> {
  const where: Prisma.BlogPostWhereInput = {};
  if (filters.postIds?.length) {
    where.id = { in: filters.postIds };
  } else {
    if (filters.slugs?.length) where.slug = { in: filters.slugs };
    if (filters.postStatusIn?.length) where.postStatus = { in: filters.postStatusIn };
    if (filters.exam?.length) where.exam = filters.exam;
    if (filters.missingSerpFieldsOnly) {
      where.OR = [
        { seoTitle: null },
        { seoTitle: "" },
        { seoDescription: null },
        { seoDescription: "" },
      ];
    }
  }
  return prisma.blogPost.count({ where });
}
