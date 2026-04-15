/**
 * Route-aware context switching helpers.
 *
 * When a user changes country, language, profession, or exam, we need to
 * resolve a safe destination URL. This module handles:
 *
 *   1. Country switch → best matching route for new region
 *   2. Language switch → same page in new locale (or fallback)
 *   3. Profession/exam switch → valid pathway for new combo
 *   4. Fallback → country/profession hub instead of 404
 */

import {
  REGION_CONFIG,
  isAllowedLocaleForRegion,
  type GlobalLocaleCode,
  type GlobalRegionSlug,
} from "@/lib/i18n/global-regions";
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import {
  listPublicExamPathways,
  buildExamPathwayPath,
  type ExamPathwayDefinition,
} from "@/lib/exam-pathways";

// ── Types ────────────────────────────────────────────────────────────────────

export type UserContext = {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
};

export type ContextSwitchResult = {
  href: string;
  context: UserContext;
  /** Whether the exact page was preserved or we fell back to a hub. */
  preservedPage: boolean;
};

export type ProfessionOption = {
  id: string;
  label: string;
  roleTrack: string;
};

export type ExamOption = {
  id: string;
  label: string;
  examCode: string;
  pathwayId: string;
};

// ── Country flag emoji lookup ────────────────────────────────────────────────

const REGION_FLAG: Record<GlobalRegionSlug, string> = {
  philippines: "🇵🇭",
  india: "🇮🇳",
  nigeria: "🇳🇬",
  kenya: "🇰🇪",
  pakistan: "🇵🇰",
  bangladesh: "🇧🇩",
  "south-africa": "🇿🇦",
  uae: "🇦🇪",
  "saudi-arabia": "🇸🇦",
  singapore: "🇸🇬",
  jamaica: "🇯🇲",
  trinidad: "🇹🇹",
  ireland: "🇮🇪",
  "new-zealand": "🇳🇿",
  japan: "🇯🇵",
  china: "🇨🇳",
  "south-korea": "🇰🇷",
  indonesia: "🇮🇩",
  vietnam: "🇻🇳",
  thailand: "🇹🇭",
  italy: "🇮🇹",
  greece: "🇬🇷",
  germany: "🇩🇪",
  france: "🇫🇷",
  hungary: "🇭🇺",
  portugal: "🇵🇹",
  mexico: "🇲🇽",
  us: "🇺🇸",
  canada: "🇨🇦",
  uk: "🇬🇧",
  aus: "🇦🇺",
};

export function getRegionFlag(region: GlobalRegionSlug): string {
  return REGION_FLAG[region] ?? "🌍";
}

// ── Locale display names ─────────────────────────────────────────────────────

const LOCALE_DISPLAY: Partial<Record<GlobalLocaleCode, { label: string; flag: string }>> = {
  en: { label: "English", flag: "🇺🇸" },
  fr: { label: "Français", flag: "🇫🇷" },
  es: { label: "Español", flag: "🇪🇸" },
  tl: { label: "Tagalog", flag: "🇵🇭" },
  hi: { label: "हिन्दी", flag: "🇮🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ko: { label: "한국어", flag: "🇰🇷" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  it: { label: "Italiano", flag: "🇮🇹" },
  hu: { label: "Magyar", flag: "🇭🇺" },
  el: { label: "Ελληνικά", flag: "🇬🇷" },
  zh: { label: "中文", flag: "🇨🇳" },
  "zh-tw": { label: "繁體中文", flag: "🇹🇼" },
  ar: { label: "العربية", flag: "🇸🇦" },
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
  pa: { label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  pt: { label: "Português", flag: "🇵🇹" },
  ur: { label: "اردو", flag: "🇵🇰" },
  fa: { label: "فارسی", flag: "🇮🇷" },
  th: { label: "ไทย", flag: "🇹🇭" },
  tr: { label: "Türkçe", flag: "🇹🇷" },
  id: { label: "Bahasa Indonesia", flag: "🇮🇩" },
  ru: { label: "Русский", flag: "🇷🇺" },
  ht: { label: "Kreyòl", flag: "🇭🇹" },
};

export function getLocaleDisplay(locale: GlobalLocaleCode) {
  return LOCALE_DISPLAY[locale] ?? { label: locale, flag: "🌍" };
}

// ── Professions available for a region ───────────────────────────────────────

/**
 * Returns professions valid for a given region, derived from active exam pathways.
 * Only US and Canada have multiple professions in the current registry;
 * international markets default to RN.
 */
export function getProfessionsForRegion(region: GlobalRegionSlug): ProfessionOption[] {
  const pathways = getPathwaysForRegion(region);
  const seen = new Set<string>();
  const result: ProfessionOption[] = [];

  for (const p of pathways) {
    if (seen.has(p.roleTrack)) continue;
    seen.add(p.roleTrack);
    result.push({
      id: p.roleTrack,
      label: professionDisplayLabel(p.roleTrack),
      roleTrack: p.roleTrack,
    });
  }

  // For international markets with no explicit pathways, default to RN
  if (result.length === 0) {
    result.push({ id: "rn", label: "RN", roleTrack: "rn" });
  }

  return result;
}

// ── Exams available for a region + profession ────────────────────────────────

export function getExamsForRegionProfession(
  region: GlobalRegionSlug,
  profession: string,
): ExamOption[] {
  const pathways = getPathwaysForRegion(region).filter(
    (p) => p.roleTrack === profession,
  );

  if (pathways.length === 0) {
    // For international markets, infer from profession
    const defaultExam = inferDefaultExam(profession);
    return defaultExam ? [defaultExam] : [];
  }

  return pathways.map((p) => ({
    id: p.examCode,
    label: p.shortName,
    examCode: p.examCode,
    pathwayId: p.id,
  }));
}

// ── Context switching ────────────────────────────────────────────────────────

/**
 * Resolve a safe destination when changing country.
 * Re-validates locale, profession, and exam for the new region.
 */
export function resolveCountrySwitch(
  currentContext: UserContext,
  newRegion: GlobalRegionSlug,
  currentPath: string,
): ContextSwitchResult {
  const regionCfg = REGION_CONFIG[newRegion];

  // Resolve locale: keep current if valid, otherwise use region default
  const locale = isAllowedLocaleForRegion(currentContext.locale, newRegion)
    ? currentContext.locale
    : regionCfg.defaultLocale;

  // Resolve profession: check if current profession exists in new region
  const professions = getProfessionsForRegion(newRegion);
  const professionValid = currentContext.profession
    ? professions.some((p) => p.roleTrack === currentContext.profession)
    : false;
  const profession = professionValid
    ? currentContext.profession
    : professions[0]?.roleTrack ?? "rn";

  // Resolve exam: check if current exam exists for new region + profession
  const exams = getExamsForRegionProfession(newRegion, profession!);
  const examValid = currentContext.exam
    ? exams.some((e) => e.examCode === currentContext.exam)
    : false;
  const exam = examValid ? currentContext.exam : exams[0]?.examCode ?? null;

  const newContext: UserContext = { locale, region: newRegion, profession, exam };

  // Try to build equivalent route in new context
  const pathways = getPathwaysForRegion(newRegion);
  const matchingPathway = pathways.find(
    (p) => p.roleTrack === profession && p.examCode === exam,
  );

  if (matchingPathway) {
    const hubPath = buildExamPathwayPath(matchingPathway);
    return { href: hubPath, context: newContext, preservedPage: false };
  }

  const marketingHub = getExamHubForGlobalRegion(newRegion);
  if (marketingHub) {
    return { href: marketingHub.hubPath, context: newContext, preservedPage: false };
  }

  // Fallback to root for the locale
  return { href: "/", context: newContext, preservedPage: false };
}

/**
 * Resolve a safe destination when changing language.
 */
export function resolveLanguageSwitch(
  currentContext: UserContext,
  newLocale: GlobalLocaleCode,
): ContextSwitchResult {
  const newContext: UserContext = { ...currentContext, locale: newLocale };
  // Language changes are handled by the existing marketing locale system
  // (cookie + router refresh), so we return the same conceptual context
  return { href: "/", context: newContext, preservedPage: true };
}

/**
 * Resolve destination when changing profession.
 */
export function resolveProfessionSwitch(
  currentContext: UserContext,
  newProfession: string,
): ContextSwitchResult {
  const exams = getExamsForRegionProfession(currentContext.region, newProfession);
  const exam = exams[0]?.examCode ?? null;
  const newContext: UserContext = {
    ...currentContext,
    profession: newProfession,
    exam,
  };

  const pathways = getPathwaysForRegion(currentContext.region);
  const matchingPathway = pathways.find(
    (p) => p.roleTrack === newProfession && p.examCode === exam,
  );

  if (matchingPathway) {
    return {
      href: buildExamPathwayPath(matchingPathway),
      context: newContext,
      preservedPage: false,
    };
  }

  return { href: "/", context: newContext, preservedPage: false };
}

/**
 * Resolve destination when changing exam.
 */
export function resolveExamSwitch(
  currentContext: UserContext,
  newExam: string,
): ContextSwitchResult {
  const newContext: UserContext = { ...currentContext, exam: newExam };

  const pathways = getPathwaysForRegion(currentContext.region);
  const matchingPathway = pathways.find(
    (p) => p.roleTrack === currentContext.profession && p.examCode === newExam,
  );

  if (matchingPathway) {
    return {
      href: buildExamPathwayPath(matchingPathway),
      context: newContext,
      preservedPage: false,
    };
  }

  return { href: "/", context: newContext, preservedPage: false };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPathwaysForRegion(region: GlobalRegionSlug): ExamPathwayDefinition[] {
  // Map global region slugs to the pathway registry's CountrySlug
  const countrySlugMap: Partial<Record<GlobalRegionSlug, string>> = {
    us: "us",
    canada: "canada",
  };

  const countrySlug = countrySlugMap[region];
  if (!countrySlug) return [];

  return listPublicExamPathways().filter((p) => p.countrySlug === countrySlug);
}

function professionDisplayLabel(roleTrack: string): string {
  const labels: Record<string, string> = {
    rn: "RN",
    rpn: "RPN",
    lpn: "LPN / LVN",
    np: "NP",
    allied: "Allied Health",
    pn: "PN",
  };
  return labels[roleTrack] ?? roleTrack.toUpperCase();
}

function inferDefaultExam(profession: string): ExamOption | null {
  const defaults: Record<string, ExamOption> = {
    rn: { id: "nclex-rn", label: "NCLEX-RN", examCode: "nclex-rn", pathwayId: "" },
    pn: { id: "nclex-pn", label: "NCLEX-PN", examCode: "nclex-pn", pathwayId: "" },
    rpn: { id: "rex-pn", label: "REx-PN", examCode: "rex-pn", pathwayId: "" },
  };
  return defaults[profession] ?? null;
}

// ── Region groups for the selector UI ────────────────────────────────────────

export type RegionGroup = {
  label: string;
  regions: Array<{ slug: GlobalRegionSlug; displayName: string; flag: string }>;
};

export function getRegionGroups(): RegionGroup[] {
  const usCanada: RegionGroup = {
    label: "United States & Canada",
    regions: [
      { slug: "us", displayName: "United States", flag: REGION_FLAG.us },
      { slug: "canada", displayName: "Canada", flag: REGION_FLAG.canada },
    ],
  };

  const internationalSlugs = (Object.keys(REGION_CONFIG) as GlobalRegionSlug[]).filter(
    (slug) => slug !== "us" && slug !== "canada",
  );
  internationalSlugs.sort((a, b) =>
    REGION_CONFIG[a].displayName.localeCompare(REGION_CONFIG[b].displayName, "en", { sensitivity: "base" }),
  );

  const international: RegionGroup = {
    label: "International",
    regions: internationalSlugs.map((slug) => ({
      slug,
      displayName: REGION_CONFIG[slug].displayName,
      flag: REGION_FLAG[slug],
    })),
  };

  return [usCanada, international];
}
