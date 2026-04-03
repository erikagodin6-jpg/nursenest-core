"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  GraduationCap,
  Heart,
  Menu,
  X,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { HOME_BRAND_LOGO_MARK_CLASSNAME } from "@/lib/branding/logo-config";
import { MarketingHeaderAuthDesktop, MarketingHeaderAuthMobile } from "@/components/auth/marketing-header-auth";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import { getExamNavStripItems } from "@/lib/marketing/country-exam-offerings";
import type { GlobalNavIconId } from "@/config/global-nav-config";
import {
  getMarketingGuidesPlansItems,
  getMarketingLearnPracticeItems,
  getMarketingMobileDrawerLeafItems,
  getMarketingWhoWeHelpItems,
} from "@/config/global-nav-config";

function NavDetails({
  label,
  children,
  subBar,
  dense,
}: {
  label: string;
  children: ReactNode;
  subBar?: boolean;
  /** Tighter homepage header: matches reduced row padding. */
  dense?: boolean;
}) {
  return (
    <details className={`group relative ${subBar ? "shrink-0" : ""}`}>
      <summary
        className={`flex cursor-pointer list-none items-center gap-1 font-medium text-[var(--theme-menu-text)] hover:bg-[var(--surface-interactive-hover)] hover:text-primary [&::-webkit-details-marker]:hidden ${
          subBar
            ? "min-h-7 rounded-md px-1.5 py-0.5 text-xs text-primary/70 hover:text-primary lg:px-2"
            : dense
              ? "rounded-full px-2.5 py-1.5 text-sm"
              : "rounded-full px-3 py-2 text-sm"
        }`}
      >
        {label}
        <ChevronDown className={`shrink-0 transition-transform group-open:rotate-180 ${subBar ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
      </summary>
      <div className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-xl border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-elevated,var(--theme-card-bg))] py-1 shadow-[var(--shadow-elevated)]">{children}</div>
    </details>
  );
}

function NavLinkItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm text-[var(--theme-menu-text)] hover:bg-[var(--surface-interactive-hover)] hover:text-primary"
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { pathname: pathWithoutLocale } = stripMarketingLocalePrefix(pathname);
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
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

  const exploreIcons: Record<GlobalNavIconId, typeof BookOpen> = {
    "book-open": BookOpen,
    "graduation-cap": GraduationCap,
    briefcase: Briefcase,
    heart: Heart,
  };

  const examNavStrip = useMemo(() => getExamNavStripItems(region), [region]);

  const isMarketingHome = pathWithoutLocale === "/" || pathWithoutLocale === "";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--divider,var(--theme-nav-border))] bg-[color-mix(in_srgb,var(--theme-nav-bg)_94%,var(--theme-primary))]/92 backdrop-blur-md transition-colors duration-200">
      {/* Single primary bar: promo links live under “Explore” / mobile menu — removes stacked top bar height */}

      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 sm:gap-2 sm:px-4 lg:px-8 ${isMarketingHome ? "py-1" : "py-1 sm:py-1.5"}`}
      >
        <Link
          href={localizeHref("/")}
          className="group flex shrink-0 items-center gap-2 overflow-visible bg-transparent"
          aria-label={t("brand.homeAriaLabel")}
        >
          <SiteBrandLogoMark className={isMarketingHome ? HOME_BRAND_LOGO_MARK_CLASSNAME : undefined} />
        </Link>

        <nav className={`hidden items-center md:flex ${isMarketingHome ? "gap-0 lg:gap-0.5" : "gap-0.5 lg:gap-1"}`}>
          <Link
            href={localizeHref("/")}
            className={`rounded-full font-medium text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] hover:text-[var(--theme-menu-hover-text)] ${isMarketingHome ? "px-2.5 py-1.5 text-sm" : "px-3 py-2 text-sm"}`}
          >
            {t("nav.home")}
          </Link>

          <NavDetails label={t("nav.marketingExplore")} dense={isMarketingHome}>
            {getMarketingWhoWeHelpItems().map((item) => {
              const Icon = item.icon ? exploreIcons[item.icon] : BookOpen;
              return (
                <NavLinkItem key={item.id} href={localizeHref(item.href)}>
                  <span className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                    {t(item.labelKey)}
                  </span>
                </NavLinkItem>
              );
            })}
          </NavDetails>

          <NavDetails label={t("nav.study")} dense={isMarketingHome}>
            {getMarketingLearnPracticeItems().map((item) => (
              <NavLinkItem key={item.id} href={localizeHref(item.href)}>
                {t(item.labelKey)}
              </NavLinkItem>
            ))}
          </NavDetails>

          <NavDetails label={t("nav.resources")} dense={isMarketingHome}>
            {getMarketingGuidesPlansItems().map((item) => (
              <NavLinkItem key={item.id} href={localizeHref(item.href)}>
                {t(item.labelKey)}
              </NavLinkItem>
            ))}
          </NavDetails>

          <div
            className={`mx-1 flex items-center gap-0.5 rounded-full border border-[var(--theme-nav-border)] px-0.5 py-0.5 ${isMarketingHome ? "scale-[0.96] lg:scale-100" : ""}`}
          >
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${region === "US" ? "bg-role-cta-soft text-role-cta-on-soft" : "text-[var(--theme-muted-text)] hover:bg-[var(--theme-menu-hover-bg)]"}`}
            >
              {t("home.region.us")}
            </button>
            <button
              type="button"
              onClick={() => setRegion("CA")}
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${region === "CA" ? "bg-role-cta-soft text-role-cta-on-soft" : "text-[var(--theme-muted-text)] hover:bg-[var(--theme-menu-hover-bg)]"}`}
            >
              {t("home.region.ca")}
            </button>
          </div>

          <div className="relative hidden lg:flex" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className={`flex items-center gap-1 rounded-full font-medium text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] hover:text-[var(--theme-menu-hover-text)] ${isMarketingHome ? "px-2.5 py-1.5 text-sm" : "px-3 py-2 text-sm"}`}
            >
              {t("nav.language")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 z-[100] mt-1 max-h-64 w-52 overflow-y-auto rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] py-1 shadow-lg">
                <MarketingLanguagePreferenceList
                  onDone={() => setLangOpen(false)}
                  renderItem={({ code, name, flag, disabled, onSelect }) => (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={onSelect}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] ${
                        code === locale ? "bg-[var(--theme-menu-hover-bg)]/60 font-semibold" : ""
                      }`}
                    >
                      <span>{flag}</span>
                      {name}
                    </button>
                  )}
                />
                <Link
                  href={mapLegacyMarketingHref("/languages")}
                  className="block border-t border-[var(--theme-separator)] px-3 py-2 text-xs font-semibold text-primary hover:underline"
                  onClick={() => setLangOpen(false)}
                >
                  {t("footer.viewAllLanguages")}
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <ThemePicker
            className="shrink-0"
            labels={{
              navTheme: t("nav.theme"),
              themeGroupLight: t("nav.themeGroupLight"),
              themeGroupDark: t("nav.themeGroupDark"),
            }}
          />
          <MarketingHeaderAuthDesktop />
          <Button
            type="button"
            variant="ghost"
            className="md:hidden h-9 w-9 shrink-0 p-0 text-[var(--theme-menu-text)]"
            aria-label={t("nav.openMenu")}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Exam strip: same on homepage and inner pages (RN / PN / NP / Allied from getExamNavStripItems). Was hidden on `/`, which made NP invisible in “main” nav on home. */}
      <div className="hidden border-t border-role-cta/15 bg-role-cta-soft md:block">
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center gap-x-0.5 overflow-x-auto overflow-y-hidden px-2 py-0.5 sm:px-4 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={localizeHref("/exam-lessons")}
            className="shrink-0 px-1.5 py-0.5 text-xs font-medium text-role-cta-on-soft/90 hover:text-role-cta-on-soft lg:px-2"
          >
            {t("nav.lessonsByExam")}
          </Link>
          <span className="hidden text-[var(--theme-muted-text)] sm:inline" aria-hidden="true">
            |
          </span>
          {examNavStrip.map((item, idx) => (
            <span key={item.id} className="contents">
              {idx > 0 ? (
                <span className="hidden text-[var(--theme-muted-text)] sm:inline" aria-hidden="true">
                  |
                </span>
              ) : null}
              <Link
                href={localizeHref(item.href)}
                className="shrink-0 px-1.5 py-0.5 text-xs font-medium text-role-cta-on-soft/90 hover:text-role-cta-on-soft lg:px-2"
              >
                {t(item.labelKey)}
              </Link>
            </span>
          ))}
          <span className="hidden text-[var(--theme-muted-text)] sm:inline" aria-hidden="true">
            |
          </span>
          <NavDetails label={t("nav.examPrepShort")} subBar>
            <NavLinkItem href={localizeHref("/mock-exams")}>{t("nav.practiceExams")}</NavLinkItem>
            <NavLinkItem href={localizeHref("/pricing")}>{t("nav.pricing")}</NavLinkItem>
          </NavDetails>
          <Link
            href={localizeHref("/pricing")}
            className="shrink-0 px-1.5 py-0.5 text-xs font-medium text-role-cta-on-soft/85 hover:text-role-cta-on-soft lg:px-2"
          >
            {t("nav.pricing")}
          </Link>
          <Link
            href={localizeHref("/faq")}
            className="shrink-0 px-1.5 py-0.5 text-xs font-medium text-role-cta-on-soft/85 hover:text-role-cta-on-soft lg:px-2"
          >
            {t("footer.faq")}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)} />
          {/* h-[100dvh] + min-h-0 scroll region: avoids clipped menu on mobile browsers with dynamic toolbars */}
          <div className="absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-[min(100%,20rem)] flex-col border-l border-[var(--theme-separator)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]">
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--theme-separator)] p-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <Link
                href={localizeHref("/")}
                className="flex shrink-0 items-center gap-2 overflow-visible bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
              >
                <SiteBrandLogoMark className={HOME_BRAND_LOGO_MARK_CLASSNAME} />
              </Link>
              <Button type="button" variant="ghost" className="h-9 w-9 p-0" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-y-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">{t("nav.regionLabel")}</p>
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRegion("US")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${
                    region === "US" ? "border-role-cta/40 bg-role-cta-soft text-role-cta-on-soft" : "border-[var(--theme-card-border)] text-[var(--theme-muted-text)]"
                  }`}
                >
                  {t("home.region.us")}
                  {region === "US" ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
                <button
                  type="button"
                  onClick={() => setRegion("CA")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${
                    region === "CA" ? "border-role-cta/40 bg-role-cta-soft text-role-cta-on-soft" : "border-[var(--theme-card-border)] text-[var(--theme-muted-text)]"
                  }`}
                >
                  {t("home.region.ca")}
                  {region === "CA" ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
              </div>
              <p className="mb-2 flex items-start gap-2 text-xs text-[var(--theme-muted-text)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}
              </p>
              <hr className="my-3 border-[var(--theme-separator)]" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">{t("nav.examHubsMobile")}</p>
              <div className="mb-4 flex flex-col gap-1.5">
                {examNavStrip.map((item) => (
                  <Link
                    key={item.id}
                    href={localizeHref(item.href)}
                    className="rounded-lg border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] px-3 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/35"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
              <hr className="my-3 border-[var(--theme-separator)]" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">{t("nav.language")}</p>
              <div className="mb-4 max-h-[min(50vh,20rem)] space-y-0.5 overflow-y-auto rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-1">
                <MarketingLanguagePreferenceList
                  onDone={() => setMobileOpen(false)}
                  renderItem={({ code, name, flag, disabled, onSelect }) => (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={onSelect}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] ${
                        code === locale ? "bg-[var(--theme-menu-hover-bg)]/60 font-semibold" : ""
                      }`}
                    >
                      <span>{flag}</span>
                      {name}
                    </button>
                  )}
                />
              </div>
              <Link
                href={localizeHref("/")}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.home")}
              </Link>
              {getMarketingMobileDrawerLeafItems().map((item) => (
                <Link
                  key={item.id}
                  href={localizeHref(item.href)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              <MarketingHeaderAuthMobile onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
