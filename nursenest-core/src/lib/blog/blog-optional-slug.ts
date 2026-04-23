import { prisma } from "@/lib/db";

/** URL segment: lowercase alphanumeric, single hyphens between groups. */
export const BLOG_SLUG_FORMAT_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class BlogInvalidSlugError extends Error {
  readonly code = "INVALID_SLUG" as const;

  constructor(message: string) {
    super(message);
    this.name = "BlogInvalidSlugError";
  }

  static is(e: unknown): e is BlogInvalidSlugError {
    return e instanceof BlogInvalidSlugError;
  }
}

/** Normalize for storage / comparison (trim, lower, strip junk, collapse hyphens). */
export function cleanBlogSlugInput(raw: string): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Empty / whitespace → `null` (caller should auto-generate).
 * Non-empty but unusable after cleaning, too short, or wrong shape → throws {@link BlogInvalidSlugError}.
 */
export function parseOptionalBlogSlug(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (trimmed.length === 0) return null;

  const cleaned = cleanBlogSlugInput(trimmed);
  if (cleaned.length === 0) {
    throw new BlogInvalidSlugError("Slug contained no usable characters after normalization.");
  }
  if (cleaned.length < 3) {
    throw new BlogInvalidSlugError("Slug must be at least 3 characters when provided.");
  }
  if (!BLOG_SLUG_FORMAT_RE.test(cleaned)) {
    throw new BlogInvalidSlugError("Invalid slug format: use lowercase letters, numbers, and hyphens only.");
  }
  return cleaned.slice(0, 180);
}

export function generateBlogSlugBaseFromTitle(title: string, maxLen = 100): string {
  const t = cleanBlogSlugInput(title).slice(0, maxLen);
  if (t.length >= 3 && BLOG_SLUG_FORMAT_RE.test(t)) return t;
  const fallback = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  if (fallback.length >= 3 && BLOG_SLUG_FORMAT_RE.test(fallback)) return fallback;
  return "blog-post";
}

export function generateBlogSlugBaseFromExamTopic(exam: string, topic: string, maxLen = 100): string {
  const base = `${exam}-${topic}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  if (base.length >= 3 && BLOG_SLUG_FORMAT_RE.test(base)) return base;
  return generateBlogSlugBaseFromTitle(topic || exam || "blog", maxLen);
}

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

/** Live typing helper for admin inputs (does not throw). */
export function liveNormalizeBlogSlugInputValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Empty string when valid or empty field; otherwise a short constraint message for `setCustomValidity`. */
export function blogSlugCustomValidityMessage(normalized: string): string {
  if (normalized.length === 0) return "";
  if (normalized.length < 3) return "Slug must be at least 3 characters when provided.";
  if (!BLOG_SLUG_FORMAT_RE.test(normalized)) {
    return "Use lowercase letters, numbers, and hyphens only.";
  }
  return "";
}
