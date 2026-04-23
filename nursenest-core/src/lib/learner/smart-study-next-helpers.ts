import type {
  StudyNextMode,
  StudyNextRecommendation,
  StudyNextRecommendationType,
} from "@/lib/learner/study-next-types";

export function hrefMatchesSuppression(href: string, suppressed: readonly string[]): boolean {
  for (const s of suppressed) {
    if (!s) continue;
    if (href === s) return true;
    if (s.endsWith("*") && href.startsWith(s.slice(0, -1))) return true;
  }
  return false;
}

export function assignStudyNextMode(rec: StudyNextRecommendation): StudyNextMode {
  switch (rec.type) {
    case "continue_pathway_lesson":
      return "continue_pathway";
    case "same_body_system_lesson":
      return "continue_body_system";
    case "weak_topic_lesson":
      return "reinforce_weak";
    case "weak_topic_qbank":
      return "practice_questions_next";
    case "weak_topic_flashcards":
      return "review_flashcards_next";
    case "missed_review_session":
      return "mixed_review";
    case "retest_topic":
      return rec.reasonCode === "insufficient_signals_mixed_bank" ? "explore" : "mixed_review";
    default:
      return "explore";
  }
}

export function attachModes(recs: StudyNextRecommendation[]): StudyNextRecommendation[] {
  return recs.map((r) => ({ ...r, mode: assignStudyNextMode(r) }));
}

export function filterSuppressed(
  recs: StudyNextRecommendation[],
  suppressed: readonly string[],
): StudyNextRecommendation[] {
  return recs.filter((r) => !hrefMatchesSuppression(r.href, suppressed));
}

export function reorderForAfterActivity(
  recs: StudyNextRecommendation[],
  after?: "lesson" | "quiz" | "flashcards" | "practice_test" | "blog",
): StudyNextRecommendation[] {
  if (!after || recs.length < 2) return recs;
  const rank = (t: StudyNextRecommendationType): number => {
    const isContinueLesson = t === "continue_pathway_lesson" || t === "same_body_system_lesson";
    if (after === "flashcards") {
      /* Larger rank sorts first — after cards, steer toward questions / mixed review, not more cards. */
      if (t === "weak_topic_qbank" || t === "missed_review_session") return 2;
      if (t === "weak_topic_flashcards" || t === "retest_topic") return 0;
      return 1;
    }
    if (after === "practice_test" || after === "quiz") {
      if (t === "missed_review_session" || t === "weak_topic_qbank") return 2;
      if (t === "weak_topic_lesson" || isContinueLesson) return 1;
      return 0;
    }
    if (after === "lesson") {
      if (t === "weak_topic_qbank" || t === "missed_review_session") return 2;
      if (t === "weak_topic_flashcards") return 1;
      return 0;
    }
    if (after === "blog") {
      if (t === "weak_topic_qbank") return 2;
      return 0;
    }
    return 0;
  };
  return [...recs].sort((a, b) => rank(b.type) - rank(a.type));
}
