import "server-only";

import { listBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-blog-xml";
import { listLocalizedBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-localized-blog-xml";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { shouldReduceNonCriticalBuildWork } from "@/lib/build/build-safe-mode";
import { shouldSkipDbBackedSitemapUrlsForBuild } from "@/lib/seo/sitemap-build-skip";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectLocaleMarketingUrls,
  collectSeoPagesUrls,
  collectToolsUrls,
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

    if (merged.length === 0) {
      safeServerLog("seo", "sitemap_merged_empty", {
        staticCandidates: String(allStatic.size),
        blogMapSize: String(blogEntries.size),
        skipDbBackedEntries: skipDbBackedEntries ? "1" : "0",
        buildSafeMode: reduceForBuildSafeMode ? "1" : "0",
      });
      throw new Error(
        "sitemap_merged_empty: no indexable URLs after merge (check origin alignment, public-url-validator rejections, and locale tier exclusions).",
      );
    }

    if (merged.length === 1) {
      let solePath: string;
      try {
        solePath = new URL(merged[0]!.loc).pathname.replace(/\/$/, "") || "/";
      } catch {
        throw new Error("sitemap_degenerate: sole merged URL is not parseable");
      }
      if (solePath === "" || solePath === "/") {
        throw new Error(
          "sitemap_degenerate_home_only: merged urlset collapsed to the homepage only — refusing to emit a misleading sitemap.",
        );
      }
    }

    let blogDetailUrlCount = 0;
    let canadaRnLessonUrlCount = 0;
    for (const m of merged) {
      try {
        const path = new URL(m.loc).pathname;
        if (path.startsWith("/blog/") && path !== "/blog" && path.length > "/blog/".length) {
          blogDetailUrlCount += 1;
        }
        if (path.includes("/canada/rn/nclex-rn/lessons")) {
          canadaRnLessonUrlCount += 1;
        }
      } catch {
        /* ignore parse errors here; validation happens elsewhere */
      }
    }
    safeServerLog("seo", "sitemap_merged_semantic_counts", {
      mergedTotal: String(merged.length),
      blogDetailUrlCount: String(blogDetailUrlCount),
      canadaRnLessonUrlCount: String(canadaRnLessonUrlCount),
    });
    if (
      isDatabaseUrlConfigured() &&
      !skipDbBackedEntries &&
      !reduceForBuildSafeMode &&
      blogDetailUrlCount === 0
    ) {
      safeServerLog("seo", "sitemap_semantic_warning_no_blog_detail_urls", {
        mergedTotal: String(merged.length),
        blogMapSize: String(blogEntries.size),
      });
    }
    if (
      isDatabaseUrlConfigured() &&
      !skipDbBackedEntries &&
      !reduceForBuildSafeMode &&
      canadaRnLessonUrlCount === 0
    ) {
      safeServerLog("seo", "sitemap_semantic_warning_no_canada_rn_nclex_lesson_urls", {
        mergedTotal: String(merged.length),
      });
    }

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
    const stack = e instanceof Error && e.stack ? e.stack.slice(0, 2500) : "";
    safeServerLog("seo", "sitemap_merged_build_failed", {
      detail: detail.slice(0, 800),
      stack,
    });
    throw e;
  }
}
