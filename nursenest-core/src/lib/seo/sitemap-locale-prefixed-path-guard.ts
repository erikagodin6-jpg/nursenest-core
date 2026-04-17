import { collectPathwayTopicProgrammaticPublicPaths } from "@/lib/seo/pathway-topic-programmatic-registry";

/**
 * Exam-hub long-tail programmatic paths (`/{country}/{role}/{exam}/{slug}`) are only routed on the
 * default marketing shell. Prefixing a hosted locale (`/fr`, `/es`, …) creates an extra path segment
 * and **404s** (see `collectLocaleMarketingUrls` in `sitemap-static-xml`).
 *
 * Call this after building `collectLocaleMarketingUrls` URL lists so reintroducing the bad join fails fast.
 */
export function assertLocaleMarketingUrlsExcludePrefixedPathwayTopics(
  urls: readonly string[],
  originNormalized: string,
  locale: string,
): void {
  const o = originNormalized.endsWith("/") ? originNormalized.slice(0, -1) : originNormalized;
  for (const p of collectPathwayTopicProgrammaticPublicPaths()) {
    const path = p.startsWith("/") ? p : `/${p}`;
    const forbiddenAbs = `${o}/${locale}${path}`;
    if (urls.includes(forbiddenAbs)) {
      throw new Error(
        `Locale marketing URL list must not include language-prefixed exam-hub programmatic URL (404): ${forbiddenAbs}`,
      );
    }
  }
}
