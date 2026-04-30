/** Minimum substantive body length for long-form SEO posts (word count, HTML stripped). */
export const BLOG_ARTICLE_MIN_WORDS = 1200;

/**
 * Minimum substantive words before immediate publish (`publishImmediately`) or live `/blog` promotion.
 * Keeps long-form depth above the hard {@link BLOG_ARTICLE_MIN_WORDS} floor used for drafts.
 */
export const BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH = 1500;

/**
 * When the model lands in this band (thin but not empty), the pipeline runs extra expansion repair
 * before failing (see {@link MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS}).
 */
export const BLOG_ARTICLE_EXPANSION_REPAIR_FLOOR_WORDS = 1150;

/**
 * Deterministic HTML → plain-ish text for audits and word estimates.
 * Strips `script`/`style` bodies first, then other tags (no DOM; no network).
 */
export function approximatePlainTextFromHtmlForAudit(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Word count from {@link approximatePlainTextFromHtmlForAudit} (deterministic). */
export function countWordsFromHtmlApproximate(html: string): number {
  const plain = approximatePlainTextFromHtmlForAudit(html);
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

export function countWordsFromHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}
