export type AdvancedEcgCurriculumUnit = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  fidelity?: "standard_mixed" | "curated_static_strip" | "curated_case_walkthrough";
  reviewRequirement?: string;
  publishGuardrail?: string;
};

export type AdvancedEcgPacemakerTeachingSection = {
  slug:
    | "foundations"
    | "paced-rhythm-recognition"
    | "malfunctions"
    | "critical-care-interpretation"
    | "advanced-concepts";
  title: string;
  summary: string;
  href: string;
  topics: readonly string[];
  fidelity: "curated_static_strip" | "curated_case_walkthrough";
  publishGuardrail: string;
};

export const ADVANCED_ECG_CURRICULUM: readonly AdvancedEcgCurriculumUnit[] = [
  {
    slug: "foundations",
    title: "Advanced ECG Foundations",
    summary: "Lead placement logic, interval strategy, axis basics, conduction mapping, and pattern-first interpretation workflows.",
    href: "/modules/ecg-advanced/foundations",
  },
  {
    slug: "rhythm-interpretation",
    title: "Rhythm Interpretation",
    summary: "Sinus, atrial, junctional, ventricular, and block pattern recognition with escalation-focused interpretation steps.",
    href: "/modules/ecg-advanced/rhythm-interpretation",
  },
  {
    slug: "12-lead",
    title: "12-Lead Interpretation",
    summary: "Systematic 12-lead reading with localization, reciprocal changes, advanced ischemia patterns, and escalation priorities.",
    href: "/modules/ecg-advanced/12-lead",
  },
  {
    slug: "telemetry",
    title: "Telemetry & Critical Care",
    summary: "High-acuity rhythm surveillance, unstable-patient telemetry recognition, artifact separation, and bedside priority framing.",
    href: "/modules/ecg-advanced/telemetry",
  },
  {
    slug: "acls",
    title: "ACLS Decision-Making",
    summary: "Rhythm recognition tied to ACLS decision branches, defibrillation/cardioversion indications, and brady/tachy algorithms.",
    href: "/modules/ecg-advanced/acls",
  },
  {
    slug: "cases",
    title: "Case Progressions",
    summary: "Integrated cases connecting ECG changes, vitals, labs, medications, and priority-based escalation decisions.",
    href: "/modules/ecg-advanced/cases",
  },
  {
    slug: "exams",
    title: "Telemetry Drills & Exams",
    summary: "Timed interpretation sets, mixed telemetry drills, remediation guidance, and milestone-based specialty assessment.",
    href: "/modules/ecg-advanced/exams",
  },
  {
    slug: "pacemakers",
    title: "Pacemaker Interpretation",
    summary: "ICU-grade paced-strip interpretation, capture/sensing analysis, malfunction recognition, and device-focused telemetry cases.",
    href: "/modules/ecg-advanced/pacemakers",
    fidelity: "curated_static_strip",
    reviewRequirement: "Clinician-reviewed paced-strip content only for Phase 1.",
    publishGuardrail: "Do not ship learner-visible generated pacing physiology from the simplified waveform generator.",
  },
] as const;

export const ADVANCED_ECG_PACEMAKER_CURRICULUM: readonly AdvancedEcgCurriculumUnit[] = [
  {
    slug: "foundations",
    title: "Pacemaker Foundations",
    summary:
      "Pacemaker anatomy, pacing modes, sensing, capture, intrinsic rhythm interaction, pacing spikes, and atrial-versus-ventricular paced-strip orientation.",
    href: "/modules/ecg-advanced/pacemakers/foundations",
    fidelity: "curated_static_strip",
    reviewRequirement: "Requires clinician-reviewed strip annotation before learner publication.",
    publishGuardrail: "Static paced-strip walkthroughs only; generated pacing previews remain internal.",
  },
  {
    slug: "malfunctions",
    title: "Pacemaker Malfunctions",
    summary: "Failure to capture, failure to sense, failure to pace, undersensing, oversensing, and pseudomalfunction recognition.",
    href: "/modules/ecg-advanced/pacemakers/malfunctions",
    fidelity: "curated_static_strip",
    reviewRequirement: "Malfunction labels require explicit clinician signoff.",
    publishGuardrail: "No learner-visible synthetic malfunction morphology from the simplified pacing renderer.",
  },
  {
    slug: "critical-care",
    title: "Critical Care Pacing",
    summary:
      "Temporary pacing, transcutaneous and transvenous pacing, ICU telemetry monitoring, unstable paced patients, and pacing emergency escalation cues.",
    href: "/modules/ecg-advanced/pacemakers/critical-care",
    fidelity: "curated_case_walkthrough",
    reviewRequirement: "Critical-care pacing scenarios stay clinician-reviewed and annotation-led.",
    publishGuardrail: "Cases can reference pacing changes, but generated device physiology stays quarantined.",
  },
  {
    slug: "cases",
    title: "Pacemaker Cases",
    summary:
      "Annotated pacing scenarios with spike highlighting, capture overlays, malfunction callouts, fusion and pseudofusion framing, CRT or ICD context, and clinician-reviewed walkthroughs.",
    href: "/modules/ecg-advanced/pacemakers/cases",
    fidelity: "curated_case_walkthrough",
    reviewRequirement: "Annotated caseboards require clinician review before learner-facing use.",
    publishGuardrail: "Future simulation work is roadmap only until stronger pacing-specific validation exists.",
  },
] as const;

export const ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS: readonly AdvancedEcgPacemakerTeachingSection[] = [
  {
    slug: "foundations",
    title: "Pacemaker Foundations",
    summary:
      "Build the paced-strip read from the hardware and physiology outward so pacing spikes, chamber targets, sensing, and capture all have a reliable mental model.",
    href: "/modules/ecg-advanced/pacemakers/foundations",
    topics: [
      "pacemaker anatomy",
      "pacing modes",
      "sensing",
      "capture",
      "intrinsic rhythm interaction",
      "pacing spikes",
      "atrial vs ventricular pacing",
      "dual-chamber pacing",
    ],
    fidelity: "curated_static_strip",
    publishGuardrail: "Teach with clinician-reviewed static strips and annotations only; unsupported generated pacing remains internal.",
  },
  {
    slug: "paced-rhythm-recognition",
    title: "Paced Rhythm Recognition",
    summary:
      "Turn paced-strip reading into a telemetry skill with repeated exposure to atrial, ventricular, dual-chamber, demand, and asynchronous pacing patterns.",
    href: "/modules/ecg-advanced/pacemakers",
    topics: [
      "atrial paced rhythms",
      "ventricular paced rhythms",
      "AV sequential pacing",
      "demand pacing",
      "asynchronous pacing",
    ],
    fidelity: "curated_static_strip",
    publishGuardrail: "Recognition examples stay curated and publish-safe until pacing-specific simulation fidelity improves.",
  },
  {
    slug: "malfunctions",
    title: "Pacemaker Malfunctions",
    summary:
      "Differentiate true device problems from lookalikes using strip-first cues for failure to capture, failure to sense, failure to pace, and pseudomalfunctions.",
    href: "/modules/ecg-advanced/pacemakers/malfunctions",
    topics: [
      "failure to capture",
      "failure to sense",
      "failure to pace",
      "undersensing",
      "oversensing",
      "pseudomalfunction recognition",
    ],
    fidelity: "curated_static_strip",
    publishGuardrail: "Malfunction teaching remains annotation-led; learner content cannot publish unsupported generated pacing morphologies.",
  },
  {
    slug: "critical-care-interpretation",
    title: "Critical Care Pacemaker Interpretation",
    summary:
      "Position paced rhythms inside unstable-patient monitoring with temporary devices, ICU telemetry escalation, and pacing emergency scenarios.",
    href: "/modules/ecg-advanced/pacemakers/critical-care",
    topics: [
      "temporary pacing",
      "transcutaneous pacing",
      "transvenous pacing",
      "ICU telemetry monitoring",
      "unstable paced patients",
      "pacing emergencies",
    ],
    fidelity: "curated_case_walkthrough",
    publishGuardrail: "Critical-care pacing cases can escalate strip changes, but publish-safe content stays curated and clinician reviewed.",
  },
  {
    slug: "advanced-concepts",
    title: "Advanced Concepts",
    summary:
      "Layer in higher-order paced-rhythm interpretation like fusion phenomena, ICD context, CRT, and pacemaker-mediated tachycardia without overstating simulation fidelity.",
    href: "/modules/ecg-advanced/pacemakers/cases",
    topics: [
      "fusion beats",
      "pseudofusion",
      "ICD rhythms",
      "CRT / biventricular pacing",
      "pacemaker-mediated tachycardia",
    ],
    fidelity: "curated_case_walkthrough",
    publishGuardrail: "Advanced pacing concepts stay in curated walkthroughs until future pacing simulation validation is complete.",
  },
] as const;

export const ADVANCED_ECG_PACEMAKER_ANNOTATION_FEATURES = [
  "annotated paced strips",
  "pacing-spike highlighting",
  "capture overlays",
  "step-by-step interpretation",
  "malfunction callouts",
  "telemetry scenarios",
  "case progression",
] as const;

export function findAdvancedEcgCurriculumUnit(slug: string | null | undefined): AdvancedEcgCurriculumUnit | null {
  if (!slug) return null;
  return ADVANCED_ECG_CURRICULUM.find((unit) => unit.slug === slug) ?? null;
}

export function findAdvancedEcgPacemakerUnit(slug: string | null | undefined): AdvancedEcgCurriculumUnit | null {
  if (!slug) return null;
  return ADVANCED_ECG_PACEMAKER_CURRICULUM.find((unit) => unit.slug === slug) ?? null;
}
