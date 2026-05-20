import { listNpPracticeTestSegmentPaths } from "@/lib/exam-pathways/np-practice-test-segments";
import { isDisallowedMarketingSeoPathname } from "@/lib/seo/marketing-locale-regional-url-invariants";

/**
 * Exam-hub long-tail programmatic paths (`/{country}/{role}/{exam}/{slug}`) are only routed on the
 * default marketing shell. Prefixing a hosted locale (`/fr`, `/es`, …) creates an extra path segment
 * and **404s** (see `collectLocaleMarketingUrls` in `sitemap-static-xml`).
 *
 * **Production sitemap:** use {@link stripForbiddenLocalePrefixedPathwayTopics} so a regression drops
 * bad URLs and keeps the merged urlset valid (avoid failing the entire `/sitemap.xml` build).
 *
 * **Tests / CI:** use {@link assertLocaleMarketingUrlsExcludePrefixedPathwayTopics} to fail fast when
 * the invariant breaks.
 *
 * `pathwayTopicPublicPaths` is caller-supplied (typically one `import()` of
 * `pathway-topic-programmatic-registry` per batch) so this module stays free of that dependency at
 * module scope and does not re-import the programmatic registry once per locale.
 */
export function stripForbiddenLocalePrefixedPathwayTopics(
  urls: readonly string[],
  originNormalized: string,
  locale: string,
  pathwayTopicPublicPaths: readonly string[],
): { urls: string[]; removed: number } {
  const o = originNormalized.endsWith("/") ? originNormalized.slice(0, -1) : originNormalized;
  const forbidden = new Set<string>();
  for (const p of pathwayTopicPublicPaths) {
    const path = p.startsWith("/") ? p : `/${p}`;
    forbidden.add(`${o}/${locale}${path}`);
  }
  // NP keyword alias hubs (`/us/np/aanp-practice-test`, …) are not routed under `/{locale}/…` — same 404 class as above.
  for (const { countrySlug, roleTrack, segment } of listNpPracticeTestSegmentPaths()) {
    forbidden.add(`${o}/${locale}/${countrySlug}/${roleTrack}/${segment}`);
  }
  const out: string[] = [];
  let removed = 0;
  for (const u of urls) {
    if (forbidden.has(u)) {
      removed += 1;
      continue;
    }
    try {
      const pathname = new URL(u).pathname;
      if (isDisallowedMarketingSeoPathname(pathname)) {
        removed += 1;
        continue;
      }
    } catch {
      removed += 1;
      continue;
    }
    out.push(u);
  }
  return { urls: out, removed };
}

export function assertLocaleMarketingUrlsExcludePrefixedPathwayTopics(
  urls: readonly string[],
  originNormalized: string,
  locale: string,
  pathwayTopicPublicPaths: readonly string[],
): void {
  const { removed } = stripForbiddenLocalePrefixedPathwayTopics(urls, originNormalized, locale, pathwayTopicPublicPaths);
  if (removed > 0) {
    throw new Error(
      `Locale marketing URL list must not include language-prefixed exam-hub programmatic URL (404): removed_count=${removed}`,
    );
  }
}
