export const ECG_WAVEFORM_FIDELITY_VALUES = [
  "educational_simplified",
  "morphology_approximate",
  "clinician_reviewed",
  "electrophysiology_validated",
] as const;

export const ECG_QA_STATUS_VALUES = [
  "pending",
  "internal_review",
  "approved",
  "rejected",
  "quarantined",
] as const;

export const ECG_PUBLISH_SAFETY_STATUS_VALUES = [
  "safe",
  "context_required",
  "internal_only",
  "unsafe",
] as const;

export type EcgWaveformFidelity = (typeof ECG_WAVEFORM_FIDELITY_VALUES)[number];
export type EcgQaStatus = (typeof ECG_QA_STATUS_VALUES)[number];
export type EcgPublishSafetyStatus = (typeof ECG_PUBLISH_SAFETY_STATUS_VALUES)[number];

export type EcgQuestionGovernanceSnapshot = {
  id?: string;
  rhythmTag: string | null;
  topicTags?: string[] | null;
  mediaType?: string | null;
  mediaConfig?: unknown;
  videoUrl?: string | null;
  clinicianReviewedAt?: Date | string | null;
  clinicianReviewedBy?: string | null;
  waveformFidelity?: string | null;
  qaStatus?: string | null;
  publishSafetyStatus?: string | null;
};

export type EcgQuestionGovernanceFlags = {
  hasRenderableMedia: boolean;
  quarantined: boolean;
  pacemakerGeneratorQuarantined: boolean;
  clinicianReviewed: boolean;
  qaApproved: boolean;
  publishSafe: boolean;
  waveformApproximate: boolean;
  contextDependent: boolean;
  learnerVisible: boolean;
};

export const ECG_QUARANTINED_RHYTHM_KEYS = [
  "first_degree_av_block",
  "second_degree_type_i_av_block",
  "second_degree_type_ii_av_block",
  "third_degree_av_block",
] as const;

export const ECG_CONTEXT_DEPENDENT_RHYTHM_KEYS = [
  "pea",
  "stemi_pattern",
  "hyperkalemia_pattern",
] as const;

const QUARANTINED_SET = new Set<string>(ECG_QUARANTINED_RHYTHM_KEYS);
const CONTEXT_DEPENDENT_SET = new Set<string>(ECG_CONTEXT_DEPENDENT_RHYTHM_KEYS);

export function isQuarantinedEcgRhythm(rhythmKey: string | null | undefined): boolean {
  return Boolean(rhythmKey && QUARANTINED_SET.has(rhythmKey));
}

export function rhythmRequiresContextualInterpretation(rhythmKey: string | null | undefined): boolean {
  return Boolean(rhythmKey && CONTEXT_DEPENDENT_SET.has(rhythmKey));
}

export function isPacemakerEcgQuestion(
  question: Pick<EcgQuestionGovernanceSnapshot, "rhythmTag" | "topicTags">,
): boolean {
  if (question.rhythmTag === "paced_rhythm") return true;
  return (question.topicTags ?? []).some((tag) => {
    const normalized = tag.trim().toLowerCase();
    return normalized.includes("pacemaker") || normalized.includes("paced");
  });
}

export function usesGeneratedPacemakerPhysiology(
  question: Pick<EcgQuestionGovernanceSnapshot, "rhythmTag" | "mediaType" | "mediaConfig">,
): boolean {
  return question.rhythmTag === "paced_rhythm" && question.mediaType === "ecg_live_strip" && Boolean(question.mediaConfig);
}

export function hasRenderableEcgMedia(question: Pick<EcgQuestionGovernanceSnapshot, "mediaType" | "mediaConfig" | "videoUrl">): boolean {
  if (question.mediaType === "ecg_live_strip") {
    return Boolean(question.mediaConfig && typeof question.mediaConfig === "object" && !Array.isArray(question.mediaConfig));
  }
  return typeof question.videoUrl === "string" ? question.videoUrl.trim().length > 0 : false;
}

export function defaultEcgQaMetadataForRhythm(
  rhythmKey: string,
  source: "generated" | "curated" | "draft_promoted" = "generated",
): {
  waveformFidelity: EcgWaveformFidelity;
  qaStatus: EcgQaStatus;
  publishSafetyStatus: EcgPublishSafetyStatus;
} {
  if (isQuarantinedEcgRhythm(rhythmKey)) {
    return {
      waveformFidelity: "morphology_approximate",
      qaStatus: "quarantined",
      publishSafetyStatus: "internal_only",
    };
  }

  if (source === "curated") {
    return {
      waveformFidelity: "morphology_approximate",
      qaStatus: "approved",
      publishSafetyStatus: "safe",
    };
  }

  if (source === "draft_promoted") {
    return {
      waveformFidelity: "educational_simplified",
      qaStatus: "internal_review",
      publishSafetyStatus: "internal_only",
    };
  }

  return {
    waveformFidelity: "educational_simplified",
    qaStatus: "pending",
    publishSafetyStatus: "internal_only",
  };
}

export function isEcgQuestionLearnerVisible(question: EcgQuestionGovernanceSnapshot): boolean {
  return getEcgQuestionGovernanceFlags(question).learnerVisible;
}

export function countPublishReadyEcgQuestions(questions: EcgQuestionGovernanceSnapshot[]): number {
  return questions.filter((question) => isEcgQuestionLearnerVisible(question)).length;
}

export function getEcgQuestionGovernanceFlags(question: EcgQuestionGovernanceSnapshot): EcgQuestionGovernanceFlags {
  const pacemakerGeneratorQuarantined = usesGeneratedPacemakerPhysiology(question);
  const quarantined = isQuarantinedEcgRhythm(question.rhythmTag) || pacemakerGeneratorQuarantined;
  const hasRenderableMedia = hasRenderableEcgMedia(question);
  const clinicianReviewed = Boolean(question.clinicianReviewedAt);
  const qaApproved = question.qaStatus === "approved" && !pacemakerGeneratorQuarantined;
  const publishSafe = question.publishSafetyStatus === "safe" && !pacemakerGeneratorQuarantined;
  const waveformApproximate =
    question.waveformFidelity === "educational_simplified" ||
    question.waveformFidelity === "morphology_approximate";
  const contextDependent = rhythmRequiresContextualInterpretation(question.rhythmTag);

  return {
    hasRenderableMedia,
    quarantined,
    pacemakerGeneratorQuarantined,
    clinicianReviewed,
    qaApproved,
    publishSafe,
    waveformApproximate,
    contextDependent,
    learnerVisible:
      !quarantined &&
      hasRenderableMedia &&
      clinicianReviewed &&
      qaApproved &&
      publishSafe,
  };
}

export function getEcgAdminWarnings(question: EcgQuestionGovernanceSnapshot): string[] {
  const warnings: string[] = [];
  if (usesGeneratedPacemakerPhysiology(question)) {
    warnings.push("Pacemaker generator output is internal-only until static clinician-reviewed paced strips replace the simplified renderer.");
  }
  if (isQuarantinedEcgRhythm(question.rhythmTag)) {
    warnings.push("Quarantined: renderer cannot faithfully model this conduction morphology yet.");
  }
  if (
    question.waveformFidelity === "educational_simplified" ||
    question.waveformFidelity === "morphology_approximate"
  ) {
    warnings.push("Waveform fidelity is approximate, not electrophysiology validated.");
  }
  if (rhythmRequiresContextualInterpretation(question.rhythmTag)) {
    warnings.push("Diagnosis depends on contextual interpretation, not strip morphology alone.");
  }
  if (!question.clinicianReviewedAt) {
    warnings.push("No clinician review recorded.");
  }
  return warnings;
}
