import type { CountryCode } from "@prisma/client";
import { ExamFamily } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { ExamRegistryKey, GlobalExamContext } from "@/lib/exam-context/global-exam-context";

/** Maps pathway → terminology pack — extend for UK_NMC, AU_NMBA, etc. */
export type TerminologyProfileId =
  | "CANADA_PN"
  | "CANADA_RN"
  | "CANADA_NP"
  | "US_PN"
  | "US_RN"
  | "US_NP"
  | "ALLIED";

export type ExamRegistryEntry = {
  registryKey: ExamRegistryKey;
  country: CountryCode;
  examKey: string;
  pathwayId: string;
  displayName: string;
  fullName: string;
  tierLabel: string;
  terminologyProfile: TerminologyProfileId;
  /** Stable blueprint handle for content mapping / future CMS */
  blueprintId: string;
};

function terminologyProfileForPathway(p: ExamPathwayDefinition): TerminologyProfileId {
  if (p.examFamily === ExamFamily.ALLIED) return "ALLIED";
  if (p.countryCode === "CA") {
    if (p.examFamily === ExamFamily.REX_PN) return "CANADA_PN";
    if (p.examFamily === ExamFamily.NP) return "CANADA_NP";
    return "CANADA_RN";
  }
  if (p.examFamily === ExamFamily.NCLEX_PN) return "US_PN";
  if (p.examFamily === ExamFamily.NP) return "US_NP";
  return "US_RN";
}

function tierLabelFromPathway(p: ExamPathwayDefinition): string {
  switch (p.roleTrack) {
    case "rpn":
      return "RPN";
    case "lpn":
      return "PN";
    case "rn":
      return "RN";
    case "np":
      return "NP";
    case "allied":
      return "ALLIED";
    default:
      return p.roleTrack.toUpperCase();
  }
}

function blueprintIdFromPathway(p: ExamPathwayDefinition): string {
  return `${p.countrySlug}-${p.roleTrack}-${p.examCode}-blueprint`;
}

export function registryKeyFromPathway(p: ExamPathwayDefinition): ExamRegistryKey {
  return `${p.countryCode}:${p.examKey}` as ExamRegistryKey;
}

/** All exam products — one row per pathway (same examKey may appear for CA vs US). */
export const EXAM_REGISTRY_BY_PATHWAY_ID: Record<string, ExamRegistryEntry> = Object.fromEntries(
  EXAM_PATHWAYS.map((p) => {
    const registryKey = registryKeyFromPathway(p);
    const entry: ExamRegistryEntry = {
      registryKey,
      country: p.countryCode,
      examKey: p.examKey,
      pathwayId: p.id,
      displayName: p.shortName,
      fullName: p.displayName,
      tierLabel: tierLabelFromPathway(p),
      terminologyProfile: terminologyProfileForPathway(p),
      blueprintId: blueprintIdFromPathway(p),
    };
    return [p.id, entry] as const;
  }),
);

export const EXAM_REGISTRY_BY_KEY: Record<string, ExamRegistryEntry> = Object.fromEntries(
  Object.values(EXAM_REGISTRY_BY_PATHWAY_ID).map((e) => [e.registryKey, e] as const),
);

export function getExamRegistryEntryByPathwayId(pathwayId: string | null | undefined): ExamRegistryEntry | undefined {
  if (!pathwayId?.trim()) return undefined;
  return EXAM_REGISTRY_BY_PATHWAY_ID[pathwayId.trim()];
}

export function getExamRegistryEntryByRegistryKey(key: ExamRegistryKey): ExamRegistryEntry | undefined {
  return EXAM_REGISTRY_BY_KEY[key];
}

/** Build {@link GlobalExamContext} — primary resolver for learner flows. */
export function buildGlobalExamContext(pathwayId: string | null | undefined, language: string = "en"): GlobalExamContext | null {
  const row = getExamRegistryEntryByPathwayId(pathwayId);
  if (!row) return null;
  const lang = language.trim() || "en";
  return {
    country: row.country,
    exam: row.examKey,
    tier: row.tierLabel,
    language: lang,
    pathwayId: row.pathwayId,
    registryKey: row.registryKey,
    terminologyProfile: row.terminologyProfile,
    blueprintId: row.blueprintId,
  };
}
