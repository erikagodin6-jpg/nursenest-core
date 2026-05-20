import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import type { TerminologyProfileId } from "@/lib/exam-context/exam-registry";
import { getExamRegistryEntryByPathwayId } from "@/lib/exam-context/exam-registry";

/**
 * Canonical term keys — use these in UI templates; resolve per exam context.
 */
export type TerminologyKey =
  | "practical_nurse_role"
  | "unlicensed_assistive"
  | "pn_exam_short"
  | "delegation_hint_short";

type ProfileMap = Partial<Record<TerminologyKey, string>>;

const PROFILES: Record<TerminologyProfileId, ProfileMap> = {
  CANADA_PN: {
    practical_nurse_role: "RPN (registered practical nurse)",
    unlicensed_assistive: "unregulated care provider (UCP) / care aide",
    pn_exam_short: "REx-PN",
    delegation_hint_short: "RN, RPN, and UCP per provincial college standards",
  },
  CANADA_RN: {
    practical_nurse_role: "nursing",
    unlicensed_assistive: "unregulated care provider",
    pn_exam_short: "NCLEX-RN",
    delegation_hint_short: "provincial scope and interprofessional practice",
  },
  CANADA_NP: {
    practical_nurse_role: "NP",
    unlicensed_assistive: "unregulated care provider",
    pn_exam_short: "NP licensure",
    delegation_hint_short: "provincial NP standards",
  },
  US_PN: {
    practical_nurse_role: "LPN/LVN",
    unlicensed_assistive: "UAP",
    pn_exam_short: "NCLEX-PN",
    delegation_hint_short: "RN, LPN/LVN, and UAP per state nurse practice act",
  },
  US_RN: {
    practical_nurse_role: "RN",
    unlicensed_assistive: "UAP",
    pn_exam_short: "NCLEX-RN",
    delegation_hint_short: "RN scope and delegation per facility policy",
  },
  US_NP: {
    practical_nurse_role: "NP",
    unlicensed_assistive: "UAP",
    pn_exam_short: "NP certification",
    delegation_hint_short: "advanced practice and collaborative agreement rules",
  },
  ALLIED: {
    practical_nurse_role: "clinician",
    unlicensed_assistive: "assistive personnel",
    pn_exam_short: "certification exam",
    delegation_hint_short: "scope per profession and employer policy",
  },
};

/**
 * Resolve display terminology for the learner's exam — no scattered string replaces in components.
 */
export function getTerminology(key: TerminologyKey, ctx: GlobalExamContext): string {
  const profile = PROFILES[ctx.terminologyProfile as TerminologyProfileId];
  const v = profile?.[key];
  if (v) return v;
  return key;
}

/** Resolve from pathwayId when full context is not yet threaded. */
export function getTerminologyForPathway(key: TerminologyKey, pathwayId: string | null | undefined, language = "en"): string {
  const row = getExamRegistryEntryByPathwayId(pathwayId);
  if (!row) return key;
  const ctx: GlobalExamContext = {
    country: row.country,
    exam: row.examKey,
    tier: row.tierLabel,
    language: language || "en",
    pathwayId: row.pathwayId,
    registryKey: row.registryKey,
    terminologyProfile: row.terminologyProfile,
    blueprintId: row.blueprintId,
    measurementSystem: getMeasurementSystemForCountry(row.country),
  };
  return getTerminology(key, ctx);
}
