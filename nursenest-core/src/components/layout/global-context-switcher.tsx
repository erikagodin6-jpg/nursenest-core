"use client";

/**
 * Global context switcher — popover selectors for country, language,
 * profession, and exam. Used by both the context bar (desktop popovers)
 * and mobile context drawer.
 *
 * Each selector is a standalone component that can be composed into
 * different containers.
 */

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Search, X } from "lucide-react";
import {
  REGION_CONFIG,
  type GlobalLocaleCode,
  type GlobalRegionSlug,
} from "@/lib/i18n/global-regions";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  getRegionFlag,
  getLocaleDisplay,
  getRegionGroups,
  getProfessionsForRegion,
  getExamsForRegionProfession,
  type ProfessionOption,
  type ExamOption,
} from "@/lib/navigation/context-switch-helpers";
import { isPublicCountrySwitcherReady } from "@/lib/navigation/market-readiness";

// ── Country Selector ─────────────────────────────────────────────────────────

type CountrySelectorProps = {
  currentRegion: GlobalRegionSlug;
  onSelect: (region: GlobalRegionSlug) => void;
  onClose?: () => void;
  /** Render as inline list (mobile drawer) vs floating popover (desktop). */
  variant?: "popover" | "inline";
  /**
   * Admin/internal: list all regions with draft status. Default false — only fully published markets.
   */
  includeUnpublishedRegions?: boolean;
};

export function CountrySelector({
  currentRegion,
  onSelect,
  onClose,
  variant = "popover",
  includeUnpublishedRegions = false,
}: CountrySelectorProps) {
  const { t } = useMarketingI18n();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const groups = getRegionGroups({ includeUnpublishedRegions });
  const highlightRegion =
    includeUnpublishedRegions || isPublicCountrySwitcherReady(currentRegion) ? currentRegion : null;

  useEffect(() => {
    if (variant === "popover") inputRef.current?.focus();
  }, [variant]);

  const lowerSearch = search.toLowerCase().trim();

  const filteredGroups = groups
    .map((g) => ({
      ...g,
      regions: g.regions.filter(
        (r) =>
          !lowerSearch ||
          r.displayName.toLowerCase().includes(lowerSearch) ||
          r.slug.includes(lowerSearch),
      ),
    }))
    .filter((g) => g.regions.length > 0);

  const containerClass =
    variant === "popover"
      ? "w-72 max-h-[400px] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)]"
      : "w-full";

  return (
    <div className={containerClass} role="listbox" aria-label={t("nav.selectCountry")}>
      {/* Search */}
      <div className={`flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2 ${variant === "inline" ? "rounded-xl border bg-[var(--surface)]" : ""}`}>
        <Search className="h-3.5 w-3.5 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("nav.searchCountriesPlaceholder")}
          className="min-w-0 flex-1 bg-transparent text-xs text-[var(--theme-heading-text)] placeholder:text-[var(--theme-muted-text)] outline-none"
          aria-label={t("nav.searchCountriesAria")}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} className="text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)]" aria-label={t("nav.clearCountrySearch")}>
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Groups */}
      <div className="max-h-[320px] overflow-y-auto overscroll-y-contain p-1.5">
        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-2 pb-1 pt-2 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
              {group.label}
            </p>
            {group.regions.map((r) => {
              const isActive = highlightRegion !== null && r.slug === highlightRegion;
              return (
                <button
                  key={r.slug}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={(e) => {
                    // Avoid bubbling to document "click outside" handlers; defer close so the event path stays valid.
                    e.stopPropagation();
                    onSelect(r.slug);
                    queueMicrotask(() => onClose?.());
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    isActive
                      ? "bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                      : "text-[var(--theme-heading-text)] hover:bg-[var(--nav-hover)]"
                  }`}
                >
                  <span className="text-sm leading-none">{r.flag}</span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate">{r.displayName}</span>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--text-accent)]" aria-hidden />}
                </button>
              );
            })}
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-[var(--theme-muted-text)]">
            {t("nav.noCountriesFound")}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Language Selector ────────────────────────────────────────────────────────

type LanguageSelectorProps = {
  currentLocale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  onSelect: (locale: GlobalLocaleCode) => void;
  onClose?: () => void;
  variant?: "popover" | "inline";
};

export function LanguageSelector({
  currentLocale,
  region,
  onSelect,
  onClose,
  variant = "popover",
}: LanguageSelectorProps) {
  const regionCfg = REGION_CONFIG[region];
  const locales = [...regionCfg.allowedLocales];

  const containerClass =
    variant === "popover"
      ? "w-52 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)]"
      : "w-full";

  return (
    <div className={containerClass} role="listbox" aria-label="Select language">
      <div className="p-1.5">
        <p className="px-2 pb-1.5 pt-1 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
          Available for {regionCfg.displayName}
        </p>
        {locales.map((loc) => {
          const display = getLocaleDisplay(loc as GlobalLocaleCode);
          const isActive = loc === currentLocale;
          return (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => {
                onSelect(loc as GlobalLocaleCode);
                onClose?.();
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-xs transition-colors ${
                isActive
                  ? "bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                  : "text-[var(--theme-heading-text)] hover:bg-[var(--nav-hover)]"
              }`}
            >
              <span className="text-sm leading-none">{display.flag}</span>
              <span className="min-w-0 flex-1">{display.label}</span>
              {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--text-accent)]" aria-hidden />}
            </button>
          );
        })}
        {locales.length <= 1 && (
          <p className="px-2.5 py-2 text-[11px] text-[var(--theme-muted-text)]">
            Only {getLocaleDisplay(locales[0] as GlobalLocaleCode).label} is available for {regionCfg.displayName}.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Profession Selector ──────────────────────────────────────────────────────

type ProfessionSelectorProps = {
  currentProfession: string | null;
  region: GlobalRegionSlug;
  onSelect: (profession: string) => void;
  onClose?: () => void;
  variant?: "popover" | "inline";
};

export function ProfessionSelector({
  currentProfession,
  region,
  onSelect,
  onClose,
  variant = "popover",
}: ProfessionSelectorProps) {
  const professions = getProfessionsForRegion(region);

  const containerClass =
    variant === "popover"
      ? "w-52 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)]"
      : "w-full";

  return (
    <div className={containerClass} role="listbox" aria-label="Select profession">
      <div className="p-1.5">
        <p className="px-2 pb-1.5 pt-1 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
          Profession
        </p>
        {professions.map((p) => {
          const isActive = p.roleTrack === currentProfession;
          return (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => {
                onSelect(p.roleTrack);
                onClose?.();
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-xs transition-colors ${
                isActive
                  ? "bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                  : "text-[var(--theme-heading-text)] hover:bg-[var(--nav-hover)]"
              }`}
            >
              <span className="min-w-0 flex-1">{p.label}</span>
              {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--text-accent)]" aria-hidden />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Exam Selector ────────────────────────────────────────────────────────────

type ExamSelectorProps = {
  currentExam: string | null;
  region: GlobalRegionSlug;
  profession: string | null;
  onSelect: (exam: string) => void;
  onClose?: () => void;
  variant?: "popover" | "inline";
};

export function ExamSelector({
  currentExam,
  region,
  profession,
  onSelect,
  onClose,
  variant = "popover",
}: ExamSelectorProps) {
  const exams = profession ? getExamsForRegionProfession(region, profession) : [];

  const containerClass =
    variant === "popover"
      ? "w-52 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)]"
      : "w-full";

  return (
    <div className={containerClass} role="listbox" aria-label="Select exam">
      <div className="p-1.5">
        <p className="px-2 pb-1.5 pt-1 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
          Exam Pathway
        </p>
        {exams.map((e) => {
          const isActive = e.examCode === currentExam;
          return (
            <button
              key={e.id}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => {
                onSelect(e.examCode);
                onClose?.();
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-xs transition-colors ${
                isActive
                  ? "bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                  : "text-[var(--theme-heading-text)] hover:bg-[var(--nav-hover)]"
              }`}
            >
              <span className="min-w-0 flex-1">{e.label}</span>
              {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--text-accent)]" aria-hidden />}
            </button>
          );
        })}
        {exams.length === 0 && (
          <p className="px-2.5 py-2 text-[11px] text-[var(--theme-muted-text)]">
            No exam pathways configured for this selection.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Compact country trigger for utility strip ────────────────────────────────

type CompactCountryTriggerProps = {
  region: GlobalRegionSlug;
  onClick: () => void;
};

export function CompactCountryTrigger({ region, onClick }: CompactCountryTriggerProps) {
  const { t } = useMarketingI18n();
  const flag = getRegionFlag(region);
  const regionCfg = REGION_CONFIG[region];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-full bg-transparent px-2 py-0.5 text-[11px] font-normal tracking-wide text-[var(--header-utility-text)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)]"
      aria-label={`${t("nav.selectCountry")}: ${regionCfg.displayName}`}
      title={`${t("nav.selectCountry")} — ${regionCfg.displayName}`}
    >
      <Globe className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
      <span className="hidden min-[900px]:inline text-[10px] font-medium opacity-75">{t("nav.selectCountry")}</span>
      <span className="hidden sm:inline">{flag}</span>
      <span className="max-w-[80px] truncate">{regionCfg.displayName}</span>
      <ChevronDown className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
    </button>
  );
}
