export type FlagshipExperienceId =
  | "advanced-ecg"
  | "telemetry-simulation"
  | "branching-scenarios"
  | "prioritization-delegation"
  | "clinical-skills-lab"
  | "labs-workstation"
  | "med-calculation-drills"
  | "adaptive-remediation"
  | "readiness-analytics"
  | "retention-flashcards";

export type FlagshipExperience = {
  id: FlagshipExperienceId;
  title: string;
  eyebrow: string;
  description: string;
  clinicalValue: string;
  href: string;
  previewKind: "telemetry" | "branching" | "assignment" | "skills" | "labs" | "med-math" | "analytics" | "flashcards";
  badges: readonly string[];
  recommendedWhen: readonly string[];
  accentVar: string;
  premiumLevel: "included" | "advanced" | "specialized";
};

export const FLAGSHIP_EXPERIENCES: readonly FlagshipExperience[] = [
  {
    id: "advanced-ecg",
    title: "Advanced ECG Mastery",
    eyebrow: "Telemetry mastery",
    description: "Animated rhythm strips, interval measurement, rhythm differentiation, and bedside escalation prompts.",
    clinicalValue: "Trains rapid rhythm recognition and the nursing actions that matter when the monitor changes.",
    href: "/app/ecg-video-quiz",
    previewKind: "telemetry",
    badges: ["Interactive", "Telemetry mastery", "High-acuity"],
    recommendedWhen: ["Wide-complex recognition is weak", "Telemetry questions are slow", "Rhythm confidence is low"],
    accentVar: "--semantic-info",
    premiumLevel: "specialized",
  },
  {
    id: "telemetry-simulation",
    title: "Interactive telemetry simulation",
    eyebrow: "Monitor-based reasoning",
    description: "Moving strips, patient context, oxygenation trends, and escalation decisions in one simulation flow.",
    clinicalValue: "Connects monitor changes to patient assessment so ECG practice feels like bedside nursing.",
    href: "/app/ecg-video-quiz",
    previewKind: "telemetry",
    badges: ["Simulation-ready", "Clinical reasoning", "Interactive"],
    recommendedWhen: ["ECG accuracy is improving", "Escalation timing needs practice", "Cardiac weak areas appear"],
    accentVar: "--semantic-chart-3",
    premiumLevel: "advanced",
  },
  {
    id: "branching-scenarios",
    title: "Branching clinical scenarios",
    eyebrow: "Dynamic patient cases",
    description: "Patient conditions evolve, choices change outcomes, and remediation explains what changed the priority.",
    clinicalValue: "Builds bedside intuition by making learners reassess as patients improve, worsen, or destabilize.",
    href: "/app/clinical-scenarios",
    previewKind: "branching",
    badges: ["Branching", "Deterioration", "Bedside readiness"],
    recommendedWhen: ["Case reasoning is weak", "Deterioration cues are missed", "Rationale review is frequent"],
    accentVar: "--semantic-danger",
    premiumLevel: "advanced",
  },
  {
    id: "prioritization-delegation",
    title: "Prioritization & delegation simulations",
    eyebrow: "Bedside assignment trainer",
    description: "Multi-patient ranking, delegation sorting, escalation sequencing, and rapid-response decision rounds.",
    clinicalValue: "Teaches who to see first, what can wait, what must be escalated, and what can safely be delegated.",
    href: "/app/prioritization-delegation",
    previewKind: "assignment",
    badges: ["High-acuity", "Delegation", "Patient safety"],
    recommendedWhen: ["Prioritization weakness detected", "Delegation misses repeat", "Unstable-patient recognition is slow"],
    accentVar: "--semantic-danger",
    premiumLevel: "advanced",
  },
  {
    id: "clinical-skills-lab",
    title: "Clinical Skills simulation lab",
    eyebrow: "Competency workstation",
    description: "Role-scoped bedside skills with step progression, safety checkpoints, MCQs, retention cards, and remediation hooks.",
    clinicalValue: "Turns procedures into nursing judgment practice by connecting every skill to assessment, escalation, communication, and documentation.",
    href: "/app/clinical-skills",
    previewKind: "skills",
    badges: ["Competency lab", "Simulation-ready", "Role-scoped"],
    recommendedWhen: ["Procedure confidence is low", "Documentation gaps repeat", "Bedside safety skills need reinforcement"],
    accentVar: "--semantic-chart-2",
    premiumLevel: "included",
  },
  {
    id: "labs-workstation",
    title: "Labs workstation",
    eyebrow: "Trend interpretation",
    description: "Lab trends, medication implications, escalation thresholds, and patient deterioration cues.",
    clinicalValue: "Moves learners beyond memorizing reference ranges into interpreting what the lab means for the patient.",
    href: "/app/labs",
    previewKind: "labs",
    badges: ["Trend-based", "Medication implications", "Escalation"],
    recommendedWhen: ["Lab questions are missed", "Electrolytes connect to ECG weak areas", "Medication holds are unclear"],
    accentVar: "--semantic-success",
    premiumLevel: "included",
  },
  {
    id: "med-calculation-drills",
    title: "Medication-safety calculation drills",
    eyebrow: "High-alert math",
    description: "Timed dosage practice, unit conversion, medication holds, and safety traps for high-risk meds.",
    clinicalValue: "Builds calculation accuracy while reinforcing why unsafe doses, holds, and double-checks matter clinically.",
    href: "/app/med-calculations",
    previewKind: "med-math",
    badges: ["Timed", "High-alert", "Medication safety"],
    recommendedWhen: ["Calculation speed is slow", "High-alert medications are weak", "Confidence drops under time pressure"],
    accentVar: "--semantic-warning",
    premiumLevel: "included",
  },
  {
    id: "adaptive-remediation",
    title: "Adaptive remediation engine",
    eyebrow: "Weak-pattern repair",
    description: "Miss patterns trigger focused lessons, flashcards, mini cases, and rationale-based repair loops.",
    clinicalValue: "Targets the reasoning pattern behind the miss instead of simply repeating another question.",
    href: "/app/account/review-queue",
    previewKind: "analytics",
    badges: ["Adaptive", "Retention-focused", "Weak-area targeting"],
    recommendedWhen: ["High-confidence misses appear", "Unsafe patterns repeat", "Review queue is growing"],
    accentVar: "--semantic-brand",
    premiumLevel: "included",
  },
  {
    id: "readiness-analytics",
    title: "Readiness analytics & report card",
    eyebrow: "Competency visibility",
    description: "Progress, weak domains, confidence calibration, safety risk, and readiness signals in one dashboard.",
    clinicalValue: "Shows what is improving, what is slipping, and what to study next without guessing.",
    href: "/app/account/progress",
    previewKind: "analytics",
    badges: ["Analytics", "Readiness", "Competency map"],
    recommendedWhen: ["Study plan feels unclear", "Exam date is approaching", "Weak domains need prioritizing"],
    accentVar: "--semantic-chart-4",
    premiumLevel: "included",
  },
  {
    id: "retention-flashcards",
    title: "Retention flashcards",
    eyebrow: "Spaced review",
    description: "Weak-area flashcards generated around rationales, safety cues, medication implications, and priority traps.",
    clinicalValue: "Converts practice misses into long-term recall and safer bedside reasoning patterns.",
    href: "/app/flashcards",
    previewKind: "flashcards",
    badges: ["Spaced repetition", "Rationale-linked", "Active recall"],
    recommendedWhen: ["Retention is fading", "Rationales are opened often", "Repeated topic decay appears"],
    accentVar: "--semantic-chart-2",
    premiumLevel: "included",
  },
] as const;

export function flagshipExperienceHref(experience: FlagshipExperience, pathwayId?: string | null): string {
  const pid = pathwayId?.trim();
  if (!pid) return experience.href;
  const sep = experience.href.includes("?") ? "&" : "?";
  return `${experience.href}${sep}pathwayId=${encodeURIComponent(pid)}`;
}

export function recommendedFlagshipExperiences(args: {
  weakTopicTitles?: readonly string[];
  learnerPath?: string | null;
  limit?: number;
} = {}): FlagshipExperience[] {
  const weak = (args.weakTopicTitles ?? []).join(" ").toLowerCase();
  const preferred = new Set<FlagshipExperienceId>();
  if (/ecg|telemetry|rhythm|cardiac|electrolyte/.test(weak)) {
    preferred.add("advanced-ecg");
    preferred.add("telemetry-simulation");
    preferred.add("labs-workstation");
  }
  if (/priorit|delegat|unstable|safety|deteriorat|respiratory/.test(weak)) {
    preferred.add("prioritization-delegation");
    preferred.add("branching-scenarios");
  }
  if (/skill|procedure|foley|catheter|sterile|wound|trach|injection|assessment|documentation|handoff|escalation/.test(weak)) {
    preferred.add("clinical-skills-lab");
    preferred.add("adaptive-remediation");
  }
  if (/med|pharm|dose|calculation|insulin|heparin|warfarin/.test(weak)) {
    preferred.add("med-calculation-drills");
    preferred.add("adaptive-remediation");
  }

  const ordered = [
    ...FLAGSHIP_EXPERIENCES.filter((experience) => preferred.has(experience.id)),
    ...FLAGSHIP_EXPERIENCES.filter((experience) => !preferred.has(experience.id)),
  ];
  return ordered.slice(0, args.limit ?? 4);
}
