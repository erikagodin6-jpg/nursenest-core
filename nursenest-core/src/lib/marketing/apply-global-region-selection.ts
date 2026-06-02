import { saveContextPreferences } from "@/app/actions/save-context-preferences";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import { localeAfterRegionSwitch } from "@/lib/marketing/global-region-exam-hubs-locale";
import { getMarketReadiness } from "@/lib/navigation/market-readiness";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";

type ApplyGlobalRegionSelectionOpts = {
  marketingLocale: GlobalLocaleCode;
  setUsCaMarketingRegion: (r: "US" | "CA") => void;
  router: { push: (href: string) => void | Promise<boolean> };
  /** Map marketing path + locale prefix (legacy mapping applied). */
  buildLocalizedPath: (localeCode: string, path: string) => string;
};

function emitGlobalRegionSelectionAnalytics(args: {
  newRegion: GlobalRegionSlug;
  marketingLocale: GlobalLocaleCode;
  savedOk: boolean;
  destinationKind: "save_failed" | "us_ca_toggle" | "expansion_hub" | "home_fallback";
}): void {
  const { newRegion, marketingLocale, savedOk, destinationKind } = args;
  const tier = getMarketReadiness(newRegion).supportTier;
  trackProductEvent(PH.marketingHeaderGlobalRegionSelected, {
    global_region_slug: newRegion,
    market_support_tier: tier,
    destination_kind: destinationKind,
    marketing_locale: marketingLocale,
    context_preferences_saved: savedOk,
  });
}

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
    if (!saved.ok) {
      emitGlobalRegionSelectionAnalytics({
        newRegion,
        marketingLocale,
        savedOk: false,
        destinationKind: "save_failed",
      });
      return;
    }
    setUsCaMarketingRegion(newRegion === "us" ? "US" : "CA");
    emitGlobalRegionSelectionAnalytics({
      newRegion,
      marketingLocale,
      savedOk: true,
      destinationKind: "us_ca_toggle",
    });
    return;
  }

  const saved = await saveContextPreferences({ region: newRegion, locale: nextLocale });
  if (!saved.ok) {
    emitGlobalRegionSelectionAnalytics({
      newRegion,
      marketingLocale,
      savedOk: false,
      destinationKind: "save_failed",
    });
    return;
  }

  const hub = getExamHubForGlobalRegion(newRegion);
  if (hub) {
    emitGlobalRegionSelectionAnalytics({
      newRegion,
      marketingLocale,
      savedOk: true,
      destinationKind: "expansion_hub",
    });
    await router.push(buildLocalizedPath(nextLocale, hub.hubPath));
    return;
  }

  // Region has no mapped exam hub (e.g. nigeria) — still navigate so the click never no-ops.
  emitGlobalRegionSelectionAnalytics({
    newRegion,
    marketingLocale,
    savedOk: true,
    destinationKind: "home_fallback",
  });
  await router.push(buildLocalizedPath(nextLocale, "/"));
}
