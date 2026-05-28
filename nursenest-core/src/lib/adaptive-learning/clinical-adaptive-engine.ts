import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import {
  clinicalIntuitionRiskForAttempt,
  clinicalIntuitionSignalForCandidate,
  type ClinicalIntuitionDomain,
  type ClinicalIntuitionSkill,
} from "@/lib/adaptive-learning/clinical-intuition-training";
import {
  detectAdaptiveAntiAnxietySupport,
  type AdaptiveAntiAnxietySupportPlan,
} from "@/lib/adaptive-learning/anti-anxiety-study-support";

export type AdaptiveDifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AdaptiveConfidenceLevel = "very_confident" | "somewhat_confident" | "unsure" | "guessing";

export type ConfidenceCalibrationBand =
  | "dangerous_misconception"
  | "weak_retention"
  | "mastery"
  | "learning_gap";

export type AdaptiveQuestionMetadata = {
  profession: string;
  specialty: string;
  topic: string;
  subtopic?: string | null;
  difficulty: AdaptiveDifficultyLevel;
  cognitiveLoad: number;
  safetyCritical: boolean;
  prioritizationLevel: number;
  delegationComplexity: number;
  diagnosticComplexity: number;
  pharmacologyComplexity: number;
  caseBased: boolean;
  misconceptionTags: readonly string[];
  examBlueprintCategory: string;
  clinicalIntuitionDomains?: readonly ClinicalIntuitionDomain[];
  clinicalIntuitionSkills?: readonly ClinicalIntuitionSkill[];
};

export type AdaptiveAttemptSignal = {
  questionId: string;
  topicId: string;
  metadata: AdaptiveQuestionMetadata;
  correct: boolean;
  confidence: AdaptiveConfidenceLevel;
  timeToAnswerMs: number;
  hintsUsed: number;
  rationaleOpened: boolean;
  answerChanges: number;
  unsafeDecision: boolean;
  misconceptionTags?: readonly string[];
};

export type AdaptiveTopicMastery = {
  topicId: string;
  masteryLevel: number;
  confidenceLevel: number;
  lastReviewedMs: number | null;
  repetitionIntervalDays: number;
  incorrectPatterns: readonly string[];
  safetyRisk: number;
};

export type AdaptiveLearnerProfile = {
  userId: string;
  profession: string;
  tier: HealthcareProgramTier;
  overallLevel: AdaptiveDifficultyLevel;
  readinessScore: number;
  confidenceScore: number;
  safetyScore: number;
  topicMastery: readonly AdaptiveTopicMastery[];
  remediationQueue: readonly string[];
};

export type AdaptiveQuestionCandidate = {
  id: string;
  metadata: AdaptiveQuestionMetadata;
  recentlySeen?: boolean;
};

export type RankedAdaptiveCandidate = AdaptiveQuestionCandidate & {
  adaptiveScore: number;
  priorityReasons: readonly string[];
};

export type AdaptiveRemediationPlan = {
  mandatory: boolean;
  topicIds: readonly string[];
  components: readonly (
    | "focused_mini_quiz"
    | "targeted_flashcards"
    | "micro_case_study"
    | "simplified_breakdown"
    | "clinical_pearl"
    | "misconception_correction"
  )[];
  reason:
    | "safety_critical"
    | "dangerous_misconception"
    | "repeated_learning_gap"
    | "routine_reinforcement";
};

export type AdaptiveNextStep = {
  difficulty: AdaptiveDifficultyLevel;
  readinessScore: number;
  readinessBand: "high_remediation_needed" | "developing_competency" | "near_exam_readiness" | "strong_exam_readiness";
  remediation: AdaptiveRemediationPlan;
  flashcardReviewIntervalDays: number;
  safetyOverride: boolean;
  antiAnxietySupport: AdaptiveAntiAnxietySupportPlan;
};

export const SAFETY_CRITICAL_DOMAINS = [
  "sepsis",
  "respiratory distress",
  "silent hypoxia",
  "subtle respiratory decline",
  "worsening neuro status",
  "unstable vital trend",
  "hidden safety risk",
  "stroke",
  "acs",
  "medication safety",
  "delegation",
  "insulin",
  "anticoagulation",
  "escalation",
  "pediatric emergencies",
] as const;

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampDifficulty(value: number): AdaptiveDifficultyLevel {
  return Math.min(7, Math.max(1, Math.round(value))) as AdaptiveDifficultyLevel;
}

function confidenceWeight(confidence: AdaptiveConfidenceLevel): number {
  switch (confidence) {
    case "very_confident":
      return 1;
    case "somewhat_confident":
      return 0.7;
    case "unsure":
      return 0.35;
    case "guessing":
      return 0.1;
  }
}

export function classifyConfidenceCalibration(args: {
  correct: boolean;
  confidence: AdaptiveConfidenceLevel;
}): ConfidenceCalibrationBand {
  const high = args.confidence === "very_confident" || args.confidence === "somewhat_confident";
  if (args.correct && high) return "mastery";
  if (args.correct) return "weak_retention";
  if (high) return "dangerous_misconception";
  return "learning_gap";
}

export function readinessBand(score: number): AdaptiveNextStep["readinessBand"] {
  const clamped = clampScore(score);
  if (clamped < 50) return "high_remediation_needed";
  if (clamped < 70) return "developing_competency";
  if (clamped < 85) return "near_exam_readiness";
  return "strong_exam_readiness";
}

export function computeReadinessScore(profile: AdaptiveLearnerProfile): number {
  const masteryAverage =
    profile.topicMastery.length > 0
      ? profile.topicMastery.reduce((sum, topic) => sum + Math.min(1, Math.max(0, topic.masteryLevel)), 0) /
        profile.topicMastery.length
      : 0;
  const confidence = Math.min(1, Math.max(0, profile.confidenceScore / 100));
  const safety = Math.min(1, Math.max(0, profile.safetyScore / 100));
  return clampScore(masteryAverage * 45 + confidence * 20 + safety * 35);
}

export function safetyRiskForAttempt(attempt: AdaptiveAttemptSignal): number {
  let risk = 0;
  if (attempt.metadata.safetyCritical) risk += 30;
  if (attempt.unsafeDecision) risk += 35;
  if (!attempt.correct) risk += 18;
  if (classifyConfidenceCalibration(attempt) === "dangerous_misconception") risk += 22;
  if (attempt.metadata.prioritizationLevel >= 4) risk += 8;
  if (attempt.metadata.pharmacologyComplexity >= 4) risk += 8;
  risk += clinicalIntuitionRiskForAttempt(attempt);
  return clampScore(risk);
}

export function shouldTriggerSafetyOverride(attempts: readonly AdaptiveAttemptSignal[]): boolean {
  const recent = attempts.slice(-5);
  const highRiskMisses = recent.filter((attempt) => safetyRiskForAttempt(attempt) >= 70).length;
  const unsafeCount = recent.filter((attempt) => attempt.unsafeDecision).length;
  return highRiskMisses >= 1 || unsafeCount >= 2;
}

export function recommendDifficultyLevel(args: {
  currentLevel: AdaptiveDifficultyLevel;
  recentAttempts: readonly AdaptiveAttemptSignal[];
}): AdaptiveDifficultyLevel {
  const recent = args.recentAttempts.slice(-8);
  if (recent.length < 3) return args.currentLevel;

  const accuracy = recent.filter((attempt) => attempt.correct).length / recent.length;
  const averageConfidence =
    recent.reduce((sum, attempt) => sum + confidenceWeight(attempt.confidence), 0) / recent.length;
  const hintAverage = recent.reduce((sum, attempt) => sum + attempt.hintsUsed, 0) / recent.length;
  const unsafe = recent.some((attempt) => safetyRiskForAttempt(attempt) >= 70);
  const slowOrChanged = recent.filter((attempt) => attempt.timeToAnswerMs > 90000 || attempt.answerChanges > 1).length;
  const anxietySupport = detectAdaptiveAntiAnxietySupport(recent);

  if (anxietySupport.difficultyAdjustment < 0) {
    return clampDifficulty(args.currentLevel + anxietySupport.difficultyAdjustment);
  }

  if (unsafe || accuracy < 0.55 || hintAverage >= 2 || slowOrChanged >= 3) {
    return clampDifficulty(args.currentLevel - 1);
  }

  if (accuracy >= 0.8 && averageConfidence >= 0.7 && hintAverage <= 0.5) {
    return clampDifficulty(args.currentLevel + 1);
  }

  return args.currentLevel;
}

export function computeAdaptiveReviewIntervalDays(args: {
  correct: boolean;
  confidence: AdaptiveConfidenceLevel;
  difficulty: AdaptiveDifficultyLevel;
  safetyCritical: boolean;
  safetyRisk: number;
}): number {
  if (args.safetyCritical && (!args.correct || args.safetyRisk >= 70)) return 0;
  const calibration = classifyConfidenceCalibration(args);
  if (calibration === "dangerous_misconception") return 0;
  if (calibration === "learning_gap") return 1;
  if (calibration === "weak_retention") return args.difficulty >= 5 ? 1 : 3;
  if (args.difficulty >= 6) return 7;
  return args.confidence === "very_confident" ? 21 : 14;
}

export function buildRemediationPlan(args: {
  profile: AdaptiveLearnerProfile;
  recentAttempts: readonly AdaptiveAttemptSignal[];
}): AdaptiveRemediationPlan {
  const recent = args.recentAttempts.slice(-8);
  const unsafe = shouldTriggerSafetyOverride(recent);
  const dangerous = recent.filter((attempt) => classifyConfidenceCalibration(attempt) === "dangerous_misconception");
  const missed = recent.filter((attempt) => !attempt.correct);
  const topics = Array.from(new Set([...dangerous, ...missed].map((attempt) => attempt.topicId))).slice(0, 6);

  if (unsafe) {
    return {
      mandatory: true,
      topicIds: topics,
      components: ["focused_mini_quiz", "targeted_flashcards", "micro_case_study", "misconception_correction"],
      reason: "safety_critical",
    };
  }

  if (dangerous.length > 0) {
    return {
      mandatory: true,
      topicIds: topics,
      components: ["targeted_flashcards", "simplified_breakdown", "misconception_correction"],
      reason: "dangerous_misconception",
    };
  }

  if (missed.length >= 3) {
    return {
      mandatory: false,
      topicIds: topics,
      components: ["focused_mini_quiz", "clinical_pearl", "targeted_flashcards"],
      reason: "repeated_learning_gap",
    };
  }

  return {
    mandatory: false,
    topicIds: args.profile.remediationQueue.slice(0, 4),
    components: ["targeted_flashcards", "clinical_pearl"],
    reason: "routine_reinforcement",
  };
}

function topicById(profile: AdaptiveLearnerProfile, topicId: string): AdaptiveTopicMastery | undefined {
  return profile.topicMastery.find((topic) => topic.topicId === topicId);
}

export function rankAdaptiveQuestionCandidates(args: {
  profile: AdaptiveLearnerProfile;
  candidates: readonly AdaptiveQuestionCandidate[];
  nowMs: number;
}): RankedAdaptiveCandidate[] {
  const requiredDifficulty = args.profile.overallLevel;
  return args.candidates
    .map((candidate) => {
      const mastery = topicById(args.profile, candidate.metadata.topic);
      const reasons: string[] = [];
      let score = 0;

      if (mastery) {
        const weakness = (1 - Math.min(1, Math.max(0, mastery.masteryLevel))) * 35;
        score += weakness;
        if (mastery.safetyRisk >= 70) {
          score += 35;
          reasons.push("safety_weakness");
        }
        if (mastery.confidenceLevel < 0.5) {
          score += 14;
          reasons.push("weak_confidence");
        }
        if (mastery.lastReviewedMs != null) {
          const daysSinceReview = Math.max(0, (args.nowMs - mastery.lastReviewedMs) / 86400000);
          if (daysSinceReview >= mastery.repetitionIntervalDays) {
            score += 18;
            reasons.push("low_retention_due");
          }
        }
      } else {
        score += 12;
        reasons.push("profession_required_competency");
      }

      if (candidate.metadata.safetyCritical) {
        score += 18;
        reasons.push("safety_critical");
      }
      const intuition = clinicalIntuitionSignalForCandidate(candidate);
      if (intuition.trainingScore > 0) {
        score += intuition.trainingScore;
        for (const reason of intuition.reasons) reasons.push(reason);
      }
      const difficultyDistance = Math.abs(candidate.metadata.difficulty - requiredDifficulty);
      score += Math.max(0, 16 - difficultyDistance * 5);
      if (candidate.metadata.caseBased) score += 5;
      if (candidate.recentlySeen) score -= 40;
      if (reasons.length === 0) reasons.push("blueprint_balancing");

      return { ...candidate, adaptiveScore: Math.round(score * 100) / 100, priorityReasons: reasons };
    })
    .sort((a, b) => {
      if (b.adaptiveScore !== a.adaptiveScore) return b.adaptiveScore - a.adaptiveScore;
      return a.id.localeCompare(b.id);
    });
}

export function buildAdaptiveNextStep(args: {
  profile: AdaptiveLearnerProfile;
  recentAttempts: readonly AdaptiveAttemptSignal[];
}): AdaptiveNextStep {
  const recent = args.recentAttempts;
  const lastAttempt = recent.at(-1);
  const safetyOverride = shouldTriggerSafetyOverride(recent);
  const antiAnxietySupport = detectAdaptiveAntiAnxietySupport(recent);
  const difficulty = safetyOverride
    ? clampDifficulty(args.profile.overallLevel - 1)
    : recommendDifficultyLevel({ currentLevel: args.profile.overallLevel, recentAttempts: recent });
  const readinessScore = computeReadinessScore(args.profile);
  const remediation = buildRemediationPlan(args);
  const flashcardReviewIntervalDays = lastAttempt
    ? computeAdaptiveReviewIntervalDays({
        correct: lastAttempt.correct,
        confidence: lastAttempt.confidence,
        difficulty: lastAttempt.metadata.difficulty,
        safetyCritical: lastAttempt.metadata.safetyCritical,
        safetyRisk: safetyRiskForAttempt(lastAttempt),
      })
    : 3;

  return {
    difficulty,
    readinessScore,
    readinessBand: readinessBand(readinessScore),
    remediation,
    flashcardReviewIntervalDays,
    safetyOverride,
    antiAnxietySupport,
  };
}
