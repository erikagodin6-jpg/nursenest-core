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
  getRegionFlag,
} from "@/lib/navigation/context-switch-helpers";
import { isPublicCountrySwitcherReady } from "@/lib/navigation/market-readiness";

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
 * Country choices for step 2 — **fully published markets only** (same gate as the marketing country switcher).
 * Ordering: US, Canada, then any additional ready regions alphabetically.
 */
export function getCountryChoices(): CountryChoice[] {
  const ready = (Object.keys(REGION_CONFIG) as GlobalRegionSlug[]).filter(isPublicCountrySwitcherReady);
  const rank = (slug: GlobalRegionSlug) => (slug === "us" ? 0 : slug === "canada" ? 1 : 2);
  ready.sort((a, b) => {
    const d = rank(a) - rank(b);
    if (d !== 0) return d;
    return REGION_CONFIG[a].displayName.localeCompare(REGION_CONFIG[b].displayName, "en", { sensitivity: "base" });
  });

  return ready.map((slug) => ({
    slug,
    displayName: REGION_CONFIG[slug].displayName,
    flag: getRegionFlag(slug),
    group: "priority",
  }));
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
