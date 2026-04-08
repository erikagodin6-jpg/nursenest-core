"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { ThemePicker } from "@/components/theme/theme-picker";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

const REGION_BTN =
  "rounded-full px-2 py-px text-[11px] font-normal leading-tight tracking-wide transition-[background,color] duration-200";

/**
 * Desktop-only preferences rail — visually recessive; must not compete with primary header.
 */
export function MarketingHeaderUtilityStrip() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="hidden border-b border-[color-mix(in_srgb,var(--theme-nav-border)_35%,transparent)] bg-[color-mix(in_srgb,var(--theme-muted-text)_3.5%,var(--theme-page-bg))] md:block">
      <div className="mx-auto flex h-7 max-w-7xl items-center justify-end gap-2 px-4 lg:gap-2.5 lg:px-8">
        <div className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--theme-muted-text)_6%,transparent)] p-px">
          <button
            type="button"
            onClick={() => setRegion("US")}
            className={`${REGION_BTN} ${
              region === "US"
                ? "bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                : "text-[var(--theme-muted-text)] hover:text-[color-mix(in_srgb,var(--theme-body-text)_75%,var(--theme-muted-text))]"
            }`}
          >
            {t("home.region.us")}
          </button>
          <button
            type="button"
            onClick={() => setRegion("CA")}
            className={`${REGION_BTN} ${
              region === "CA"
                ? "bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                : "text-[var(--theme-muted-text)] hover:text-[color-mix(in_srgb,var(--theme-body-text)_75%,var(--theme-muted-text))]"
            }`}
          >
            {t("home.region.ca")}
          </button>
        </div>

        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-0.5 rounded-full bg-transparent px-2 py-0.5 text-[11px] font-normal tracking-wide text-[var(--theme-muted-text)] transition-colors hover:text-[color-mix(in_srgb,var(--theme-body-text)_80%,var(--theme-muted-text))]"
            aria-expanded={langOpen}
          >
            {t("nav.language")}
            <ChevronDown className={`h-3 w-3 shrink-0 opacity-50 transition-transform ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen ? (
            <div className="absolute end-0 z-[120] mt-1 max-h-56 w-52 overflow-y-auto rounded-xl border border-[color-mix(in_srgb,var(--theme-card-border)_80%,transparent)] bg-[var(--theme-card-bg)] p-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <MarketingLanguagePreferenceList
                onDone={() => setLangOpen(false)}
                renderItem={({ code, name, flag, disabled, onSelect }) => (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={onSelect}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-[var(--theme-menu-hover-bg)] ${
                      code === locale ? "bg-[var(--theme-menu-hover-bg)]/60 font-medium text-[var(--theme-heading-text)]" : "text-[var(--theme-body-text)]"
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

        <div className="text-[var(--theme-muted-text)] [&_button]:min-h-0 [&_button]:border-[color-mix(in_srgb,var(--theme-nav-border)_40%,transparent)] [&_button]:bg-transparent [&_button]:px-2 [&_button]:py-0.5 [&_button]:text-[11px] [&_button]:font-normal [&_button]:opacity-90 [&_button]:shadow-none [&_button]:hover:bg-[color-mix(in_srgb,var(--theme-muted-text)_8%,transparent)]">
          <ThemePicker
            className="shrink-0"
            labels={{
              navTheme: t("nav.theme"),
              themeGroupLight: t("nav.themeGroupLight"),
              themeGroupDark: t("nav.themeGroupDark"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
