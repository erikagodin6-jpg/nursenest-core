"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin, Menu, X } from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingHeaderAuthDesktop } from "@/components/auth/marketing-header-auth";
import { MarketingHeaderUtilityStrip } from "@/components/layout/marketing-header-utility-strip";
import { MarketingSiteSubNav } from "@/components/layout/marketing-site-sub-nav";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShellMobileRow,
} from "@/lib/theme/marketing-region-toggle";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { TierGatewayDropdown } from "@/components/layout/tier-gateway-dropdown";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

const NAV_LINK_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link font-medium tracking-tight text-[var(--theme-menu-text)]";

export function SiteHeader() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "site_header_mobile_drawer" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const localizeHref = (href: string) => {
    const mapped = mapLegacyMarketingHref(href);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const marketingNav = [
    { href: "/lessons", labelKey: "nav.lessons" as const },
    { href: "/pricing", labelKey: "nav.pricing" as const },
    { href: "/faq", labelKey: "footer.faq" as const },
  ];

  return (
    <div className="sticky top-0 z-50">
      <MarketingHeaderUtilityStrip />

      <header className="border-b border-[color-mix(in_srgb,var(--theme-nav-border)_55%,transparent)] bg-[color-mix(in_srgb,var(--theme-header-surface)_92%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--theme-header-surface)_88%,transparent)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5 lg:h-[3.75rem] lg:gap-6 lg:px-8">
          <Link
            href={localizeHref("/")}
            className="group flex min-w-0 shrink-0 items-center gap-2 overflow-hidden bg-transparent"
            aria-label={t("brand.homeAriaLabel")}
          >
            <SiteBrandLogoMark />
          </Link>

          <nav
            aria-label={t("nav.marketingExplore")}
            className="hidden min-w-0 flex-1 items-center justify-center md:flex md:gap-5 lg:gap-8"
          >
            <TierGatewayDropdown navLinkClass={`${NAV_LINK_CLASS} flex items-center gap-1`} />
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={localizeHref(item.href)}
                className={`${NAV_LINK_CLASS} max-w-[11rem] truncate`}
                onClick={() =>
                  trackClientEvent(PH.marketingNavClick, {
                    actor: "anonymous",
                    nav_id: item.href,
                    surface: "site_header_desktop",
                    marketing_region: region,
                  })
                }
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="flex min-w-0 items-center">
              <MarketingHeaderAuthDesktop />
            </div>

            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 shrink-0 p-0 text-[var(--theme-menu-text)] md:hidden"
              aria-label={t("nav.openMenu")}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <MarketingSiteSubNav />

      {mobileOpen ? (
        <div className="fixed inset-0 z-[200] md:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)} />
          <div className="absolute end-0 top-0 flex h-[100dvh] max-h-[100dvh] w-[min(100%,20rem)] flex-col border-s border-[var(--theme-separator)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--theme-separator)] px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
              <Link
                href={localizeHref("/")}
                className="flex min-w-0 shrink-0 items-center overflow-hidden bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
                onClick={() => setMobileOpen(false)}
              >
                <SiteBrandLogoMark />
              </Link>
              <Button type="button" variant="ghost" className="h-9 w-9 shrink-0 p-0" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-y-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <div className="mb-3 flex flex-col gap-1">
                <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--theme-muted-text)]">
                  {t("nav.tierDrop.heading")}
                </p>
                {[
                  { key: "rn", href: marketingExamHubPath(region, "rn"), labelKey: "nav.tierDrop.rnTitle" as const },
                  {
                    key: "pn",
                    href: marketingExamHubPath(region, "pn"),
                    labelKey: (region === "CA" ? "nav.tierDrop.rpnTitle" : "nav.tierDrop.lpnTitle") as Parameters<typeof t>[0],
                  },
                  { key: "np", href: marketingExamHubPath(region, "np"), labelKey: "nav.tierDrop.npTitle" as const },
                  { key: "allied", href: marketingExamHubPath(region, "allied"), labelKey: "nav.tierDrop.alliedTitle" as const },
                  { key: "pre-nursing", href: "/pre-nursing", labelKey: "nav.tierDrop.preNursingTitle" as const },
                  { key: "tools", href: HUB.tools, labelKey: "nav.tierDrop.toolsTitle" as const },
                ].map((tier) => (
                  <Link
                    key={tier.key}
                    href={localizeHref(tier.href)}
                    className={`${NAV_LINK_CLASS} rounded-xl px-3 py-2.5`}
                    onClick={() => {
                      trackClientEvent(PH.marketingNavClick, {
                        actor: "anonymous",
                        nav_id: `tier_drop_${tier.key}`,
                        surface: "site_header_mobile_drawer",
                        marketing_region: region,
                      });
                      setMobileOpen(false);
                    }}
                  >
                    {t(tier.labelKey)}
                  </Link>
                ))}
              </div>
              <div className="mb-3 flex flex-col gap-1">
                <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--theme-muted-text)]">
                  {t("nav.more")}
                </p>
                {marketingNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href)}
                    className={`${NAV_LINK_CLASS} rounded-xl px-3 py-2.5`}
                    onClick={() => {
                      trackClientEvent(PH.marketingNavClick, {
                        actor: "anonymous",
                        nav_id: item.href,
                        surface: "site_header_mobile_drawer",
                        marketing_region: region,
                      });
                      setMobileOpen(false);
                    }}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>

              <p className="mb-2 nn-marketing-caption text-[var(--theme-muted-text)]">{t("nav.regionLabel")}</p>
              <div className={`mb-3 ${marketingRegionToggleShellMobileRow()}`} role="group" aria-label={t("nav.regionLabel")}>
                <button type="button" onClick={() => setRegionAndRefresh("US")} className={marketingRegionToggleSegment(region === "US", "mobile")}>
                  {t("home.region.us")}
                </button>
                <button type="button" onClick={() => setRegionAndRefresh("CA")} className={marketingRegionToggleSegment(region === "CA", "mobile")}>
                  {t("home.region.ca")}
                </button>
              </div>
              <p className="mb-3 flex items-start gap-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-muted-text)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}
              </p>
              <hr className="my-3 border-[var(--theme-separator)]" />
              <p className="mb-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-muted-text)]">{t("nav.language")}</p>
              <div className="relative mb-3" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--theme-card-border)] px-3 py-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-body-text)]"
                >
                  {t("nav.language")}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen ? (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-1">
                    <MarketingLanguagePreferenceList
                      onDone={() => setLangOpen(false)}
                      renderItem={({ code, name, flag, disabled, onSelect }) => (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={onSelect}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-body-text)] hover:bg-[var(--theme-menu-hover-bg)] ${
                            code === locale ? "bg-[var(--theme-menu-hover-bg)]/60" : ""
                          }`}
                        >
                          <span>{flag}</span>
                          {name}
                        </button>
                      )}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mb-2">
                <ThemePicker
                  labels={{
                    navTheme: t("nav.theme"),
                    themeGroupLight: t("nav.themeGroupLight"),
                    themeGroupDark: t("nav.themeGroupDark"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
