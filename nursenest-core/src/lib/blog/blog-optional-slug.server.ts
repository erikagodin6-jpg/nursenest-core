import "server-only";

import { prisma } from "@/lib/db";
import { cleanBlogSlugInput } from "@/lib/blog/blog-optional-slug";

/** First free slug: `base`, `base-1`, `base-2`, … (bounded by DB checks). */
export async function ensureUniqueBlogPostSlug(baseSlug: string, maxTotalLength = 120): Promise<string> {
  const base = cleanBlogSlugInput(baseSlug).slice(0, maxTotalLength) || "blog-post";
  let slug = base.slice(0, maxTotalLength);
  let i = 1;
  while (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${i++}`.slice(0, maxTotalLength);
  }
  return slug;
}

/**
 * Like {@link ensureUniqueBlogPostSlug}, but allows `excludePostId` to keep its current slug
 * (used when repairing a row without colliding with itself).
 */
export async function ensureUniqueBlogPostSlugExcluding(
  baseSlug: string,
  excludePostId: string,
  maxTotalLength = 120,
): Promise<string> {
  const base = cleanBlogSlugInput(baseSlug).slice(0, maxTotalLength) || "blog-post";
  let slug = base.slice(0, maxTotalLength);
  let i = 1;
  for (;;) {
    const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === excludePostId) return slug;
    slug = `${base}-${i++}`.slice(0, maxTotalLength);
  }
}
