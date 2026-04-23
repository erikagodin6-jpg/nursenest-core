/** Minimum substantive body length for long-form SEO posts (word count, HTML stripped). */
export const BLOG_ARTICLE_MIN_WORDS = 1200;

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
