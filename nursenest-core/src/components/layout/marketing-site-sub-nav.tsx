"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { getExamNavStripItems } from "@/lib/marketing/country-exam-offerings";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

function isSubNavActive(strippedPath: string, href: string): boolean {
  const base = href.split("?")[0] || "";
  if (!base || base === "/") return false;
  if (strippedPath === base) return true;
  if (strippedPath.startsWith(`${base}/`)) return true;
  return false;
}

const LINK_BASE =
  "flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium leading-snug tracking-tight transition-[background,color,box-shadow] duration-200 md:px-3.5 md:py-2 md:text-sm";

/**
 * Pathway sub-navigation — soft editorial tint; pill active state (no harsh tabs).
 */
export function MarketingSiteSubNav() {
  const pathname = usePathname() ?? "/";
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const localize = (href: string) => {
    const mapped = mapLegacyMarketingHref(href);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  };

  const items = useMemo(() => {
    const strip = getExamNavStripItems(region);
    return [
      ...strip.map((s) => ({ key: s.id, labelKey: s.labelKey, href: s.href })),
      { key: "pre-nursing", labelKey: "nav.preNursing" as const, href: "/pre-nursing" },
      { key: "tools", labelKey: "nav.tools" as const, href: HUB.tools },
    ];
  }, [region]);

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;

  return (
    <nav
      aria-label={t("nav.pathwayHubsAria")}
      className="border-b border-[color-mix(in_srgb,var(--theme-primary)_12%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_6.5%,var(--theme-page-bg))]"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <ul className="-mx-3 flex h-10 snap-x snap-mandatory items-center gap-1 overflow-x-auto overscroll-x-contain px-3 py-1.5 sm:mx-0 sm:gap-1.5 sm:overflow-x-visible sm:px-0 sm:py-2 md:h-11 md:justify-center md:gap-2 lg:gap-2.5">
          {items.map((item) => {
            const href = localize(item.href);
            const active = isSubNavActive(strippedPath, item.href);
            return (
              <li key={item.key} className="flex shrink-0 snap-start items-center">
                <Link
                  href={href}
                  className={`${LINK_BASE} ${
                    active
                      ? "bg-[color-mix(in_srgb,var(--theme-primary)_14%,var(--theme-page-bg))] text-[var(--theme-heading-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "text-[color-mix(in_srgb,var(--theme-muted-text)_92%,var(--theme-heading-text))] hover:bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-page-bg))] hover:text-[var(--theme-heading-text)]"
                  } `}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
