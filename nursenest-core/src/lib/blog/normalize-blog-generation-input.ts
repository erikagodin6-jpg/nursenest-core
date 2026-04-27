/**
 * Single normalization boundary for admin blog generation.
 *
 * The admin can enter any title in any format — uppercase, punctuation, colons,
 * slashes, ampersands, emojis, long-tail SEO phrases, and clinical abbreviations
 * (HFrEF, HFpEF, SIADH, ABGs, NCLEX-style, REx-PN).
 *
 * This module converts the raw title into safe, derived fields.
 * Raw input must NEVER be used directly as a URL, slug, pathname, fetch URL,
 * router param, or regex pattern without going through this layer first.
 */

import { cleanBlogSlugInput, BLOG_SLUG_FORMAT_RE, generateBlogSlugBaseFromTitle } from "./blog-optional-slug";

export type NormalizedBlogGenerationInput = {
  /** Title safe for database storage and display (trimmed, collapsed whitespace, max 220 chars). */
  cleanTitle: string;
  /** URL-safe slug derived from title (lowercase alphanumeric, hyphens, max 80 chars). */
  slug: string;
  /** SEO meta title clamped to 70 chars. */
  seoTitle: string;
  /** Placeholder meta description clamped to 155 chars. */
  metaDescription: string;
  /** Excerpt seed for article body (first 200 chars of cleanTitle). */
  excerptSeed: string;
  /** Topic keywords extracted from title (min 3-char words, deduped, max 10). */
  topicKeywords: string[];
  /** Canonical public path — always `/blog/{slug}`, never contains raw title. */
  canonicalPath: string;
};

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "its",
  "was", "had", "who", "how", "when", "what", "from", "will", "into", "that",
  "this", "with", "have", "over", "also", "your", "our", "its", "their", "which",
  "been", "does", "about", "before", "after", "would", "could", "should", "per",
]);

function extractTopicKeywords(title: string): string[] {
  const seen = new Set<string>();
  return title
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .filter((w) => {
      if (seen.has(w)) return false;
      seen.add(w);
      return true;
    })
    .slice(0, 10);
}

/**
 * Convert any raw admin title to a URL-safe slug (max 80 chars).
 * Handles emojis, Unicode, colons, slashes, ampersands, clinical abbreviations.
 * Falls back to a timestamped slug if normalization yields nothing.
 */
export function normalizeTitleToSlug(rawTitle: string, maxLen = 80): string {
  if (!rawTitle?.trim()) {
    return `generated-blog-post-${Date.now()}`;
  }
  const slug = generateBlogSlugBaseFromTitle(rawTitle, maxLen);
  if (slug.length >= 3 && BLOG_SLUG_FORMAT_RE.test(slug)) return slug;
  return `generated-blog-post-${Date.now()}`;
}

/**
 * Normalize raw admin title input into all safe derived fields.
 * Call this once at the normalization boundary — never pass rawTitle to URLs,
 * slugs, fetch(), router.push(), new URL(), or regex patterns directly.
 */
export function normalizeBlogGenerationInput(rawTitle: string): NormalizedBlogGenerationInput {
  const cleanTitle =
    String(rawTitle ?? "")
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, " ")  // normalize non-ASCII (emojis) to space
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220) || "Untitled";

  const slug = normalizeTitleToSlug(cleanTitle);
  const seoTitle = cleanTitle.slice(0, 70);
  const metaDescription = `${cleanTitle.slice(0, 115)} — nursing exam prep guide (NurseNest).`.slice(0, 155);
  const excerptSeed = cleanTitle.slice(0, 200);
  const topicKeywords = extractTopicKeywords(cleanTitle);
  const canonicalPath = `/blog/${slug}`;

  return { cleanTitle, slug, seoTitle, metaDescription, excerptSeed, topicKeywords, canonicalPath };
}

/**
 * Re-sanitize an AI-returned slug before saving.
 * Returns a safe slug or a fallback if the AI output is unusable.
 */
export function sanitizeAiReturnedSlug(
  aiSlug: string | null | undefined,
  fallbackTitle: string,
  maxLen = 100,
): string {
  if (aiSlug?.trim()) {
    const cleaned = cleanBlogSlugInput(aiSlug).slice(0, maxLen);
    if (cleaned.length >= 3 && BLOG_SLUG_FORMAT_RE.test(cleaned)) return cleaned;
  }
  return generateBlogSlugBaseFromTitle(fallbackTitle, maxLen);
}

/**
 * Clamp AI-returned SEO fields to safe lengths before saving.
 * Returns a sanitized object with all fields within database constraints.
 */
export function sanitizeAiSeoOutput(input: {
  title?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  category?: string | null;
  tags?: unknown;
}): {
  title: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  category: string | null;
  tags: string[];
} {
  const title = typeof input.title === "string" ? input.title.trim().slice(0, 220) || null : null;
  const seoTitle = typeof input.seoTitle === "string" ? input.seoTitle.replace(/\s+/g, " ").trim().slice(0, 70) || null : null;
  const metaDescription =
    typeof input.metaDescription === "string" ? input.metaDescription.replace(/\s+/g, " ").trim().slice(0, 155) || null : null;
  const category = typeof input.category === "string" ? input.category.trim().slice(0, 120) || null : null;

  // Tags must be plain strings; reject anything that isn't
  const rawTags = Array.isArray(input.tags) ? input.tags : [];
  const tags = rawTags
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter((t) => t.length >= 1 && t.length <= 80)
    .slice(0, 20);

  return { title, seoTitle, metaDescription, category, tags };
}
