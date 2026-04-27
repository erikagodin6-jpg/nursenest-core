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

/**
 * Normalize for storage / comparison.
 * Handles emojis, Unicode accents, &→and, special punctuation, and collapses hyphens.
 * Safe to call with any admin input including clinical abbreviations, titles, and emojis.
 */
export function cleanBlogSlugInput(raw: string): string {
  return String(raw ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")  // strip combining diacritics
    .replace(/[^\x00-\x7F]/g, " ")    // non-ASCII (emojis, CJK, etc.) → space
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ")     // & → and
    .replace(/[/:\\—–]/g, " ")        // /, :, \, em-dash, en-dash → space
    .replace(/[^a-z0-9\s-]/g, "")    // strip remaining special chars
    .replace(/\s+/g, "-")             // spaces → hyphens
    .replace(/-+/g, "-")              // collapse hyphens
    .replace(/^-|-$/g, "");           // strip leading/trailing hyphens
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
  // Fallback: aggressively strip everything non-alphanumeric
  const fallback = String(title ?? "")
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, " ")
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  if (fallback.length >= 3 && BLOG_SLUG_FORMAT_RE.test(fallback)) return fallback;
  return `blog-post-${Date.now()}`;
}

export function generateBlogSlugBaseFromExamTopic(exam: string, topic: string, maxLen = 100): string {
  const base = `${exam}-${topic}`
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, " ")
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  if (base.length >= 3 && BLOG_SLUG_FORMAT_RE.test(base)) return base;
  return generateBlogSlugBaseFromTitle(topic || exam || "blog", maxLen);
}

/** Live typing helper for admin inputs (does not throw). */
export function liveNormalizeBlogSlugInputValue(value: string): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, " ")  // non-ASCII (emojis) → space
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ")
    .replace(/[/:\\—–]/g, " ")
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

/**
 * Normalize a Zod preprocess value for slug fields.
 * Returns the cleaned slug string (min 3 chars) or undefined (triggers auto-generation).
 * Safe to use directly in `z.preprocess(normalizeSlugPreprocess, z.string()...optional())`.
 */
export function normalizeSlugPreprocess(v: unknown, maxLen = 180): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t) return undefined;
  const cleaned = cleanBlogSlugInput(t).slice(0, maxLen);
  return cleaned.length >= 3 ? cleaned : undefined;
}
