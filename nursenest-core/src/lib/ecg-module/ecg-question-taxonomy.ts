export const ECG_QUESTION_FAMILIES = [
  "strip_identification",
  "rhythm_specific",
  "priority_action",
  "complication_escalation",
  "comparison",
  "clinical_causes",
] as const;

export const ECG_EXAM_STYLE_TAGS = ["telemetry", "icu", "acls", "nclex", "np", "mixed"] as const;

export type EcgQuestionFamily = (typeof ECG_QUESTION_FAMILIES)[number];
export type EcgExamStyle = (typeof ECG_EXAM_STYLE_TAGS)[number];

export type EcgQuestionTaxonomy = {
  rhythmOrTopicKey: string;
  families: EcgQuestionFamily[];
  examStyles: EcgExamStyle[];
  clinicalReviewRequired: boolean;
};

const CATEGORY_FAMILY_MAP: Record<string, EcgQuestionFamily[]> = {
  rhythm_interpretation_mcq: ["rhythm_specific"],
  waveform_identification_drill: ["strip_identification"],
  ngn_ecg_case: ["priority_action", "complication_escalation"],
  telemetry_prioritization: ["priority_action", "complication_escalation"],
  medication_ecg_integration: ["clinical_causes"],
  acls_rhythm_progression: ["complication_escalation", "priority_action"],
  electrolyte_ecg: ["clinical_causes"],
  artifact_vs_true_rhythm: ["comparison", "strip_identification"],
  progressive_curated_set: ["rhythm_specific", "strip_identification"],
};

export function normalizeEcgQuestionTaxonomy(input: {
  rhythmTag: string | null;
  topicTags?: string[] | null;
  clinicalPriority?: string | null;
}): EcgQuestionTaxonomy {
  const tags = (input.topicTags ?? []).map((tag) => tag.trim().toLowerCase());
  const tagSet = new Set(tags);
  const families = new Set<EcgQuestionFamily>();
  const examStyles: EcgExamStyle[] = [];

  for (const family of ECG_QUESTION_FAMILIES) {
    if (tagSet.has(`family:${family}`)) {
      families.add(family);
    }
  }

  for (const [category, categoryFamilies] of Object.entries(CATEGORY_FAMILY_MAP)) {
    if (tagSet.has(`category:${category}`)) {
      for (const family of categoryFamilies) families.add(family);
    }
  }

  if (families.size === 0 && input.clinicalPriority?.trim()) {
    families.add("priority_action");
  }

  for (const examStyle of ECG_EXAM_STYLE_TAGS) {
    if (tagSet.has(`exam_style:${examStyle}`)) {
      examStyles.push(examStyle);
    }
  }

  return {
    rhythmOrTopicKey: input.rhythmTag?.trim() || "unknown",
    families: [...families],
    examStyles,
    clinicalReviewRequired: tagSet.has("review:clinical_required"),
  };
}
