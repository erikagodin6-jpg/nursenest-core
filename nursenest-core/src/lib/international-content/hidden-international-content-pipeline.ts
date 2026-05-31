export type HiddenInternationalContentKind =
  | "lesson"
  | "flashcard"
  | "practice_question"
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
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT", kind: "lesson", targetCount: 500 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT", kind: "flashcard", targetCount: 5000 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT", kind: "practice_question", targetCount: 3000 },
  { pathwayId: "uk-rn-nmc-test-of-competence", countryCode: "GB", profession: "rn", exam: "NMC CBT", kind: "study_plan", targetCount: 8 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN", kind: "lesson", targetCount: 400 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN", kind: "flashcard", targetCount: 4000 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN", kind: "practice_question", targetCount: 2500 },
  { pathwayId: "au-rn-iqnm-pathway", countryCode: "AU", profession: "rn", exam: "NMBA RN", kind: "study_plan", targetCount: 6 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ", kind: "lesson", targetCount: 300 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ", kind: "flashcard", targetCount: 3000 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ", kind: "practice_question", targetCount: 2000 },
  { pathwayId: null, countryCode: "NZ", profession: "rn", exam: "NCNZ", kind: "study_plan", targetCount: 5 },
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
