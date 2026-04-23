import "server-only";

import type { PrismaClient } from "@prisma/client";
import { stringSimilarityDice } from "@/lib/seo/seo-text-similarity";

const DEFAULT_SIMILARITY_THRESHOLD = 0.85;

export type SeoDuplicateGuardInput = {
  slug: string;
  metaTitle: string;
  h1: string;
  /** Exclude current blog post when updating. */
  excludeBlogPostId?: string;
  threshold?: number;
};

export class SeoDuplicateBlockedError extends Error {
  readonly code = "SEO_DUPLICATE_BLOCKED" as const;

  constructor(message: string) {
    super(message);
    this.name = "SeoDuplicateBlockedError";
  }
}

/**
 * Blocks creation when slug exists, or when title/H1 is dangerously similar to recent posts.
 */
export async function assertSeoSafeToCreateBlog(
  prisma: PrismaClient,
  input: SeoDuplicateGuardInput,
): Promise<void> {
  const threshold = input.threshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const slug = input.slug.trim();
  if (!slug) throw new SeoDuplicateBlockedError("Slug is empty.");

  const slugHit = await prisma.blogPost.findFirst({
    where: {
      slug,
      ...(input.excludeBlogPostId ? { NOT: { id: input.excludeBlogPostId } } : {}),
    },
    select: { id: true, slug: true },
  });
  if (slugHit) {
    throw new SeoDuplicateBlockedError(`Slug "${slug}" already exists on another post.`);
  }

  const candidates = await prisma.blogPost.findMany({
    where: input.excludeBlogPostId ? { NOT: { id: input.excludeBlogPostId } } : undefined,
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: { slug: true, seoTitle: true, title: true },
  });

  const meta = input.metaTitle.trim();
  const h1 = input.h1.trim();
  for (const c of candidates) {
    const t = (c.seoTitle ?? "").trim() || c.title.trim();
    if (t && stringSimilarityDice(meta, t) >= threshold) {
      throw new SeoDuplicateBlockedError(
        `metaTitle is too similar (>=${Math.round(threshold * 100)}%) to existing post "${c.slug}".`,
      );
    }
    const h1c = c.title.trim();
    if (h1c && stringSimilarityDice(h1, h1c) >= threshold) {
      throw new SeoDuplicateBlockedError(
        `H1/title is too similar (>=${Math.round(threshold * 100)}%) to existing post "${c.slug}".`,
      );
    }
  }
}

const CANONICAL_SUFFIX = "nursing-guide";

/**
 * Ensures a **terminal** blog slug is unique; appends `-nursing-guide`, then numeric suffixes.
 */
export async function ensureUniqueTaxonomyTerminalSlug(
  prisma: PrismaClient,
  baseSlug: string,
  maxLen = 120,
): Promise<string> {
  const clean = baseSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  const root = clean.length >= 3 ? clean : "nursing-topic";
  let candidate = root;
  for (let i = 0; i < 201; i++) {
    const hit = await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!hit) return candidate;
    candidate = i === 0 ? `${root}-${CANONICAL_SUFFIX}`.slice(0, maxLen) : `${root}-${CANONICAL_SUFFIX}-${i}`.slice(0, maxLen);
  }
  throw new SeoDuplicateBlockedError("Could not allocate a unique slug after 200 attempts.");
}

/**
 * PathwayLesson uniqueness is scoped to pathway + locale; checks `seoTitle` similarity within pathway.
 */
export async function assertSeoSafeToCreatePathwayLesson(
  prisma: PrismaClient,
  input: {
    pathwayId: string;
    locale: string;
    slug: string;
    metaTitle: string;
    h1: string;
    threshold?: number;
  },
): Promise<void> {
  const threshold = input.threshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const slugHit = await prisma.pathwayLesson.findFirst({
    where: { pathwayId: input.pathwayId, locale: input.locale, slug: input.slug.trim() },
    select: { id: true },
  });
  if (slugHit) {
    throw new SeoDuplicateBlockedError(
      `Lesson slug "${input.slug}" already exists for pathway ${input.pathwayId} (${input.locale}).`,
    );
  }
  const peers = await prisma.pathwayLesson.findMany({
    where: { pathwayId: input.pathwayId, locale: input.locale },
    take: 60,
    orderBy: { updatedAt: "desc" },
    select: { slug: true, seoTitle: true, title: true },
  });
  const meta = input.metaTitle.trim();
  const h1 = input.h1.trim();
  for (const c of peers) {
    const t = (c.seoTitle ?? "").trim();
    if (t && stringSimilarityDice(meta, t) >= threshold) {
      throw new SeoDuplicateBlockedError(
        `Lesson seoTitle too similar to "${c.slug}" (>=${Math.round(threshold * 100)}%).`,
      );
    }
    if (c.title && stringSimilarityDice(h1, c.title.trim()) >= threshold) {
      throw new SeoDuplicateBlockedError(
        `Lesson title/H1 too similar to "${c.slug}" (>=${Math.round(threshold * 100)}%).`,
      );
    }
  }
}
