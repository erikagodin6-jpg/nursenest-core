import type { CompetencyEvidence, CompetencyProfession } from "@/lib/competencies/competency-registry";
import {
  buildLearnerCompetencyPassport,
  listAvailableReadinessCertificates,
  listEarnedBadges,
} from "@/lib/competencies/competency-registry";

export type MasteryPassportId =
  | "ecg_passport"
  | "labs_passport"
  | "pharmacology_passport"
  | "clinical_skills_passport"
  | "medication_math_passport"
  | "leadership_passport";

export type CompetencyClearanceId =
  | "telemetry_ready"
  | "medication_safety_ready"
  | "new_graduate_ready"
  | "critical_care_ready"
  | "emergency_nursing_ready"
  | "lab_interpretation_ready";

export type MasteryPassport = Readonly<{
  id: MasteryPassportId;
  name: string;
  profession: CompetencyProfession;
  earnedCompetencyCount: number;
  inProgressCompetencyCount: number;
  attentionCompetencyCount: number;
  badgeCount: number;
  certificateCount: number;
  earned: boolean;
}>;

export type CompetencyClearance = Readonly<{
  id: CompetencyClearanceId;
  name: string;
  earned: boolean;
  requiredPerformance: readonly string[];
  disclaimer: string;
}>;

const clearanceDisclaimer =
  "Internal NurseNest readiness clearance only. This is not licensure, certification, or employer credentialing.";

const PASSPORTS: readonly Omit<MasteryPassport, "earnedCompetencyCount" | "inProgressCompetencyCount" | "attentionCompetencyCount" | "badgeCount" | "certificateCount" | "earned">[] = [
  { id: "ecg_passport", name: "ECG Passport", profession: "RN" },
  { id: "labs_passport", name: "Labs Passport", profession: "RN" },
  { id: "pharmacology_passport", name: "Pharmacology Passport", profession: "RN" },
  { id: "clinical_skills_passport", name: "Clinical Skills Passport", profession: "RN" },
  { id: "medication_math_passport", name: "Medication Math Passport", profession: "PN" },
  { id: "leadership_passport", name: "Leadership Passport", profession: "RN" },
];

export function buildMasteryPassports(args: {
  profession: CompetencyProfession;
  evidence: readonly CompetencyEvidence[];
}): readonly MasteryPassport[] {
  return PASSPORTS.filter((passport) => passport.profession === args.profession).map((passport) => {
    const competencyPassport = buildLearnerCompetencyPassport({
      profession: passport.profession,
      evidence: args.evidence,
    });
    const badgeCount = listEarnedBadges(competencyPassport).length;
    const certificateCount = listAvailableReadinessCertificates(competencyPassport).length;
    return {
      ...passport,
      earnedCompetencyCount: competencyPassport.competenciesEarned.length,
      inProgressCompetencyCount: competencyPassport.competenciesInProgress.length,
      attentionCompetencyCount: competencyPassport.competenciesRequiringAttention.length,
      badgeCount,
      certificateCount,
      earned:
        competencyPassport.overallReadiness >= 0.85 &&
        competencyPassport.competenciesEarned.length > competencyPassport.competenciesRequiringAttention.length,
    };
  });
}

export function buildCompetencyClearances(args: {
  profession: CompetencyProfession;
  evidence: readonly CompetencyEvidence[];
}): readonly CompetencyClearance[] {
  const passport = buildLearnerCompetencyPassport({ profession: args.profession, evidence: args.evidence });
  const readiness = passport.overallReadiness;
  const earnedCompetencies = new Set(passport.competenciesEarned.map((item) => item.competency.id));

  const clearances: readonly CompetencyClearance[] = [
    {
      id: "telemetry_ready",
      name: "Telemetry Ready",
      earned: earnedCompetencies.has("rn_ecg_foundations"),
      requiredPerformance: ["ECG interpretation", "clinical judgment", "simulation evidence"],
      disclaimer: clearanceDisclaimer,
    },
    {
      id: "medication_safety_ready",
      name: "Medication Safety Ready",
      earned: earnedCompetencies.has("rn_medication_safety") || earnedCompetencies.has("pn_medication_administration"),
      requiredPerformance: ["knowledge", "reasoning", "documentation"],
      disclaimer: clearanceDisclaimer,
    },
    {
      id: "new_graduate_ready",
      name: "New Graduate Ready",
      earned: earnedCompetencies.has("new_grad_escalation_readiness"),
      requiredPerformance: ["prioritization", "communication", "simulation outcomes"],
      disclaimer: clearanceDisclaimer,
    },
    {
      id: "critical_care_ready",
      name: "Critical Care Ready",
      earned: readiness >= 0.75 && earnedCompetencies.has("rn_ecg_foundations") && earnedCompetencies.has("rn_abg_lab_interpretation"),
      requiredPerformance: ["ECG", "ABG/labs", "escalation", "simulation outcomes"],
      disclaimer: clearanceDisclaimer,
    },
    {
      id: "emergency_nursing_ready",
      name: "Emergency Nursing Ready",
      earned: earnedCompetencies.has("rn_clinical_judgment_prioritization"),
      requiredPerformance: ["triage", "prioritization", "emergency simulation"],
      disclaimer: clearanceDisclaimer,
    },
    {
      id: "lab_interpretation_ready",
      name: "Lab Interpretation Ready",
      earned: earnedCompetencies.has("rn_abg_lab_interpretation"),
      requiredPerformance: ["lab interpretation", "clinical reasoning", "readiness evidence"],
      disclaimer: clearanceDisclaimer,
    },
  ];

  return clearances.filter((clearance) => {
    if (clearance.id === "new_graduate_ready") return args.profession === "NEW_GRAD";
    return args.profession === "RN" || args.profession === "PN" || args.profession === "NP";
  });
}
