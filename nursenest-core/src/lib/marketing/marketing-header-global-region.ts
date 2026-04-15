import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { HUB_BY_REGION } from "@/lib/marketing/global-region-exam-hubs";
import type { NursenestRegion } from "@/lib/region/use-nursenest-region";

/** First path segment under `/exams/…` → global region slug (from shipped marketing hubs). */
const EXAMS_HUB_SEGMENT_TO_REGION: Partial<Record<string, GlobalRegionSlug>> = (() => {
  const map: Partial<Record<string, GlobalRegionSlug>> = {};
  for (const [slug, hub] of Object.entries(HUB_BY_REGION)) {
    if (!hub) continue;
    const parts = hub.hubPath.replace(/^\//, "").split("/").filter(Boolean);
    if (parts[0] === "exams" && parts[1] && map[parts[1]] === undefined) {
      map[parts[1]] = slug as GlobalRegionSlug;
    }
  }
  return map;
})();

function pathWithoutQuery(strippedPathname: string): string {
  return strippedPathname.split("?")[0] ?? strippedPathname;
}

/**
 * US or Canada from the active marketing route (`/us/…`, `/canada/…`), after locale strip.
 */
function usOrCanadaFromMarketingPath(strippedPathname: string): "us" | "canada" | null {
  const p = pathWithoutQuery(strippedPathname);
  if (p === "/canada" || p.startsWith("/canada/")) return "canada";
  if (p === "/us" || p.startsWith("/us/")) return "us";
  return null;
}

/**
 * Canada-focused allied health marketing surface — prefer Canada for header context.
 */
function isCanadaAlliedHealthPath(strippedPathname: string): boolean {
  const p = pathWithoutQuery(strippedPathname);
  return p === "/allied-health" || p.startsWith("/allied-health/");
}

function expansionRegionFromExamsPath(strippedPathname: string): GlobalRegionSlug | null {
  const p = pathWithoutQuery(strippedPathname);
  const m = /^\/exams\/([^/]+)/.exec(p);
  if (!m?.[1]) return null;
  return EXAMS_HUB_SEGMENT_TO_REGION[m[1]] ?? null;
}

function isUsOrCanadaSlug(r: GlobalRegionSlug): boolean {
  return r === "us" || r === "canada";
}

function usCaFromMarketingExamRegion(r: NursenestRegion): "us" | "canada" {
  return r === "CA" ? "canada" : "us";
}

export type EffectiveDefaultPublicGlobalRegionInput = {
  /**
   * Marketing pathname with locale prefix already removed
   * (`stripMarketingLocalePrefix(pathname).pathname`).
   */
  strippedPathname: string;
  /** Raw `nn_global_region` cookie value (may include expansion regions). */
  globalRegionCookie: GlobalRegionSlug | null;
  marketingExamRegion: NursenestRegion;
  /** From session `user.country` when `"US"` | `"CA"` */
  sessionCountryUsCa: "US" | "CA" | undefined;
};

/**
 * Single source of truth for which global region the **public marketing header** should reflect.
 *
 * Priority:
 * 1. Active route (US/Canada hubs, Canada allied-health, `/exams/…` expansion hubs)
 * 2. Signed-in user US/CA profile
 * 3. `nn_global_region` only when `us` or `canada` (legacy / intentional US–CA selection)
 * 4. Legacy marketing US vs CA exam region (`NursenestRegion`)
 *
 * Expansion regions (e.g. Philippines) are **not** implied from a stale `nn_global_region` alone;
 * they appear when the URL is an expansion hub or the user is on that experience.
 */
export function effectiveDefaultPublicGlobalRegion(
  args: EffectiveDefaultPublicGlobalRegionInput,
): GlobalRegionSlug {
  const { strippedPathname, globalRegionCookie, marketingExamRegion, sessionCountryUsCa } = args;

  const routeUsCa = usOrCanadaFromMarketingPath(strippedPathname);
  if (routeUsCa) return routeUsCa;

  if (isCanadaAlliedHealthPath(strippedPathname)) return "canada";

  const routeExpansion = expansionRegionFromExamsPath(strippedPathname);
  if (routeExpansion) return routeExpansion;

  if (sessionCountryUsCa === "CA") return "canada";
  if (sessionCountryUsCa === "US") return "us";

  if (globalRegionCookie && isUsOrCanadaSlug(globalRegionCookie)) {
    return globalRegionCookie;
  }

  return usCaFromMarketingExamRegion(marketingExamRegion);
}

/** Alias used by header utilities; resolves through {@link effectiveDefaultPublicGlobalRegion}. */
export const effectiveMarketingHeaderGlobalRegion = effectiveDefaultPublicGlobalRegion;
