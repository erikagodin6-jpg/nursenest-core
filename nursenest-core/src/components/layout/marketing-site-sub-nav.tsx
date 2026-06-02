"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { getNavChromeStyle } from "@/lib/theme/nav-chrome";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { mapLegacyMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useCountryPreference } from "@/lib/region/use-country-preference";
import { countryExamLabels } from "@/lib/region/country-preference";
import { getExamNavStripItems } from "@/lib/marketing/country-exam-offerings";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { formatTitleCase } from "@/lib/format/text-case";

function isSubNavActive(strippedPath: string, href: string): boolean {
  const base = href.split("?")[0] || "";
  if (!base || base === "/") return false;
  if (strippedPath === base) return true;
  if (strippedPath.startsWith(`${base}/`)) return true;
  return false;
}

/** Allow wrapping for long German/French/Spanish labels; render as low-noise tabs. */
const LINK_BASE =
  "flex min-h-[2.25rem] w-max max-w-[min(100%,13rem)] items-center justify-center whitespace-normal text-balance break-words border-b-2 border-transparent px-1.5 py-1.5 text-[13px] font-medium leading-snug tracking-tight transition-[border-color,color] duration-200 md:max-w-[15rem] md:px-2 md:py-2 md:text-sm";

/**
 * Pathway sub-navigation — text-first tabs with a single active underline.
 */
type SubNavItem = { key: string; label: string; href: string };

export function MarketingSiteSubNav() {
  const pathname = usePathname() ?? "/";
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const { country } = useCountryPreference();
  const { theme } = useTheme();
  const navChromeStyle = getNavChromeStyle(theme);

  const localize = (href: string) => {
    const mapped = mapLegacyMarketingHref(href);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  };

  const items = useMemo((): SubNavItem[] => {
    // Country-specific exam labels take precedence over the generic i18n keys.
    const labels = countryExamLabels(country);
    const strip = getExamNavStripItems(region);
    const examItems: SubNavItem[] = strip.map((s) => {
      let label: string;
      switch (s.id) {
        case "rn":    label = labels.rn;     break;
        case "pn":    label = labels.pn;     break;
        case "np":    label = labels.np;     break;
        case "allied":label = labels.allied; break;
        default:      label = formatTitleCase(t(s.labelKey), locale);
      }
      return { key: s.id, label, href: s.href };
    });
    return [
      ...examItems,
      { key: "pre-nursing", label: formatTitleCase(t("nav.preNursing"), locale), href: "/pre-nursing" },
      { key: "tools",       label: formatTitleCase(t("nav.tools"), locale),      href: HUB.tools },
    ];
  }, [region, country, t, locale]);

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;

  return (
    <nav
      aria-label={t("nav.pathwayHubsAria")}
      style={navChromeStyle}
      className="border-b"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <ul className="-mx-3 flex min-h-10 snap-x snap-mandatory items-stretch gap-1 overflow-x-auto overscroll-x-contain px-3 py-1.5 sm:mx-0 sm:items-center sm:gap-1.5 sm:overflow-x-visible sm:px-0 sm:py-2 md:min-h-11 md:justify-center md:gap-2 lg:gap-2.5">
          {items.map((item) => {
            const href = localize(item.href);
            const active = isSubNavActive(strippedPath, item.href);
            return (
              <li key={item.key} className="flex shrink-0 snap-start items-stretch sm:items-center">
                <Link
                  href={href}
                  className={`${LINK_BASE} ${
                    active
                      ? "border-[color:var(--nn-nav-fg)] text-[color:var(--nn-nav-fg)]"
                      : "text-[color:var(--nn-nav-fg)] opacity-75 hover:border-[color:var(--nn-nav-border)] hover:opacity-100"
                  } `}
                  onClick={() =>
                    trackClientEvent(PH.marketingSubNavClick, {
                      actor: "anonymous",
                      nav_key: item.key,
                      marketing_region: region,
                    })
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
