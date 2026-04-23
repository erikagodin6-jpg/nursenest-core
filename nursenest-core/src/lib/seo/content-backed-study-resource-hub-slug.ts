/**
 * URL segment for `…/study-resources/[bodyKey]` — shared by sitemap, loaders, and tests (no `server-only`).
 */
export function normalizeBodySystemUrlKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
