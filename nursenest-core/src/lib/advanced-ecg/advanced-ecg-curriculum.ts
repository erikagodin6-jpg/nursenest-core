export type AdvancedEcgCurriculumUnit = {
  slug: string;
  title: string;
  summary: string;
};

export const ADVANCED_ECG_CURRICULUM: readonly AdvancedEcgCurriculumUnit[] = [
  {
    slug: "foundations",
    title: "Advanced ECG Foundations",
    summary: "Lead placement logic, interval strategy, axis basics, and pattern-first interpretation workflows.",
  },
  {
    slug: "twelve-lead-interpretation",
    title: "12-Lead Interpretation",
    summary: "Systematic 12-lead reading with localization, reciprocal changes, and escalation priorities.",
  },
  {
    slug: "ischemia-infarction",
    title: "Ischemia & Infarction",
    summary: "ST/T-wave change recognition, STEMI equivalents, posterior patterns, and urgent response framing.",
  },
  {
    slug: "conduction-blocks",
    title: "Conduction Blocks",
    summary: "AV blocks, bundle branch patterns, fascicular clues, and when conduction delay changes bedside risk.",
  },
  {
    slug: "pacemakers",
    title: "Pacemakers",
    summary: "Capture, sensing, pacing modes, malfunction recognition, and device-related rhythm interpretation.",
  },
  {
    slug: "electrolytes-toxicology",
    title: "Electrolytes & Toxicology",
    summary: "Electrolyte signatures, medication effects, tox clues, and safe differential thinking under uncertainty.",
  },
  {
    slug: "critical-care-telemetry",
    title: "Critical Care Telemetry",
    summary: "High-acuity rhythm surveillance, instability markers, and telemetry-to-action decision framing.",
  },
  {
    slug: "acls-ecg-decision-making",
    title: "ACLS ECG Decision-Making",
    summary: "Rhythm recognition tied to ACLS decision branches, priorities, and team communication cues.",
  },
  {
    slug: "case-studies",
    title: "Advanced ECG Case Studies",
    summary: "Integrated cases that connect rhythm recognition, clinical context, and escalation choices.",
  },
] as const;
