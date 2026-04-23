import type { Prisma } from "@prisma/client";
import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import { prisma } from "@/lib/db";

const DEFAULT_TAKE = 8;
const HARD_CAP = 20;

export type BlogRelatedPublishedClient = Pick<typeof prisma, "blogPost">;

/**
 * Bounded related posts for the publishing package (live posts only): tag overlap, then
 * case-insensitive `targetKeyword` match, then same-`exam` fallback.
 * Legacy-safe: returns [] when there is nothing to match on.
 */
export async function findRelatedPublishedBlogPosts(
  params: {
    excludeId: string;
    tags: string[];
    targetKeyword?: string | null;
    exam?: string | null;
    take?: number;
  },
  db: BlogRelatedPublishedClient = prisma,
): Promise<Array<{ slug: string; title: string; excerpt: string }>> {
  const now = new Date();
  const take = Math.min(HARD_CAP, Math.max(1, params.take ?? DEFAULT_TAKE));
  const tagKeys = [...new Set((params.tags ?? []).map((t) => t.trim()).filter((t) => t.length >= 2))].slice(0, 6);
  const or: Prisma.BlogPostWhereInput[] = [];
  for (const t of tagKeys) {
    or.push({ tags: { has: t } });
  }

  const baseAnd: Prisma.BlogPostWhereInput[] = [blogLiveWhere(now), { id: { not: params.excludeId } }];

  if (or.length > 0) {
    const rows = await db.blogPost.findMany({
      where: { AND: [...baseAnd, { OR: or }] },
      select: { slug: true, title: true, excerpt: true },
      orderBy: { updatedAt: "desc" },
      take: take + 4,
    });
    return dedupeBySlug(rows).slice(0, take);
  }

  /** Same-primary-keyword posts (bounded) before falling back to broad exam bucket. */
  const kw = params.targetKeyword?.trim();
  if (kw && kw.length >= 3 && kw.length <= 200) {
    const rows = await db.blogPost.findMany({
      where: {
        AND: [
          ...baseAnd,
          { targetKeyword: { equals: kw, mode: "insensitive" } },
        ],
      },
      select: { slug: true, title: true, excerpt: true },
      orderBy: { updatedAt: "desc" },
      take: take + 4,
    });
    const narrowed = dedupeBySlug(rows);
    if (narrowed.length > 0) return narrowed.slice(0, take);
  }

  const exam = params.exam?.trim();
  if (exam && exam.length >= 2) {
    const rows = await db.blogPost.findMany({
      where: { AND: [...baseAnd, { exam }] },
      select: { slug: true, title: true, excerpt: true },
      orderBy: { updatedAt: "desc" },
      take,
    });
    return dedupeBySlug(rows).slice(0, take);
  }

  return [];
}

function dedupeBySlug(rows: Array<{ slug: string; title: string; excerpt: string }>) {
  const seen = new Set<string>();
  const out: typeof rows = [];
  for (const r of rows) {
    const s = r.slug.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(r);
  }
  return out;
}
