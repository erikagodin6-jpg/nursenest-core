import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { resolveMarketingShardI18nRoot } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { ProgrammaticPageOverlay } from "@/lib/seo/programmatic-overlay-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type OverlayBundle = Record<string, ProgrammaticPageOverlay>;
function programmaticOverlayDir(): string {
  return path.join(resolveMarketingShardI18nRoot(), "programmatic-overlays");
}

const bundleCache = new Map<string, OverlayBundle | null>();

function readBundleFromDisk(locale: string): OverlayBundle | null {
  const single = path.join(programmaticOverlayDir(), `${locale}.json`);
  if (existsSync(single)) {
    try {
      return JSON.parse(readFileSync(single, "utf8")) as OverlayBundle;
    } catch (e) {
      safeServerLog("i18n", "programmatic_overlay_parse_failed", {
        locale,
        path: single,
        detail: e instanceof Error ? e.message : String(e),
      });
      return null;
    }
  }
  return null;
}

/** Cached overlay map for a locale (slug → partial page). English has no overlay. */
export function loadProgrammaticOverlayBundle(locale: string): OverlayBundle {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const hit = bundleCache.get(locale);
  if (hit !== undefined) return hit ?? {};
  const data = readBundleFromDisk(locale);
  bundleCache.set(locale, data);
  return data ?? {};
}

export function getProgrammaticOverlayForSlug(
  locale: string,
  slug: string,
): ProgrammaticPageOverlay | undefined {
  const bundle = loadProgrammaticOverlayBundle(locale);
  return bundle[slug];
}

export function clearProgrammaticOverlayCacheForTests(): void {
  bundleCache.clear();
}
