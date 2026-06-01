"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingUtilityFloatingPanel } from "@/components/layout/marketing-utility-floating-panel";
import { publicMarketingThemeChoiceCount } from "@/lib/theme/theme-registry";

const CountrySelectorDropdownLazy = dynamic(
  () => import("@/components/layout/country-selector-dropdown").then((m) => ({ default: m.CountrySelectorDropdown })),
  { ssr: false },
);

const MarketingLanguagePreferenceListLazy = dynamic(
  () => import("@/components/i18n/marketing-language-preference").then((m) => ({ default: m.MarketingLanguagePreferenceList })),
  { ssr: false },
);

const ThemePickerLazy = dynamic(
  () => import("@/components/theme/theme-picker").then((m) => ({ default: m.ThemePicker })),
  { ssr: false },
);

const LANGUAGE_PANEL_WIDTH_PX = 208;

export type MarketingHeaderUtilityChromeMode = "dark-bar" | "standard" | "row4" | "dark-marketing";

export function MarketingHeaderUtilityCluster({
  chromeMode,
  className,
}: {
  chromeMode: MarketingHeaderUtilityChromeMode;
  includeUnpublishedRegions?: boolean;
  className?: string;
}) {
  const { t, locale } = useMarketingI18n();
  const [langOpen, setLangOpen] = useState(false);
  const langAnchorRef = useRef<HTMLDivElement>(null);
  const langPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langAnchorRef.current?.contains(target) || langPanelRef.current?.contains(target)) return;
      setLangOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const triggerBase =
    "inline-flex h-[32px] items-center rounded-full border px-3 text-[0.8125rem] font-medium leading-tight tracking-normal";
  const darkMarketingTrigger =
    `${triggerBase} max-w-[11rem] gap-1 border-[color-mix(in_srgb,var(--nav-fg)_20%,transparent)] bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)] font-normal text-[var(--nav-fg)] shadow-none transition-colors hover:bg-[color-mix(in_srgb,var(--nav-fg)_14%,transparent)]`;
  const langButtonClass =
    chromeMode === "row4"
      ? `${triggerBase} nn-header-utility-trigger-row4 gap-0.5 font-medium transition-colors`
      : chromeMode === "dark-marketing"
        ? `${darkMarketingTrigger} max-w-none gap-0.5`
        : `${triggerBase} gap-0.5 bg-white font-normal text-[var(--theme-heading-text)] transition-colors`;
  const themeWrapClass =
    chromeMode === "row4"
      ? "nn-header-utility-theme-row4 text-[var(--nav-fg)] [&_button]:h-[32px] [&_button]:min-h-0 [&_button]:rounded-full [&_button]:border [&_button]:px-3 [&_button]:py-1 [&_button]:text-[0.8125rem] [&_button]:font-medium [&_button]:shadow-none"
      : "text-[var(--nav-fg)] [&_button]:h-[32px] [&_button]:min-h-0 [&_button]:rounded-full [&_button]:border [&_button]:px-3 [&_button]:py-1 [&_button]:text-[0.8125rem] [&_button]:shadow-none";

  return (
    <div
      data-testid="marketing-header-utility-cluster"
      data-nn-header-layer="utility-controls"
      className={`nn-header-utility-cluster--quiet flex min-w-0 shrink flex-wrap items-center justify-end gap-1.5 lg:gap-2 ${className ?? ""}`}
    >
      <CountrySelectorDropdownLazy variant="header" />

      <div className="shrink-0" ref={langAnchorRef}>
        <button type="button" onClick={() => setLangOpen((open) => !open)} className={langButtonClass} aria-expanded={langOpen}>
          {t("nav.language")}
          <ChevronDown className={`h-3 w-3 shrink-0 opacity-50 transition-transform ${langOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      <MarketingUtilityFloatingPanel
        open={langOpen}
        anchorRef={langAnchorRef}
        panelRef={langPanelRef}
        widthPx={LANGUAGE_PANEL_WIDTH_PX}
      >
        {langOpen ? (
          <div className="rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-card-hover)]">
            <MarketingLanguagePreferenceListLazy
              onDone={() => setLangOpen(false)}
              renderItem={({ code, name, flag, disabled, onSelect }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onSelect}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-[var(--nav-hover)] ${
                    code === locale ? "bg-[var(--nav-active)] font-medium text-[var(--nav-on-active-fg)]" : "text-[var(--nav-muted)]"
                  }`}
                >
                  <span>{flag}</span>
                  {name}
                </button>
              )}
            />
          </div>
        ) : null}
      </MarketingUtilityFloatingPanel>

      {publicMarketingThemeChoiceCount() > 1 ? (
        <div className={themeWrapClass}>
          <ThemePickerLazy
            className="shrink-0"
            dropdownPortal
            pickerScope="publicMarketing"
            labels={{
              navTheme: t("nav.theme"),
              themeGroupLight: t("nav.themeGroupLight"),
              themeGroupDark: t("nav.themeGroupDark"),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function MarketingHeaderUtilityStrip({
  variant = "standard",
  leading,
  includeUnpublishedRegions,
}: {
  variant?: "standard" | "dark-bar";
  leading?: ReactNode;
  includeUnpublishedRegions?: boolean;
}) {
  const chromeMode: MarketingHeaderUtilityChromeMode = variant === "dark-bar" ? "dark-bar" : "standard";
  const shellJustify = leading ? "justify-between" : "justify-end";

  return (
    <div
      data-nn-header-band={variant === "dark-bar" ? "utility" : undefined}
      className={`top-bar relative z-[25] w-full ${variant === "dark-bar" ? "nn-header-utility-dark" : "nn-header-utility"}`}
    >
      <div
        className={`nn-section-shell flex items-center gap-2 lg:gap-2.5 ${shellJustify} ${
          variant === "dark-bar" ? "min-h-[30px] py-[2px] md:min-h-[32px] md:py-0.5" : "min-h-[30px] gap-2 py-[1px]"
        }`}
      >
        {leading ? <div className="min-w-0 flex-1 overflow-hidden pe-2">{leading}</div> : null}
        <MarketingHeaderUtilityCluster
          chromeMode={chromeMode}
          includeUnpublishedRegions={includeUnpublishedRegions}
        />
      </div>
    </div>
  );
}
