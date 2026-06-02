/**
 * SiteHeaderServer -- Server Component wrapper for the marketing SiteHeader.
 *
 * Responsibilities:
 * 1. Pre-computes static nav link labels and hrefs server-side from i18n messages.
 * 2. Pre-computes the tier hub strip (RN/PN/NP/Allied/NewGrad labels + hrefs) for
 *    the detected marketing region -- eliminates buildMarketingTierHubStrip() from
 *    the client hydration critical path (was one of the 53 useMemo/hook calls).
 * 3. Passes everything as `precomputedNavData` to the client SiteHeader.
 * 4. Establishes a clean server/client boundary so static nav labels are never
 *    recomputed by useMarketingI18n() hooks during client hydration.
 *
 * Architecture: Marketing layouts should use SiteHeaderServer instead of SiteHeader
 * directly. Non-marketing routes that don't have the message shards available can
 * still import SiteHeader directly (backward-compatible fallback path).
 */

import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { formatTitleCase } from "@/lib/format/text-case";
import { buildMarketingTierHubStrip } from "@/lib/navigation/marketing-tier-hub-strip";
import { SiteHeader, type SiteHeaderProps, type SiteHeaderPrecomputedNav } from "@/components/layout/site-header";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";

/** Resolve a key from a flat messages record with a safe English fallback. */
function pick(messages: Record<string, string>, key: string, fallback: string): string {
  const v = messages[key]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/** Load nav + brand message shards from the filesystem (server-only path, bounded 400ms). */
async function loadNavMessagesSafe(locale: string): Promise<Record<string, string>> {
  try {
    const timeoutMs = 400;
    const timeoutPromise = new Promise<Record<string, string>>((resolve) =>
      setTimeout(() => resolve({}), timeoutMs),
    );
    const loadPromise = import(
      "@/lib/marketing-i18n/load-marketing-message-shards"
    ).then(({ loadMarketingMessageShards }) =>
      loadMarketingMessageShards(locale, ["nav", "brand"]),
    );
    return await Promise.race([loadPromise, timeoutPromise]);
  } catch {
    return {};
  }
}

function localizeHref(locale: string, href: string): string {
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) return href;
    return withMarketingLocale(locale, href);
  } catch {
    return href;
  }
}

function buildPrecomputedNavData(
  messages: Record<string, string>,
  locale: string,
  region: MarketingRegionToggle,
): SiteHeaderPrecomputedNav {
  const tr = (key: string, fallback: string) => pick(messages, key, fallback);

  // Precompute the tier hub strip server-side so SiteHeader.tierHubMenus useMemo
  // can short-circuit on first render, removing buildMarketingTierHubStrip + its
  // dependencies (marketingExamHubPath, publicNewGradStudyDestinations) from the
  // client hydration task.
  const tierHubStrip = buildMarketingTierHubStrip(region, (k) => tr(k, k));

  return {
    locale,
    serverRegion: region,
    tierHubStrip,
    homeAriaLabel: tr("brand.homeAriaLabel", "NurseNest home"),
    loginLabel: formatTitleCase(tr("nav.logIn", "Log In"), locale),
    signupLabel: formatTitleCase(tr("nav.signup", "Start Free"), locale),
    // Brand/company links → Row 1 center nav.
    // Order: About (discovery) → Tools (feature) → FAQ (support) → Pricing (conversion).
    // Blog is intentionally excluded — accessible via mobile drawer and footer.
    // These must NOT appear in the class/pathway row.
    brandNavLinks: [
      {
        key: "about",
        href: localizeHref(locale, "/about"),
        matchBase: "/about",
        label: formatTitleCase(tr("nav.about", "About"), locale),
      },
      {
        key: "tools",
        href: localizeHref(locale, HUB.tools),
        matchBase: HUB.tools,
        label: formatTitleCase(tr("nav.tools", "Tools"), locale),
      },
      {
        key: "faq",
        href: localizeHref(locale, "/faq"),
        matchBase: "/faq",
        label: formatTitleCase(tr("footer.faq", "FAQ"), locale),
      },
      {
        key: "pricing",
        href: localizeHref(locale, HUB.pricing),
        matchBase: "/pricing",
        label: formatTitleCase(tr("nav.pricing", "Pricing"), locale),
      },
    ],
    // Class/pathway links → Row 2 tier rail (alongside RN/RPN/NP/New Grad/Allied chips).
    // Individual exam/admissions items only — "Pre-Nursing" parent category excluded
    // because its children (HESI, TEAS, CASPer) are already present as individual items.
    pathwayNavLinks: [
      {
        key: "ecg",
        href: localizeHref(locale, "/ecg-interpretation"),
        matchBase: "/ecg-interpretation",
        label: "ECG",
      },
      {
        key: "hesi",
        href: "/pre-nursing/hesi-a2",
        matchBase: "/pre-nursing/hesi-a2",
        label: "HESI A2",
      },
      {
        key: "teas",
        href: "/pre-nursing/ati-teas",
        matchBase: "/pre-nursing/ati-teas",
        label: "ATI TEAS",
      },
      {
        key: "casper",
        href: "/pre-nursing/casper",
        matchBase: "/pre-nursing/casper",
        label: "CASPER",
      },
    ],
  };
}

/** Resolve marketing region safely -- defaults to CA (Canada-first) on failure. */
async function resolveMarketingRegionSafe(): Promise<MarketingRegionToggle> {
  try {
    return (await readOptionalMarketingRegionToggleForCountry()) ?? "CA";
  } catch {
    return "CA";
  }
}

/**
 * Server Component wrapper for the marketing header.
 *
 * Pre-computes static nav labels AND the tier hub strip (RN/PN/NP/Allied/NewGrad)
 * from the server-side i18n message cache and detected region. The client component
 * uses these directly for first render, removing two expensive computation chains
 * from the 53-hook hydration sequence.
 */
export async function SiteHeaderServer({
  serverHasStaffSession,
  staticRegion,
}: SiteHeaderProps & { staticRegion?: MarketingRegionToggle } = {}) {
  const locale = DEFAULT_MARKETING_LOCALE;
  const [messages, region] = await Promise.all([
    loadNavMessagesSafe(locale),
    staticRegion ?? resolveMarketingRegionSafe(),
  ]);
  const precomputedNavData = buildPrecomputedNavData(messages, locale, region);

  return (
    <SiteHeader
      serverHasStaffSession={serverHasStaffSession}
      precomputedNavData={precomputedNavData}
    />
  );
}
