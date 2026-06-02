import type { CoachFollowUpAction, CoachIntent } from "./study-coach-types";

export const INTENT_TITLES: Record<CoachIntent, string> = {
  explain_simply: "Simplified Explanation",
  why_wrong: "Why This Was Wrong",
  what_next: "What to Study Next",
  weak_summary: "Focus Areas to Review",
  topic_review: "Key Points",
  quick_plan: "Quick Study Session",
  quiz_concept: "Quick Check",
  readiness_explain: "Readiness Snapshot",
  study_priority_ranked: "Ranked Priorities",
  pattern_insight: "Recent Pattern",
  intervention_alert: "Study Note",
};

export function titleForIntent(intent: CoachIntent): string {
  return INTENT_TITLES[intent];
}

const FOLLOW_UPS: Record<CoachIntent, CoachFollowUpAction[]> = {
  explain_simply: [
    { label: "Key Points Only", intent: "topic_review" },
    { label: "Quiz Me on This", intent: "quiz_concept" },
    { label: "Build a Quick Review", intent: "quick_plan" },
  ],
  why_wrong: [
    { label: "Quiz Me on This", intent: "quiz_concept" },
    { label: "Simplify This", intent: "explain_simply" },
    { label: "Key Points Only", intent: "topic_review" },
  ],
  what_next: [
    { label: "Build a Quick Review", intent: "quick_plan" },
    { label: "Focus Areas to Review", intent: "weak_summary" },
  ],
  weak_summary: [
    { label: "What to Study Next", intent: "what_next" },
    { label: "Build a Quick Review", intent: "quick_plan" },
    { label: "Key Points Only", intent: "topic_review" },
  ],
  topic_review: [
    { label: "Quiz Me on This", intent: "quiz_concept" },
    { label: "Simplify This", intent: "explain_simply" },
  ],
  quick_plan: [{ label: "Focus Areas to Review", intent: "weak_summary" }],
  quiz_concept: [
    { label: "Simplify This", intent: "explain_simply" },
    { label: "Key Points Only", intent: "topic_review" },
  ],
  readiness_explain: [
    { label: "What to Study Next", intent: "what_next" },
    { label: "Build a Quick Review", intent: "quick_plan" },
    { label: "Focus Areas to Review", intent: "weak_summary" },
  ],
  study_priority_ranked: [
    { label: "Build a Quick Review", intent: "quick_plan" },
    { label: "What to Study Next", intent: "what_next" },
  ],
  pattern_insight: [
    { label: "What to Study Next", intent: "what_next" },
    { label: "Build a Quick Review", intent: "quick_plan" },
  ],
  intervention_alert: [
    { label: "What to Study Next", intent: "what_next" },
    { label: "Focus Areas to Review", intent: "weak_summary" },
  ],
};

export function followUpsForIntent(intent: CoachIntent): CoachFollowUpAction[] {
  return FOLLOW_UPS[intent] ?? [];
}
