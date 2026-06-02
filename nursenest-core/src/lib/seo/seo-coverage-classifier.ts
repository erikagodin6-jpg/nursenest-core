/**
 * Normalizes SEO audit spreadsheet rows (Ahrefs, Sitebulb, GSC exports, etc.) into remediation buckets.
 * Used by `scripts/seo/ingest-nursenest-coverage-xlsx.mts` and contract tests — no I/O here.
 */

export const SEO_REMEDIATION_BUCKETS = [
  "canonical_conflicts",
  "duplicate_urls",
  "non_indexable_pages",
  "unexpected_noindex",
  "missing_metadata",
  "missing_titles",
  "missing_descriptions",
  "missing_h1",
  "weak_h1_title_mismatch",
  "broken_internal_links",
  "orphan_pages",
  "redirect_chains",
  "routes_404",
  "routes_5xx",
  "blocked_hreflang",
  "invalid_hreflang",
  "sitemap_omissions",
  "sitemap_duplication",
  "robots_conflicts",
  "soft_404s",
  "low_content_pages",
  "empty_states_indexable",
  "auth_private_leak",
  "pagination_canonical",
  "mixed_locale_indexing",
  "trailing_slash_inconsistency",
  "case_inconsistency",
  "invalid_structured_data",
  "weak_open_graph",
  "thin_lesson_hubs",
  "duplicate_lesson_metadata",
  "duplicate_blog_metadata",
  "uncrawlable_pages",
  "js_only_content_risk",
  "incorrect_canonical_origin",
  "preview_staging_indexed",
  "parameterized_url_indexing",
  "faceted_navigation_indexing",
  "broken_breadcrumb_schema",
  "invalid_blogposting_schema",
  "invalid_faq_schema",
  "sitemap_child_index_mismatch",
  "stale_sitemap_generation",
  "canonical_loops",
  "unclassified",
] as const;

export type SeoRemediationBucket = (typeof SEO_REMEDIATION_BUCKETS)[number];

const RULES: Array<{ bucket: SeoRemediationBucket; patterns: RegExp[] }> = [
  { bucket: "canonical_conflicts", patterns: [/canonical conflict/i, /multiple canonical/i, /non-canonical/i] },
  { bucket: "canonical_loops", patterns: [/canonical loop/i, /canonical chain/i] },
  { bucket: "duplicate_urls", patterns: [/duplicate\s+url/i, /duplicate\s+page/i] },
  { bucket: "non_indexable_pages", patterns: [/non-indexable/i, /not indexable/i] },
  { bucket: "unexpected_noindex", patterns: [/noindex/i, /blocked by meta robots/i] },
  { bucket: "missing_metadata", patterns: [/missing meta/i] },
  { bucket: "missing_titles", patterns: [/missing title/i, /empty title/i] },
  { bucket: "missing_descriptions", patterns: [/missing description/i] },
  { bucket: "missing_h1", patterns: [/missing h1/i, /no h1/i] },
  { bucket: "weak_h1_title_mismatch", patterns: [/h1.*title/i, /title.*h1 mismatch/i] },
  { bucket: "broken_internal_links", patterns: [/broken\s+internal/i] },
  { bucket: "orphan_pages", patterns: [/orphan/i] },
  { bucket: "redirect_chains", patterns: [/redirect chain/i] },
  { bucket: "routes_404", patterns: [/\b404\b/] },
  { bucket: "routes_5xx", patterns: [/\b5\d\d\b/] },
  { bucket: "blocked_hreflang", patterns: [/hreflang.*not reciproc/i, /hreflang.*missing return/i] },
  { bucket: "invalid_hreflang", patterns: [/hreflang/i] },
  { bucket: "sitemap_omissions", patterns: [/not in sitemap/i] },
  { bucket: "sitemap_duplication", patterns: [/duplicate.*sitemap/i] },
  { bucket: "sitemap_child_index_mismatch", patterns: [/sitemap index/i, /child sitemap/i] },
  { bucket: "stale_sitemap_generation", patterns: [/stale sitemap/i] },
  { bucket: "robots_conflicts", patterns: [/robots\.txt/i] },
  { bucket: "soft_404s", patterns: [/soft 404/i] },
  { bucket: "low_content_pages", patterns: [/thin content/i, /low word/i] },
  { bucket: "empty_states_indexable", patterns: [/empty.*index/i] },
  { bucket: "auth_private_leak", patterns: [/\/app\//i, /login.*index/i] },
  { bucket: "pagination_canonical", patterns: [/pagination/i, /rel=canonical.*page/i] },
  { bucket: "mixed_locale_indexing", patterns: [/mixed locale/i] },
  { bucket: "trailing_slash_inconsistency", patterns: [/trailing slash/i] },
  { bucket: "case_inconsistency", patterns: [/uppercase/i, /mixed case url/i] },
  { bucket: "invalid_structured_data", patterns: [/invalid schema/i, /structured data error/i, /rich results error/i] },
  { bucket: "weak_open_graph", patterns: [/open graph/i, /twitter card/i] },
  { bucket: "thin_lesson_hubs", patterns: [/thin hub/i, /lesson hub/i] },
  { bucket: "duplicate_lesson_metadata", patterns: [/duplicate lesson/i] },
  { bucket: "duplicate_blog_metadata", patterns: [/duplicate blog/i] },
  { bucket: "uncrawlable_pages", patterns: [/timeout/i, /crawl budget/i] },
  { bucket: "js_only_content_risk", patterns: [/javascript/i, /render/i] },
  { bucket: "incorrect_canonical_origin", patterns: [/wrong host/i, /http:\/\//i] },
  { bucket: "preview_staging_indexed", patterns: [/staging/i, /localhost/i, /\.vercel\.app/i] },
  { bucket: "parameterized_url_indexing", patterns: [/\?utm=/i, /\?page=\d+/i] },
  { bucket: "faceted_navigation_indexing", patterns: [/faceted/i, /\?filter=/i] },
  { bucket: "broken_breadcrumb_schema", patterns: [/breadcrumb/i] },
  { bucket: "invalid_blogposting_schema", patterns: [/blogposting/i] },
  { bucket: "invalid_faq_schema", patterns: [/faq\s*schema/i] },
];

/**
 * Classify free-form audit text (row JSON, issue column, etc.) into zero or more buckets.
 */
export function classifySeoAuditText(blob: string): SeoRemediationBucket[] {
  const s = blob.trim();
  if (!s) return ["unclassified"];

  const hits = new Set<SeoRemediationBucket>();
  for (const { bucket, patterns } of RULES) {
    if (patterns.some((re) => re.test(s))) {
      hits.add(bucket);
    }
  }

  if (hits.has("blocked_hreflang") && hits.has("invalid_hreflang")) {
    hits.delete("invalid_hreflang");
  }

  if (hits.size === 0) return ["unclassified"];

  return [...hits];
}
