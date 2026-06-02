/**
 * Premium MLT / MLS specialty modules — bank tagging + marketing copy (single source).
 * Tag questions with `bankTag` on `ExamQuestion.tags` to route CAT/practice slices per specialty.
 */

export type MltPremiumModuleDefinition = {
  /** Stable slug for URLs and telemetry (not locale-keyed). */
  id: string;
  /** Apply to `ExamQuestion.tags` for items authored for this specialty pool. */
  bankTag: string;
  title: string;
  description: string;
};

export const MLT_PREMIUM_MODULE_DEFINITIONS: MltPremiumModuleDefinition[] = [
  {
    id: "hematology",
    bankTag: "module:mlt-hematology",
    title: "Hematology",
    description:
      "Cell morphology, CBC interpretation, differentials, and hemostasis cues framed for MLS/MLT certification vignettes.",
  },
  {
    id: "blood-bank",
    bankTag: "module:mlt-blood-bank",
    title: "Blood bank / transfusion medicine",
    description:
      "ABO/Rh, antibody screening, crossmatch logic, transfusion reactions, and compatibility scenarios at technologist depth.",
  },
  {
    id: "clinical-chemistry",
    bankTag: "module:mlt-clinical-chemistry",
    title: "Clinical chemistry",
    description:
      "Enzymes, electrolytes, proteins, therapeutic monitoring, interference, and delta-check reasoning for chemistry boards.",
  },
  {
    id: "microbiology",
    bankTag: "module:mlt-microbiology",
    title: "Microbiology",
    description:
      "Culture workflow, gram stain significance, susceptibility basics, safety culture, and organism-driven case stems.",
  },
  {
    id: "urinalysis",
    bankTag: "module:mlt-urinalysis",
    title: "Urinalysis",
    description:
      "Physical and chemical UA, microscopy patterns, cast identification, and correlation with renal/clinical context.",
  },
  {
    id: "histology-pathology",
    bankTag: "module:mlt-histology-pathology",
    title: "Histology / pathology",
    description:
      "Tissue processing awareness, staining rationale, specimen adequacy, and correlation items suitable for lab exams.",
  },
  {
    id: "molecular-diagnostics",
    bankTag: "module:mlt-molecular-diagnostics",
    title: "Molecular diagnostics",
    description:
      "PCR hygiene, contamination control, QC for amplification workflows, and interpretation guardrails for molecular lanes.",
  },
  {
    id: "qc-instrumentation",
    bankTag: "module:mlt-qc-instrumentation",
    title: "Quality control / instrumentation",
    description:
      "Westgard-style rules awareness, troubleshooting analyzer drift, calibration verification, and preventive maintenance judgment.",
  },
];

/** Canonical `module:mlt-*` tags — exclude from general MLT practice hub counts. */
export const MLT_PREMIUM_MODULE_BANK_TAGS: readonly string[] = MLT_PREMIUM_MODULE_DEFINITIONS.map((m) => m.bankTag);
