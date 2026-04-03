import "server-only";

import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { ProgrammaticPageOverlay } from "@/lib/seo/programmatic-overlay-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type OverlayBundle = Record<string, ProgrammaticPageOverlay>;

function resolvePublicRoot(): string {
  const root = process.cwd();
  const candidates = [
    path.join(root, "public", "i18n"),
    path.join(root, "nursenest-core", "public", "i18n"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return path.join(root, "public", "i18n");
}

const bundleCache = new Map<string, OverlayBundle | null>();

function readBundleFromDisk(locale: string): OverlayBundle | null {
  const base = resolvePublicRoot();
  const single = path.join(base, "programmatic-overlays", `${locale}.json`);
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
  const dir = path.join(base, "programmatic-overlays", locale);
  if (!existsSync(dir)) return null;
  const out: OverlayBundle = {};
  try {
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".json")) continue;
      const slug = name.replace(/\.json$/i, "");
      const fp = path.join(dir, name);
      out[slug] = JSON.parse(readFileSync(fp, "utf8")) as ProgrammaticPageOverlay;
    }
  } catch (e) {
    safeServerLog("i18n", "programmatic_overlay_dir_read_failed", {
      locale,
      path: dir,
      detail: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
  return Object.keys(out).length ? out : null;
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
