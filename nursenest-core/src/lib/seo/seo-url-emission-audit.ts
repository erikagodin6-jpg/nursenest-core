/**
 * ## SEO incident recovery — emitted URL observability
 *
 * Enable with `SEO_URL_EMIT_AUDIT=1` (or `true`). Per-URL lines with `SEO_URL_EMIT_AUDIT_VERBOSE=1`
 * (capped) for diffing against crawl/GSC 404 exports.
 *
 * ## Known 404 pattern classes & mitigations (historical)
 *
 * | Pattern | Typical cause | Mitigation in repo |
 * |---------|----------------|---------------------|
 * | `/{locale}/us/...` or `/{locale}/canada/...` | Marketing locale prefixed onto exam hubs | `isDisallowedMarketingSeoPathname`, `marketing-alternates`, sitemap strip |
 * | `/seo/{slug}` in sitemap | Internal rewrite target surfaced | `isValidPublicUrl` blocks `/seo/` |
 * | `/login`, `/signup` in sitemap | Auth pages indexed | `isAuthNoindexMarketingPathname`, sitemap filter |
 * | Lesson URL 404 | Slug in DB/catalog but page `notFound` / gate mismatch | `listPathwayLessonSlugBatch(..., restrictToPublicMarketingSurface: true)` for sitemap |
 * | Topic cluster crawl waste / empty hub | `listTopicClusters` included slugs with zero hub-eligible lessons | `listTopicClustersForSitemap` gates on `getLessonsForTopicPage` total > 0 |
 * | Expansion `/exams/{segment}` 404 | Region unpublished | `listPublishedExpansionExamMarketingPaths` + `isRegionalMarketingUrlPublished` |
 * | Regional country topic 404 | Unpublished region | `regionalTopicPaths.filter(isRegionalMarketingUrlPublished)` |
 * | Programmatic `/questions/{slug}` 404 | Registry typo | `getProgrammaticQuestionTopicDefinition` + `notFound()` on page |
 * | Blog `/blog/{slug}` 404 | Draft removed after publish | `getSitemapPublishedBlogSlugs` should match `Blog` published filter |
 *
 * HTTP 404/redirect cannot be proven without fetch; use `validatePublicUrlHttpOptional` in CI when needed.
 */
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { absoluteUrl } from "@/lib/seo/site-origin";

const MAX_VERBOSE_URLS = 8_000;
const SUMMARY_SAMPLE = 24;

export type SeoUrlEmissionSurface =
  | "sitemap_merged"
  | "sitemap_pathway_lesson_urls"
  | "sitemap_content_backed_study_resources"
  | "sitemap_blog"
  | "blog_latest_links"
  | "programmatic_product_links";

function auditEnabled(): boolean {
  const v = process.env.SEO_URL_EMIT_AUDIT?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function verboseEnabled(): boolean {
  const v = process.env.SEO_URL_EMIT_AUDIT_VERBOSE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/**
 * Dedupes, optionally logs every URL (verbose), otherwise one summary line + sample.
 */
export function logSeoEmittedUrlBatch(surface: SeoUrlEmissionSurface, urls: readonly string[], extra?: Record<string, string>): void {
  if (!auditEnabled()) return;
  const uniq = [...new Set(urls.map((u) => u.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  if (uniq.length === 0) {
    safeServerLog("seo", "emit_url_empty", { surface, ...extra });
    return;
  }

  if (verboseEnabled()) {
    const slice = uniq.slice(0, MAX_VERBOSE_URLS);
    for (const url of slice) {
      safeServerLog("seo", "emit_url", { surface, url: url.slice(0, 900), ...extra });
    }
    if (uniq.length > MAX_VERBOSE_URLS) {
      safeServerLog("seo", "emit_url_verbose_truncated", {
        surface,
        total: String(uniq.length),
        cap: String(MAX_VERBOSE_URLS),
        ...extra,
      });
    }
    return;
  }

  safeServerLog("seo", "emit_url_batch_summary", {
    surface,
    count: String(uniq.length),
    sample: uniq
      .slice(0, SUMMARY_SAMPLE)
      .join(" | ")
      .slice(0, 3_800),
    ...extra,
  });
}

/** Log hrefs built for “latest blog posts” widgets (internal links). */
export function logBlogLatestLinkHrefs(hrefs: readonly string[]): void {
  const abs = hrefs.map((h) => (h.startsWith("http://") || h.startsWith("https://") ? h : absoluteUrl(h)));
  logSeoEmittedUrlBatch("blog_latest_links", abs);
}
