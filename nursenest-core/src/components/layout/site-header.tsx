"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, MapPin, Menu, X } from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingHeaderAuthDesktop } from "@/components/auth/marketing-header-auth";
import { Button } from "@/components/ui/button";

const NAV_LINK_CLASS =
  "nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] transition-colors duration-150 hover:text-primary";

const REGION_BTN_CLASS =
  "nn-marketing-body-sm font-medium tracking-normal rounded-full px-2 py-1 transition-colors duration-150";

export function SiteHeader() {
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

  const marketingNav = [
    { href: "/lessons", labelKey: "nav.exams" as const },
    { href: "/question-bank", labelKey: "nav.questionBank" as const },
    { href: "/practice-exams", labelKey: "nav.practiceExams" as const },
    { href: "/pricing", labelKey: "nav.pricing" as const },
    { href: "/faq", labelKey: "footer.faq" as const },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--divider,var(--theme-nav-border))] bg-[var(--theme-header-surface)]/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-2 sm:gap-3 sm:px-4 lg:h-16 lg:px-8">
        <Link
          href={localizeHref("/")}
          className="group flex min-w-0 shrink-0 items-center gap-2 overflow-hidden bg-transparent"
          aria-label={t("brand.homeAriaLabel")}
        >
          <SiteBrandLogoMark />
        </Link>

        <nav
          aria-label={t("nav.marketingExplore")}
          className="hidden min-w-0 flex-1 items-center justify-center md:flex md:gap-4 lg:gap-6"
        >
          {marketingNav.map((item) => (
            <Link key={item.href} href={localizeHref(item.href)} className={`${NAV_LINK_CLASS} max-w-[11rem] truncate`}>
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <div className="inline-flex items-center rounded-full border border-[var(--theme-nav-border)] bg-[var(--theme-card-bg)] p-0.5">
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`${REGION_BTN_CLASS} ${
                region === "US" ? "bg-role-cta-soft text-role-cta-on-soft" : "text-[var(--theme-muted-text)] hover:bg-[var(--theme-menu-hover-bg)]"
              }`}
              aria-label={t("home.region.us")}
            >
              {t("home.region.us")}
            </button>
            <button
              type="button"
              onClick={() => setRegion("CA")}
              className={`${REGION_BTN_CLASS} ${
                region === "CA" ? "bg-role-cta-soft text-role-cta-on-soft" : "text-[var(--theme-muted-text)] hover:bg-[var(--theme-menu-hover-bg)]"
              }`}
              aria-label={t("home.region.ca")}
            >
              {t("home.region.ca")}
            </button>
          </div>

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
                {marketingNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href)}
                    className={`${NAV_LINK_CLASS} rounded-xl px-3 py-2.5`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>

              <p className="mb-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-muted-text)]">{t("nav.regionLabel")}</p>
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRegion("US")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 nn-marketing-body-sm font-medium tracking-normal ${
                    region === "US" ? "border-role-cta/40 bg-role-cta-soft text-role-cta-on-soft" : "border-[var(--theme-card-border)] text-[var(--theme-muted-text)]"
                  }`}
                >
                  {t("home.region.us")}
                  {region === "US" ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
                <button
                  type="button"
                  onClick={() => setRegion("CA")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 nn-marketing-body-sm font-medium tracking-normal ${
                    region === "CA" ? "border-role-cta/40 bg-role-cta-soft text-role-cta-on-soft" : "border-[var(--theme-card-border)] text-[var(--theme-muted-text)]"
                  }`}
                >
                  {t("home.region.ca")}
                  {region === "CA" ? <CheckCircle2 className="h-4 w-4" /> : null}
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

            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
