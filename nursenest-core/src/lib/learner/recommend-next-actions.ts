import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { appCatWeakFocusPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { confidenceFromSignal, type RecommendationConfidence } from "@/lib/learner/topic-linking";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type {
  StudyNextConfidence,
  StudyNextReasonCode,
  StudyNextRecommendation,
} from "@/lib/learner/study-next-types";

function confidenceLabelForWeakTopic(w: WeakTopicRow): RecommendationConfidence {
  return w.recommendationConfidence ?? confidenceFromSignal(w.sourceConfidence);
}

function topicDrillHref(topic: string, topicCode?: string): string {
  const q = new URLSearchParams();
  q.set("preset", "topic_drill");
  q.set("topic", topic);
  if (topicCode && topicCode.length > 1) q.set("topicCode", topicCode);
  return `/app/questions?${q.toString()}`;
}

function reasonForWeakTopic(w: WeakTopicRow): {
  code: StudyNextReasonCode;
  short: string;
  confidence: StudyNextConfidence;
} {
  const conf = confidenceLabelForWeakTopic(w);
  const code: StudyNextReasonCode =
    conf === "high"
      ? "weak_topic_high_confidence"
      : w.wrongStreak && w.wrongStreak >= 2
        ? "weak_topic_recent_miss"
        : "weak_topic_low_confidence";
  const short =
    conf === "high"
      ? "Your recent attempts show a sustained gap here."
      : w.wrongStreak && w.wrongStreak >= 2
        ? "Recent misses cluster on this topic."
        : "Limited evidence so far; a short drill still helps.";
  const confidence: StudyNextConfidence = conf === "high" ? "high" : conf === "medium" ? "medium" : "low";
  return { code, short, confidence };
}

function continuePathwayRec(next: NonNullable<LearnerStudySnapshot["pathwayNext"]>): StudyNextRecommendation {
  const stalled = next.stalled;
  const reasonCode: StudyNextReasonCode = stalled ? "pathway_progress_stalled" : "continue_path_started";
  const reasonShort = stalled
    ? "You have not returned to this pathway recently; resume the next lesson."
    : "Continue where your pathway left off.";
  return {
    type: "continue_pathway_lesson",
    href: next.href,
    title: `Continue: ${next.title}`,
    reasonCode,
    reasonShort,
    confidence: stalled ? "medium" : "high",
  };
}

function weakLessonRec(w: WeakTopicRow, lesson: { title: string; href: string }): StudyNextRecommendation {
  const r = reasonForWeakTopic(w);
  return {
    type: "weak_topic_lesson",
    href: lesson.href,
    title: `Lesson: ${lesson.title}`,
    reasonCode: r.code,
    reasonShort: `${r.short} Matched lesson in your pathway.`,
    confidence: r.confidence,
    topicLabel: w.topic,
  };
}

function weakQbankRec(w: WeakTopicRow): StudyNextRecommendation {
  const r = reasonForWeakTopic(w);
  const code = (w.normalizedTopic ?? normalizeTopicKey(w.topic)).trim();
  return {
    type: "weak_topic_qbank",
    href: topicDrillHref(w.topic, code.length > 1 ? code : undefined),
    title: `Question drill: ${w.topic}`,
    reasonCode: r.code,
    reasonShort: r.short,
    confidence: r.confidence,
    topicLabel: w.topic,
  };
}

function weakFlashcardsRec(w: WeakTopicRow): StudyNextRecommendation {
  const r = reasonForWeakTopic(w);
  return {
    type: "weak_topic_flashcards",
    href: "/app/flashcards/weak-areas",
    title: "Weak-area flashcards",
    reasonCode: r.code,
    reasonShort: `${r.short} Cards are filtered to your weak topics.`,
    confidence: r.confidence,
    topicLabel: w.topic,
  };
}

function defaultPathwayIdForRecs(snapshot: LearnerStudySnapshot): string | null {
  const fromLesson = snapshot.weakTopicPathwayLesson?.pathwayId?.trim();
  if (fromLesson) return fromLesson;
  const fromNext = snapshot.pathwayNext?.pathwayId?.trim();
  return fromNext || null;
}

function retestWeakPoolRec(snapshot: LearnerStudySnapshot): StudyNextRecommendation {
  const pid = defaultPathwayIdForRecs(snapshot);
  const href = appCatWeakFocusPath(pid, undefined);
  const pw = pid ? getExamPathwayById(pid) : undefined;
  const title = pw ? `${catPathwayShortCatLabel(pw)} (weak focus)` : "Adaptive session (weak pool)";
  return {
    type: "retest_topic",
    href,
    title,
    reasonCode: "practice_retest_weak_pool",
    reasonShort: pw
      ? `CAT-style session biased to weak topics on ${catPathwayShortCatLabel(pw)}.`
      : "Builds a session biased to topics your ledger flags.",
    confidence: "medium",
  };
}

function mixedWeakBankRec(): StudyNextRecommendation {
  return {
    type: "weak_topic_qbank",
    href: "/app/questions?studyMode=weak",
    title: "Question bank (weak mode)",
    reasonCode: "insufficient_signals_mixed_bank",
    reasonShort: "No strong topic signal yet; the bank can prioritize weak topics as you accrue data.",
    confidence: "low",
  };
}

/**
 * Deterministic ordering: continue (when mid-pathway) → weak lesson → weak qbank → flashcards → retest → mixed weak bank.
 * Max `maxTotal` items (default 3). Dedupes by `href`.
 */
export function recommendNextActions(
  snapshot: LearnerStudySnapshot,
  context?: { maxTotal?: number },
): StudyNextRecommendation[] {
  const maxTotal = Math.min(5, Math.max(1, context?.maxTotal ?? 3));
  const w = snapshot.topWeak;
  const pn = snapshot.pathwayNext;
  const wl = snapshot.weakTopicPathwayLesson;

  const priority: (StudyNextRecommendation | null)[] = [];

  if (pn?.engagedInPathway) {
    priority.push(continuePathwayRec(pn));
  }
  if (w && wl) {
    priority.push(weakLessonRec(w, wl));
  }
  if (w) {
    priority.push(weakQbankRec(w));
  }
  if (w && snapshot.hasWeakTopicFlashcards) {
    priority.push(weakFlashcardsRec(w));
  }
  priority.push(retestWeakPoolRec(snapshot));
  priority.push(mixedWeakBankRec());

  const flat = priority.filter((x): x is StudyNextRecommendation => x != null);
  const seen = new Set<string>();
  const out: StudyNextRecommendation[] = [];
  for (const rec of flat) {
    if (seen.has(rec.href)) continue;
    seen.add(rec.href);
    out.push(rec);
    if (out.length >= maxTotal) break;
  }
  return out;
}
