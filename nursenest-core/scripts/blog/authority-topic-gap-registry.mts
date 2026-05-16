import type { AuthorityLane } from "./authority-publishing-types.mjs";

export type AuthorityGapTopic = {
  lane: AuthorityLane;
  topic: string;
  priority: "critical" | "high" | "medium";
  rationale: string;
  cluster: string;
};

export const AUTHORITY_TOPIC_GAP_REGISTRY: AuthorityGapTopic[] = [
  {
    lane: "cnple",
    topic: "Canadian NP prescribing algorithms",
    priority: "critical",
    rationale: "High commercial intent and weak competitor coverage.",
    cluster: "prescribing",
  },
  {
    lane: "cnple",
    topic: "CNPLE differential diagnosis frameworks",
    priority: "critical",
    rationale: "Core NP reasoning competency with strong long-tail demand.",
    cluster: "diagnostics",
  },
  {
    lane: "ecg",
    topic: "Telemetry deterioration recognition",
    priority: "critical",
    rationale: "High-value ECG interpretation and bedside monitoring intent.",
    cluster: "telemetry",
  },
  {
    lane: "ecg",
    topic: "Electrolyte ECG pattern progression",
    priority: "high",
    rationale: "Strong semantic overlap between ECG, renal, and ICU learners.",
    cluster: "electrolytes",
  },
  {
    lane: "rt",
    topic: "Ventilator waveform interpretation",
    priority: "critical",
    rationale: "Underserved RT educational search cluster.",
    cluster: "ventilation",
  },
  {
    lane: "rt",
    topic: "ARDS oxygenation management",
    priority: "high",
    rationale: "Strong ICU and RT educational overlap.",
    cluster: "oxygenation",
  },
  {
    lane: "pathophysiology",
    topic: "Shock physiology progression",
    priority: "high",
    rationale: "Cross-links sepsis, perfusion, ICU, and emergency topics.",
    cluster: "hemodynamics",
  },
  {
    lane: "rexpn",
    topic: "Canadian practical nursing prioritization",
    priority: "high",
    rationale: "Core REx-PN exam competency.",
    cluster: "clinical judgment",
  },
  {
    lane: "nclex",
    topic: "NGN clinical judgment case sequencing",
    priority: "high",
    rationale: "High-yield NCLEX Next Gen topic.",
    cluster: "clinical judgment",
  },
];

export function getAuthorityTopicGapsByLane(lane: AuthorityLane): AuthorityGapTopic[] {
  return AUTHORITY_TOPIC_GAP_REGISTRY.filter((item) => item.lane === lane);
}

export function getCriticalAuthorityTopicGaps(): AuthorityGapTopic[] {
  return AUTHORITY_TOPIC_GAP_REGISTRY.filter((item) => item.priority === "critical");
}
