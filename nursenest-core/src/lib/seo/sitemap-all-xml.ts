import "server-only";

import { listBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-blog-xml";
import { listLocalizedBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-localized-blog-xml";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { shouldReduceNonCriticalBuildWork } from "@/lib/build/build-safe-mode";
import { shouldSkipDbBackedSitemapUrlsForBuild } from "@/lib/seo/sitemap-build-skip";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectLocaleMarketingUrls,
  collectSeoPagesUrls,
  collectToolsUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import {
  getSitemapIncludedLocales,
  isLocalePrefixedPathnameExcludedFromSitemap,
} from "@/lib/i18n/language-readiness";
import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { logSeoEmittedUrlBatch } from "@/lib/seo/seo-url-emission-audit";
import {
  isSeoHttpValidationEnabled,
  SeoHttpValidationStrictError,
  validateUrlsHttpBatch,
} from "@/lib/seo/seo-http-emit-validation";

/**
 * Single sitemap urlset used by `/sitemap.xml`.
 * Includes core marketing, **full-tier** locale marketing, tools, SEO pages, and blog URLs.
 * Omits `/app/*`, auth noindex paths, partial/incomplete locale prefixes, and other blocked public patterns
 * (see `public-url-validator`, `sitemap-marketing-exclusions`, `language-readiness`).
 */
export async function buildSingleSitemapXmlSafe(): Promise<string> {
  const buildStarted = Date.now();
  try {
    const origin = normalizeOrigin(resolveSitemapOrigin());
    const allStatic = new Set<string>();
    const blogEntries = new Map<string, string | undefined>();
    const skipDbBackedEntries = shouldSkipDbBackedSitemapUrlsForBuild();
    const reduceForBuildSafeMode = shouldReduceNonCriticalBuildWork();

    const pushStatic = (url: string) => {
      const r = isValidPublicUrl(url, { origin });
      if (!r.ok) {
        safeServerLog("seo", "sitemap_public_url_rejected", {
          url: url.slice(0, 500),
          code: r.code,
          detail: (r.detail ?? "").slice(0, 200),
        });
        return;
      }
      try {
        const path = new URL(url).pathname;
        if (isLocalePrefixedPathnameExcludedFromSitemap(path)) {
          safeServerLog("seo", "sitemap_locale_tier_excluded", {
            url: url.slice(0, 500),
          });
          return;
        }
      } catch {
        return;
      }
      allStatic.add(url);
    };

    const [coreUrls, blogSitemapEntries, localizedBlogSitemapEntries] = await Promise.all([
      collectCoreUrls(origin),
      skipDbBackedEntries || reduceForBuildSafeMode
        ? Promise.resolve<SitemapUrlEntry[]>([])
        : listBlogSitemapEntriesSafe(),
      skipDbBackedEntries || reduceForBuildSafeMode
        ? Promise.resolve<SitemapUrlEntry[]>([])
        : listLocalizedBlogSitemapEntriesSafe(),
    ]);

    for (const url of coreUrls) {
      pushStatic(url);
    }

    if (!reduceForBuildSafeMode) {
      for (const url of collectSeoPagesUrls(origin)) {
        pushStatic(url);
      }

      for (const url of collectToolsUrls(origin)) {
        pushStatic(url);
      }

      const localeBatches = await Promise.all(
        getSitemapIncludedLocales().map(async (locale) => collectLocaleMarketingUrls(origin, locale)),
      );
      for (const batch of localeBatches) {
        for (const url of batch) {
          pushStatic(url);
        }
      }
    }

    for (const entry of blogSitemapEntries) {
      const r = isValidPublicUrl(entry.loc, { origin });
      if (!r.ok) {
        safeServerLog("seo", "sitemap_blog_url_rejected", {
          url: entry.loc.slice(0, 500),
          code: r.code,
          detail: (r.detail ?? "").slice(0, 200),
        });
        continue;
      }
      try {
        if (isLocalePrefixedPathnameExcludedFromSitemap(new URL(entry.loc).pathname)) {
          safeServerLog("seo", "sitemap_blog_locale_tier_excluded", { url: entry.loc.slice(0, 500) });
          continue;
        }
      } catch {
        continue;
      }
      blogEntries.set(entry.loc, entry.lastmod);
    }

    for (const entry of localizedBlogSitemapEntries) {
      const r = isValidPublicUrl(entry.loc, { origin });
      if (!r.ok) {
        safeServerLog("seo", "sitemap_localized_blog_url_rejected", {
          url: entry.loc.slice(0, 500),
          code: r.code,
          detail: (r.detail ?? "").slice(0, 200),
        });
        continue;
      }
      try {
        if (isLocalePrefixedPathnameExcludedFromSitemap(new URL(entry.loc).pathname)) {
          safeServerLog("seo", "sitemap_localized_blog_locale_tier_excluded", {
            url: entry.loc.slice(0, 500),
          });
          continue;
        }
      } catch {
        continue;
      }
      blogEntries.set(entry.loc, entry.lastmod);
    }

    const merged: SitemapUrlEntry[] = [];
    for (const loc of Array.from(allStatic).sort()) {
      const lastmod = blogEntries.get(loc);
      merged.push(lastmod ? { loc, lastmod } : { loc });
    }
    for (const [loc, lastmod] of Array.from(blogEntries.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (allStatic.has(loc)) continue;
      merged.push(lastmod ? { loc, lastmod } : { loc });
    }
    logSeoEmittedUrlBatch("sitemap_merged", merged.map((m) => m.loc), {
      staticCount: String(allStatic.size),
      mergedTotal: String(merged.length),
      dbBackedEntriesSkipped: skipDbBackedEntries ? "1" : "0",
      buildSafeMode: reduceForBuildSafeMode ? "1" : "0",
    });
    safeServerLog("seo", "sitemap_build_complete", {
      durationMs: String(Date.now() - buildStarted),
      mergedTotal: String(merged.length),
      blogLocCount: String(blogEntries.size),
    });

    if (isSeoHttpValidationEnabled()) {
      await validateUrlsHttpBatch(merged.map((m) => m.loc), {
        sourceFile: "src/lib/seo/sitemap-all-xml.ts",
        generator: "buildSingleSitemapXmlSafe",
        kind: "sitemap",
      });
    }

    return buildSitemapUrlsetFromAbsoluteUrls(merged);
  } catch (e) {
    if (e instanceof SeoHttpValidationStrictError) {
      throw e;
    }
    const detail = e instanceof Error ? e.message : String(e);
    safeServerLog("seo", "sitemap_merged_build_failed", {
      detail: detail.slice(0, 400),
    });
    return minimalUrlsetSingleHome();
  }
}
