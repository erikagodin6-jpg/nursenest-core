/**
 * Shared long-form article size floors (no imports from the generation pipeline — keeps
 * {@link validateBlogPrePublish} free of cycles with {@link persistControlPanelDraft}).
 */

export const BLOG_ARTICLE_MIN_BODY_CHARS = 450;

/** Shown when the model returns no HTML; allows a debuggable draft row instead of a hard failure. */
export const BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT =
  "Content generation incomplete. Regenerate required.";

export function blogBodyHtmlWhenAiReturnedEmpty(): string {
  return `<p>${BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT}</p>`;
}

/** True when the body is the explicit “incomplete generation” placeholder (skip length / longform hard gates). */
export function isBlogBodyGenerationIncompletePlaceholderHtml(html: string): boolean {
  return typeof html === "string" && html.includes(BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT);
}

/** Ensures persisted `BlogPost.body` is never an empty string after HTML strip. */
export function ensureNonEmptyBlogBodyHtmlForPersist(html: string): string {
  const visible = (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (visible.length === 0) return blogBodyHtmlWhenAiReturnedEmpty();
  return html;
}
