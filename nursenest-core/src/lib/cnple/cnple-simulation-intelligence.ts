export type CnpleCompetencyKey =
  | "diagnostic-reasoning"
  | "pharmacotherapy-safety"
  | "acute-escalation"
  | "chronic-disease-management"
  | "communication-shared-decision-making"
  | "professional-practice-ethics"
  | "health-promotion-prevention"
  | "older-adult-care"
  | "equity-cultural-safety";

export type CnplePatientStateSignal = {
  key: string;
  label: string;
  direction: "improved" | "worsened" | "unchanged" | "new-risk" | "resolved";
  severity: "low" | "moderate" | "high" | "critical";
  rationale: string;
};

export type CnpleSimulationDecisionTrace = {
  caseId: string;
  stepIndex: number;
  selectedOptionId: string;
  correctOptionId: string;
  family: string;
  cnpleDomain?: string;
  consequenceTrajectory?: "optimal" | "suboptimal" | "harmful";
  competencyHits: CnpleCompetencyKey[];
  patientStateSignals: CnplePatientStateSignal[];
};

export type CnpleCompetencyScore = {
  competency: CnpleCompetencyKey;
  attempts: number;
  correct: number;
  harmfulSelections: number;
  score: number;
  status: "strength" | "developing" | "priority-remediation";
};

export type CnpleSimulationDebrief = {
  caseId: string;
  readinessPercent: number;
  summary: string;
  competencyScores: CnpleCompetencyScore[];
  patientStateSummary: CnplePatientStateSignal[];
  remediationPriorities: string[];
  nextCaseRecommendations: string[];
};

const FAMILY_COMPETENCY_MAP: Record<string, CnpleCompetencyKey[]> = {
  "pediatric-asthma-acute-triage": ["acute-escalation", "diagnostic-reasoning"],
  "pediatric-asthma-discharge-safety": ["acute-escalation", "communication-shared-decision-making"],
  "pediatric-asthma-controller-adherence": ["chronic-disease-management", "health-promotion-prevention"],
  "pediatric-fever-kawasaki-recognition": ["diagnostic-reasoning", "acute-escalation"],
  "pediatric-inflammatory-differential": ["diagnostic-reasoning", "communication-shared-decision-making"],
  "kawasaki-follow-up-safety-netting": ["health-promotion-prevention", "chronic-disease-management"],
  "copd-exacerbation-initial-management": ["acute-escalation", "pharmacotherapy-safety"],
  "copd-exacerbation-disposition": ["acute-escalation", "professional-practice-ethics"],
  "copd-relapse-prevention-maintenance": ["chronic-disease-management", "health-promotion-prevention"],
  "heart-failure-outpatient-diuretic-titration": ["pharmacotherapy-safety", "chronic-disease-management"],
  "heart-failure-renal-potassium-monitoring": ["pharmacotherapy-safety", "diagnostic-reasoning"],
  "heart-failure-self-management-gdmt-review": ["chronic-disease-management", "communication-shared-decision-making"],
  "diabetes-sick-day-medication-safety": ["pharmacotherapy-safety", "acute-escalation"],
  "diabetes-hyperglycemia-correction-and-monitoring": ["pharmacotherapy-safety", "diagnostic-reasoning"],
  "diabetes-sick-day-prevention-teachback": ["health-promotion-prevention", "communication-shared-decision-making"],
  "suicide-risk-assessment-direct-questioning": ["diagnostic-reasoning", "communication-shared-decision-making"],
  "suicide-safety-planning-disposition": ["acute-escalation", "professional-practice-ethics"],
  "suicide-relapse-prevention-longitudinal-care": ["chronic-disease-management", "health-promotion-prevention"],
  "delirium-recognition-polypharmacy": ["diagnostic-reasoning", "pharmacotherapy-safety", "older-adult-care"],
  "delirium-deprescribing-and-trigger-management": ["pharmacotherapy-safety", "older-adult-care"],
  "post-delirium-cognition-and-deprescribing-followup": ["chronic-disease-management", "communication-shared-decision-making", "older-adult-care"],
  "afib-anticoagulation-risk-benefit-initiation": ["pharmacotherapy-safety", "communication-shared-decision-making"],
  "afib-doac-selection-interaction-safety": ["pharmacotherapy-safety", "diagnostic-reasoning"],
  "afib-anticoagulation-monitoring-falls-prevention": ["health-promotion-prevention", "chronic-disease-management", "older-adult-care"],
  "ckd-acute-decline-medication-safety": ["pharmacotherapy-safety", "diagnostic-reasoning"],
  "ckd-albuminuria-hyperkalemia-prevention": ["chronic-disease-management", "pharmacotherapy-safety"],
  "ckd-chronic-management-pain-and-referral": ["chronic-disease-management", "health-promotion-prevention"],
  "abnormal-uterine-bleeding-risk-stratification": ["diagnostic-reasoning", "acute-escalation"],
  "aub-anemia-symptom-management-while-investigating": ["pharmacotherapy-safety", "communication-shared-decision-making"],
  "aub-longitudinal-management-and-red-flags": ["chronic-disease-management", "health-promotion-prevention"],
};

const COMPETENCY_LABELS: Record<CnpleCompetencyKey, string> = {
  "diagnostic-reasoning": "Diagnostic reasoning",
  "pharmacotherapy-safety": "Pharmacotherapy safety",
  "acute-escalation": "Acute escalation and disposition",
  "chronic-disease-management": "Chronic disease management",
  "communication-shared-decision-making": "Communication and shared decision-making",
  "professional-practice-ethics": "Professional practice and ethics",
  "health-promotion-prevention": "Health promotion and prevention",
  "older-adult-care": "Older adult care",
  "equity-cultural-safety": "Equity and cultural safety",
};

export function getCnpleCompetenciesForQuestionFamily(family: string): CnpleCompetencyKey[] {
  return FAMILY_COMPETENCY_MAP[family] ?? ["diagnostic-reasoning"];
}

export function calculateCnpleCompetencyScores(traces: CnpleSimulationDecisionTrace[]): CnpleCompetencyScore[] {
  const byCompetency = new Map<CnpleCompetencyKey, { attempts: number; correct: number; harmful: number }>();

  for (const trace of traces) {
    const isCorrect = trace.selectedOptionId === trace.correctOptionId;
    const isHarmful = trace.consequenceTrajectory === "harmful";

    for (const competency of trace.competencyHits) {
      const current = byCompetency.get(competency) ?? { attempts: 0, correct: 0, harmful: 0 };
      current.attempts += 1;
      if (isCorrect) current.correct += 1;
      if (isHarmful) current.harmful += 1;
      byCompetency.set(competency, current);
    }
  }

  return Array.from(byCompetency.entries()).map(([competency, stats]) => {
    const raw = stats.attempts === 0 ? 0 : stats.correct / stats.attempts;
    const harmfulPenalty = stats.attempts === 0 ? 0 : (stats.harmful / stats.attempts) * 0.25;
    const score = Math.max(0, Math.round((raw - harmfulPenalty) * 100));
    return {
      competency,
      attempts: stats.attempts,
      correct: stats.correct,
      harmfulSelections: stats.harmful,
      score,
      status: score >= 85 ? "strength" : score >= 65 ? "developing" : "priority-remediation",
    };
  });
}

export function buildCnpleSimulationDebrief(caseId: string, traces: CnpleSimulationDecisionTrace[]): CnpleSimulationDebrief {
  const competencyScores = calculateCnpleCompetencyScores(traces);
  const harmfulCount = traces.filter((trace) => trace.consequenceTrajectory === "harmful").length;
  const correctCount = traces.filter((trace) => trace.selectedOptionId === trace.correctOptionId).length;
  const readinessPercent = traces.length === 0 ? 0 : Math.max(0, Math.round(((correctCount / traces.length) * 100) - harmfulCount * 6));
  const patientStateSummary = traces.flatMap((trace) => trace.patientStateSignals).filter((signal) => signal.severity !== "low");
  const remediationPriorities = competencyScores
    .filter((score) => score.status !== "strength")
    .sort((a, b) => a.score - b.score)
    .map((score) => `${COMPETENCY_LABELS[score.competency]}: ${score.score}%`);

  return {
    caseId,
    readinessPercent,
    summary: readinessPercent >= 85
      ? "Strong longitudinal CNPLE performance with safe clinical judgment across the case."
      : readinessPercent >= 70
        ? "Developing CNPLE readiness: core reasoning is present, but targeted remediation is recommended before advancing complexity."
        : "Priority remediation recommended: unsafe or incomplete decisions appeared in this simulation.",
    competencyScores,
    patientStateSummary,
    remediationPriorities,
    nextCaseRecommendations: recommendNextCnpleCases(competencyScores),
  };
}

function recommendNextCnpleCases(scores: CnpleCompetencyScore[]): string[] {
  const weak = new Set(scores.filter((score) => score.status !== "strength").map((score) => score.competency));
  const recommendations: string[] = [];

  if (weak.has("pharmacotherapy-safety")) recommendations.push("CKD medication safety or AFib anticoagulation");
  if (weak.has("acute-escalation")) recommendations.push("COPD exacerbation or pediatric asthma triage");
  if (weak.has("diagnostic-reasoning")) recommendations.push("Kawasaki/MIS-C or abnormal uterine bleeding workup");
  if (weak.has("chronic-disease-management")) recommendations.push("Heart failure, diabetes sick-day, or COPD relapse prevention");
  if (weak.has("communication-shared-decision-making")) recommendations.push("Suicide risk safety planning or anticoagulation shared decision-making");
  if (weak.has("older-adult-care")) recommendations.push("Delirium, falls-risk, or anticoagulation in older adults");

  return recommendations.length > 0 ? recommendations : ["Advance to mixed-domain integrated LOFT simulation"];
}
