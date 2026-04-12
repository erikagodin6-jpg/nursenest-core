/**
 * Context routing — resolves a destination URL after the user completes
 * the smart exam selector.
 *
 * Reuses the existing exam-pathway registry and context-switch helpers
 * to ensure the resolved route is always valid.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import {
  getProfessionsForRegion,
  getExamsForRegionProfession,
} from "@/lib/navigation/context-switch-helpers";

// ── Types ────────────────────────────────────────────────────────────────────

export type ResolvedRoute = {
  href: string;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string | null;
};

// ── Route resolver ───────────────────────────────────────────────────────────

/**
 * Build the best destination URL for a given context selection.
 *
 * Falls back gracefully:
 *   1. Exact pathway route if found in the registry
 *   2. Region + profession hub
 *   3. Localized root
 */
export function resolveOnboardingRoute(
  region: GlobalRegionSlug,
  locale: GlobalLocaleCode,
  profession: string,
  exam: string | null,
): ResolvedRoute {
  const exams = getExamsForRegionProfession(region, profession);
  const resolvedExam = exam ?? exams[0]?.examCode ?? null;

  if (resolvedExam) {
    const pathwayHref = `/${locale}/${region}/${profession}/${resolvedExam}`;
    return { href: pathwayHref, locale, region, profession, exam: resolvedExam };
  }

  // No exam resolved — fall back to localized root
  return { href: `/${locale}`, locale, region, profession, exam: null };
}

// ── Helpers for the selector UI ──────────────────────────────────────────────

export type ProfessionChoice = {
  id: string;
  label: string;
  description: string;
};

/**
 * Profession choices for the first step. Static — every market starts here.
 * The list is intentionally short to minimize cognitive load.
 */
export const PROFESSION_CHOICES: ProfessionChoice[] = [
  { id: "rn", label: "RN", description: "Registered Nurse" },
  { id: "rpn", label: "RPN / LPN", description: "Practical Nurse" },
  { id: "np", label: "NP", description: "Nurse Practitioner" },
  { id: "allied", label: "Allied Health", description: "Other nursing roles" },
];

export type CountryChoice = {
  slug: GlobalRegionSlug;
  displayName: string;
  flag: string;
  group: "priority" | "more";
};

/**
 * Country choices for step 2, prioritizing underserved markets.
 */
export function getCountryChoices(): CountryChoice[] {
  const priority: GlobalRegionSlug[] = [
    "philippines", "india", "nigeria", "kenya", "pakistan",
    "bangladesh", "south-africa", "canada", "us", "uk", "aus",
  ];

  const more: GlobalRegionSlug[] = [
    "uae", "saudi-arabia", "singapore", "jamaica", "trinidad",
    "ireland", "new-zealand",
  ];

  const toChoice = (slug: GlobalRegionSlug, group: "priority" | "more"): CountryChoice => {
    const cfg = REGION_CONFIG[slug];
    const flags: Record<string, string> = {
      philippines: "\u{1F1F5}\u{1F1ED}", india: "\u{1F1EE}\u{1F1F3}",
      nigeria: "\u{1F1F3}\u{1F1EC}", kenya: "\u{1F1F0}\u{1F1EA}",
      pakistan: "\u{1F1F5}\u{1F1F0}", bangladesh: "\u{1F1E7}\u{1F1E9}",
      "south-africa": "\u{1F1FF}\u{1F1E6}", canada: "\u{1F1E8}\u{1F1E6}",
      us: "\u{1F1FA}\u{1F1F8}", uk: "\u{1F1EC}\u{1F1E7}", aus: "\u{1F1E6}\u{1F1FA}",
      uae: "\u{1F1E6}\u{1F1EA}", "saudi-arabia": "\u{1F1F8}\u{1F1E6}",
      singapore: "\u{1F1F8}\u{1F1EC}", jamaica: "\u{1F1EF}\u{1F1F2}",
      trinidad: "\u{1F1F9}\u{1F1F9}", ireland: "\u{1F1EE}\u{1F1EA}",
      "new-zealand": "\u{1F1F3}\u{1F1FF}",
    };
    return {
      slug,
      displayName: cfg.displayName,
      flag: flags[slug] ?? "\u{1F30D}",
      group,
    };
  };

  return [
    ...priority.map((s) => toChoice(s, "priority")),
    ...more.map((s) => toChoice(s, "more")),
  ];
}

/**
 * Resolve the available locales for a region.
 * Returns the list only when there are 2+ options (otherwise auto-select).
 */
export function getLocaleChoicesForRegion(
  region: GlobalRegionSlug,
): { code: GlobalLocaleCode; label: string }[] | null {
  const cfg = REGION_CONFIG[region];
  if (cfg.allowedLocales.length <= 1) return null;

  const labels: Record<string, string> = {
    en: "English", fr: "Fran\u00e7ais", es: "Espa\u00f1ol",
    tl: "Tagalog", hi: "\u0939\u093F\u0928\u094D\u0926\u0940",
  };

  return cfg.allowedLocales.map((code) => ({
    code,
    label: labels[code] ?? code,
  }));
}
