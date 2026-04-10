"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { ThemePicker } from "@/components/theme/theme-picker";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShell,
} from "@/lib/theme/marketing-region-toggle";

/**
 * Desktop-only preferences rail — visually recessive; must not compete with primary header.
 */
export function MarketingHeaderUtilityStrip() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "utility_strip" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);
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
    <div className="nn-header-utility hidden md:block">
      <div className="mx-auto flex h-7 max-w-7xl items-center justify-end gap-2 px-4 lg:gap-2.5 lg:px-8">
        <div className="flex items-center gap-1.5">
          <span className="nn-marketing-caption shrink-0 leading-none text-[var(--header-utility-text)]">{t("nav.regionLabel")}</span>
          <div className={marketingRegionToggleShell("pill")} role="group" aria-label={t("nav.regionLabel")}>
            <button
              type="button"
              onClick={() => setRegionAndRefresh("US")}
              className={marketingRegionToggleSegment(region === "US", "compact")}
            >
              {t("home.region.us")}
            </button>
            <button
              type="button"
              onClick={() => setRegionAndRefresh("CA")}
              className={marketingRegionToggleSegment(region === "CA", "compact")}
            >
              {t("home.region.ca")}
            </button>
          </div>
        </div>

        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-0.5 rounded-full bg-transparent px-2 py-0.5 text-[11px] font-normal tracking-wide text-[var(--header-utility-text)] transition-colors hover:bg-[var(--surface-interactive-hover)] hover:text-[var(--theme-heading-text)]"
            aria-expanded={langOpen}
          >
            {t("nav.language")}
            <ChevronDown className={`h-3 w-3 shrink-0 opacity-50 transition-transform ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen ? (
            <div className="absolute end-0 z-[120] mt-1 max-h-56 w-52 overflow-y-auto rounded-xl border border-[var(--border-medium)] bg-[var(--bg-elevated)] p-1 shadow-[var(--shadow-card-hover)]">
              <MarketingLanguagePreferenceList
                onDone={() => setLangOpen(false)}
                renderItem={({ code, name, flag, disabled, onSelect }) => (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={onSelect}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-[var(--surface-interactive-hover)] ${
                      code === locale ? "bg-[var(--surface-selected)] font-medium text-[var(--theme-heading-text)]" : "text-[var(--theme-body-text)]"
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

        <div className="text-[var(--header-utility-text)] [&_button]:min-h-0 [&_button]:border-[var(--header-utility-border)] [&_button]:bg-transparent [&_button]:px-2 [&_button]:py-0.5 [&_button]:text-[11px] [&_button]:font-normal [&_button]:shadow-none [&_button]:hover:bg-[var(--surface-interactive-hover)] [&_button]:hover:text-[var(--theme-heading-text)]">
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
