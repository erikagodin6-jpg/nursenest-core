"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin, Menu, X } from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingHeaderAuthDesktop } from "@/components/auth/marketing-header-auth";
import { MarketingHeaderUtilityStrip } from "@/components/layout/marketing-header-utility-strip";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShellMobileRow,
} from "@/lib/theme/marketing-region-toggle";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { formatTitleCase } from "@/lib/format/text-case";

const NAV_LINK_CLASS = "nn-marketing-body-sm nn-marketing-nav-link font-semibold tracking-tight";

function isActivePath(current: string, base: string): boolean {
  if (!base || base === "/") return current === "/";
  if (current === base) return true;
  return current.startsWith(`${base}/`);
}

export function SiteHeader() {
  const { t, locale } = useMarketingI18n();
  const pathname = usePathname() ?? "/";
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

  const primaryNav = [
    {
      key: "rn",
      href: marketingExamHubPath(region, "rn"),
      matchBase: marketingExamHubPath(region, "rn"),
      label: formatTitleCase(t("nav.tierDrop.rnTitle"), locale),
    },
    {
      key: "pn",
      href: marketingExamHubPath(region, "pn"),
      matchBase: marketingExamHubPath(region, "pn"),
      label: formatTitleCase(region === "CA" ? t("nav.tierDrop.rpnTitle") : t("nav.tierDrop.lpnTitle"), locale),
    },
    {
      key: "np",
      href: marketingExamHubPath(region, "np"),
      matchBase: marketingExamHubPath(region, "np"),
      label: formatTitleCase(t("nav.tierDrop.npTitle"), locale),
    },
    {
      key: "allied",
      href: marketingExamHubPath(region, "allied"),
      matchBase: marketingExamHubPath(region, "allied"),
      label: formatTitleCase(t("nav.tierDrop.alliedTitle"), locale),
    },
    {
      key: "lessons",
      href: "/lessons",
      matchBase: "/lessons",
      label: formatTitleCase(t("nav.lessons"), locale),
    },
    {
      key: "practice-questions",
      href: rnQuestions(region),
      matchBase: rnQuestions(region),
      label: formatTitleCase(t("footer.testBank"), locale),
    },
  ] as const;

  const mobileMoreNav: { key: string; href: string; label: string }[] = [
    { key: "pricing", href: "/pricing", label: formatTitleCase(t("nav.pricing"), locale) },
    { key: "faq", href: "/faq", label: formatTitleCase(t("footer.faq"), locale) },
    { key: "pre-nursing", href: "/pre-nursing", label: formatTitleCase(t("nav.preNursing"), locale) },
    { key: "tools", href: HUB.tools, label: formatTitleCase(t("nav.tools"), locale) },
  ];

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;

  return (
    <div className="sticky top-0 z-50 nn-header-animate-in">
      <MarketingHeaderUtilityStrip />
      <header className="nn-header-nav">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto,1fr,auto] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:h-[4.35rem] lg:px-8">
          <Link
            href={localizeHref("/")}
            className="group flex min-w-0 shrink-0 items-center gap-2 overflow-hidden bg-transparent pe-2"
            aria-label={t("brand.homeAriaLabel")}
          >
            <SiteBrandLogoMark />
          </Link>

          <nav
            aria-label={t("nav.marketingExplore")}
            className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex xl:gap-2"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.key}
                href={localizeHref(item.href)}
                aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                className={`${NAV_LINK_CLASS} text-center`}
                onClick={() =>
                  trackClientEvent(PH.marketingNavClick, {
                    actor: "anonymous",
                    nav_id: item.key,
                    surface: "site_header_desktop",
                    marketing_region: region,
                  })
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden min-w-0 items-center lg:flex">
              <MarketingHeaderAuthDesktop />
            </div>

            <Button
              type="button"
              variant="ghost"
              className="h-10 w-10 shrink-0 rounded-xl border border-[var(--header-border)] p-0 text-[var(--header-text)] hover:bg-[var(--nav-hover)] lg:hidden"
              aria-label={t("nav.openMenu")}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[200] md:hidden animate-[nn-overlay-enter_0.24s_ease_both]">
          <button type="button" className="absolute inset-0 bg-black/56" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-0 top-0 flex h-[100dvh] max-h-[100dvh] flex-col border-b border-[var(--header-border)] bg-[var(--header-background)] text-[var(--nav-fg)] shadow-[var(--shadow-elevated)] animate-[nn-drawer-slide-in_0.28s_cubic-bezier(0.25,0.1,0.25,1)_both]">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--header-border)] px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
              <Link
                href={localizeHref("/")}
                className="flex min-w-0 shrink-0 items-center overflow-hidden bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
                onClick={() => setMobileOpen(false)}
              >
                <SiteBrandLogoMark />
              </Link>
              <Button type="button" variant="ghost" className="h-10 w-10 shrink-0 rounded-xl border border-[var(--nav-border)] p-0 text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-y-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
              <div className="space-y-1">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                  {t("nav.marketingExplore")}
                </p>
                {primaryNav.map((item) => (
                  <Link
                    key={item.key}
                    href={localizeHref(item.href)}
                    className="flex items-center rounded-xl px-3 py-3 text-[15px] font-semibold text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)]"
                    onClick={() => {
                      trackClientEvent(PH.marketingNavClick, {
                        actor: "anonymous",
                        nav_id: item.key,
                        surface: "site_header_mobile_drawer",
                        marketing_region: region,
                      });
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                  {t("nav.more")}
                </p>
                {mobileMoreNav.map((item) => (
                  <Link
                    key={item.key}
                    href={localizeHref(item.href)}
                    className="flex items-center rounded-xl px-3 py-3 text-[15px] font-medium text-[var(--nav-muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)]"
                    onClick={() => {
                      trackClientEvent(PH.marketingNavClick, {
                        actor: "anonymous",
                        nav_id: item.key,
                        surface: "site_header_mobile_drawer",
                        marketing_region: region,
                      });
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-1 flex flex-col gap-2 border-t border-[var(--header-border)] pt-5">
                <Link
                  href={localizeHref(`/signup?callbackUrl=${encodeURIComponent("/app")}`)}
                  className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  {formatTitleCase(t("nav.getStarted"), locale)}
                </Link>
                <Link
                  href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-4 py-3 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {formatTitleCase(t("nav.logIn"), locale)}
                </Link>
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
              <p className="mb-3 flex items-start gap-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-muted)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}
              </p>
              <hr className="my-3 border-[var(--header-border)]" />
              <p className="mb-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-muted)]">{t("nav.language")}</p>
              <div className="relative mb-3" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] px-3 py-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                >
                  {t("nav.language")}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen ? (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-elevated)]">
                    <MarketingLanguagePreferenceList
                      onDone={() => setLangOpen(false)}
                      renderItem={({ code, name, flag, disabled, onSelect }) => (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={onSelect}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] ${
                            code === locale ? "bg-[var(--nav-active)]" : ""
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
