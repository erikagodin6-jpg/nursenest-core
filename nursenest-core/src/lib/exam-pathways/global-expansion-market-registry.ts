import type { CountryCode } from "@prisma/client";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type GlobalLaunchTier = 1 | 2 | 3 | 4;
export type GlobalMarketStatus = "core" | "next_wave" | "future" | "research";
export type GlobalProfessionTrack = "rn" | "rpn" | "lpn" | "pn-lpn" | "np" | "allied" | "pre-nursing" | "admissions";
export type GlobalContentScope = "global" | "country_specific" | "exam_specific";

export type GlobalCountryMarket = {
  readonly countryCode: string;
  readonly prismaCountryCode?: CountryCode;
  readonly countrySlug: string;
  readonly displayName: string;
  readonly selectorLabel: string;
  readonly launchTier: GlobalLaunchTier;
  readonly status: GlobalMarketStatus;
  readonly region: "north_america" | "english_speaking" | "migration_market" | "middle_east" | "asia_pacific";
  readonly primaryLanguage: string;
  readonly futureLanguages: readonly string[];
  readonly supportedPathwayIds: readonly string[];
  readonly plannedPathways: readonly {
    readonly profession: GlobalProfessionTrack;
    readonly exam: string;
    readonly canonicalHref: string;
  }[];
  readonly seoHref: string;
  readonly dashboardSegmentKey: string;
};

export type GlobalCountrySelectorOption = {
  readonly countryCode: string;
  readonly countrySlug: string;
  readonly label: string;
  readonly launchTier: GlobalLaunchTier;
  readonly status: GlobalMarketStatus;
  readonly href: string;
  readonly supportedPathwayCount: number;
};

export type GlobalPathwayPreference = {
  readonly country: string;
  readonly profession: GlobalProfessionTrack;
  readonly exam: string;
  readonly pathwayId: string;
  readonly href: string;
};

export const GLOBAL_COUNTRY_MARKETS: readonly GlobalCountryMarket[] = [
  {
    countryCode: "CA",
    prismaCountryCode: "CA" as CountryCode,
    countrySlug: "canada",
    displayName: "Canada",
    selectorLabel: "Canada",
    launchTier: 1,
    status: "core",
    region: "north_america",
    primaryLanguage: "en",
    futureLanguages: ["fr"],
    supportedPathwayIds: ["ca-rn-nclex-rn", "ca-rpn-rex-pn", "ca-np-cnple", "ca-allied-core", "pre-nursing-ca"],
    plannedPathways: [],
    seoHref: "/canada",
    dashboardSegmentKey: "country.ca",
  },
  {
    countryCode: "US",
    prismaCountryCode: "US" as CountryCode,
    countrySlug: "us",
    displayName: "United States",
    selectorLabel: "United States",
    launchTier: 1,
    status: "core",
    region: "north_america",
    primaryLanguage: "en",
    futureLanguages: ["es"],
    supportedPathwayIds: [
      "us-rn-nclex-rn",
      "us-lpn-nclex-pn",
      "us-np-fnp",
      "us-np-agpcnp",
      "us-np-pmhnp",
      "us-np-whnp",
      "us-np-pnp-pc",
      "us-allied-core",
      "pre-nursing",
    ],
    plannedPathways: [
      { profession: "admissions", exam: "ATI TEAS", canonicalHref: "/admissions/ati-teas" },
      { profession: "admissions", exam: "HESI A2", canonicalHref: "/admissions/hesi-a2" },
      { profession: "admissions", exam: "CASPER", canonicalHref: "/admissions/casper" },
    ],
    seoHref: "/us",
    dashboardSegmentKey: "country.us",
  },
  {
    countryCode: "GB",
    prismaCountryCode: "GB" as CountryCode,
    countrySlug: "uk",
    displayName: "United Kingdom",
    selectorLabel: "United Kingdom",
    launchTier: 2,
    status: "next_wave",
    region: "english_speaking",
    primaryLanguage: "en",
    futureLanguages: [],
    supportedPathwayIds: ["uk-rn-nmc-test-of-competence"],
    plannedPathways: [{ profession: "rn", exam: "NMC CBT", canonicalHref: "/uk/rn/nmc-cbt" }],
    seoHref: "/uk",
    dashboardSegmentKey: "country.gb",
  },
  {
    countryCode: "AU",
    prismaCountryCode: "AU" as CountryCode,
    countrySlug: "australia",
    displayName: "Australia",
    selectorLabel: "Australia",
    launchTier: 2,
    status: "next_wave",
    region: "english_speaking",
    primaryLanguage: "en",
    futureLanguages: [],
    supportedPathwayIds: ["au-rn-iqnm-pathway"],
    plannedPathways: [{ profession: "rn", exam: "NMBA / AHPRA", canonicalHref: "/au/rn" }],
    seoHref: "/australia",
    dashboardSegmentKey: "country.au",
  },
  {
    countryCode: "NZ",
    countrySlug: "new-zealand",
    displayName: "New Zealand",
    selectorLabel: "New Zealand",
    launchTier: 2,
    status: "future",
    region: "english_speaking",
    primaryLanguage: "en",
    futureLanguages: [],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "NCNZ", canonicalHref: "/nz/rn" }],
    seoHref: "/nz",
    dashboardSegmentKey: "country.nz",
  },
  {
    countryCode: "IE",
    countrySlug: "ireland",
    displayName: "Ireland",
    selectorLabel: "Ireland",
    launchTier: 2,
    status: "future",
    region: "english_speaking",
    primaryLanguage: "en",
    futureLanguages: [],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "NMBI Registration", canonicalHref: "/ie/rn" }],
    seoHref: "/ie",
    dashboardSegmentKey: "country.ie",
  },
  {
    countryCode: "PH",
    prismaCountryCode: "PH" as CountryCode,
    countrySlug: "philippines",
    displayName: "Philippines",
    selectorLabel: "Philippines",
    launchTier: 3,
    status: "future",
    region: "migration_market",
    primaryLanguage: "en",
    futureLanguages: ["tl"],
    supportedPathwayIds: ["ph-rn-prc-pnle"],
    plannedPathways: [{ profession: "rn", exam: "PRC PNLE", canonicalHref: "/ph/rn/pnle" }],
    seoHref: "/philippines",
    dashboardSegmentKey: "country.ph",
  },
  {
    countryCode: "IN",
    prismaCountryCode: "IN" as CountryCode,
    countrySlug: "india",
    displayName: "India",
    selectorLabel: "India",
    launchTier: 3,
    status: "future",
    region: "migration_market",
    primaryLanguage: "en",
    futureLanguages: ["hi"],
    supportedPathwayIds: ["in-rn-state-nursing-council-registration"],
    plannedPathways: [{ profession: "rn", exam: "State Nursing Council Registration", canonicalHref: "/in/rn" }],
    seoHref: "/india",
    dashboardSegmentKey: "country.in",
  },
  {
    countryCode: "NG",
    prismaCountryCode: "NG" as CountryCode,
    countrySlug: "nigeria",
    displayName: "Nigeria",
    selectorLabel: "Nigeria",
    launchTier: 3,
    status: "future",
    region: "migration_market",
    primaryLanguage: "en",
    futureLanguages: [],
    supportedPathwayIds: ["ng-rn-nmcn-licensure"],
    plannedPathways: [{ profession: "rn", exam: "NMCN Licensure", canonicalHref: "/ng/rn" }],
    seoHref: "/nigeria",
    dashboardSegmentKey: "country.ng",
  },
  {
    countryCode: "ZA",
    countrySlug: "south-africa",
    displayName: "South Africa",
    selectorLabel: "South Africa",
    launchTier: 3,
    status: "research",
    region: "migration_market",
    primaryLanguage: "en",
    futureLanguages: [],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "SANC Registration", canonicalHref: "/za/rn" }],
    seoHref: "/south-africa",
    dashboardSegmentKey: "country.za",
  },
  {
    countryCode: "SA",
    prismaCountryCode: "SA" as CountryCode,
    countrySlug: "saudi-arabia",
    displayName: "Saudi Arabia",
    selectorLabel: "Saudi Arabia",
    launchTier: 4,
    status: "future",
    region: "middle_east",
    primaryLanguage: "en",
    futureLanguages: ["ar"],
    supportedPathwayIds: ["sa-rn-scfhs-licensure"],
    plannedPathways: [{ profession: "rn", exam: "SCFHS Licensure", canonicalHref: "/sa/rn" }],
    seoHref: "/saudi-arabia",
    dashboardSegmentKey: "country.sa",
  },
  {
    countryCode: "AE",
    countrySlug: "uae",
    displayName: "UAE",
    selectorLabel: "UAE",
    launchTier: 4,
    status: "future",
    region: "middle_east",
    primaryLanguage: "en",
    futureLanguages: ["ar"],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "UAE Nursing Licensure", canonicalHref: "/ae/rn" }],
    seoHref: "/uae",
    dashboardSegmentKey: "country.ae",
  },
  {
    countryCode: "QA",
    countrySlug: "qatar",
    displayName: "Qatar",
    selectorLabel: "Qatar",
    launchTier: 4,
    status: "research",
    region: "middle_east",
    primaryLanguage: "en",
    futureLanguages: ["ar"],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "Qatar Nursing Licensure", canonicalHref: "/qa/rn" }],
    seoHref: "/qatar",
    dashboardSegmentKey: "country.qa",
  },
  {
    countryCode: "KW",
    countrySlug: "kuwait",
    displayName: "Kuwait",
    selectorLabel: "Kuwait",
    launchTier: 4,
    status: "research",
    region: "middle_east",
    primaryLanguage: "en",
    futureLanguages: ["ar"],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "Kuwait Nursing Licensure", canonicalHref: "/kw/rn" }],
    seoHref: "/kuwait",
    dashboardSegmentKey: "country.kw",
  },
  {
    countryCode: "SG",
    countrySlug: "singapore",
    displayName: "Singapore",
    selectorLabel: "Singapore",
    launchTier: 4,
    status: "research",
    region: "asia_pacific",
    primaryLanguage: "en",
    futureLanguages: ["zh"],
    supportedPathwayIds: [],
    plannedPathways: [{ profession: "rn", exam: "SNB Registration", canonicalHref: "/sg/rn" }],
    seoHref: "/singapore",
    dashboardSegmentKey: "country.sg",
  },
] as const;

export function listGlobalCountryMarkets(): readonly GlobalCountryMarket[] {
  return GLOBAL_COUNTRY_MARKETS;
}

export function getGlobalCountryMarketByCode(countryCode: string | null | undefined): GlobalCountryMarket | null {
  const normalized = countryCode?.trim().toUpperCase();
  if (!normalized) return null;
  return GLOBAL_COUNTRY_MARKETS.find((market) => market.countryCode === normalized) ?? null;
}

export function getGlobalCountryMarketBySlug(countrySlug: string | null | undefined): GlobalCountryMarket | null {
  const normalized = countrySlug?.trim().toLowerCase();
  if (!normalized) return null;
  return GLOBAL_COUNTRY_MARKETS.find((market) => market.countrySlug === normalized) ?? null;
}

export function displayNameForGlobalCountryCode(countryCode: string | null | undefined): string | null {
  return getGlobalCountryMarketByCode(countryCode)?.displayName ?? null;
}

export function listGlobalCountrySelectorOptions(): readonly GlobalCountrySelectorOption[] {
  return GLOBAL_COUNTRY_MARKETS.map((market) => ({
    countryCode: market.countryCode,
    countrySlug: market.countrySlug,
    label: market.selectorLabel,
    launchTier: market.launchTier,
    status: market.status,
    href: market.seoHref,
    supportedPathwayCount: market.supportedPathwayIds.length,
  }));
}

export function listPathwaysForGlobalCountry(countryCodeOrSlug: string): readonly ExamPathwayDefinition[] {
  const market = getGlobalCountryMarketByCode(countryCodeOrSlug) ?? getGlobalCountryMarketBySlug(countryCodeOrSlug);
  if (!market) return [];
  return market.supportedPathwayIds
    .map((id) => getExamPathwayById(id))
    .filter((pathway): pathway is ExamPathwayDefinition => Boolean(pathway));
}

export function globalPathwayPreferenceFromPathwayId(pathwayId: string | null | undefined): GlobalPathwayPreference | null {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : undefined;
  if (!pathway) return null;
  const market = getGlobalCountryMarketByCode(pathway.countryCode);
  return {
    country: market?.displayName ?? String(pathway.countryCode),
    profession: pathway.roleTrack,
    exam: pathway.shortName || pathway.examKey,
    pathwayId: pathway.id,
    href: `/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}`,
  };
}

export function globalContentScopeForPathway(pathwayId: string | null | undefined): GlobalContentScope {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : undefined;
  if (!pathway) return "global";
  if (pathway.contentExamKeys.length > 0) return "exam_specific";
  if (pathway.countryCode) return "country_specific";
  return "global";
}

export function validateGlobalMarketRegistry(): readonly string[] {
  const issues: string[] = [];
  const seenCodes = new Set<string>();
  const seenSlugs = new Set<string>();
  for (const market of GLOBAL_COUNTRY_MARKETS) {
    if (seenCodes.has(market.countryCode)) issues.push(`Duplicate global country code: ${market.countryCode}`);
    if (seenSlugs.has(market.countrySlug)) issues.push(`Duplicate global country slug: ${market.countrySlug}`);
    seenCodes.add(market.countryCode);
    seenSlugs.add(market.countrySlug);
    for (const pathwayId of market.supportedPathwayIds) {
      if (!EXAM_PATHWAYS.some((pathway) => pathway.id === pathwayId)) {
        issues.push(`Unknown pathway ${pathwayId} listed for ${market.displayName}`);
      }
    }
  }
  return issues;
}
