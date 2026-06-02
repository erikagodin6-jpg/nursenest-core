import type { CountryCode, TierCode } from "@prisma/client";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { displayNameForGlobalCountryCode } from "@/lib/exam-pathways/global-expansion-market-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type AccountExamPreference = {
  readonly country: CountryCode;
  readonly exam: string;
  readonly role: string;
  readonly pathwayId: string;
};

export type PrimaryExamPathwayOption = {
  readonly id: string;
  readonly label: string;
  readonly currentPathwayLabel: string;
  readonly country: CountryCode;
  readonly role: string;
  readonly exam: string;
  readonly status: ExamPathwayDefinition["status"] | "planned";
  readonly publicHubHref: string | null;
};

export type SignupExamFocusForPathway =
  | "nclex_rn"
  | "nclex_pn"
  | "rex_pn"
  | "np_board"
  | "np_fnp"
  | "np_agpcnp"
  | "np_pmhnp"
  | "np_whnp"
  | "np_pnp_pc"
  | "allied_cert";

export type ContentCountryScope = "shared" | "canada" | "united-states" | "both" | "international";

export function pathwayPublicHubHref(pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">): string {
  return `/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}`;
}

export function currentPathwayLabelForPathway(pathway: Pick<ExamPathwayDefinition, "countryCode" | "shortName">): string {
  const country = displayNameForGlobalCountryCode(pathway.countryCode) ?? pathway.countryCode;
  return `${country} ${pathway.shortName}`.trim();
}

export function accountExamPreferenceFromPathwayId(pathwayId: string | null | undefined): AccountExamPreference | null {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : undefined;
  if (!pathway) return null;
  return {
    country: pathway.countryCode,
    exam: pathway.shortName || pathway.examKey,
    role: pathway.roleTrack,
    pathwayId: pathway.id,
  };
}

export function resolvePrimaryExamPathwayId(args: {
  country: CountryCode;
  tier: TierCode;
  examFocus?: string | null;
}): string | null {
  const country = args.country;
  const focus = (args.examFocus ?? "").trim().toLowerCase() as SignupExamFocusForPathway | "";

  if (args.tier === "RN") return country === "US" ? "us-rn-nclex-rn" : "ca-rn-nclex-rn";
  if (args.tier === "RPN") return "ca-rpn-rex-pn";
  if (args.tier === "LVN_LPN") return "us-lpn-nclex-pn";
  if (args.tier === "ALLIED") return country === "US" ? "us-allied-core" : "ca-allied-core";
  if (args.tier === "NP") {
    if (country !== "US") return "ca-np-cnple";
    if (focus === "np_agpcnp") return "us-np-agpcnp";
    if (focus === "np_pmhnp") return "us-np-pmhnp";
    if (focus === "np_whnp") return "us-np-whnp";
    if (focus === "np_pnp_pc") return "us-np-pnp-pc";
    return "us-np-fnp";
  }

  return null;
}

export function listPrimaryExamPathwayOptions(): readonly PrimaryExamPathwayOption[] {
  const publicOptions = EXAM_PATHWAYS.filter((pathway) => pathway.status !== "hidden").map((pathway) => ({
    id: pathway.id,
    label: pathway.displayName,
    currentPathwayLabel: currentPathwayLabelForPathway(pathway),
    country: pathway.countryCode,
    role: pathway.roleTrack,
    exam: pathway.shortName || pathway.examKey,
    status: pathway.status,
    publicHubHref: pathwayPublicHubHref(pathway),
  }));

  const plannedAdmissions: PrimaryExamPathwayOption[] = [
    {
      id: "admissions-ati-teas",
      label: "ATI TEAS",
      currentPathwayLabel: "Admissions ATI TEAS",
      country: "US" as CountryCode,
      role: "pre-nursing",
      exam: "ATI TEAS",
      status: "planned",
      publicHubHref: "/admissions/ati-teas",
    },
    {
      id: "admissions-hesi-a2",
      label: "HESI A2",
      currentPathwayLabel: "Admissions HESI A2",
      country: "US" as CountryCode,
      role: "pre-nursing",
      exam: "HESI A2",
      status: "planned",
      publicHubHref: "/admissions/hesi-a2",
    },
    {
      id: "admissions-casper",
      label: "CASPER",
      currentPathwayLabel: "Admissions CASPER",
      country: "US" as CountryCode,
      role: "pre-nursing",
      exam: "CASPER",
      status: "planned",
      publicHubHref: "/admissions/casper",
    },
  ];

  return [...publicOptions, ...plannedAdmissions];
}

export function contentCountryScopeForPathway(pathwayId: string | null | undefined): ContentCountryScope {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : undefined;
  if (!pathway) return "shared";
  if (pathway.countryCode === "CA") return "canada";
  if (pathway.countryCode === "US") return "united-states";
  return "international";
}

export function contentCountryScopeMatchesPathway(
  scope: ContentCountryScope | null | undefined,
  pathwayId: string | null | undefined,
): boolean {
  const normalized = scope ?? "shared";
  if (normalized === "shared" || normalized === "both") return true;
  return normalized === contentCountryScopeForPathway(pathwayId);
}
