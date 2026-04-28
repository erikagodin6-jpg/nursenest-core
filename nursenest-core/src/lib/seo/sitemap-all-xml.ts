import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { shouldReduceNonCriticalBuildWork } from "@/lib/build/build-safe-mode";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectLocaleMarketingSitemapSafeUrls,
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

/**
 * Single sitemap urlset used by `/sitemap.xml`.
 *
 * **Production-safe:** no database, Stripe, session, HTTP self-checks, or pathway lesson **detail** URLs.
 * Core URLs use {@link collectCoreUrls} with `productionSafeStatic`; locales use
 * {@link collectLocaleMarketingSitemapSafeUrls} (hubs only). On empty merge or unexpected errors,
 * callers still receive valid XML via {@link minimalUrlsetSingleHome} from the route handler.
 */
export async function buildSingleSitemapXmlSafe(): Promise<string> {
  const buildStarted = Date.now();
  try {
    const origin = normalizeOrigin(resolveSitemapOrigin());
    const allStatic = new Set<string>();
    const reduceForBuildSafeMode = shouldReduceNonCriticalBuildWork();

    const pushStatic = (url: string) => {
      const r = isValidPublicUrl(url, { origin, allowSitemapLogin: true });
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

    const coreUrls = await collectCoreUrls(origin, { productionSafeStatic: true });
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

      for (const locale of getSitemapIncludedLocales()) {
        for (const url of collectLocaleMarketingSitemapSafeUrls(origin, locale)) {
          pushStatic(url);
        }
      }
    }

    const merged: SitemapUrlEntry[] = [];
    for (const loc of Array.from(allStatic).sort()) {
      merged.push({ loc });
    }

    logSeoEmittedUrlBatch("sitemap_merged", merged.map((m) => m.loc), {
      staticCount: String(allStatic.size),
      mergedTotal: String(merged.length),
      productionSafeStatic: "1",
      buildSafeMode: reduceForBuildSafeMode ? "1" : "0",
    });
    safeServerLog("seo", "sitemap_build_complete", {
      durationMs: String(Date.now() - buildStarted),
      mergedTotal: String(merged.length),
    });

    if (merged.length === 0) {
      safeServerLog("seo", "sitemap_merged_empty_fallback", {
        staticCandidates: String(allStatic.size),
        buildSafeMode: reduceForBuildSafeMode ? "1" : "0",
      });
      return minimalUrlsetSingleHome();
    }

    return buildSitemapUrlsetFromAbsoluteUrls(merged);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error && e.stack ? e.stack.slice(0, 2500) : "";
    safeServerLog("seo", "sitemap_merged_build_failed", {
      detail: detail.slice(0, 800),
      stack,
    });
    return minimalUrlsetSingleHome();
  }
}
