export type HiddenInternationalContentKind =
  | "lesson"
  | "flashcard"
  | "practice_question"
  | "simulation"
  | "osce_station"
  | "ngn_case"
  | "bowtie"
  | "matrix_case"
  | "clinical_pearl"
  | "hint"
  | "rationale"
  | "study_plan"
  | "readiness_domain"
  | "report_card";

export type HiddenInternationalPipelineTarget = {
  readonly pathwayId: string | null;
  readonly countryCode: string;
  readonly profession: string;
  readonly exam: string;
  readonly kind: HiddenInternationalContentKind;
  readonly targetCount: number;
};

export type HiddenInternationalDraftPolicy = {
  readonly status: "draft";
  readonly published: false;
  readonly visibleInNavigation: false;
  readonly learnerAccessible: false;
  readonly launchReady: false;
  readonly adminOnly: true;
  readonly noindex: true;
};

export const HIDDEN_INTERNATIONAL_DRAFT_POLICY: HiddenInternationalDraftPolicy = {
  status: "draft",
  published: false,
  visibleInNavigation: false,
  learnerAccessible: false,
  launchReady: false,
  adminOnly: true,
  noindex: true,
};

export const HIDDEN_INTERNATIONAL_PIPELINE_TARGETS: readonly HiddenInternationalPipelineTarget[] = [
  { pathwayId: "us-rn-nclex-rn", countryCode: "US", profession: "rn", exam: "NCLEX-RN", kind: "lesson", targetCount: 300 },
  { pathwayId: "us-rn-nclex-rn", countryCode: "US", profession: "rn", exam: "NCLEX-RN", kind: "flashcard", targetCount: 5000 },
  { pathwayId: "us-rn-nclex-rn", countryCode: "US", profession: "rn", exam: "NCLEX-RN", kind: "practice_question", targetCount: 2500 },
  { pathwayId: "us-rn-nclex-rn", countryCode: "US", profession: "rn", exam: "NCLEX-RN", kind: "readiness_domain", targetCount: 12 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "lesson", targetCount: 750 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "flashcard", targetCount: 10000 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "practice_question", targetCount: 5000 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "simulation", targetCount: 200 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "osce_station", targetCount: 250 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "ngn_case", targetCount: 250 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "bowtie", targetCount: 150 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "matrix_case", targetCount: 150 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT + OSCE", kind: "study_plan", targetCount: 8 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "lesson", targetCount: 600 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "flashcard", targetCount: 8000 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "practice_question", targetCount: 5000 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "simulation", targetCount: 150 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "ngn_case", targetCount: 250 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "bowtie", targetCount: 150 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "matrix_case", targetCount: 150 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN / IQNM", kind: "study_plan", targetCount: 6 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "lesson", targetCount: 500 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "flashcard", targetCount: 7000 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "practice_question", targetCount: 4000 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "simulation", targetCount: 120 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "ngn_case", targetCount: 200 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "bowtie", targetCount: 125 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "matrix_case", targetCount: 125 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ RN Registration", kind: "study_plan", targetCount: 5 },
] as const;

export function buildHiddenInternationalDraftMetadata(target: HiddenInternationalPipelineTarget) {
  return {
    ...HIDDEN_INTERNATIONAL_DRAFT_POLICY,
    pathwayId: target.pathwayId,
    countryCode: target.countryCode,
    profession: target.profession,
    exam: target.exam,
    contentKind: target.kind,
  } as const;
}

export function validateHiddenInternationalPipelineTargets(): readonly string[] {
  const issues: string[] = [];
  for (const target of HIDDEN_INTERNATIONAL_PIPELINE_TARGETS) {
    if (target.targetCount <= 0) issues.push(`${target.countryCode} ${target.exam} ${target.kind} target must be positive`);
    const meta = buildHiddenInternationalDraftMetadata(target);
    if (meta.status !== "draft" || meta.published || meta.visibleInNavigation || meta.learnerAccessible || meta.launchReady) {
      issues.push(`${target.countryCode} ${target.exam} ${target.kind} is not draft-only`);
    }
  }
  return issues;
}
