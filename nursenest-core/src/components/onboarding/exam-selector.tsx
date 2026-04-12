"use client";

/**
 * Smart first-visit exam + country selector.
 *
 * Shows ONLY for anonymous users with no saved preferences on unscoped pages.
 * Guides them through profession → country → language (if applicable) →
 * immediate redirect into their scoped exam pathway.
 *
 * Desktop: centered card with dimmed backdrop.
 * Mobile: bottom sheet slide-up.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import {
  PROFESSION_CHOICES,
  getCountryChoices,
  getLocaleChoicesForRegion,
  resolveOnboardingRoute,
  type CountryChoice,
} from "@/lib/context/context-routing";
import {
  persistSelectorSelection,
  persistSelectorDismissed,
  hasExistingPreferences,
  wasSelectorDismissed,
} from "@/lib/context/context-persistence";
import { trackClientEvent } from "@/lib/observability/posthog-client";

// ── Analytics ────────────────────────────────────────────────────────────────

const EVT = {
  shown: "exam_selector_shown",
  dismissed: "exam_selector_dismissed",
  completed: "exam_selector_completed",
  professionSelected: "profession_selected",
  countrySelected: "country_selected",
  languageSelected: "language_selected",
  routed: "selector_routed",
} as const;

// ── Step type ────────────────────────────────────────────────────────────────

type Step = "profession" | "country" | "language";

// ── Props ────────────────────────────────────────────────────────────────────

type ExamSelectorProps = {
  geoRegion: GlobalRegionSlug | null;
};

export function ExamSelector({ geoRegion }: ExamSelectorProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("profession");
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<GlobalRegionSlug | null>(geoRegion);
  const [showMoreCountries, setShowMoreCountries] = useState(false);

  // Client-side eligibility check (cookie/localStorage may not be available during SSR)
  useEffect(() => {
    if (hasExistingPreferences() || wasSelectorDismissed()) return;
    setVisible(true);
    trackClientEvent(EVT.shown, { source: "root" });
  }, []);

  const countries = useMemo(() => getCountryChoices(), []);
  const priorityCountries = useMemo(() => countries.filter((c) => c.group === "priority"), [countries]);
  const moreCountries = useMemo(() => countries.filter((c) => c.group === "more"), [countries]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    persistSelectorDismissed();
    trackClientEvent(EVT.dismissed, { source: "root" });
  }, []);

  const handleProfessionSelect = useCallback((professionId: string) => {
    setSelectedProfession(professionId);
    trackClientEvent(EVT.professionSelected, { profession: professionId });
    setStep("country");
  }, []);

  const handleCountrySelect = useCallback((region: GlobalRegionSlug) => {
    setSelectedRegion(region);
    trackClientEvent(EVT.countrySelected, { region });

    const localeOptions = getLocaleChoicesForRegion(region);
    if (localeOptions && localeOptions.length > 1) {
      setStep("language");
    } else {
      finishSelection(region, REGION_CONFIG[region].defaultLocale);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfession]);

  const handleLanguageSelect = useCallback((locale: GlobalLocaleCode) => {
    if (!selectedRegion) return;
    trackClientEvent(EVT.languageSelected, { locale, region: selectedRegion });
    finishSelection(selectedRegion, locale);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, selectedProfession]);

  const finishSelection = useCallback((region: GlobalRegionSlug, locale: GlobalLocaleCode) => {
    const profession = selectedProfession ?? "rn";
    const resolved = resolveOnboardingRoute(region, locale, profession, null);

    persistSelectorSelection({
      region,
      locale,
      profession,
      exam: resolved.exam,
    });

    trackClientEvent(EVT.completed, {
      region,
      locale,
      profession,
      exam: resolved.exam ?? undefined,
    });

    trackClientEvent(EVT.routed, {
      href: resolved.href,
      region,
      locale,
      profession,
      exam: resolved.exam ?? undefined,
    });

    setVisible(false);
    router.push(resolved.href);
  }, [selectedProfession, router]);

  const handleBack = useCallback(() => {
    if (step === "language") setStep("country");
    else if (step === "country") setStep("profession");
  }, [step]);

  if (!visible) return null;

  const localeOptions = selectedRegion ? getLocaleChoicesForRegion(selectedRegion) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={handleDismiss}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Find your exam path"
        className={[
          "fixed z-50 bg-[var(--bg-card)] shadow-2xl",
          // Desktop: centered card
          "max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl max-sm:animate-[nn-drawer-slide-up_0.3s_ease-out]",
          // Mobile: bottom sheet
          "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:w-full sm:max-w-md",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {step !== "profession" && (
              <button
                onClick={handleBack}
                className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                Back
              </button>
            )}
            <h2 className="text-lg font-semibold text-[var(--text-heading)]">
              {step === "profession" && "Find your exam path"}
              {step === "country" && "Where are you studying?"}
              {step === "language" && "Preferred language"}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              {step === "profession" && "Get study prep built for your nursing role"}
              {step === "country" && "We\u2019ll customize your experience"}
              {step === "language" && "Choose your study language"}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 flex-shrink-0 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-body)] transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 sm:px-6">
          {step === "profession" && (
            <ProfessionStep onSelect={handleProfessionSelect} />
          )}

          {step === "country" && (
            <CountryStep
              priorityCountries={priorityCountries}
              moreCountries={moreCountries}
              showMore={showMoreCountries}
              onToggleMore={() => setShowMoreCountries((v) => !v)}
              geoRegion={geoRegion}
              onSelect={handleCountrySelect}
            />
          )}

          {step === "language" && localeOptions && (
            <LanguageStep
              options={localeOptions}
              onSelect={handleLanguageSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-5 py-3 sm:px-6">
          <button
            onClick={handleDismiss}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}

// ── Step: Profession ─────────────────────────────────────────────────────────

function ProfessionStep({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {PROFESSION_CHOICES.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={[
            "group flex flex-col items-start rounded-xl border border-[var(--border)] px-4 py-3.5",
            "hover:border-[var(--accent-primary)] hover:bg-[var(--accent-highlight)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]",
            "transition-all",
          ].join(" ")}
        >
          <span className="text-base font-semibold text-[var(--text-heading)] group-hover:text-[var(--accent-primary)] transition-colors">
            {p.label}
          </span>
          <span className="mt-0.5 text-xs text-[var(--text-muted)]">
            {p.description}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Step: Country ────────────────────────────────────────────────────────────

function CountryStep({
  priorityCountries,
  moreCountries,
  showMore,
  onToggleMore,
  geoRegion,
  onSelect,
}: {
  priorityCountries: CountryChoice[];
  moreCountries: CountryChoice[];
  showMore: boolean;
  onToggleMore: () => void;
  geoRegion: GlobalRegionSlug | null;
  onSelect: (slug: GlobalRegionSlug) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {priorityCountries.map((c) => (
          <CountryButton
            key={c.slug}
            country={c}
            isGeoMatch={c.slug === geoRegion}
            onSelect={onSelect}
          />
        ))}
      </div>

      {moreCountries.length > 0 && (
        <>
          <button
            onClick={onToggleMore}
            className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors"
          >
            {showMore ? "Show fewer" : "More countries"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${showMore ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {showMore && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {moreCountries.map((c) => (
                <CountryButton
                  key={c.slug}
                  country={c}
                  isGeoMatch={c.slug === geoRegion}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CountryButton({
  country,
  isGeoMatch,
  onSelect,
}: {
  country: CountryChoice;
  isGeoMatch: boolean;
  onSelect: (slug: GlobalRegionSlug) => void;
}) {
  return (
    <button
      onClick={() => onSelect(country.slug)}
      className={[
        "group flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left",
        "transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]",
        isGeoMatch
          ? "border-[var(--accent-primary)] bg-[var(--accent-highlight)]"
          : "border-[var(--border)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-highlight)]",
      ].join(" ")}
    >
      <span className="text-lg leading-none" role="img" aria-label={country.displayName}>
        {country.flag}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-[var(--text-heading)] truncate">
          {country.displayName}
        </span>
        {isGeoMatch && (
          <span className="text-[10px] text-[var(--accent-primary)] font-medium">
            Detected
          </span>
        )}
      </span>
    </button>
  );
}

// ── Step: Language ────────────────────────────────────────────────────────────

function LanguageStep({
  options,
  onSelect,
}: {
  options: { code: GlobalLocaleCode; label: string }[];
  onSelect: (code: GlobalLocaleCode) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => onSelect(opt.code)}
          className={[
            "flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3",
            "hover:border-[var(--accent-primary)] hover:bg-[var(--accent-highlight)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]",
            "transition-all",
          ].join(" ")}
        >
          <span className="text-base font-medium text-[var(--text-heading)]">
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}
