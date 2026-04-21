"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { ThemePicker } from "@/components/theme/theme-picker";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { CompactCountryTrigger, CountrySelector } from "@/components/layout/global-context-switcher";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { effectiveMarketingHeaderGlobalRegion } from "@/lib/marketing/marketing-header-global-region";
import { mapLegacyMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { MarketingUtilityFloatingPanel } from "@/components/layout/marketing-utility-floating-panel";

const COUNTRY_PANEL_WIDTH_PX = 288; /* matches CountrySelector popover w-72 */
const LANGUAGE_PANEL_WIDTH_PX = 208; /* w-52 */

/**
 * Desktop-only preferences rail.
 *
 * variant="standard"  — recessive faint-tint surface (dark themes and default).
 * variant="dark-bar"  — full brand/nav-background surface (top band in light-theme 3-layer header).
 *
 * `leading` — optional left cluster (e.g. country hub shortcuts) when the strip shares a row with preferences.
 *
 * Visibility (e.g. `hidden xl:block`) is applied by the parent wrapper in `SiteHeader` so Tailwind
 * always sees full class literals in that module — dynamic `className` strings here can be purged.
 */
export function MarketingHeaderUtilityStrip({
  variant = "standard",
  leading,
  includeUnpublishedRegions,
}: {
  variant?: "standard" | "dark-bar";
  leading?: ReactNode;
  /**
   * When provided (from {@link SiteHeader} `isAdminAuthenticated`), matches header/staff hub
   * visibility using the same DB-backed session hint + JWT fallback. When omitted, falls back to
   * JWT role only (utility strip has no separate server prop).
   */
  includeUnpublishedRegions?: boolean;
}) {
  const { t, locale } = useMarketingI18n();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "utility_strip" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);
  const [langOpen, setLangOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryAnchorRef = useRef<HTMLDivElement>(null);
  const countryPanelRef = useRef<HTMLDivElement>(null);
  const langAnchorRef = useRef<HTMLDivElement>(null);
  const langPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (countryAnchorRef.current?.contains(t) || countryPanelRef.current?.contains(t)) return;
      if (langAnchorRef.current?.contains(t) || langPanelRef.current?.contains(t)) return;
      setLangOpen(false);
      setCountryOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setCountryOpen(false);
      }
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const globalLocale: GlobalLocaleCode = (locale as GlobalLocaleCode) ?? "en";
  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;
  const clientGlobalRegion = useClientGlobalRegionCookie();
  const effectiveGlobalRegion: GlobalRegionSlug = useMemo(
    () =>
      effectiveMarketingHeaderGlobalRegion({
        strippedPathname: strippedPath,
        globalRegionCookie: clientGlobalRegion,
        marketingExamRegion: region,
        sessionCountryUsCa: user?.country,
      }),
    [strippedPath, clientGlobalRegion, region, user?.country],
  );

  const countrySelectorIncludeUnpublished =
    typeof includeUnpublishedRegions === "boolean"
      ? includeUnpublishedRegions
      : Boolean(user?.role && isStaffRole(user.role));

  const buildLocalizedMarketingPath = useCallback(
    (localeCode: string, path: string) => {
      const mapped = mapLegacyMarketingHref(path);
      if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
      return withMarketingLocale(localeCode, mapped);
    },
    [],
  );

  const handleCountrySelect = useCallback(
    async (newRegion: GlobalRegionSlug) => {
      const { applyGlobalRegionSelection } = await import("@/lib/marketing/apply-global-region-selection");
      await applyGlobalRegionSelection(newRegion, {
        marketingLocale: globalLocale,
        setUsCaMarketingRegion: setRegionAndRefresh,
        router,
        buildLocalizedPath: buildLocalizedMarketingPath,
      });
      setCountryOpen(false);
    },
    [globalLocale, setRegionAndRefresh, router, buildLocalizedMarketingPath],
  );

  const chromeTrigger =
    variant === "dark-bar"
      ? "inline-flex h-[26px] max-w-[11rem] items-center gap-1 rounded-lg border border-[color-mix(in_srgb,var(--theme-heading-text)_14%,#cbd5e1)] bg-white px-2.5 text-[11px] font-normal leading-tight tracking-tight text-[var(--theme-heading-text)] shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-[color-mix(in_srgb,white_88%,var(--theme-heading-text))]"
      : undefined;

  const shellJustify = leading ? "justify-between" : "justify-end";

  return (
    <div className={`relative z-[25] w-full ${variant === "dark-bar" ? "nn-header-utility-dark" : "nn-header-utility"}`}>
      <div
        className={`nn-section-shell flex items-center gap-2 lg:gap-2.5 ${shellJustify} ${
          variant === "dark-bar"
            ? "min-h-[30px] py-[2px] md:min-h-[32px] md:py-0.5"
            : "min-h-[30px] gap-2 py-[1px]"
        }`}
      >
        {leading ? <div className="min-w-0 flex-1 overflow-hidden pe-2">{leading}</div> : null}
        <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-2.5">
          <div className="shrink-0" ref={countryAnchorRef}>
            <CompactCountryTrigger
              region={effectiveGlobalRegion}
              onClick={() => setCountryOpen((o) => !o)}
              className={chromeTrigger}
            />
          </div>
          <MarketingUtilityFloatingPanel
            open={countryOpen}
            anchorRef={countryAnchorRef}
            panelRef={countryPanelRef}
            widthPx={COUNTRY_PANEL_WIDTH_PX}
          >
            <CountrySelector
              currentRegion={effectiveGlobalRegion}
              onSelect={handleCountrySelect}
              onClose={() => setCountryOpen(false)}
              variant="popover"
              includeUnpublishedRegions={countrySelectorIncludeUnpublished}
            />
          </MarketingUtilityFloatingPanel>

          <div className="shrink-0" ref={langAnchorRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className={
                variant === "dark-bar"
                  ? "inline-flex h-[26px] items-center gap-0.5 rounded-lg border border-[color-mix(in_srgb,var(--theme-heading-text)_14%,#cbd5e1)] bg-white px-2.5 text-[11px] font-normal tracking-tight text-[var(--theme-heading-text)] shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:bg-[color-mix(in_srgb,white_88%,var(--theme-heading-text))]"
                  : "flex items-center gap-0.5 rounded-full bg-transparent px-2 py-0.5 text-[11px] font-normal tracking-wide text-[var(--header-utility-text)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)]"
              }
              aria-expanded={langOpen}
            >
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
            <div className="rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-card-hover)]">
              <MarketingLanguagePreferenceList
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
          </MarketingUtilityFloatingPanel>

          <div
            className={
              variant === "dark-bar"
                ? "text-[var(--theme-heading-text)] [&_button]:h-[26px] [&_button]:min-h-0 [&_button]:rounded-lg [&_button]:border [&_button]:border-[color-mix(in_srgb,var(--theme-heading-text)_14%,#cbd5e1)] [&_button]:bg-white [&_button]:px-2 [&_button]:py-0.5 [&_button]:text-[11px] [&_button]:font-normal [&_button]:text-[var(--theme-heading-text)] [&_button]:shadow-[0_1px_2px_rgba(15,23,42,0.05)] [&_button]:hover:bg-[color-mix(in_srgb,white_88%,var(--theme-heading-text))]"
                : "text-[var(--header-utility-text)] [&_button]:min-h-0 [&_button]:border-[var(--header-utility-border)] [&_button]:bg-transparent [&_button]:px-2 [&_button]:py-0.5 [&_button]:text-[11px] [&_button]:font-normal [&_button]:shadow-none [&_button]:hover:bg-[var(--nav-hover)] [&_button]:hover:text-[var(--nav-fg)]"
            }
          >
            <ThemePicker
              className="shrink-0"
              dropdownPortal
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
  );
}
