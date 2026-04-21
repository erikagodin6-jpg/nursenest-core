import { REGION_CONFIG, type GlobalLocaleCode, type GlobalRegionSlug } from "@/lib/i18n/global-regions";

/**
 * Locale resolution after a global region switch — depends on {@link REGION_CONFIG} and is kept
 * separate from {@link ./global-region-exam-hubs} so hub-only imports avoid eager global-regions.
 */
export function localeAfterRegionSwitch(
  region: GlobalRegionSlug,
  currentLocale: GlobalLocaleCode,
): GlobalLocaleCode {
  const cfg = REGION_CONFIG[region];
  if (cfg.allowedLocales.includes(currentLocale)) return currentLocale;
  return cfg.defaultLocale;
}
