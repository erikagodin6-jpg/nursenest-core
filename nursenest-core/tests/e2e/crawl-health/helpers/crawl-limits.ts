/**
 * Production-safe bounds — override via env for staging or deeper audits.
 */
export function crawlMaxSitemapUrls(): number {
  const raw = process.env.CRAWL_MAX_SITEMAP_URLS;
  if (raw === undefined || raw === "") return 120;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.floor(n), 5000) : 120;
}

/** Fail the run if a URL takes more than this many redirect hops (chain length − 1). */
export function crawlMaxRedirectHops(): number {
  const raw = process.env.CRAWL_MAX_REDIRECT_HOPS;
  if (raw === undefined || raw === "") return 3;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.floor(n), 20) : 3;
}

/** Max unique same-origin links to HEAD/GET-check after HTML pages are sampled. */
export function crawlMaxInternalLinkChecks(): number {
  const raw = process.env.CRAWL_MAX_INTERNAL_LINK_CHECKS;
  if (raw === undefined || raw === "") return 150;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.floor(n), 2000) : 150;
}

/** Only the first N successful HTML documents contribute internal links to the link-audit queue. */
export function crawlLinkSampleHtmlPages(): number {
  const raw = process.env.CRAWL_LINK_SAMPLE_HTML_PAGES;
  if (raw === undefined || raw === "") return 10;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), 80) : 10;
}

/** Parallel in-flight page fetches (stay low for production courtesy). */
export function crawlConcurrency(): number {
  const raw = process.env.CRAWL_CONCURRENCY;
  if (raw === undefined || raw === "") return 3;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), 8) : 3;
}
