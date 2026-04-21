/**
 * Context routing — resolves a destination URL after the user completes
 * the smart exam selector.
 *
 * Reuses the existing exam-pathway registry and context-switch helpers
 * to ensure the resolved route is always valid.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import {
  getProfessionsForRegion,
  getExamsForRegionProfession,
  getRegionFlag,
} from "@/lib/navigation/context-switch-helpers";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { isGlobalRegionListedInCountrySwitcher } from "@/lib/navigation/market-readiness";

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
 * Published US/CA pathway rows (same filter as onboarding exam list).
 */
function pathwaysForUsCanada(region: GlobalRegionSlug): ExamPathwayDefinition[] {
  const countrySlug = region === "us" ? "us" : region === "canada" ? "canada" : null;
  if (!countrySlug) return [];
  return listPublishedExamPathwaysForPublicSite().filter((p) => p.countrySlug === countrySlug);
}

/**
 * Build the best destination URL for a given context selection.
 *
 * Falls back gracefully:
 *   1. **US / Canada** — canonical exam hub `/{country}/{role}/{exam}` (English has **no** `/en/` prefix)
 *   2. **Expansion regions** — shipped `/exams/…` hub (locale UI via cookie; do not prefix `/tl/` on hubs that only exist on `(default)`)
 *   3. Localized marketing root `/{locale}` or `/`
 */
export function resolveOnboardingRoute(
  region: GlobalRegionSlug,
  locale: GlobalLocaleCode,
  profession: string,
  exam: string | null,
): ResolvedRoute {
  const exams = getExamsForRegionProfession(region, profession);
  const resolvedExam = exam ?? exams[0]?.examCode ?? null;

  if (region === "us" || region === "canada") {
    const byProfession = pathwaysForUsCanada(region).filter((p) => p.roleTrack === profession);
    const matching =
      (resolvedExam && byProfession.find((p) => p.examCode === resolvedExam)) ?? byProfession[0];
    if (matching) {
      return {
        href: buildExamPathwayPath(matching),
        locale,
        region,
        profession,
        exam: matching.examCode,
      };
    }
  }

  const hub = getExamHubForGlobalRegion(region);
  if (hub) {
    return {
      href: hub.hubPath,
      locale,
      region,
      profession,
      exam: resolvedExam,
    };
  }

  if (locale === DEFAULT_MARKETING_LOCALE) {
    return { href: "/", locale, region, profession, exam: resolvedExam };
  }
  return { href: `/${locale}`, locale, region, profession, exam: resolvedExam };
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
 * Country choices for step 2 — same listing gate as the marketing country switcher ({@link isGlobalRegionListedInCountrySwitcher}).
 * Ordering: US, Canada, then any additional ready regions alphabetically.
 */
export function getCountryChoices(): CountryChoice[] {
  const ready = (Object.keys(REGION_CONFIG) as GlobalRegionSlug[]).filter(isGlobalRegionListedInCountrySwitcher);
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
