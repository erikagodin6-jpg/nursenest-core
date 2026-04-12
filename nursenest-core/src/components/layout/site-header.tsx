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
import {
  HUB,
  NP,
  alliedHub,
  alliedQuestions,
  pnLessons,
  pnQuestions,
  rnLessons,
  rnQuestions,
  npNpQuestionsForRegion,
} from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { PRIMARY_CTA, VIEW_PRICING_CTA } from "@/lib/copy/cta-copy";

const NAV_LINK_CLASS = "nn-marketing-body-sm nn-marketing-nav-link whitespace-nowrap font-semibold tracking-tight";
type ExamMenuKey = "rn" | "pn" | "np" | "allied";

type MegaMenuLink = {
  key: string;
  label: string;
  href: string;
  description?: string;
};

type MegaMenuColumn = {
  key: "overview" | "learn" | "practice" | "quick";
  heading: string;
  description?: string;
  links: MegaMenuLink[];
};

type MegaMenuConfig = {
  key: ExamMenuKey;
  label: string;
  hubHref: string;
  columns: MegaMenuColumn[];
};

function isActivePath(current: string, base: string): boolean {
  if (!base || base === "/") return current === "/";
  if (current === base) return true;
  return current.startsWith(`${base}/`);
}

function createMegaMenus(region: "US" | "CA", t: (key: string) => string, locale: string): MegaMenuConfig[] {
  const rnHub = marketingExamHubPath(region, "rn");
  const pnHub = marketingExamHubPath(region, "pn");
  const npHub = marketingExamHubPath(region, "np");
  const alliedHubHref = alliedHub(region);
  const pnLabel = region === "CA" ? t("nav.tierDrop.rpnTitle") : t("nav.tierDrop.lpnTitle");
  const npLessons = region === "US" ? NP.fnpLessons : NP.caNpLessons;

  return [
    {
      key: "rn",
      label: formatTitleCase(t("nav.tierDrop.rnTitle"), locale),
      hubHref: rnHub,
      columns: [
        {
          key: "overview",
          heading: "RN Overview",
          description: "NCLEX-RN focused prep pathway and readiness flow.",
          links: [{ key: "rn-hub", label: "Open RN Hub", href: rnHub }],
        },
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "rn-lessons", label: "RN Lessons", href: rnLessons(region) },
            { key: "rn-guides", label: "Study Guides", href: rnLessons(region) },
            { key: "rn-concepts", label: "Key Concepts", href: rnHub },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "rn-questions", label: "Practice Questions", href: rnQuestions(region) },
            { key: "rn-cat", label: "CAT Exams", href: publicMarketingCatHrefForOffering(region, "rn") },
            { key: "rn-flashcards", label: "Flashcards", href: `${HUB.flashcards}?track=rn` },
            { key: "rn-bank", label: "Question Bank Hub", href: rnQuestions(region) },
          ],
        },
        {
          key: "quick",
          heading: "Quick Links",
          links: [
            { key: "rn-start", label: "Start Here", href: rnHub },
            { key: "rn-free", label: "Free Questions", href: rnQuestions(region) },
          ],
        },
      ],
    },
    {
      key: "pn",
      label: formatTitleCase(pnLabel, locale),
      hubHref: pnHub,
      columns: [
        {
          key: "overview",
          heading: "PN / RPN Overview",
          description: "Region-aware PN pathway with exam-aligned scopes.",
          links: [{ key: "pn-hub", label: "Open PN / RPN Hub", href: pnHub }],
        },
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "pn-lessons", label: "PN / RPN Lessons", href: pnLessons(region) },
            { key: "pn-guides", label: "Study Guides", href: pnLessons(region) },
            { key: "pn-concepts", label: "Key Concepts", href: pnHub },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "pn-questions", label: "Practice Questions", href: pnQuestions(region) },
            { key: "pn-cat", label: "CAT Exams", href: publicMarketingCatHrefForOffering(region, "pn") },
            { key: "pn-flashcards", label: "Flashcards", href: `${HUB.flashcards}?track=pn` },
            { key: "pn-bank", label: "Question Bank Hub", href: pnQuestions(region) },
          ],
        },
        {
          key: "quick",
          heading: "Quick Links",
          links: [
            { key: "pn-start", label: "Start Here", href: pnHub },
            { key: "pn-free", label: "Free Questions", href: pnQuestions(region) },
          ],
        },
      ],
    },
    {
      key: "np",
      label: formatTitleCase(t("nav.tierDrop.npTitle"), locale),
      hubHref: npHub,
      columns: [
        {
          key: "overview",
          heading: "NP Overview",
          description: "NP pathway prep for board-specific decision making.",
          links: [{ key: "np-hub", label: "Open NP Hub", href: npHub }],
        },
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "np-lessons", label: "NP Lessons", href: npLessons },
            { key: "np-guides", label: "Study Guides", href: npLessons },
            { key: "np-concepts", label: "Key Concepts", href: npHub },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "np-questions", label: "Practice Questions", href: npNpQuestionsForRegion(region) },
            { key: "np-cat", label: "CAT Exams", href: publicMarketingCatHrefForOffering(region, "np") },
            { key: "np-flashcards", label: "Flashcards", href: `${HUB.flashcards}?track=np` },
            { key: "np-bank", label: "Question Bank Hub", href: npNpQuestionsForRegion(region) },
          ],
        },
        {
          key: "quick",
          heading: "Quick Links",
          links: [
            { key: "np-start", label: "Start Here", href: npHub },
            { key: "np-free", label: "Free Questions", href: npNpQuestionsForRegion(region) },
          ],
        },
      ],
    },
    {
      key: "allied",
      label: formatTitleCase(t("nav.tierDrop.alliedTitle"), locale),
      hubHref: alliedHubHref,
      columns: [
        {
          key: "overview",
          heading: "Allied Health Overview",
          description: "Allied certification routes with profession-specific drilling.",
          links: [{ key: "allied-hub", label: "Open Allied Health Hub", href: alliedHubHref }],
        },
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "allied-lessons", label: "Allied Lessons", href: alliedHubHref },
            { key: "allied-guides", label: "Study Guides", href: alliedHubHref },
            { key: "allied-concepts", label: "Key Concepts", href: alliedHubHref },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "allied-questions", label: "Practice Questions", href: alliedQuestions(region) },
            { key: "allied-cat", label: "CAT Exams", href: publicMarketingCatHrefForOffering(region, "allied") },
            { key: "allied-flashcards", label: "Flashcards", href: `${HUB.flashcards}?track=allied` },
            { key: "allied-bank", label: "Question Bank Hub", href: alliedQuestions(region) },
          ],
        },
        {
          key: "quick",
          heading: "Quick Links",
          links: [
            { key: "allied-start", label: "Start Here", href: alliedHubHref },
            { key: "allied-free", label: "Free Questions", href: alliedQuestions(region) },
          ],
        },
      ],
    },
  ];
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
  const [mobileExpandedMega, setMobileExpandedMega] = useState<ExamMenuKey | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<ExamMenuKey | null>(null);
  const closeMegaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const localizeHref = (href: string) => {
    const mapped = mapLegacyMarketingHref(href);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  };

  const clearMegaCloseTimer = () => {
    if (!closeMegaTimeoutRef.current) return;
    clearTimeout(closeMegaTimeoutRef.current);
    closeMegaTimeoutRef.current = null;
  };

  const scheduleMegaClose = () => {
    clearMegaCloseTimer();
    closeMegaTimeoutRef.current = setTimeout(() => setOpenMegaMenu(null), 120);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
      if (!headerRef.current?.contains(e.target as Node)) setOpenMegaMenu(null);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMegaMenu(null);
        setLangOpen(false);
      }
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMegaMenu(null);
    setMobileExpandedMega(null);
  }, [pathname, locale, region]);

  useEffect(
    () => () => {
      if (closeMegaTimeoutRef.current) {
        clearTimeout(closeMegaTimeoutRef.current);
      }
    },
    [],
  );

  const megaMenus = useMemo(() => createMegaMenus(region, t, locale), [region, t, locale]);
  const pricingNav = {
    key: "pricing",
    href: HUB.pricing,
    matchBase: HUB.pricing,
    label: formatTitleCase(VIEW_PRICING_CTA, locale),
  };
  const openMega = megaMenus.find((menu) => menu.key === openMegaMenu) ?? null;

  const mobileMoreNav: { key: string; href: string; label: string }[] = [
    { key: "faq", href: "/faq", label: formatTitleCase(t("footer.faq"), locale) },
    { key: "pre-nursing", href: "/pre-nursing", label: formatTitleCase(t("nav.preNursing"), locale) },
    { key: "tools", href: HUB.tools, label: formatTitleCase(t("nav.tools"), locale) },
  ];

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;

  return (
    <div className="sticky top-0 z-50 nn-header-animate-in" ref={headerRef}>
      <MarketingHeaderUtilityStrip />
      <header className={`nn-header-nav ${isScrolled ? "nn-header-nav--scrolled" : ""}`}>
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
            className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex xl:gap-8"
            onMouseEnter={clearMegaCloseTimer}
            onMouseLeave={scheduleMegaClose}
          >
            {megaMenus.map((menu) => {
              const expanded = openMegaMenu === menu.key;
              return (
                <div key={menu.key} className="relative" onMouseEnter={() => setOpenMegaMenu(menu.key)}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mega-menu-${menu.key}`}
                    className={`${NAV_LINK_CLASS} inline-flex items-center gap-1 text-center`}
                    onClick={() => setOpenMegaMenu(expanded ? null : menu.key)}
                    onFocus={() => setOpenMegaMenu(menu.key)}
                  >
                    {menu.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                </div>
              );
            })}
            <Link
              href={localizeHref(pricingNav.href)}
              aria-current={isActivePath(strippedPath, pricingNav.matchBase) ? "page" : undefined}
              className={`${NAV_LINK_CLASS} text-center`}
              onClick={() =>
                trackClientEvent(PH.marketingNavClick, {
                  actor: "anonymous",
                  nav_id: pricingNav.key,
                  surface: "site_header_desktop",
                  marketing_region: region,
                })
              }
            >
              {pricingNav.label}
            </Link>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
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
        {openMega ? (
          <div
            id={`mega-menu-${openMega.key}`}
            role="dialog"
            aria-label={`${openMega.label} menu`}
            className="absolute inset-x-0 top-full z-[120] hidden lg:block"
            onMouseEnter={clearMegaCloseTimer}
            onMouseLeave={scheduleMegaClose}
          >
            <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-[var(--nav-border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-elevated)]">
                <div className="grid gap-5 lg:grid-cols-4">
                  {openMega.columns.map((column) => (
                    <section key={column.key} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                      <p className="nn-marketing-caption font-semibold tracking-widest text-[var(--nav-muted)]">
                        {formatEyebrow(column.key === "quick" ? "Quick Links" : column.key, locale)}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-[var(--theme-heading-text)]">
                        {formatTitleCase(column.heading, locale)}
                      </h3>
                      {column.description ? (
                        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
                          {formatSentenceCase(column.description, locale)}
                        </p>
                      ) : null}
                      <ul className="mt-3 space-y-2">
                        {column.links.map((link) => (
                          <li key={link.key}>
                            <Link
                              href={localizeHref(link.href)}
                              className="block rounded-lg px-2 py-2 text-sm font-medium text-[var(--theme-heading-text)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-link-hover)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                              onClick={() => {
                                setOpenMegaMenu(null);
                                trackClientEvent(PH.marketingNavClick, {
                                  actor: "anonymous",
                                  nav_id: `${openMega.key}_${link.key}`,
                                  surface: "site_header_mega_menu",
                                  marketing_region: region,
                                });
                              }}
                            >
                              {formatTitleCase(link.label, locale)}
                              {link.description ? (
                                <span className="mt-0.5 block text-xs font-normal text-[var(--theme-muted-text)]">
                                  {formatSentenceCase(link.description, locale)}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
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
                {megaMenus.map((menu) => {
                  const expanded = mobileExpandedMega === menu.key;
                  return (
                    <div key={menu.key} className="rounded-xl border border-[var(--nav-border)] bg-[var(--surface)]">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`mobile-mega-${menu.key}`}
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-[15px] font-semibold text-[var(--nav-fg)]"
                        onClick={() => setMobileExpandedMega(expanded ? null : menu.key)}
                      >
                        {menu.label}
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                      {expanded ? (
                        <div id={`mobile-mega-${menu.key}`} className="space-y-3 border-t border-[var(--nav-border)] px-3 py-3">
                          {menu.columns.map((column) => (
                            <div key={`${menu.key}-${column.key}`}>
                              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                                {formatEyebrow(column.key === "quick" ? "Quick Links" : column.key, locale)}
                              </p>
                              <ul className="space-y-1">
                                {column.links.map((link) => (
                                  <li key={link.key}>
                                    <Link
                                      href={localizeHref(link.href)}
                                      className="block rounded-lg px-2 py-2 text-[14px] font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                                      onClick={() => {
                                        trackClientEvent(PH.marketingNavClick, {
                                          actor: "anonymous",
                                          nav_id: `${menu.key}_${link.key}`,
                                          surface: "site_header_mobile_mega",
                                          marketing_region: region,
                                        });
                                        setMobileOpen(false);
                                      }}
                                    >
                                      {formatTitleCase(link.label, locale)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                <Link
                  href={localizeHref(pricingNav.href)}
                  className="flex items-center rounded-xl px-3 py-3 text-[15px] font-semibold text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)]"
                  onClick={() => {
                    trackClientEvent(PH.marketingNavClick, {
                      actor: "anonymous",
                      nav_id: pricingNav.key,
                      surface: "site_header_mobile_drawer",
                      marketing_region: region,
                    });
                    setMobileOpen(false);
                  }}
                >
                  {pricingNav.label}
                </Link>
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
                  {formatTitleCase(PRIMARY_CTA, locale)}
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
