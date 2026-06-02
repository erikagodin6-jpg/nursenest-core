import type { CountryCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { GlobalProfessionTrack } from "@/lib/exam-pathways/global-expansion-market-registry";

export type GlobalExamLaunchStatus = "current_market" | "draft" | "research";
export type GlobalExamContentStatus = "live" | "draft_inventory" | "not_started";
export type GlobalExamReadinessStatus = "live" | "needs_gap_analysis" | "needs_regulator_review" | "not_started";
export type GlobalExamVisibilityStatus = "public" | "admin_only_hidden";

export type GlobalExamRegistryEntry = {
  readonly id: string;
  readonly country: string;
  readonly countryCode: string;
  readonly prismaCountryCode?: CountryCode;
  readonly regulator: string;
  readonly exam: string;
  readonly profession: GlobalProfessionTrack;
  readonly pathwayId: string | null;
  readonly publicPath: string;
  readonly adminPreviewPath: string;
  readonly launchStatus: GlobalExamLaunchStatus;
  readonly contentStatus: GlobalExamContentStatus;
  readonly readinessStatus: GlobalExamReadinessStatus;
  readonly visibilityStatus: GlobalExamVisibilityStatus;
  readonly noindex: boolean;
  readonly sitemapEligible: boolean;
  readonly navigationEligible: boolean;
};

export const GLOBAL_EXAM_REGISTRY: readonly GlobalExamRegistryEntry[] = [
  {
    id: "global-ca-rn-nclex-rn",
    country: "Canada",
    countryCode: "CA",
    prismaCountryCode: "CA" as CountryCode,
    regulator: "National Council of State Boards of Nursing / Canadian regulators",
    exam: "NCLEX-RN",
    profession: "rn",
    pathwayId: "ca-rn-nclex-rn",
    publicPath: "/canada/rn/nclex-rn",
    adminPreviewPath: "/admin/global-expansion/hubs/canada/rn",
    launchStatus: "current_market",
    contentStatus: "live",
    readinessStatus: "live",
    visibilityStatus: "public",
    noindex: false,
    sitemapEligible: true,
    navigationEligible: true,
  },
  {
    id: "global-us-rn-nclex-rn",
    country: "United States",
    countryCode: "US",
    prismaCountryCode: "US" as CountryCode,
    regulator: "National Council of State Boards of Nursing",
    exam: "NCLEX-RN",
    profession: "rn",
    pathwayId: "us-rn-nclex-rn",
    publicPath: "/us/rn/nclex-rn",
    adminPreviewPath: "/admin/global-expansion/hubs/us/rn",
    launchStatus: "current_market",
    contentStatus: "live",
    readinessStatus: "live",
    visibilityStatus: "public",
    noindex: false,
    sitemapEligible: true,
    navigationEligible: true,
  },
  {
    id: "global-uk-rn-nmc-cbt",
    country: "United Kingdom",
    countryCode: "GB",
    prismaCountryCode: "GB" as CountryCode,
    regulator: "Nursing and Midwifery Council",
    exam: "NMC CBT / OSCE",
    profession: "rn",
    pathwayId: "uk-rn-nmc-test-of-competence",
    publicPath: "/uk/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/uk/rn",
    launchStatus: "draft",
    contentStatus: "draft_inventory",
    readinessStatus: "needs_regulator_review",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-au-rn-nmba",
    country: "Australia",
    countryCode: "AU",
    prismaCountryCode: "AU" as CountryCode,
    regulator: "NMBA / AHPRA",
    exam: "NMBA RN Pathway",
    profession: "rn",
    pathwayId: "au-rn-iqnm-pathway",
    publicPath: "/au/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/au/rn",
    launchStatus: "draft",
    contentStatus: "draft_inventory",
    readinessStatus: "needs_regulator_review",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-nz-rn-ncnz",
    country: "New Zealand",
    countryCode: "NZ",
    regulator: "Nursing Council of New Zealand",
    exam: "NCNZ Registration",
    profession: "rn",
    pathwayId: null,
    publicPath: "/nz/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/nz/rn",
    launchStatus: "draft",
    contentStatus: "not_started",
    readinessStatus: "needs_gap_analysis",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-ie-rn-nmbi",
    country: "Ireland",
    countryCode: "IE",
    regulator: "Nursing and Midwifery Board of Ireland",
    exam: "NMBI Registration",
    profession: "rn",
    pathwayId: null,
    publicPath: "/ie/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/ie/rn",
    launchStatus: "draft",
    contentStatus: "not_started",
    readinessStatus: "needs_gap_analysis",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-ph-rn-pnle",
    country: "Philippines",
    countryCode: "PH",
    prismaCountryCode: "PH" as CountryCode,
    regulator: "Professional Regulation Commission",
    exam: "PNLE",
    profession: "rn",
    pathwayId: "ph-rn-prc-pnle",
    publicPath: "/ph/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/ph/rn",
    launchStatus: "draft",
    contentStatus: "draft_inventory",
    readinessStatus: "needs_regulator_review",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-in-rn-registration",
    country: "India",
    countryCode: "IN",
    prismaCountryCode: "IN" as CountryCode,
    regulator: "Indian Nursing Council / state nursing councils",
    exam: "State Nursing Council Registration",
    profession: "rn",
    pathwayId: "in-rn-state-nursing-council-registration",
    publicPath: "/in/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/in/rn",
    launchStatus: "draft",
    contentStatus: "draft_inventory",
    readinessStatus: "needs_regulator_review",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-sa-rn-scfhs",
    country: "Saudi Arabia",
    countryCode: "SA",
    prismaCountryCode: "SA" as CountryCode,
    regulator: "Saudi Commission for Health Specialties",
    exam: "SCFHS RN Licensure",
    profession: "rn",
    pathwayId: "sa-rn-scfhs-licensure",
    publicPath: "/sa/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/sa/rn",
    launchStatus: "draft",
    contentStatus: "draft_inventory",
    readinessStatus: "needs_regulator_review",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
  {
    id: "global-ae-rn-licensure",
    country: "UAE",
    countryCode: "AE",
    regulator: "UAE health authorities",
    exam: "UAE Nursing Licensure",
    profession: "rn",
    pathwayId: null,
    publicPath: "/ae/rn",
    adminPreviewPath: "/admin/global-expansion/hubs/ae/rn",
    launchStatus: "draft",
    contentStatus: "not_started",
    readinessStatus: "needs_gap_analysis",
    visibilityStatus: "admin_only_hidden",
    noindex: true,
    sitemapEligible: false,
    navigationEligible: false,
  },
] as const;

export function listGlobalExamRegistryEntries(): readonly GlobalExamRegistryEntry[] {
  return GLOBAL_EXAM_REGISTRY;
}

export function listHiddenGlobalExamRegistryEntries(): readonly GlobalExamRegistryEntry[] {
  return GLOBAL_EXAM_REGISTRY.filter((entry) => entry.visibilityStatus === "admin_only_hidden");
}

export function findGlobalExamRegistryEntryByAdminRoute(
  countryCodeOrSlug: string,
  profession: string,
): GlobalExamRegistryEntry | null {
  const country = countryCodeOrSlug.trim().toLowerCase();
  const normalizedProfession = profession.trim().toLowerCase();
  return (
    GLOBAL_EXAM_REGISTRY.find((entry) => {
      const code = entry.countryCode.toLowerCase();
      const publicCountry = entry.publicPath.split("/").filter(Boolean)[0]?.toLowerCase();
      return (country === code || country === publicCountry) && entry.profession === normalizedProfession;
    }) ?? null
  );
}

export function validateGlobalExamRegistry(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  const adminRoutes = new Set<string>();
  for (const entry of GLOBAL_EXAM_REGISTRY) {
    if (ids.has(entry.id)) issues.push(`Duplicate global exam registry id: ${entry.id}`);
    ids.add(entry.id);
    if (adminRoutes.has(entry.adminPreviewPath)) issues.push(`Duplicate admin preview path: ${entry.adminPreviewPath}`);
    adminRoutes.add(entry.adminPreviewPath);
    if (entry.pathwayId && !getExamPathwayById(entry.pathwayId)) {
      issues.push(`Unknown pathway id ${entry.pathwayId} for ${entry.id}`);
    }
    if (entry.visibilityStatus === "admin_only_hidden") {
      if (!entry.noindex) issues.push(`${entry.id} must be noindex`);
      if (entry.sitemapEligible) issues.push(`${entry.id} must not be sitemap eligible`);
      if (entry.navigationEligible) issues.push(`${entry.id} must not be navigation eligible`);
      if (entry.launchStatus === "current_market") issues.push(`${entry.id} hidden entry cannot be current_market`);
    }
  }
  return issues;
}
