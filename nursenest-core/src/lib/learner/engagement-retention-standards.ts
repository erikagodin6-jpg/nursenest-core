import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type EngagementRetentionMechanic =
  | "streaks"
  | "mastery-tracking"
  | "weak-topic-targeting"
  | "spaced-repetition"
  | "adaptive-flashcards"
  | "remediation-loops"
  | "confidence-scoring"
  | "exam-readiness-indicators"
  | "performance-analytics";

export type EngagementRetentionStandard = {
  tier: HealthcareProgramTier;
  purpose: string;
  requiredMechanics: readonly EngagementRetentionMechanic[];
  learningQualityRules: readonly string[];
  professionalToneRules: readonly string[];
  safetyGuardrails: readonly string[];
};

export type EngagementRetentionInput = {
  tier: HealthcareProgramTier;
  enabledMechanics?: readonly EngagementRetentionMechanic[] | null;
  copy?: string | null;
  rewardsConsistency?: boolean | null;
  targetsWeakAreas?: boolean | null;
  includesRemediationLoop?: boolean | null;
  includesConfidenceCalibration?: boolean | null;
  includesReadinessContext?: boolean | null;
  trivializesSafety?: boolean | null;
  blocksStudyProgressForRewards?: boolean | null;
};

export type EngagementRetentionIssueCode =
  | "MISSING_CORE_MECHANIC"
  | "NO_WEAK_TOPIC_TARGETING"
  | "NO_REMEDIATION_LOOP"
  | "NO_CONFIDENCE_CALIBRATION"
  | "NO_READINESS_CONTEXT"
  | "DOES_NOT_REWARD_CONSISTENCY"
  | "TRIVIALIZES_PATIENT_SAFETY"
  | "REWARD_BLOCKS_LEARNING_FLOW"
  | "UNPROFESSIONAL_GAME_LANGUAGE";

export type EngagementRetentionIssue = {
  code: EngagementRetentionIssueCode;
  severity: "warning" | "error";
  mechanic?: EngagementRetentionMechanic;
  message: string;
  remediation: string;
};

export type EngagementRetentionResult = {
  pass: boolean;
  score: number;
  standard: EngagementRetentionStandard;
  issues: EngagementRetentionIssue[];
};

const REQUIRED_MECHANICS = [
  "streaks",
  "mastery-tracking",
  "weak-topic-targeting",
  "spaced-repetition",
  "adaptive-flashcards",
  "remediation-loops",
  "confidence-scoring",
  "exam-readiness-indicators",
  "performance-analytics",
] as const;

const SHARED_LEARNING_QUALITY_RULES = [
  "Reward consistent study behavior, not raw screen time.",
  "Use mastery and readiness as learning signals, not vanity scores.",
  "Prioritize weak-topic remediation before broad content expansion.",
  "Use confidence scoring to separate knowledge gaps from overconfidence.",
  "Route missed concepts into spaced repetition and adaptive flashcards.",
] as const;

const SHARED_PROFESSIONAL_TONE_RULES = [
  "Use calm, clinical, motivating language.",
  "Avoid arcade language, jokes, gambling metaphors, or shaming copy.",
  "Frame streaks as consistency support, not punishment.",
  "Keep patient safety serious and clinically meaningful.",
] as const;

const SHARED_SAFETY_GUARDRAILS = [
  "Never reward speed over safe clinical reasoning.",
  "Never hide remediation behind game rewards.",
  "Never present readiness indicators as guaranteed licensure outcomes.",
  "Never trivialize patient harm, deterioration, medication errors, or safety misses.",
] as const;

export const ENGAGEMENT_RETENTION_STANDARDS: Record<HealthcareProgramTier, EngagementRetentionStandard> = {
  RPN: {
    tier: "RPN",
    purpose:
      "Support practical-nurse consistency, foundational mastery, weak-area remediation, and safe recognition/reporting habits.",
    requiredMechanics: REQUIRED_MECHANICS,
    learningQualityRules: SHARED_LEARNING_QUALITY_RULES,
    professionalToneRules: SHARED_PROFESSIONAL_TONE_RULES,
    safetyGuardrails: [
      ...SHARED_SAFETY_GUARDRAILS,
      "Use retention goals to reinforce expected-vs-unexpected findings and reportable changes.",
    ],
  },
  RN: {
    tier: "RN",
    purpose:
      "Support NCLEX-RN readiness through consistency, clinical judgment mastery, weak-topic targeting, confidence calibration, and remediation loops.",
    requiredMechanics: REQUIRED_MECHANICS,
    learningQualityRules: SHARED_LEARNING_QUALITY_RULES,
    professionalToneRules: SHARED_PROFESSIONAL_TONE_RULES,
    safetyGuardrails: [
      ...SHARED_SAFETY_GUARDRAILS,
      "Use engagement signals to reinforce prioritization, delegation, deterioration recognition, and patient safety.",
    ],
  },
  NP: {
    tier: "NP",
    purpose:
      "Support advanced-practice retention through diagnostic mastery, pharmacology safety, confidence calibration, and longitudinal remediation.",
    requiredMechanics: REQUIRED_MECHANICS,
    learningQualityRules: SHARED_LEARNING_QUALITY_RULES,
    professionalToneRules: SHARED_PROFESSIONAL_TONE_RULES,
    safetyGuardrails: [
      ...SHARED_SAFETY_GUARDRAILS,
      "Use retention goals to reinforce diagnostic uncertainty, contraindications, follow-up, and escalation logic.",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    purpose:
      "Support allied-health retention through profession-specific mastery, workflow safety, weak-topic remediation, and readiness analytics.",
    requiredMechanics: REQUIRED_MECHANICS,
    learningQualityRules: SHARED_LEARNING_QUALITY_RULES,
    professionalToneRules: SHARED_PROFESSIONAL_TONE_RULES,
    safetyGuardrails: [
      ...SHARED_SAFETY_GUARDRAILS,
      "Use engagement signals to reinforce scope, workflow checks, communication, documentation, and escalation.",
    ],
  },
} as const;

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function addIssue(issues: EngagementRetentionIssue[], issue: EngagementRetentionIssue): void {
  issues.push(issue);
}

export function resolveEngagementRetentionStandard(
  tier: HealthcareProgramTier,
): EngagementRetentionStandard {
  return ENGAGEMENT_RETENTION_STANDARDS[tier];
}

export function evaluateEngagementRetentionSystem(
  input: EngagementRetentionInput,
): EngagementRetentionResult {
  const standard = resolveEngagementRetentionStandard(input.tier);
  const enabled = new Set(input.enabledMechanics ?? []);
  const copy = text(input.copy);
  const issues: EngagementRetentionIssue[] = [];

  for (const mechanic of standard.requiredMechanics) {
    if (!enabled.has(mechanic)) {
      addIssue(issues, {
        code: "MISSING_CORE_MECHANIC",
        severity: mechanic === "streaks" || mechanic === "performance-analytics" ? "warning" : "error",
        mechanic,
        message: `Engagement system is missing ${mechanic}.`,
        remediation: "Add the missing mechanic or explicitly document why this surface delegates it to a connected learner system.",
      });
    }
  }

  if (input.targetsWeakAreas !== true || !enabled.has("weak-topic-targeting")) {
    addIssue(issues, {
      code: "NO_WEAK_TOPIC_TARGETING",
      severity: "error",
      mechanic: "weak-topic-targeting",
      message: "Engagement does not clearly drive learners toward weak-topic remediation.",
      remediation: "Tie streaks, mastery, flashcards, or next actions to the learner's weakest safe-to-practice areas.",
    });
  }

  if (input.includesRemediationLoop !== true || !enabled.has("remediation-loops")) {
    addIssue(issues, {
      code: "NO_REMEDIATION_LOOP",
      severity: "error",
      mechanic: "remediation-loops",
      message: "Engagement rewards are not connected to remediation loops.",
      remediation: "Route misses, low confidence, and weak topics into review, rationales, flashcards, or focused practice.",
    });
  }

  if (input.includesConfidenceCalibration !== true || !enabled.has("confidence-scoring")) {
    addIssue(issues, {
      code: "NO_CONFIDENCE_CALIBRATION",
      severity: "warning",
      mechanic: "confidence-scoring",
      message: "System does not calibrate confidence against performance.",
      remediation: "Track high-confidence misses and low-confidence correct responses so learners remediate judgment gaps.",
    });
  }

  if (input.includesReadinessContext !== true || !enabled.has("exam-readiness-indicators")) {
    addIssue(issues, {
      code: "NO_READINESS_CONTEXT",
      severity: "warning",
      mechanic: "exam-readiness-indicators",
      message: "Engagement signals are not connected to exam readiness.",
      remediation: "Show how consistency, mastery, weak-topic work, and adaptive review affect readiness indicators.",
    });
  }

  if (input.rewardsConsistency !== true || !enabled.has("streaks")) {
    addIssue(issues, {
      code: "DOES_NOT_REWARD_CONSISTENCY",
      severity: "warning",
      mechanic: "streaks",
      message: "System does not reward steady study consistency.",
      remediation: "Use calm streaks or daily-goal credit that reinforces sustainable review without shaming breaks.",
    });
  }

  if (input.trivializesSafety === true || /\b(win|crush|destroy|kill|boss battle|loot|jackpot|gamble)\b/i.test(copy)) {
    addIssue(issues, {
      code: "TRIVIALIZES_PATIENT_SAFETY",
      severity: "error",
      message: "Gamification language or mechanics trivialize clinical safety.",
      remediation: "Use professional language that frames progress around safer decisions, retention, and readiness.",
    });
  }

  if (input.blocksStudyProgressForRewards === true) {
    addIssue(issues, {
      code: "REWARD_BLOCKS_LEARNING_FLOW",
      severity: "error",
      message: "Reward mechanics block or interrupt the study flow.",
      remediation: "Keep rewards lightweight and non-blocking; never force a game interaction before remediation or the next question.",
    });
  }

  if (/\b(level up|xp|combo|quest|grind|boss|loot|achievement unlocked)\b/i.test(copy)) {
    addIssue(issues, {
      code: "UNPROFESSIONAL_GAME_LANGUAGE",
      severity: "warning",
      message: "Copy feels too game-like for clinical education.",
      remediation: "Use professional motivation language such as consistency, mastery, readiness, review, and focus areas.",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 18 : 7);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
