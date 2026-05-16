export type CnpleSimulationAnalyticsDomain = {
  id: string;
  label: string;
  description: string;
  remediationFocus: readonly string[];
};

export type CnpleSimulationRiskSignal = {
  id: string;
  label: string;
  description: string;
  learnerImpact: string;
};

/**
 * Canonical analytics model for CNPLE simulation reporting.
 *
 * Goal:
 * Replace shallow score-only feedback with clinically meaningful
 * NP reasoning analysis.
 */

export const CNPLE_SIMULATION_ANALYTICS_DOMAINS: readonly CnpleSimulationAnalyticsDomain[] = [
  {
    id: "diagnostic-reasoning",
    label: "Diagnostic Reasoning",
    description:
      "Measures differential construction, investigation selection, red-flag recognition, and avoidance of premature closure.",
    remediationFocus: [
      "Differential diagnosis mapping",
      "Red-flag escalation",
      "Diagnostic uncertainty handling",
      "Investigation sequencing",
    ],
  },
  {
    id: "prescribing-safety",
    label: "Prescribing Safety",
    description:
      "Measures medication selection, contraindication recognition, titration safety, and monitoring planning.",
    remediationFocus: [
      "Renal dosing",
      "Medication interactions",
      "Antibiotic stewardship",
      "Monitoring intervals",
    ],
  },
  {
    id: "follow-up-management",
    label: "Follow-Up Management",
    description:
      "Measures longitudinal care planning, repeat-visit reasoning, and chronic disease progression management.",
    remediationFocus: [
      "Repeat-visit assessment",
      "Medication escalation",
      "Monitoring progression",
      "Referral timing",
    ],
  },
  {
    id: "clinical-prioritization",
    label: "Clinical Prioritization",
    description:
      "Measures recognition of unstable findings, urgent escalation needs, and prioritization under time pressure.",
    remediationFocus: [
      "Sepsis recognition",
      "Stroke escalation",
      "Acute deterioration",
      "Emergency referral thresholds",
    ],
  },
] as const;

export const CNPLE_SIMULATION_RISK_SIGNALS: readonly CnpleSimulationRiskSignal[] = [
  {
    id: "premature-closure",
    label: "Premature Diagnostic Closure",
    description:
      "Learner repeatedly selects a likely diagnosis without adequately excluding dangerous alternatives.",
    learnerImpact:
      "Increases risk of missing unstable or life-threatening pathology.",
  },
  {
    id: "unsafe-prescribing",
    label: "Unsafe Prescribing Pattern",
    description:
      "Learner repeatedly misses contraindications, interactions, or monitoring requirements.",
    learnerImpact:
      "Suggests elevated patient-safety risk during medication management.",
  },
  {
    id: "followup-failure",
    label: "Follow-Up Management Failure",
    description:
      "Learner struggles to appropriately escalate care across repeat visits or worsening disease progression.",
    learnerImpact:
      "Suggests difficulty managing longitudinal NP care safely.",
  },
  {
    id: "red-flag-miss",
    label: "Critical Red-Flag Misses",
    description:
      "Learner repeatedly overlooks unstable findings requiring urgent intervention or escalation.",
    learnerImpact:
      "Suggests elevated risk in acute prioritization and emergency recognition.",
  },
] as const;
