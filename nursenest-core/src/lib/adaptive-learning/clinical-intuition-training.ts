import type { AdaptiveAttemptSignal, AdaptiveQuestionCandidate } from "@/lib/adaptive-learning/clinical-adaptive-engine";

export type ClinicalIntuitionDomain =
  | "early_sepsis"
  | "subtle_respiratory_decline"
  | "silent_hypoxia"
  | "worsening_neuro_status"
  | "unstable_vital_trend"
  | "hidden_safety_risk";

export type ClinicalIntuitionSkill =
  | "pattern_recognition"
  | "cue_clustering"
  | "something_feels_wrong"
  | "escalation_timing"
  | "trend_detection"
  | "risk_anticipation";

export type ClinicalIntuitionProfile = {
  domains: readonly ClinicalIntuitionDomain[];
  skills: readonly ClinicalIntuitionSkill[];
  subtleCueCount: number;
  escalationUrgency: "routine" | "watch_closely" | "escalate_now";
  patternRecognitionWeight: number;
};

export type ClinicalIntuitionTrainingSignal = {
  candidateId: string;
  profile: ClinicalIntuitionProfile;
  trainingScore: number;
  reasons: readonly string[];
};

export const CLINICAL_INTUITION_GENERATION_GUIDANCE = `
Clinical intuition training requirement:
- Build questions around subtle cue clusters, not one obvious abnormal value.
- Include early deterioration patterns such as early sepsis, subtle respiratory decline, silent hypoxia, worsening neuro status, unstable vital-sign trends, and hidden safety risks.
- Use novice-safe nursing actions: focused reassessment, ABCs, recognizing change from baseline, timely escalation, SBAR, safety precautions, and reassessment after intervention.
- Teach the learner to ask, "What small finding does not fit the expected pattern?" and "What could happen if I wait?"
- Avoid ICU-only management, ventilator adjustments, invasive hemodynamics, physician-level diagnosis, or specialist procedures unless an advanced/specialty mode explicitly requests them.
`.trim();

const DOMAIN_PATTERNS: ReadonlyArray<{
  domain: ClinicalIntuitionDomain;
  patterns: readonly RegExp[];
}> = [
  {
    domain: "early_sepsis",
    patterns: [
      /\bsepsis|infection|febrile|fever|chills|lactate|culture|antibiotic\b/i,
      /\bwarm skin|new confusion|tachycardia|hypotension|low urine output\b/i,
    ],
  },
  {
    domain: "subtle_respiratory_decline",
    patterns: [
      /\bshort(?:ness)? of breath|dyspnea|wheez|crackles|work of breathing|accessory muscles\b/i,
      /\brespiratory rate|tachypnea|tripod|unable to speak|retractions\b/i,
    ],
  },
  {
    domain: "silent_hypoxia",
    patterns: [
      /\bspo2|oxygen saturation|pulse oximetry|hypoxia|hypoxic\b/i,
      /\brestless|confus(?:ed|ion)|anxious|drowsy|cyanosis\b/i,
    ],
  },
  {
    domain: "worsening_neuro_status",
    patterns: [
      /\blevel of consciousness|loc|confus(?:ed|ion)|slurred speech|facial droop|weakness\b/i,
      /\bpupil|seizure|stroke|headache|new onset neuro\b/i,
    ],
  },
  {
    domain: "unstable_vital_trend",
    patterns: [
      /\bheart rate|hr|blood pressure|bp|respiratory rate|rr|temperature|temp\b/i,
      /\bfrom .* to|trend|trending|increasing|decreasing|worsening|dropping|rising\b/i,
    ],
  },
  {
    domain: "hidden_safety_risk",
    patterns: [
      /\bfall|bleeding|anticoagulant|insulin|opioid|sedat|aspiration|delirium\b/i,
      /\bnew weakness|dizzy|unsteady|near miss|almost fell|forgot|missed dose\b/i,
    ],
  },
];

const SKILL_PATTERNS: ReadonlyArray<{
  skill: ClinicalIntuitionSkill;
  patterns: readonly RegExp[];
}> = [
  { skill: "pattern_recognition", patterns: [/\bpattern|cluster|constellation|together|combination\b/i] },
  { skill: "cue_clustering", patterns: [/\bcue|finding|assessment data|vitals and\b/i] },
  { skill: "something_feels_wrong", patterns: [/\bsubtle|early|mild|slight|new|change|not acting right\b/i] },
  { skill: "escalation_timing", patterns: [/\bescalat|notify|rapid response|provider|immediate|first|priority\b/i] },
  { skill: "trend_detection", patterns: [/\btrend|from .* to|worsen|dropping|rising|increasing|decreasing\b/i] },
  { skill: "risk_anticipation", patterns: [/\brisk|prevent|anticipat|before|potential|could progress\b/i] },
];

function textFromCandidate(candidate: AdaptiveQuestionCandidate): string {
  const meta = candidate.metadata;
  return [
    meta.topic,
    meta.subtopic,
    meta.specialty,
    meta.examBlueprintCategory,
    ...meta.misconceptionTags,
  ]
    .filter(Boolean)
    .join(" ");
}

function countPatternHits(value: string, patterns: readonly RegExp[]): number {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(value) ? 1 : 0), 0);
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

export function resolveClinicalIntuitionProfile(input: {
  text: string;
  safetyCritical?: boolean;
  prioritizationLevel?: number;
}): ClinicalIntuitionProfile {
  const text = input.text.trim();
  const domains = DOMAIN_PATTERNS.flatMap((entry) =>
    countPatternHits(text, entry.patterns) > 0 ? [entry.domain] : [],
  );
  const skills = SKILL_PATTERNS.flatMap((entry) =>
    countPatternHits(text, entry.patterns) > 0 ? [entry.skill] : [],
  );
  const subtleCueCount = [...DOMAIN_PATTERNS, ...SKILL_PATTERNS].reduce(
    (sum, entry) => sum + countPatternHits(text, entry.patterns),
    0,
  );
  const prioritization = input.prioritizationLevel ?? 0;
  const escalationUrgency =
    input.safetyCritical || prioritization >= 4 || skills.includes("escalation_timing")
      ? "escalate_now"
      : subtleCueCount >= 3
        ? "watch_closely"
        : "routine";
  const patternRecognitionWeight = Math.min(
    1,
    domains.length * 0.18 + skills.length * 0.11 + (input.safetyCritical ? 0.18 : 0),
  );

  return {
    domains: unique(domains),
    skills: unique(skills),
    subtleCueCount,
    escalationUrgency,
    patternRecognitionWeight: Math.round(patternRecognitionWeight * 100) / 100,
  };
}

export function clinicalIntuitionSignalForCandidate(
  candidate: AdaptiveQuestionCandidate,
): ClinicalIntuitionTrainingSignal {
  const inferred = resolveClinicalIntuitionProfile({
    text: textFromCandidate(candidate),
    safetyCritical: candidate.metadata.safetyCritical,
    prioritizationLevel: candidate.metadata.prioritizationLevel,
  });
  const domains = unique([...(candidate.metadata.clinicalIntuitionDomains ?? []), ...inferred.domains]);
  const skills = unique([...(candidate.metadata.clinicalIntuitionSkills ?? []), ...inferred.skills]);
  const profile: ClinicalIntuitionProfile = {
    ...inferred,
    domains,
    skills,
    patternRecognitionWeight: Math.min(
      1,
      Math.round((inferred.patternRecognitionWeight + domains.length * 0.04 + skills.length * 0.03) * 100) / 100,
    ),
  };
  const reasons: string[] = [];
  if (profile.domains.length > 0) reasons.push("deterioration_domain_match");
  if (profile.skills.includes("cue_clustering")) reasons.push("cue_clustering_practice");
  if (profile.skills.includes("something_feels_wrong")) reasons.push("subtle_change_recognition");
  if (profile.escalationUrgency === "escalate_now") reasons.push("escalation_timing");

  const trainingScore = Math.round(
    (profile.patternRecognitionWeight * 24 +
      Math.min(12, profile.subtleCueCount * 2) +
      (profile.escalationUrgency === "escalate_now" ? 10 : profile.escalationUrgency === "watch_closely" ? 5 : 0)) *
      100,
  ) / 100;

  return {
    candidateId: candidate.id,
    profile,
    trainingScore,
    reasons,
  };
}

export function clinicalIntuitionRiskForAttempt(attempt: AdaptiveAttemptSignal): number {
  const signal = clinicalIntuitionSignalForCandidate({
    id: attempt.questionId,
    metadata: attempt.metadata,
  });
  if (signal.trainingScore <= 0) return 0;

  let risk = 0;
  if (!attempt.correct) risk += 18;
  if (attempt.unsafeDecision) risk += 20;
  if (attempt.timeToAnswerMs > 90000) risk += 8;
  if (attempt.answerChanges > 1) risk += 6;
  if (signal.profile.escalationUrgency === "escalate_now") risk += 12;
  if (attempt.confidence === "very_confident" && !attempt.correct) risk += 12;
  return Math.min(35, risk);
}
