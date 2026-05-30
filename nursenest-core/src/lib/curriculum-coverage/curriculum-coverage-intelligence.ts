export type CurriculumKey =
  | "nclex"
  | "rex_pn"
  | "cnple"
  | "hesi"
  | "teas"
  | "rt_competencies"
  | "new_grad_competencies";

export type CurriculumContentType =
  | "questions"
  | "flashcards"
  | "lessons"
  | "simulations"
  | "ecg"
  | "pharmacology"
  | "clinical_skills";

export type CurriculumTopicTarget = {
  id: string;
  label: string;
  targetPercent: number;
  minimumDensity: number;
  keywords: readonly string[];
};

export type CurriculumDefinition = {
  key: CurriculumKey;
  label: string;
  audience: string;
  topics: readonly CurriculumTopicTarget[];
};

export type CurriculumMappedCount = {
  curriculumKey: CurriculumKey;
  topicId: string;
  contentType: CurriculumContentType;
  count: number;
};

export type CurriculumCoverageTopicRow = {
  curriculumKey: CurriculumKey;
  topicId: string;
  label: string;
  targetPercent: number;
  actualPercent: number;
  variancePercent: number;
  densityScore: number;
  totalItems: number;
  status: "missing" | "weak" | "aligned" | "overrepresented";
  contentTypes: Record<CurriculumContentType, number>;
  recommendation: string;
};

export type CurriculumCoverageReport = {
  curriculumKey: CurriculumKey;
  label: string;
  audience: string;
  totalItems: number;
  coverageScore: number;
  densityScore: number;
  heatMap: CurriculumCoverageTopicRow[];
  missingTopics: CurriculumCoverageTopicRow[];
  overrepresentedTopics: CurriculumCoverageTopicRow[];
  weakTopicAreas: CurriculumCoverageTopicRow[];
  contentDensityScores: Record<CurriculumContentType, number>;
};

export type CurriculumCoverageDashboard = {
  generatedAt: string;
  degraded: boolean;
  reports: CurriculumCoverageReport[];
  summary: {
    curriculaAudited: number;
    totalMappedItems: number;
    averageCoverageScore: number;
    missingTopics: number;
    weakTopicAreas: number;
    overrepresentedTopics: number;
  };
  unmappedSignals: Array<{
    contentType: CurriculumContentType;
    label: string;
    count: number;
  }>;
};

const ZERO_COUNTS: Record<CurriculumContentType, number> = {
  questions: 0,
  flashcards: 0,
  lessons: 0,
  simulations: 0,
  ecg: 0,
  pharmacology: 0,
  clinical_skills: 0,
};

export const CURRICULUM_DEFINITIONS: Record<CurriculumKey, CurriculumDefinition> = {
  nclex: {
    key: "nclex",
    label: "NCLEX",
    audience: "Entry-level RN / PN exam readiness",
    topics: [
      topic("management_of_care", "Management of Care", 17, 18, ["delegation", "priority", "leadership", "assignment", "case management"]),
      topic("safety_infection_control", "Safety & Infection Control", 12, 14, ["safety", "infection", "isolation", "sterile", "fall", "precaution"]),
      topic("health_promotion", "Health Promotion & Maintenance", 9, 10, ["health promotion", "screening", "immunization", "growth", "pregnancy", "newborn"]),
      topic("psychosocial_integrity", "Psychosocial Integrity", 10, 10, ["mental", "psych", "therapeutic communication", "crisis", "substance"]),
      topic("basic_care", "Basic Care & Comfort", 8, 10, ["fundamental", "comfort", "nutrition", "mobility", "skin", "hygiene"]),
      topic("pharmacological_therapies", "Pharmacological Therapies", 15, 18, ["pharm", "medication", "drug", "insulin", "opioid", "anticoag"]),
      topic("reduction_of_risk", "Reduction of Risk Potential", 12, 14, ["lab", "diagnostic", "postoperative", "risk", "monitoring", "complication"]),
      topic("physiological_adaptation", "Physiological Adaptation", 17, 18, ["cardio", "resp", "shock", "endocrine", "neuro", "renal", "deterioration"]),
    ],
  },
  rex_pn: {
    key: "rex_pn",
    label: "REx-PN",
    audience: "Canadian practical nursing entry-to-practice",
    topics: [
      topic("professional_practice", "Professional Practice", 14, 12, ["professional", "ethic", "scope", "documentation", "collaboration"]),
      topic("safe_effective_care", "Safe & Effective Care", 20, 18, ["safety", "infection", "priority", "delegation", "fall", "medication safety"]),
      topic("health_assessment", "Health Assessment", 16, 14, ["assessment", "vitals", "health history", "physical", "recognize cues"]),
      topic("care_planning", "Care Planning & Interventions", 18, 16, ["care plan", "intervention", "teaching", "wound", "mobility", "nutrition"]),
      topic("pharmacology", "Medication Administration", 14, 14, ["pharm", "medication", "drug", "insulin", "opioid", "anticoag"]),
      topic("client_relationship", "Therapeutic Relationships", 8, 8, ["communication", "therapeutic", "mental", "family", "conflict"]),
      topic("clinical_judgment", "Clinical Judgment", 10, 12, ["judgment", "priority", "cue", "escalation", "deterioration"]),
    ],
  },
  cnple: {
    key: "cnple",
    label: "CNPLE",
    audience: "Canadian nurse practitioner readiness",
    topics: [
      topic("assessment_diagnosis", "Assessment & Diagnosis", 22, 18, ["assessment", "diagnosis", "differential", "history", "physical"]),
      topic("clinical_management", "Clinical Management", 24, 20, ["management", "treatment", "follow-up", "chronic", "acute"]),
      topic("prescribing", "Pharmacology & Prescribing", 18, 16, ["prescribing", "pharm", "medication", "contraindication", "monitoring"]),
      topic("health_promotion", "Health Promotion", 10, 10, ["screening", "prevention", "counsel", "vaccine", "lifestyle"]),
      topic("professional_practice", "Professional Practice", 12, 10, ["professional", "collaboration", "ethic", "scope", "documentation"]),
      topic("mental_health", "Mental Health", 8, 8, ["mental", "psych", "mood", "anxiety", "risk"]),
      topic("lifespan_family", "Lifespan & Family", 6, 8, ["maternal", "pediatric", "geriatric", "family", "reproductive"]),
    ],
  },
  hesi: {
    key: "hesi",
    label: "HESI A2",
    audience: "Pre-nursing admissions readiness",
    topics: [
      topic("reading", "Reading Comprehension", 14, 12, ["reading", "comprehension", "main idea", "inference"]),
      topic("vocabulary", "Vocabulary", 12, 10, ["vocabulary", "terminology", "word meaning"]),
      topic("grammar", "Grammar", 12, 10, ["grammar", "sentence", "punctuation", "usage"]),
      topic("biology", "Biology", 14, 12, ["biology", "cell", "genetics"]),
      topic("chemistry", "Chemistry", 12, 10, ["chemistry", "molecule", "reaction", "periodic"]),
      topic("anatomy_physiology", "Anatomy & Physiology", 16, 14, ["anatomy", "physiology", "body system"]),
      topic("math", "Mathematics", 12, 12, ["math", "ratio", "fraction", "dosage", "algebra"]),
      topic("critical_thinking", "Critical Thinking", 8, 8, ["critical thinking", "judgment", "scenario", "decision"]),
    ],
  },
  teas: {
    key: "teas",
    label: "ATI TEAS",
    audience: "Pre-nursing TEAS readiness",
    topics: [
      topic("reading", "Reading", 24, 16, ["reading", "comprehension", "inference", "passage"]),
      topic("science", "Science", 32, 20, ["science", "anatomy", "biology", "chemistry", "physiology"]),
      topic("english", "English & Language Usage", 22, 14, ["english", "grammar", "sentence", "punctuation", "language"]),
      topic("math", "Mathematics", 22, 16, ["math", "ratio", "percentage", "algebra", "measurement"]),
    ],
  },
  rt_competencies: {
    key: "rt_competencies",
    label: "RT Competencies",
    audience: "Respiratory therapy competency readiness",
    topics: [
      topic("airway_ventilation", "Airway & Ventilation", 26, 18, ["airway", "ventilator", "intubation", "peep", "weaning"]),
      topic("abg_diagnostics", "ABG & Diagnostics", 18, 14, ["abg", "blood gas", "diagnostic", "spirometry"]),
      topic("respiratory_disease", "Respiratory Disease", 18, 14, ["copd", "asthma", "ards", "pneumonia", "pulmonary"]),
      topic("equipment_safety", "Equipment & Safety", 13, 10, ["equipment", "troubleshoot", "device", "safety"]),
      topic("critical_care", "Critical Care & Emergency", 15, 12, ["critical", "emergency", "shock", "rapid", "transport"]),
      topic("professional_practice", "Professional Practice", 10, 8, ["professional", "communication", "documentation", "ethic"]),
    ],
  },
  new_grad_competencies: {
    key: "new_grad_competencies",
    label: "New Grad Competencies",
    audience: "Transition-to-practice readiness",
    topics: [
      topic("prioritization", "Prioritization & Shift Management", 16, 14, ["priority", "shift", "assignment", "time management", "handoff"]),
      topic("clinical_judgment", "Clinical Judgment", 16, 14, ["judgment", "recognize cues", "deterioration", "escalation", "decision"]),
      topic("medication_safety", "Medication Safety", 16, 14, ["medication", "insulin", "opioid", "anticoag", "high-alert"]),
      topic("clinical_skills", "Clinical Skills", 14, 12, ["skill", "procedure", "iv", "foley", "wound", "central line"]),
      topic("communication", "Communication & SBAR", 12, 10, ["communication", "sbar", "report", "provider", "family"]),
      topic("documentation", "Documentation", 8, 8, ["documentation", "charting", "record", "note"]),
      topic("telemetry_ecg", "Telemetry & ECG", 10, 10, ["ecg", "ekg", "telemetry", "rhythm", "stemi"]),
      topic("professional_resilience", "Professional Resilience", 8, 8, ["stress", "conflict", "orientation", "preceptor", "professional"]),
    ],
  },
};

function topic(
  id: string,
  label: string,
  targetPercent: number,
  minimumDensity: number,
  keywords: readonly string[],
): CurriculumTopicTarget {
  return { id, label, targetPercent, minimumDensity, keywords };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round0(value: number): number {
  return Math.round(value);
}

export function inferCurriculumTopic(
  definition: CurriculumDefinition,
  signals: readonly (string | null | undefined)[],
): string | null {
  const text = signals.filter(Boolean).join(" ").toLowerCase();
  if (!text.trim()) return null;
  for (const target of definition.topics) {
    if (target.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) return target.id;
  }
  return definition.topics.find((target) => text.includes(target.label.toLowerCase()))?.id ?? null;
}

function statusFor(row: {
  totalItems: number;
  densityScore: number;
  variancePercent: number;
}): CurriculumCoverageTopicRow["status"] {
  if (row.totalItems === 0) return "missing";
  if (row.variancePercent >= 6) return "overrepresented";
  if (row.densityScore < 70 || row.variancePercent <= -4) return "weak";
  return "aligned";
}

function recommendationFor(row: {
  label: string;
  status: CurriculumCoverageTopicRow["status"];
  contentTypes: Record<CurriculumContentType, number>;
}): string {
  if (row.status === "overrepresented") {
    return `Slow broad ${row.label} generation and redirect authoring capacity to weaker curriculum areas.`;
  }
  const weakest = Object.entries(row.contentTypes)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([type]) => type.replaceAll("_", " "));
  return `Build ${row.label} ${weakest.join(" and ")} first, then add assessment formats that match the competency.`;
}

export function buildCurriculumCoverageReport(
  definition: CurriculumDefinition,
  mappedCounts: readonly CurriculumMappedCount[],
): CurriculumCoverageReport {
  const contentByTopic = new Map<string, Record<CurriculumContentType, number>>();
  for (const count of mappedCounts.filter((row) => row.curriculumKey === definition.key)) {
    const existing = contentByTopic.get(count.topicId) ?? { ...ZERO_COUNTS };
    existing[count.contentType] += count.count;
    contentByTopic.set(count.topicId, existing);
  }

  const totalItems = [...contentByTopic.values()].reduce(
    (sum, row) => sum + Object.values(row).reduce((inner, count) => inner + count, 0),
    0,
  );

  const heatMap = definition.topics.map((target) => {
    const contentTypes = contentByTopic.get(target.id) ?? { ...ZERO_COUNTS };
    const topicTotal = Object.values(contentTypes).reduce((sum, count) => sum + count, 0);
    const actualPercent = totalItems > 0 ? round1((topicTotal / totalItems) * 100) : 0;
    const variancePercent = round1(actualPercent - target.targetPercent);
    const modalityCoverage =
      Object.values(contentTypes).filter((count) => count > 0).length / Object.keys(ZERO_COUNTS).length;
    const volumeScore = Math.min(100, (topicTotal / Math.max(1, target.minimumDensity)) * 100);
    const densityScore = round0(volumeScore * 0.7 + modalityCoverage * 100 * 0.3);
    const row = {
      curriculumKey: definition.key,
      topicId: target.id,
      label: target.label,
      targetPercent: target.targetPercent,
      actualPercent,
      variancePercent,
      densityScore,
      totalItems: topicTotal,
      status: "aligned" as CurriculumCoverageTopicRow["status"],
      contentTypes,
      recommendation: "",
    };
    row.status = statusFor(row);
    row.recommendation = recommendationFor(row);
    return row;
  });

  const missingTopics = heatMap.filter((row) => row.status === "missing");
  const weakTopicAreas = heatMap.filter((row) => row.status === "weak" || row.status === "missing");
  const overrepresentedTopics = heatMap.filter((row) => row.status === "overrepresented");
  const contentDensityScores = Object.keys(ZERO_COUNTS).reduce((acc, key) => {
    const contentType = key as CurriculumContentType;
    const represented = heatMap.filter((row) => row.contentTypes[contentType] > 0).length;
    acc[contentType] = round0((represented / Math.max(1, definition.topics.length)) * 100);
    return acc;
  }, {} as Record<CurriculumContentType, number>);
  const averageDensity =
    heatMap.length > 0 ? heatMap.reduce((sum, row) => sum + row.densityScore, 0) / heatMap.length : 0;
  const averageVariance =
    heatMap.length > 0 ? heatMap.reduce((sum, row) => sum + Math.abs(row.variancePercent), 0) / heatMap.length : 100;
  const missingPenalty = missingTopics.length * 6;
  const coverageScore = Math.max(0, Math.min(100, round0(100 - averageVariance * 3 - missingPenalty)));

  return {
    curriculumKey: definition.key,
    label: definition.label,
    audience: definition.audience,
    totalItems,
    coverageScore,
    densityScore: round0(averageDensity),
    heatMap,
    missingTopics,
    overrepresentedTopics,
    weakTopicAreas,
    contentDensityScores,
  };
}

export function buildCurriculumCoverageDashboard(input: {
  generatedAt?: string;
  degraded?: boolean;
  mappedCounts: readonly CurriculumMappedCount[];
  unmappedSignals?: CurriculumCoverageDashboard["unmappedSignals"];
}): CurriculumCoverageDashboard {
  const reports = Object.values(CURRICULUM_DEFINITIONS).map((definition) =>
    buildCurriculumCoverageReport(definition, input.mappedCounts),
  );
  const totalScore = reports.reduce((sum, report) => sum + report.coverageScore, 0);
  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    degraded: input.degraded ?? false,
    reports,
    summary: {
      curriculaAudited: reports.length,
      totalMappedItems: reports.reduce((sum, report) => sum + report.totalItems, 0),
      averageCoverageScore: reports.length > 0 ? round0(totalScore / reports.length) : 0,
      missingTopics: reports.reduce((sum, report) => sum + report.missingTopics.length, 0),
      weakTopicAreas: reports.reduce((sum, report) => sum + report.weakTopicAreas.length, 0),
      overrepresentedTopics: reports.reduce((sum, report) => sum + report.overrepresentedTopics.length, 0),
    },
    unmappedSignals: [...(input.unmappedSignals ?? [])].sort((a, b) => b.count - a.count).slice(0, 40),
  };
}
