import { ExamFamily } from "@prisma/client";
import type { QuestionDifficultyTier } from "@/lib/questions/difficulty-scope-filter";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getPathwayInstructionalSystem } from "@/lib/measurements/pathway-measurement-policy";

export type ExamType =
  | "NCLEX_RN"
  | "NCLEX_PN"
  | "REX_PN"
  | "AANP"
  | "ANCC"
  | "FNP"
  | "AGACNP"
  | "AGPCNP"
  | "PMHNP"
  | "PNP"
  | "WHNP"
  | "ACNPC_AG"
  | "CNPLE"
  | "NEW_GRAD_RN"
  | "SPECIALTY_CERTIFICATION"
  | "ALLIED_HEALTH"
  | "GENERIC";

export type NursingRole = "PN" | "RPN" | "RN" | "NP" | "ALLIED" | "NEW_GRAD_RN" | "PRE_NURSING";
export type ScopeLevel = "foundational" | "entry_level" | "advanced_practice" | "specialty" | "transition";
export type ExamUnitSystem = "CON" | "SI";
export type ClinicalJudgmentLevel = "foundational" | "clinical_judgment" | "advanced_diagnostic" | "specialty_transition";
export type AcuityLevel = "stable" | "moderate" | "high_acuity" | "specialty";

export type ExamPathwayRuntimeMetadata = {
  examType: ExamType;
  nursingRole: NursingRole;
  country: string;
  scopeLevel: ScopeLevel;
  unitSystem: ExamUnitSystem;
  specialty: string | null;
  difficultyTier: QuestionDifficultyTier;
  clinicalJudgmentLevel: ClinicalJudgmentLevel;
  acuityLevel: AcuityLevel;
};

function npExamType(pathway: ExamPathwayDefinition): ExamType {
  const code = pathway.examCode.trim().toLowerCase();
  const id = pathway.id.trim().toLowerCase();
  if (code === "cnple" || id.includes("cnple")) return "CNPLE";
  if (code.includes("pmhnp")) return "PMHNP";
  if (code.includes("agacnp")) return "AGACNP";
  if (code.includes("agpcnp")) return "AGPCNP";
  if (code.includes("pnp")) return "PNP";
  if (code.includes("whnp")) return "WHNP";
  if (code.includes("fnp")) return "FNP";
  return "AANP";
}

function specialtyForPathway(pathway: ExamPathwayDefinition): string | null {
  if (pathway.examFamily !== ExamFamily.NP) {
    return pathway.examCode === "new-grad-transition" ? "new_grad_transition" : null;
  }
  const code = pathway.examCode.trim().toLowerCase();
  if (code === "cnple") return "canadian_np";
  if (code === "pnp-pc") return "pnp_primary_care";
  return code || null;
}

export function buildExamPathwayRuntimeMetadata(pathway: ExamPathwayDefinition): ExamPathwayRuntimeMetadata {
  const instructional = getPathwayInstructionalSystem(pathway.id, pathway.countryCode);
  const unitSystem: ExamUnitSystem = instructional === "conventional" ? "CON" : "SI";

  if (pathway.examCode === "new-grad-transition") {
    return {
      examType: "NEW_GRAD_RN",
      nursingRole: "NEW_GRAD_RN",
      country: pathway.countryCode,
      scopeLevel: "transition",
      unitSystem,
      specialty: "new_grad_transition",
      difficultyTier: "tier3_advanced",
      clinicalJudgmentLevel: "specialty_transition",
      acuityLevel: "moderate",
    };
  }

  if (pathway.examFamily === ExamFamily.NP) {
    return {
      examType: npExamType(pathway),
      nursingRole: "NP",
      country: pathway.countryCode,
      scopeLevel: "advanced_practice",
      unitSystem,
      specialty: specialtyForPathway(pathway),
      difficultyTier: "tier3_advanced",
      clinicalJudgmentLevel: "advanced_diagnostic",
      acuityLevel: "high_acuity",
    };
  }

  if (pathway.examFamily === ExamFamily.REX_PN) {
    return {
      examType: "REX_PN",
      nursingRole: "RPN",
      country: pathway.countryCode,
      scopeLevel: "foundational",
      unitSystem,
      specialty: null,
      difficultyTier: "tier1_foundational",
      clinicalJudgmentLevel: "foundational",
      acuityLevel: "stable",
    };
  }

  if (pathway.examFamily === ExamFamily.NCLEX_PN) {
    return {
      examType: "NCLEX_PN",
      nursingRole: "PN",
      country: pathway.countryCode,
      scopeLevel: "foundational",
      unitSystem,
      specialty: null,
      difficultyTier: "tier1_foundational",
      clinicalJudgmentLevel: "foundational",
      acuityLevel: "stable",
    };
  }

  if (pathway.examFamily === ExamFamily.NCLEX_RN) {
    return {
      examType: "NCLEX_RN",
      nursingRole: "RN",
      country: pathway.countryCode,
      scopeLevel: "entry_level",
      unitSystem,
      specialty: null,
      difficultyTier: "tier2_clinical_judgment",
      clinicalJudgmentLevel: "clinical_judgment",
      acuityLevel: "moderate",
    };
  }

  if (pathway.examFamily === ExamFamily.ALLIED) {
    return {
      examType: "ALLIED_HEALTH",
      nursingRole: "ALLIED",
      country: pathway.countryCode,
      scopeLevel: "specialty",
      unitSystem,
      specialty: pathway.examCode,
      difficultyTier: "tier2_clinical_judgment",
      clinicalJudgmentLevel: "clinical_judgment",
      acuityLevel: "moderate",
    };
  }

  return {
    examType: "GENERIC",
    nursingRole: pathway.roleTrack === "rn" ? "RN" : pathway.roleTrack === "np" ? "NP" : "PRE_NURSING",
    country: pathway.countryCode,
    scopeLevel: "entry_level",
    unitSystem,
    specialty: specialtyForPathway(pathway),
    difficultyTier: "tier2_clinical_judgment",
    clinicalJudgmentLevel: "clinical_judgment",
    acuityLevel: "moderate",
  };
}
