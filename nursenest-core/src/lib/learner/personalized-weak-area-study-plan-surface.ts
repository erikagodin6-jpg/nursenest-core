import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

/** Learner-safe band — no raw priority scores. */
export type WeakAreaPublicBand = "priority_review" | "needs_attention" | "watch";

export type WeakAreaPublicSummary = {
  label: string;
  band: WeakAreaPublicBand;
  coachLine: string;
};

export type PersonalizedStudyPlanStep = {
  step: number;
  title: string;
  detail: string;
  href: string;
  kind: string;
};

export type PersonalizedWeakAreaStudyPlanPublic = {
  pathwayId: string | null;
  weakestAreas: WeakAreaPublicSummary[];
  reviewSequence: PersonalizedStudyPlanStep[];
  anchors: {
    lesson: { title: string; href: string; reason: string } | null;
    flashcards: { title: string; href: string; reason: string } | null;
    questions: { title: string; href: string; reason: string } | null;
    practiceWeak: { title: string; href: string; reason: string } | null;
  };
  signals: {
    hasRepeatIncorrects: boolean;
    hasStaleInProgressPractice: boolean;
    perQuestionTimingAvailable: boolean;
  };
  /** Explains how weak-area practice stays fresh (non-repetitive session logic). */
  sessionIntegrationNote: string;
};

export type PersonalizedWeakAreaStudyPlanDebug = PersonalizedWeakAreaStudyPlanPublic & {
  topicPerformanceSource: string | null;
  rawWeakTopics: Array<{
    topic: string;
    normalizedTopic?: string;
    strength?: string;
    weakPriorityScore?: number;
    sourceConfidence?: number;
    topicSource?: string;
    wrongStreak?: number;
    missRate?: number;
    attempted?: number;
  }>;
  topRecommendationTypes: string[];
};

function bandForWeakRow(w: WeakTopicRow): WeakAreaPublicBand {
  const streak = w.wrongStreak ?? 0;
  const rate = w.missRate ?? 0;
  if (w.strength === "weak" || streak >= 3 || rate >= 55) return "priority_review";
  if (streak >= 2 || rate >= 40) return "needs_attention";
  return "watch";
}

function coachLineForRow(w: WeakTopicRow, band: WeakAreaPublicBand): string {
  if (band === "priority_review") {
    return w.wrongStreak && w.wrongStreak >= 2
      ? "Recent incorrect answers cluster here — short, focused review will help most."
      : "Accuracy on this topic is below where we want it for exam readiness.";
  }
  if (band === "needs_attention") {
    return "Worth a targeted pass so it does not become a bigger gap later.";
  }
  return "Keep this topic on your radar with occasional reinforcement.";
}

export function toPublicWeakSummaries(rows: WeakTopicRow[], max = 4): WeakAreaPublicSummary[] {
  const out: WeakAreaPublicSummary[] = [];
  for (const w of rows.slice(0, max)) {
    const band = bandForWeakRow(w);
    out.push({
      label: w.topic,
      band,
      coachLine: coachLineForRow(w, band),
    });
  }
  return out;
}

export function pickAnchor(
  recs: StudyNextRecommendation[],
  predicate: (r: StudyNextRecommendation) => boolean,
): { title: string; href: string; reason: string } | null {
  const r = recs.find(predicate);
  if (!r) return null;
  return { title: r.title, href: r.href, reason: r.reasonShort };
}

/** Same ordering as learner-facing {@link PersonalizedWeakAreaStudyPlanPublic.reviewSequence}. */
export function buildReviewSequence(recs: StudyNextRecommendation[]): PersonalizedStudyPlanStep[] {
  const orderedKinds: Array<{ test: (r: StudyNextRecommendation) => boolean; kind: string }> = [
    { test: (r) => r.type === "continue_pathway_lesson", kind: "continue_lesson" },
    { test: (r) => r.type === "weak_topic_lesson", kind: "weak_lesson" },
    { test: (r) => r.type === "weak_topic_flashcards", kind: "flashcards" },
    { test: (r) => r.type === "weak_topic_qbank", kind: "questions" },
    { test: (r) => r.type === "missed_review_session", kind: "missed_practice" },
    { test: (r) => r.type === "retest_topic", kind: "adaptive_weak" },
  ];

  const steps: PersonalizedStudyPlanStep[] = [];
  let step = 1;
  for (const { test, kind } of orderedKinds) {
    const r = recs.find(test);
    if (!r) continue;
    steps.push({
      step,
      title: r.title,
      detail: r.reasonShort,
      href: r.href,
      kind,
    });
    step += 1;
    if (steps.length >= 5) break;
  }
  return steps;
}
