"use client";

import { createPortal } from "react-dom";

/**
 * Mobile context/settings drawer.
 *
 * Separate from the main hamburger navigation. Opens from the context bar
 * or a dedicated settings button. Contains:
 *
 *   1. Country selector (grouped, searchable)
 *   2. Language selector
 *   3. Profession selector (if region has multiple)
 *   4. Exam selector (if profession has multiple exams)
 *   5. Theme picker
 *
 * Product navigation (Lessons, Questions, etc.) stays in the main hamburger.
 * This drawer handles ONLY market/context settings.
 */

import { Settings, X } from "lucide-react";
import { ThemePicker, type ThemePickerLabels } from "@/components/theme/theme-picker";
import {
  REGION_CONFIG,
  type GlobalLocaleCode,
  type GlobalRegionSlug,
} from "@/lib/i18n/global-regions";
import {
  getRegionFlag,
  getLocaleDisplay,
  getProfessionsForRegion,
  getExamsForRegionProfession,
} from "@/lib/navigation/context-switch-helpers";
import {
  CountrySelector,
  LanguageSelector,
  ProfessionSelector,
  ExamSelector,
} from "./global-context-switcher";

// ── Types ────────────────────────────────────────────────────────────────────

type MobileContextDrawerProps = {
  open: boolean;
  onClose: () => void;
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
  onRegionChange: (region: GlobalRegionSlug) => void;
  onLocaleChange: (locale: GlobalLocaleCode) => void;
  onProfessionChange: (profession: string) => void;
  onExamChange: (exam: string) => void;
  themeLabels: ThemePickerLabels;
  /** Staff-only: list draft/incomplete regions in the country listbox. */
  countrySelectorIncludeUnpublished?: boolean;
};

// ── Component ────────────────────────────────────────────────────────────────

export function MobileContextDrawer({
  open,
  onClose,
  region,
  locale,
  profession,
  exam,
  onRegionChange,
  onLocaleChange,
  onProfessionChange,
  onExamChange,
  themeLabels,
  countrySelectorIncludeUnpublished = false,
}: MobileContextDrawerProps) {
  if (!open) return null;
  if (typeof document === "undefined") return null;

  const regionCfg = REGION_CONFIG[region];
  const flag = getRegionFlag(region);
  const localeDisplay = getLocaleDisplay(locale);
  const professions = getProfessionsForRegion(region);
  const exams = profession ? getExamsForRegionProfession(region, profession) : [];
  const hasMultipleProfessions = professions.length > 1;
  const hasMultipleExams = exams.length > 1;
  const hasMultipleLocales = regionCfg.allowedLocales.length > 1;

  const overlay = (
    <div className="fixed inset-0 z-[210] md:hidden animate-[nn-overlay-enter_0.24s_ease_both]">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/56"
        aria-label="Close settings"
        onClick={onClose}
      />

      {/* Drawer panel — slides from bottom */}
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)] animate-[nn-drawer-slide-up_0.28s_cubic-bezier(0.25,0.1,0.25,1)_both]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-[var(--theme-muted-text)]" aria-hidden />
            <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">
              Region & Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--theme-muted-text)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--theme-heading-text)]"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-y-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          {/* Current context summary */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
            <span className="text-base leading-none">{flag}</span>
            <span className="text-xs font-semibold text-[var(--theme-heading-text)]">
              {regionCfg.displayName}
            </span>
            <span className="text-xs text-[var(--theme-muted-text)]">·</span>
            <span className="text-xs text-[var(--theme-muted-text)]">{localeDisplay.label}</span>
            {profession && (
              <>
                <span className="text-xs text-[var(--theme-muted-text)]">·</span>
                <span className="text-xs text-[var(--theme-muted-text)]">{profession.toUpperCase()}</span>
              </>
            )}
          </div>

          {/* Country */}
          <section>
            <SectionLabel>Country / Region</SectionLabel>
            <CountrySelector
              currentRegion={region}
              onSelect={(r) => {
                onRegionChange(r);
                onClose();
              }}
              variant="inline"
              includeUnpublishedRegions={countrySelectorIncludeUnpublished}
            />
          </section>

          {/* Language */}
          {hasMultipleLocales && (
            <section>
              <SectionLabel>Language</SectionLabel>
              <LanguageSelector
                currentLocale={locale}
                region={region}
                onSelect={(l) => {
                  onLocaleChange(l);
                  onClose();
                }}
                variant="inline"
              />
            </section>
          )}

          {/* Profession */}
          {hasMultipleProfessions && (
            <section>
              <SectionLabel>Profession</SectionLabel>
              <ProfessionSelector
                currentProfession={profession}
                region={region}
                onSelect={(p) => {
                  onProfessionChange(p);
                  onClose();
                }}
                variant="inline"
              />
            </section>
          )}

          {/* Exam */}
          {hasMultipleExams && (
            <section>
              <SectionLabel>Exam Pathway</SectionLabel>
              <ExamSelector
                currentExam={exam}
                region={region}
                profession={profession}
                onSelect={(e) => {
                  onExamChange(e);
                  onClose();
                }}
                variant="inline"
              />
            </section>
          )}

          {/* Theme */}
          <section>
            <SectionLabel>Appearance</SectionLabel>
            <ThemePicker labels={themeLabels} />
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
      {children}
    </p>
  );
}

// ── Mobile context trigger button ────────────────────────────────────────────

type MobileContextTriggerProps = {
  region: GlobalRegionSlug;
  onClick: () => void;
};

export function MobileContextTrigger({ region, onClick }: MobileContextTriggerProps) {
  const flag = getRegionFlag(region);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--theme-heading-text)] transition-colors hover:bg-[var(--nav-hover)] md:hidden"
      aria-label="Open region and language settings"
    >
      <span className="text-sm leading-none">{flag}</span>
      <Settings className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
    </button>
  );
}
