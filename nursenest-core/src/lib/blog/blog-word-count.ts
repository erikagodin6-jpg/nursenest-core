/** Minimum substantive body length for long-form SEO posts (word count, HTML stripped). */
export const BLOG_ARTICLE_MIN_WORDS = 1200;

export function countWordsFromHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}
