import { saveContextPreferences } from "@/app/actions/save-context-preferences";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { getExamHubForGlobalRegion, localeAfterRegionSwitch } from "@/lib/marketing/global-region-exam-hubs";

type ApplyGlobalRegionSelectionOpts = {
  marketingLocale: GlobalLocaleCode;
  setUsCaMarketingRegion: (r: "US" | "CA") => void;
  router: { push: (href: string) => void | Promise<boolean> };
  /** Map marketing path + locale prefix (legacy mapping applied). */
  buildLocalizedPath: (localeCode: string, path: string) => string;
};

/**
 * Persists `nn_global_region` + locale cookies and routes to a country exam hub when available.
 * US/Canada also update the legacy US/CA marketing region toggle.
 */
export async function applyGlobalRegionSelection(
  newRegion: GlobalRegionSlug,
  opts: ApplyGlobalRegionSelectionOpts,
): Promise<void> {
  const { marketingLocale, setUsCaMarketingRegion, router, buildLocalizedPath } = opts;
  const nextLocale = localeAfterRegionSwitch(newRegion, marketingLocale);

  if (newRegion === "us" || newRegion === "canada") {
    const saved = await saveContextPreferences({ region: newRegion, locale: nextLocale });
    if (!saved.ok) return;
    setUsCaMarketingRegion(newRegion === "us" ? "US" : "CA");
    return;
  }

  const saved = await saveContextPreferences({ region: newRegion, locale: nextLocale });
  if (!saved.ok) return;

  const hub = getExamHubForGlobalRegion(newRegion);
  if (hub) {
    await router.push(buildLocalizedPath(nextLocale, hub.hubPath));
    return;
  }

  // Region has no mapped exam hub (e.g. nigeria) — still navigate so the click never no-ops.
  await router.push(buildLocalizedPath(nextLocale, "/"));
}
