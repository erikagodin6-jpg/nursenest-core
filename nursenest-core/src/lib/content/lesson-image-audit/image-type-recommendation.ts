import type {
  RecommendedLessonImageType,
  LessonImageProductionCluster,
} from "@/lib/content/lesson-image-audit/types";
import type { VisualNecessityInput } from "@/lib/content/lesson-image-audit/visual-necessity";

export type ImageTypeRecommendation = {
  primary: RecommendedLessonImageType;
  secondary: RecommendedLessonImageType[];
  productionNotes: string;
  sharedVisualSystemId: string | null;
};

function haystack(input: VisualNecessityInput): string {
  return [input.title, input.slug, input.topic, input.topicSlug, input.bodySystem]
    .join(" ")
    .toLowerCase();
}

export function recommendLessonImageTypes(input: VisualNecessityInput): ImageTypeRecommendation {
  const h = haystack(input);

  if (
    /\b(ecg|ekg|rhythm|arrhythmia|afib|a-fib|atrial fibrillation|atrial-fibrillation|fibrillation|stemi|bundle branch)\b/.test(
      h,
    )
  ) {
    return {
      primary: "ecg_strip",
      secondary: ["clinical_illustration", "comparison_table"],
      productionNotes: "Rhythm-focused strip plus brief annotation panel; keep grid calm and Blossom-tinted.",
      sharedVisualSystemId: "ecg_rhythm_family",
    };
  }

  if (/\b(insulin|anticoagulant|heparin|warfarin|medication|drug|pharm)\b/.test(h)) {
    return {
      primary: "medication_chart",
      secondary: ["comparison_table", "nursing_workflow"],
      productionNotes: "Onset/peak/duration or mechanism chart with clear nursing safety callouts.",
      sharedVisualSystemId: h.includes("insulin") ? "insulin_onset_peak_chart" : "medication_safety_chart",
    };
  }

  if (/\b(hyperkalemia|hypokalemia|potassium|electrolyte).*(ecg|ekg)\b/.test(h) || /\b(ecg|ekg).*(potassium|electrolyte)\b/.test(h)) {
    return {
      primary: "ecg_strip",
      secondary: ["comparison_table", "lab_interpretation_chart"],
      productionNotes: "Modular electrolyte ECG changes panel — reusable across K/Mg/Ca lessons.",
      sharedVisualSystemId: "electrolyte_ecg",
    };
  }

  if (/\b(abg|arterial blood gas|lab|electrolyte|potassium|sodium|bicarbonate|cbc)\b/.test(h)) {
    return {
      primary: "lab_interpretation_chart",
      secondary: ["algorithm_flowchart", "comparison_table"],
      productionNotes: "Interpretation ladder with normal/abnormal bands — not raw number memorization only.",
      sharedVisualSystemId: h.includes("abg") || h.includes("arterial blood gas")
        ? "abg_interpretation"
        : "lab_interpretation_panel",
    };
  }

  if (/\b(ventilator|ventilation|intubation|peep|fio2)\b/.test(h)) {
    return {
      primary: "nursing_workflow",
      secondary: ["infographic", "clinical_illustration"],
      productionNotes: "Mode/workflow diagram with safety checkpoints for bedside nurses.",
      sharedVisualSystemId: "ventilation_workflow",
    };
  }

  if (/\b(chest tube|thoracentesis|tracheostomy|procedure|insertion)\b/.test(h)) {
    return {
      primary: "nursing_workflow",
      secondary: ["anatomy_diagram", "clinical_illustration"],
      productionNotes: "Stepwise procedure workflow with equipment landmarks.",
      sharedVisualSystemId: "procedure_workflow",
    };
  }

  if (/\b(burn|wound|skin|pressure injury|ulcer)\b/.test(h)) {
    return {
      primary: "clinical_illustration",
      secondary: ["infographic", "nursing_workflow"],
      productionNotes: "Layered tissue / depth visual with staging or assessment cues.",
      sharedVisualSystemId: "integumentary_clinical",
    };
  }

  if (/\b(anatomy|structure|landmark|placement)\b/.test(h)) {
    return {
      primary: "anatomy_diagram",
      secondary: ["clinical_illustration"],
      productionNotes: "Clean vector anatomy with minimal labels and high contrast lines.",
      sharedVisualSystemId: "anatomy_diagram",
    };
  }

  if (/\b(shock|cardiogenic|hypovolemic|distributive|obstructive)\b/.test(h) && /\b(type|types|compare|versus|vs)\b/.test(h)) {
    return {
      primary: "comparison_table",
      secondary: ["infographic", "algorithm_flowchart"],
      productionNotes: "Shock type comparison matrix — hemodynamics, causes, nursing priorities.",
      sharedVisualSystemId: "shock_comparison",
    };
  }

  if (/\b(acls|bls|pals|cardiac arrest|defibrillation|code blue)\b/.test(h)) {
    return {
      primary: "algorithm_flowchart",
      secondary: ["nursing_workflow", "infographic"],
      productionNotes: "ACLS-style algorithm with numbered branches and mint accent decision nodes.",
      sharedVisualSystemId: "acls_algorithm",
    };
  }

  if (/\b(shock|sepsis|emergency|arrest|code|anaphylaxis)\b/.test(h)) {
    return {
      primary: "algorithm_flowchart",
      secondary: ["nursing_workflow", "infographic"],
      productionNotes: "Time-critical algorithm with priority nursing actions highlighted in mint/blossom accents.",
      sharedVisualSystemId: "emergency_algorithm",
    };
  }

  if (/\b(compare|versus|vs\.?|types of|classification)\b/.test(h)) {
    return {
      primary: "comparison_table",
      secondary: ["infographic"],
      productionNotes: "Side-by-side comparison with consistent iconography across related lessons.",
      sharedVisualSystemId: "comparison_matrix",
    };
  }

  if (/\b(pulmonary embolism|embolism|dvt|pe\b|infarction|heart failure|copd|pneumonia)\b/.test(h)) {
    return {
      primary: "infographic",
      secondary: ["clinical_illustration", "patient_scenario_visual"],
      productionNotes:
        h.includes("embolism") || h.includes("pe")
          ? "Lung vascular infographic + clot pathway; soft mint background."
          : "Pathophysiology infographic linking signs → nursing priorities.",
      sharedVisualSystemId:
        h.includes("embolism") || /\bpe\b/.test(h) ? "lung_vascular_pe" : "cardiopulmonary_infographic",
    };
  }

  if (/\b(soap|diagnosis|chronic|np\b|primary care)\b/.test(h)) {
    return {
      primary: "patient_scenario_visual",
      secondary: ["nursing_workflow", "algorithm_flowchart"],
      productionNotes: "Scenario vignette frame for NP reasoning — not stock photo patients.",
      sharedVisualSystemId: "np_scenario_panel",
    };
  }

  return {
    primary: "clinical_illustration",
    secondary: ["infographic"],
    productionNotes: "General premium clinical illustration aligned to lesson title and body system.",
    sharedVisualSystemId: null,
  };
}

export function resolveProductionCluster(
  input: VisualNecessityInput,
  imageTypes: ImageTypeRecommendation,
): { cluster: LessonImageProductionCluster; label: string } {
  const h = haystack(input);

  if (imageTypes.primary === "ecg_strip" || /\b(ecg|ekg|acls|arrhythmia)\b/.test(h)) {
    if (/\bacls\b/.test(h)) return { cluster: "cardiac_acls", label: "Cardiac · ACLS" };
    if (
      /\b(arrhythmia|afib|a-fib|atrial fibrillation|atrial-fibrillation|fibrillation|rhythm)\b/.test(h)
    ) {
      return { cluster: "cardiac_arrhythmias", label: "Cardiac · Arrhythmias" };
    }
    return { cluster: "cardiac_ecg", label: "Cardiac · ECG" };
  }

  if (/\b(respiratory|pulmonary|copd|ards|ventilator|pe\b|embolism)\b/.test(h)) {
    return { cluster: "respiratory", label: "Respiratory" };
  }

  if (/\b(pharm|medication|insulin|anticoagulant|drug)\b/.test(h)) {
    return { cluster: "pharmacology", label: "Pharmacology" };
  }

  if (/\b(lab|abg|electrolyte|cbc)\b/.test(h)) {
    return { cluster: "labs", label: "Labs & interpretation" };
  }

  if (/\b(shock|sepsis|burn|med-surg|surgical|perioperative)\b/.test(h)) {
    return { cluster: "med_surg", label: "Med-Surg" };
  }

  if (/\b(emergency|trauma|arrest|anaphylaxis|triage)\b/.test(h)) {
    return { cluster: "emergency", label: "Emergency care" };
  }

  if (imageTypes.primary === "anatomy_diagram" || /\banatomy\b/.test(h)) {
    return { cluster: "anatomy", label: "Anatomy" };
  }

  if (/\b(soap|np\b|diagnostic|chronic disease)\b/.test(h) || input.bodySystem.toLowerCase().includes("np")) {
    return { cluster: "np_clinical", label: "NP clinical" };
  }

  if (/\b(procedure|insertion|chest tube)\b/.test(h)) {
    return { cluster: "procedures", label: "Procedures" };
  }

  if (/\b(study tip|policy|documentation)\b/.test(h)) {
    return { cluster: "policy_study_skills", label: "Study skills / policy" };
  }

  return { cluster: "other", label: "Other clinical" };
}
