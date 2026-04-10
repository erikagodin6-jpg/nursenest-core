import "server-only";

import { listBlogSitemapUrlsSafe } from "@/lib/seo/sitemap-blog-xml";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectLocaleMarketingUrls,
  collectSeoPagesUrls,
  collectToolsUrls,
  normalizeOrigin,
  resolveSitemapOrigin,
} from "@/lib/seo/sitemap-static-xml";
import { CORE_HOSTED_MARKETING_LOCALES } from "@/lib/i18n/marketing-locale-policy";

/**
 * Single sitemap urlset used by `/sitemap.xml`.
 * Includes core marketing, locale marketing, tools, SEO pages, and blog URLs.
 */
export async function buildSingleSitemapXmlSafe(): Promise<string> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const all = new Set<string>();

  for (const url of await collectCoreUrls(origin)) {
    all.add(url);
  }

  for (const url of collectSeoPagesUrls(origin)) {
    all.add(url);
  }

  for (const url of collectToolsUrls(origin)) {
    all.add(url);
  }

  for (const locale of CORE_HOSTED_MARKETING_LOCALES) {
    for (const url of collectLocaleMarketingUrls(origin, locale)) {
      all.add(url);
    }
  }

  for (const url of await listBlogSitemapUrlsSafe()) {
    all.add(url);
  }

  return buildSitemapUrlsetFromAbsoluteUrls(Array.from(all).sort());
}
