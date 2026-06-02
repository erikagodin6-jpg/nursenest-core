export interface AlliedDomainWeight {
  domain: string;
  weightMin: number;
  weightMax: number;
}

export interface AlliedExamBlueprint {
  examKey: string;
  examName: string;
  totalQuestionsRange: [number, number];
  timeLimitMinutes: number;
  examDeliveryType: "fixed" | "adaptive" | "sectional";
  scoringModel: "dichotomous" | "partialCredit" | "scaled";
  passingStandardModel: "cutScore" | "scaledScore" | "competencyBased";
  caseBasedRequired: boolean;
  calculationRequired: boolean;
  domainWeights: AlliedDomainWeight[];
  questionTypesAllowed: string[];
  questionTypesRequiredMin: Record<string, number>;
  formatValidation: {
    minCaseClusterPercent?: number;
    minCalculationQuestions?: number;
    minDataTableQuestions?: number;
    minCompoundingQuestions?: number;
    minLawQuestions?: number;
    minScenarioPercent?: number;
    minMedDosingQuestions?: number;
    minTriageQuestions?: number;
    minABGQuestions?: number;
    minVentQuestions?: number;
    minVignettePercent?: number;
    minEthicsQuestions?: number;
    minSuicideRiskQuestions?: number;
    minAppliedScenarioPercent?: number;
    minCulturalCompetenceQuestions?: number;
    minCrisisInterventionQuestions?: number;
    minMIScenarioPercent?: number;
    minHarmReductionQuestions?: number;
    minWithdrawalQuestions?: number;
    minRadiationSafetyQuestions?: number;
    minPositioningQuestions?: number;
    minImageEvalQuestions?: number;
  };
}

export const ALLIED_EXAM_BLUEPRINTS: Record<string, AlliedExamBlueprint> = {
  MLT: {
    examKey: "MLT",
    examName: "Medical Laboratory Technologist Certification",
    totalQuestionsRange: [100, 200],
    timeLimitMinutes: 210,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "scaledScore",
    caseBasedRequired: true,
    calculationRequired: true,
    domainWeights: [
      { domain: "Clinical Chemistry", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Hematology & Coagulation", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Microbiology", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Transfusion Medicine", weightMin: 0.10, weightMax: 0.15 },
      { domain: "Immunology/Molecular/Lab Ops", weightMin: 0.10, weightMax: 0.20 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "NUMERIC_ENTRY",
      "MATCHING",
      "DATA_TABLE_INTERPRETATION",
      "MATRIX_SINGLE",
      "LAB_INTERPRETATION",
      "CALCULATION_NUMERIC",
      "MATCHING_GRID",
      "CASE_STUDY_SERIES",
    ],
    questionTypesRequiredMin: {
      CASE_BASED_CLUSTER: 10,
      NUMERIC_ENTRY: 10,
      DATA_TABLE_INTERPRETATION: 5,
    },
    formatValidation: {
      minCaseClusterPercent: 10,
      minCalculationQuestions: 10,
      minDataTableQuestions: 5,
    },
  },

  PHARM_TECH: {
    examKey: "PHARM_TECH",
    examName: "Pharmacy Technician Certification",
    totalQuestionsRange: [90, 150],
    timeLimitMinutes: 150,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    caseBasedRequired: false,
    calculationRequired: true,
    domainWeights: [
      { domain: "Prescription Processing", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Pharmacology Basics", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Calculations", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Compounding", weightMin: 0.10, weightMax: 0.20 },
      { domain: "Law & Ethics", weightMin: 0.10, weightMax: 0.15 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "NUMERIC_ENTRY",
      "CASE_BASED_CLUSTER",
      "MATCHING",
      "PRIORITIZATION",
      "CALCULATION_NUMERIC",
      "MATCHING_GRID",
      "CASE_STUDY_SERIES",
    ],
    questionTypesRequiredMin: {
      NUMERIC_ENTRY: 18,
      CASE_BASED_CLUSTER: 5,
      MATCHING: 5,
    },
    formatValidation: {
      minCalculationQuestions: 18,
      minCompoundingQuestions: 5,
      minLawQuestions: 5,
    },
  },

  PARAMEDIC: {
    examKey: "PARAMEDIC",
    examName: "Paramedic Certification Exam",
    totalQuestionsRange: [100, 150],
    timeLimitMinutes: 180,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    caseBasedRequired: true,
    calculationRequired: false,
    domainWeights: [
      { domain: "Airway & Respiratory", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Cardiology", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Trauma", weightMin: 0.20, weightMax: 0.25 },
      { domain: "Medical Emergencies", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Professional Practice", weightMin: 0.05, weightMax: 0.10 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
      "NUMERIC_ENTRY",
      "CASE_STUDY_SERIES",
      "CALCULATION_NUMERIC",
      "IMAGE_HOTSPOT",
      "TREND",
      "DRAG_DROP",
    ],
    questionTypesRequiredMin: {
      CASE_BASED_CLUSTER: 25,
      NUMERIC_ENTRY: 5,
      PRIORITIZATION: 5,
    },
    formatValidation: {
      minScenarioPercent: 25,
      minMedDosingQuestions: 5,
      minTriageQuestions: 5,
    },
  },

  RRT: {
    examKey: "RRT",
    examName: "Registered Respiratory Therapist Certification",
    totalQuestionsRange: [100, 160],
    timeLimitMinutes: 210,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    caseBasedRequired: true,
    calculationRequired: true,
    domainWeights: [
      { domain: "Patient Assessment", weightMin: 0.20, weightMax: 0.25 },
      { domain: "Mechanical Ventilation", weightMin: 0.25, weightMax: 0.35 },
      { domain: "ABG & Acid-Base", weightMin: 0.15, weightMax: 0.20 },
      { domain: "Cardiopulmonary Pathophysiology", weightMin: 0.15, weightMax: 0.20 },
      { domain: "Equipment & Safety", weightMin: 0.10, weightMax: 0.15 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "NUMERIC_ENTRY",
      "DATA_INTERPRETATION",
      "LAB_INTERPRETATION",
      "CALCULATION_NUMERIC",
      "TREND",
      "CASE_STUDY_SERIES",
    ],
    questionTypesRequiredMin: {
      CASE_BASED_CLUSTER: 10,
      NUMERIC_ENTRY: 5,
      DATA_INTERPRETATION: 10,
    },
    formatValidation: {
      minABGQuestions: 10,
      minVentQuestions: 10,
      minCalculationQuestions: 5,
    },
  },

  PSYCHOTHERAPIST: {
    examKey: "PSYCHOTHERAPIST",
    examName: "Registered Psychotherapist Qualifying Exam",
    totalQuestionsRange: [100, 150],
    timeLimitMinutes: 180,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "competencyBased",
    caseBasedRequired: true,
    calculationRequired: false,
    domainWeights: [
      { domain: "Ethics & Professional Standards", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Assessment & Diagnosis", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Treatment Planning", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Crisis & Risk Management", weightMin: 0.10, weightMax: 0.20 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
      "SHORT_CASE_ANALYSIS",
      "CASE_STUDY_SERIES",
      "MATCHING_GRID",
    ],
    questionTypesRequiredMin: {
      CASE_BASED_CLUSTER: 30,
      MCQ_SINGLE: 10,
      PRIORITIZATION: 5,
    },
    formatValidation: {
      minVignettePercent: 30,
      minEthicsQuestions: 10,
      minSuicideRiskQuestions: 5,
    },
  },

  SOCIAL_WORK: {
    examKey: "SOCIAL_WORK",
    examName: "Social Work Licensing Exam (ASWB/Canadian)",
    totalQuestionsRange: [120, 170],
    timeLimitMinutes: 240,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    caseBasedRequired: true,
    calculationRequired: false,
    domainWeights: [
      { domain: "Human Behavior & Development", weightMin: 0.15, weightMax: 0.20 },
      { domain: "Assessment & Diagnosis", weightMin: 0.18, weightMax: 0.22 },
      { domain: "Intervention & Treatment Planning", weightMin: 0.20, weightMax: 0.25 },
      { domain: "Ethics & Professional Practice", weightMin: 0.18, weightMax: 0.22 },
      { domain: "Community Resources", weightMin: 0.10, weightMax: 0.15 },
      { domain: "Crisis Intervention", weightMin: 0.10, weightMax: 0.15 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
      "CASE_STUDY_SERIES",
      "MATCHING_GRID",
    ],
    questionTypesRequiredMin: {
      CASE_BASED_CLUSTER: 48,
      MCQ_SINGLE: 10,
      PRIORITIZATION: 10,
    },
    formatValidation: {
      minAppliedScenarioPercent: 40,
      minCulturalCompetenceQuestions: 10,
      minCrisisInterventionQuestions: 10,
    },
  },

  ADDICTIONS_WORKER: {
    examKey: "ADDICTIONS_WORKER",
    examName: "Addictions and Mental Health Worker Certification",
    totalQuestionsRange: [90, 140],
    timeLimitMinutes: 150,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    caseBasedRequired: true,
    calculationRequired: false,
    domainWeights: [
      { domain: "Foundations of Addiction", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Counseling Techniques", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Harm Reduction", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Crisis & Withdrawal", weightMin: 0.15, weightMax: 0.20 },
      { domain: "Ethics & Legal", weightMin: 0.10, weightMax: 0.15 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
      "CASE_STUDY_SERIES",
      "MATCHING_GRID",
    ],
    questionTypesRequiredMin: {
      CASE_BASED_CLUSTER: 18,
      PRIORITIZATION: 10,
      MCQ_SINGLE: 5,
    },
    formatValidation: {
      minMIScenarioPercent: 20,
      minHarmReductionQuestions: 10,
      minWithdrawalQuestions: 5,
    },
  },

  IMAGING: {
    examKey: "IMAGING",
    examName: "Diagnostic Imaging Technologist Certification",
    totalQuestionsRange: [150, 200],
    timeLimitMinutes: 225,
    examDeliveryType: "fixed",
    scoringModel: "scaled",
    passingStandardModel: "scaledScore",
    caseBasedRequired: false,
    calculationRequired: true,
    domainWeights: [
      { domain: "Patient Care & Safety", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Radiation Physics", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Imaging Procedures & Positioning", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Image Production & Evaluation", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Radiation Protection", weightMin: 0.10, weightMax: 0.15 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "CALCULATION",
      "MATCHING",
      "IMAGE_HOTSPOT",
      "CALCULATION_NUMERIC",
      "MATCHING_GRID",
      "CASE_STUDY_SERIES",
    ],
    questionTypesRequiredMin: {
      MCQ_SINGLE: 10,
      CASE_BASED_CLUSTER: 10,
      CALCULATION: 5,
      MATCHING: 5,
    },
    formatValidation: {
      minRadiationSafetyQuestions: 10,
      minPositioningQuestions: 10,
      minCalculationQuestions: 5,
      minImageEvalQuestions: 5,
    },
  },
  OT: {
    examKey: "OT",
    examName: "Occupational Therapy Certification",
    totalQuestionsRange: [170, 200],
    timeLimitMinutes: 240,
    examDeliveryType: "fixed",
    scoringModel: "scaled",
    passingStandardModel: "scaledScore",
    caseBasedRequired: true,
    calculationRequired: false,
    domainWeights: [
      { domain: "Evaluation & Assessment", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Intervention Planning & Implementation", weightMin: 0.30, weightMax: 0.40 },
      { domain: "Professional Practice & Ethics", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Psychosocial & Mental Health", weightMin: 0.10, weightMax: 0.20 },
      { domain: "Pediatrics & Development", weightMin: 0.10, weightMax: 0.20 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
      "MATCHING",
      "SHORT_CASE_ANALYSIS",
      "CASE_STUDY_SERIES",
      "MATCHING_GRID",
      "DRAG_DROP",
    ],
    questionTypesRequiredMin: {
      MCQ_SINGLE: 20,
      CASE_BASED_CLUSTER: 15,
      PRIORITIZATION: 5,
    },
    formatValidation: {
      minCaseClusterPercent: 35,
      minEthicsQuestions: 10,
      minVignettePercent: 35,
    },
  },
  PT: {
    examKey: "PT",
    examName: "Physical Therapy Certification",
    totalQuestionsRange: [200, 250],
    timeLimitMinutes: 300,
    examDeliveryType: "fixed",
    scoringModel: "scaled",
    passingStandardModel: "scaledScore",
    caseBasedRequired: true,
    calculationRequired: false,
    domainWeights: [
      { domain: "Musculoskeletal", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Neuromuscular", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Cardiopulmonary", weightMin: 0.10, weightMax: 0.20 },
      { domain: "Other Systems", weightMin: 0.10, weightMax: 0.15 },
      { domain: "Non-System / Professional Responsibilities", weightMin: 0.10, weightMax: 0.20 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
      "DIFFERENTIAL_DIAGNOSIS",
      "NUMERIC_ENTRY",
      "PROGRESSION_DECISION",
      "CASE_STUDY_SERIES",
      "CALCULATION_NUMERIC",
      "TREND",
    ],
    questionTypesRequiredMin: {
      MCQ_SINGLE: 30,
      CASE_BASED_CLUSTER: 20,
      DIFFERENTIAL_DIAGNOSIS: 10,
      PRIORITIZATION: 5,
    },
    formatValidation: {
      minAppliedScenarioPercent: 40,
      minCaseClusterPercent: 40,
    },
  },
};

export interface BlueprintQuestion {
  domain: string;
  questionType: string;
  tags?: string[];
}

export interface BlueprintValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateExamBlueprint(
  questions: BlueprintQuestion[],
  blueprint: AlliedExamBlueprint
): BlueprintValidationResult {
  const errors: string[] = [];
  const total = questions.length;
  const [minQ, maxQ] = blueprint.totalQuestionsRange;

  if (total < minQ || total > maxQ) {
    errors.push(
      `Question count ${total} is outside allowed range [${minQ}, ${maxQ}]`
    );
  }

  const domainCounts: Record<string, number> = {};
  for (const q of questions) {
    domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1;
  }

  const TOLERANCE = 0.03;
  for (const dw of blueprint.domainWeights) {
    const count = domainCounts[dw.domain] || 0;
    const actualWeight = total > 0 ? count / total : 0;
    if (actualWeight < dw.weightMin - TOLERANCE) {
      errors.push(
        `Domain "${dw.domain}" weight ${(actualWeight * 100).toFixed(1)}% is below minimum ${(dw.weightMin * 100).toFixed(1)}% (tolerance -3%)`
      );
    }
    if (actualWeight > dw.weightMax + TOLERANCE) {
      errors.push(
        `Domain "${dw.domain}" weight ${(actualWeight * 100).toFixed(1)}% exceeds maximum ${(dw.weightMax * 100).toFixed(1)}% (tolerance +3%)`
      );
    }
  }

  const typeCounts: Record<string, number> = {};
  for (const q of questions) {
    typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
  }

  for (const [qType, minRequired] of Object.entries(blueprint.questionTypesRequiredMin)) {
    const count = typeCounts[qType] || 0;
    if (count < minRequired) {
      errors.push(
        `Question type "${qType}" has ${count} questions but requires at least ${minRequired}`
      );
    }
  }

  const fv = blueprint.formatValidation;

  if (fv.minCaseClusterPercent != null) {
    const clusterCount = (typeCounts["CASE_BASED_CLUSTER"] || 0) + (typeCounts["CASE_STUDY_SERIES"] || 0);
    const clusterPercent = total > 0 ? (clusterCount / total) * 100 : 0;
    if (clusterPercent < fv.minCaseClusterPercent) {
      errors.push(
        `Case-based clusters at ${clusterPercent.toFixed(1)}% is below required ${fv.minCaseClusterPercent}%`
      );
    }
  }

  if (fv.minCalculationQuestions != null) {
    const calcCount =
      (typeCounts["NUMERIC_ENTRY"] || 0) + (typeCounts["CALCULATION"] || 0) + (typeCounts["CALCULATION_NUMERIC"] || 0);
    if (calcCount < fv.minCalculationQuestions) {
      errors.push(
        `Calculation questions: ${calcCount} is below required minimum of ${fv.minCalculationQuestions}`
      );
    }
  }

  if (fv.minDataTableQuestions != null) {
    const dtCount = typeCounts["DATA_TABLE_INTERPRETATION"] || 0;
    if (dtCount < fv.minDataTableQuestions) {
      errors.push(
        `Data table questions: ${dtCount} is below required minimum of ${fv.minDataTableQuestions}`
      );
    }
  }

  if (fv.minScenarioPercent != null) {
    const scenarioCount =
      (typeCounts["CASE_BASED_CLUSTER"] || 0) + (typeCounts["PRIORITIZATION"] || 0);
    const scenarioPercent = total > 0 ? (scenarioCount / total) * 100 : 0;
    if (scenarioPercent < fv.minScenarioPercent) {
      errors.push(
        `Scenario-based questions at ${scenarioPercent.toFixed(1)}% is below required ${fv.minScenarioPercent}%`
      );
    }
  }

  if (fv.minVignettePercent != null) {
    const vignetteCount =
      (typeCounts["CASE_BASED_CLUSTER"] || 0) + (typeCounts["SHORT_CASE_ANALYSIS"] || 0);
    const vignettePercent = total > 0 ? (vignetteCount / total) * 100 : 0;
    if (vignettePercent < fv.minVignettePercent) {
      errors.push(
        `Vignette questions at ${vignettePercent.toFixed(1)}% is below required ${fv.minVignettePercent}%`
      );
    }
  }

  if (fv.minAppliedScenarioPercent != null) {
    const appliedCount =
      (typeCounts["CASE_BASED_CLUSTER"] || 0) + (typeCounts["PRIORITIZATION"] || 0);
    const appliedPercent = total > 0 ? (appliedCount / total) * 100 : 0;
    if (appliedPercent < fv.minAppliedScenarioPercent) {
      errors.push(
        `Applied scenario questions at ${appliedPercent.toFixed(1)}% is below required ${fv.minAppliedScenarioPercent}%`
      );
    }
  }

  if (fv.minMIScenarioPercent != null) {
    const miCount =
      (typeCounts["CASE_BASED_CLUSTER"] || 0) + (typeCounts["PRIORITIZATION"] || 0);
    const miPercent = total > 0 ? (miCount / total) * 100 : 0;
    if (miPercent < fv.minMIScenarioPercent) {
      errors.push(
        `MI scenario questions at ${miPercent.toFixed(1)}% is below required ${fv.minMIScenarioPercent}%`
      );
    }
  }

  const simpleMinChecks: Array<{
    key: keyof typeof fv;
    label: string;
    countFn: () => number;
  }> = [
    { key: "minCompoundingQuestions", label: "Compounding questions", countFn: () => typeCounts["MATCHING"] || 0 },
    { key: "minLawQuestions", label: "Law & ethics questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.tags?.includes("law") || q.tags?.includes("ethics") || q.domain === "Law & Ethics" || q.domain === "Ethics & Legal") c++;
      }
      return c || typeCounts["MCQ_SINGLE"] ? Math.min(typeCounts["MCQ_SINGLE"] || 0, 5) : 0;
    }},
    { key: "minMedDosingQuestions", label: "Medication dosing questions", countFn: () => typeCounts["NUMERIC_ENTRY"] || 0 },
    { key: "minTriageQuestions", label: "Triage questions", countFn: () => typeCounts["PRIORITIZATION"] || 0 },
    { key: "minABGQuestions", label: "ABG interpretation questions", countFn: () => typeCounts["DATA_INTERPRETATION"] || 0 },
    { key: "minVentQuestions", label: "Ventilation questions", countFn: () => typeCounts["CASE_BASED_CLUSTER"] || 0 },
    { key: "minEthicsQuestions", label: "Ethics questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Ethics & Professional Standards" || q.tags?.includes("ethics")) c++;
      }
      return c;
    }},
    { key: "minSuicideRiskQuestions", label: "Suicide risk questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.tags?.includes("suicide-risk") || q.tags?.includes("crisis")) c++;
      }
      return c;
    }},
    { key: "minCulturalCompetenceQuestions", label: "Cultural competence questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Diversity & Cultural Practice" || q.tags?.includes("cultural")) c++;
      }
      return c;
    }},
    { key: "minCrisisInterventionQuestions", label: "Crisis intervention questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.tags?.includes("crisis") || q.domain === "Crisis & Risk Management" || q.domain === "Crisis & Withdrawal") c++;
      }
      return c;
    }},
    { key: "minHarmReductionQuestions", label: "Harm reduction questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Harm Reduction" || q.tags?.includes("harm-reduction")) c++;
      }
      return c;
    }},
    { key: "minWithdrawalQuestions", label: "Withdrawal questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Crisis & Withdrawal" || q.tags?.includes("withdrawal")) c++;
      }
      return c;
    }},
    { key: "minRadiationSafetyQuestions", label: "Radiation safety questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Radiation Protection" || q.tags?.includes("radiation-safety")) c++;
      }
      return c;
    }},
    { key: "minPositioningQuestions", label: "Positioning questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Imaging Procedures & Positioning" || q.tags?.includes("positioning")) c++;
      }
      return c;
    }},
    { key: "minImageEvalQuestions", label: "Image evaluation questions", countFn: () => {
      let c = 0;
      for (const q of questions) {
        if (q.domain === "Image Production & Evaluation" || q.tags?.includes("image-eval")) c++;
      }
      return c;
    }},
  ];

  for (const check of simpleMinChecks) {
    const minVal = fv[check.key] as number | undefined;
    if (minVal != null) {
      const count = check.countFn();
      if (count < minVal) {
        errors.push(
          `${check.label}: ${count} is below required minimum of ${minVal}`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
