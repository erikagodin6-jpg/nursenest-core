"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { PilotCountrySlug } from "@/config/country-localization-types";
import { regionalStripToPilotCountry } from "@/config/country-localization-types";
import { resolveRegionalMarketingStrip } from "@/lib/marketing/regional-marketing-nav-priority";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-path";
import { resolveLanguageTryOrder, resolveLocalizedContent } from "@/lib/localization/resolve-localized-content";

/**
 * Client resolver for pilot country hubs + language-aware content ordering.
 * Safe: small derived state only; no manifest FS reads on the client.
 */
export function useMarketingLocalizedContext() {
  const { locale } = useMarketingI18n();
  const pathname = usePathname() ?? "/";
  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;
  const globalRegion = useClientGlobalRegionCookie();
  const strip = useMemo(
    () => resolveRegionalMarketingStrip(strippedPath, locale, globalRegion),
    [strippedPath, locale, globalRegion],
  );
  const pilotCountry: PilotCountrySlug | null = useMemo(
    () => regionalStripToPilotCountry(strip, globalRegion),
    [strip, globalRegion],
  );

  const languageTryOrder = useMemo(
    () => resolveLanguageTryOrder(pilotCountry, locale),
    [pilotCountry, locale],
  );

  const localized = useMemo(
    () =>
      resolveLocalizedContent({
        selectedCountry: pilotCountry,
        selectedLanguage: locale,
        globalRegion,
        currentRoute: strippedPath,
        contentType: "blog",
      }),
    [pilotCountry, locale, globalRegion, strippedPath],
  );

  return {
    locale,
    strippedPath,
    regionalStrip: strip,
    globalRegion,
    pilotCountry,
    languageTryOrder,
    resolveMeta: localized,
  };
}
