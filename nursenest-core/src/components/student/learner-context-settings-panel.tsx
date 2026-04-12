"use client";

/**
 * Learner context settings panel.
 *
 * Persistent preferences for country, language, profession, exam, and theme.
 * Extends the existing LearnerAccountSettingsPanel with global context controls.
 *
 * This is the "settings page" version of the context system — changes here
 * are saved permanently (cookie + account when supported) rather than being
 * temporary switches via the context bar.
 */

import { useCallback, useState, useTransition } from "react";
import { Check, Globe, Languages, Stethoscope, GraduationCap, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ThemePicker } from "@/components/theme/theme-picker";
import {
  REGION_CONFIG,
  GLOBAL_REGION_SLUGS,
  type GlobalLocaleCode,
  type GlobalRegionSlug,
} from "@/lib/i18n/global-regions";
import {
  getRegionFlag,
  getLocaleDisplay,
  getProfessionsForRegion,
  getExamsForRegionProfession,
} from "@/lib/navigation/context-switch-helpers";
import { marketSupportLabel } from "@/lib/navigation/market-readiness";
import { saveContextPreferences } from "@/app/actions/save-context-preferences";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { CONTEXT_EVENTS } from "@/lib/navigation/context-analytics";

// ── Types ────────────────────────────────────────────────────────────────────

type LearnerContextSettingsPanelProps = {
  initialRegion: GlobalRegionSlug;
  initialLocale: GlobalLocaleCode;
  initialProfession: string | null;
  initialExam: string | null;
};

// ── Component ────────────────────────────────────────────────────────────────

export function LearnerContextSettingsPanel({
  initialRegion,
  initialLocale,
  initialProfession,
  initialExam,
}: LearnerContextSettingsPanelProps) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [region, setRegion] = useState<GlobalRegionSlug>(initialRegion);
  const [locale, setLocale] = useState<GlobalLocaleCode>(initialLocale);
  const [profession, setProfession] = useState<string | null>(initialProfession);
  const [exam, setExam] = useState<string | null>(initialExam);
  const [saved, setSaved] = useState(false);

  const regionCfg = REGION_CONFIG[region];
  const professions = getProfessionsForRegion(region);
  const exams = profession ? getExamsForRegionProfession(region, profession) : [];

  const handleRegionChange = useCallback((newRegion: GlobalRegionSlug) => {
    setRegion(newRegion);
    const newCfg = REGION_CONFIG[newRegion];
    // Reset locale if current isn't valid for new region
    if (!(newCfg.allowedLocales as readonly string[]).includes(locale)) {
      setLocale(newCfg.defaultLocale);
    }
    // Reset profession/exam for new region
    const newProfs = getProfessionsForRegion(newRegion);
    setProfession(newProfs[0]?.roleTrack ?? null);
    setExam(null);
    setSaved(false);
  }, [locale]);

  const handleSave = useCallback(() => {
    const fieldsChanged: string[] = [];
    if (region !== initialRegion) fieldsChanged.push("region");
    if (locale !== initialLocale) fieldsChanged.push("locale");
    if (profession !== initialProfession) fieldsChanged.push("profession");
    if (exam !== initialExam) fieldsChanged.push("exam");

    startTransition(async () => {
      const result = await saveContextPreferences({
        region,
        locale,
        profession: profession ?? undefined,
        exam: exam ?? undefined,
      });

      if (result.ok) {
        setSaved(true);
        trackClientEvent(CONTEXT_EVENTS.settingsContextSaved, {
          surface: "settings_page",
          locale,
          region,
          profession: profession ?? undefined,
          exam: exam ?? undefined,
          fields_changed: fieldsChanged.join(","),
        });
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    });
  }, [region, locale, profession, exam, initialRegion, initialLocale, initialProfession, initialExam, router]);

  const hasChanges =
    region !== initialRegion ||
    locale !== initialLocale ||
    profession !== initialProfession ||
    exam !== initialExam;

  return (
    <div className="space-y-8">
      {/* Country / Region */}
      <SettingsSection
        icon={<Globe className="h-4.5 w-4.5" />}
        title="Country / Region"
        description="Your preferred country determines pricing, exam pathways, and content localization."
      >
        <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {GLOBAL_REGION_SLUGS.map((slug) => {
            const cfg = REGION_CONFIG[slug];
            const flag = getRegionFlag(slug);
            const isActive = slug === region;
            const supportLabel = marketSupportLabel(slug);

            return (
              <button
                key={slug}
                type="button"
                onClick={() => handleRegionChange(slug)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "border-[var(--text-accent)] bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                    : "border-[var(--border-subtle)] text-[var(--theme-heading-text)] hover:border-[var(--text-accent)] hover:bg-[var(--surface)]"
                }`}
              >
                <span className="text-base leading-none">{flag}</span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate">{cfg.displayName}</span>
                  <span className="block text-[10px] text-[var(--theme-muted-text)]">
                    {supportLabel}
                  </span>
                </div>
                {isActive && <Check className="h-4 w-4 shrink-0 text-[var(--text-accent)]" />}
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Language */}
      <SettingsSection
        icon={<Languages className="h-4.5 w-4.5" />}
        title="Language"
        description={`Available languages for ${regionCfg.displayName}.`}
      >
        <div className="flex flex-wrap gap-2">
          {regionCfg.allowedLocales.map((loc) => {
            const display = getLocaleDisplay(loc);
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => { setLocale(loc); setSaved(false); }}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "border-[var(--text-accent)] bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                    : "border-[var(--border-subtle)] text-[var(--theme-heading-text)] hover:border-[var(--text-accent)]"
                }`}
              >
                <span className="text-base leading-none">{display.flag}</span>
                {display.label}
                {isActive && <Check className="h-4 w-4 shrink-0 text-[var(--text-accent)]" />}
              </button>
            );
          })}
        </div>
        {regionCfg.allowedLocales.length <= 1 && (
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
            Only English is currently available for {regionCfg.displayName}.
          </p>
        )}
      </SettingsSection>

      {/* Profession */}
      {professions.length > 1 && (
        <SettingsSection
          icon={<Stethoscope className="h-4.5 w-4.5" />}
          title="Profession"
          description="Your nursing profession determines which exam pathway and content you see."
        >
          <div className="flex flex-wrap gap-2">
            {professions.map((p) => {
              const isActive = p.roleTrack === profession;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setProfession(p.roleTrack); setExam(null); setSaved(false); }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border-[var(--text-accent)] bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                      : "border-[var(--border-subtle)] text-[var(--theme-heading-text)] hover:border-[var(--text-accent)]"
                  }`}
                >
                  {p.label}
                  {isActive && <Check className="h-4 w-4 shrink-0 text-[var(--text-accent)]" />}
                </button>
              );
            })}
          </div>
        </SettingsSection>
      )}

      {/* Exam Pathway */}
      {exams.length > 1 && (
        <SettingsSection
          icon={<GraduationCap className="h-4.5 w-4.5" />}
          title="Exam Pathway"
          description="Select the exam you are preparing for."
        >
          <div className="flex flex-wrap gap-2">
            {exams.map((e) => {
              const isActive = e.examCode === exam;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => { setExam(e.examCode); setSaved(false); }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border-[var(--text-accent)] bg-[var(--accent-surface-a)] font-semibold text-[var(--text-accent)]"
                      : "border-[var(--border-subtle)] text-[var(--theme-heading-text)] hover:border-[var(--text-accent)]"
                  }`}
                >
                  {e.label}
                  {isActive && <Check className="h-4 w-4 shrink-0 text-[var(--text-accent)]" />}
                </button>
              );
            })}
          </div>
        </SettingsSection>
      )}

      {/* Theme */}
      <SettingsSection
        icon={<Palette className="h-4.5 w-4.5" />}
        title="Appearance"
        description="Choose a theme for your study experience."
      >
        <ThemePicker className="max-w-md" />
      </SettingsSection>

      {/* Save button */}
      <div className="border-t border-[var(--border-subtle)] pt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              hasChanges && !isPending
                ? "bg-[var(--theme-primary)] text-white hover:opacity-90"
                : "bg-[var(--surface-strong)] text-[var(--theme-muted-text)] cursor-not-allowed"
            }`}
          >
            {isPending ? "Saving..." : saved ? "Saved" : "Save Preferences"}
            {saved && <Check className="h-4 w-4" />}
          </button>
          {saved && (
            <span className="text-sm text-[var(--semantic-success)]">
              Your preferences have been updated.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--border-subtle)] pt-6 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-[var(--accent-surface-a)] p-2 text-[var(--text-accent)]">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{title}</h3>
          <p className="mt-0.5 text-sm text-[var(--theme-muted-text)]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
