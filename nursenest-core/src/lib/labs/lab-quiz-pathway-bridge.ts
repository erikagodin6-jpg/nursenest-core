import type { PathwayLessonLinkedLearningSignals, PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LabLessonDefinition, LabQuestion } from "@/lib/labs/labs-engine";

function rationaleWithDistribution(q: LabQuestion): string | undefined {
  const base = q.rationale.trim();
  if (!q.answerDistribution?.length) return base.length > 0 ? base : undefined;
  const lines = q.answerDistribution.map(
    (d) => `${String.fromCharCode(65 + d.optionIndex)} (${d.shareBand}): ${d.distractorRationale}`,
  );
  return `${base}\n\nIllustrative answer distribution (teaching bands, not live analytics):\n${lines.join("\n")}`;
}

/**
 * Maps authored lab MCQs into the same {@link PathwayLessonQuizItem} contract pathway lessons use,
 * so {@link PathwayLessonQuizSet} can render them with identical UX and monetization gates.
 */
export function labQuestionsToPathwayQuizItems(questions: LabQuestion[]): PathwayLessonQuizItem[] {
  return questions.map((q) => {
    const rationale = rationaleWithDistribution(q);
    const base: PathwayLessonQuizItem = {
      question: q.stem,
      options: q.options,
      correct: q.correctIndex,
    };
    return rationale ? { ...base, rationale } : base;
  });
}

/** Mirrors pathway lesson `linkedLearningSignals` for study-loop parity (topic key + surface flags). */
export function labLessonLinkedLearningSignals(lesson: LabLessonDefinition): PathwayLessonLinkedLearningSignals {
  const key = lesson.practiceQuestionTopic.trim().toLowerCase();
  return {
    bidirectionalTopicKey: key,
    flashcardsLinked: true,
    practiceQuestionsLinked: true,
    catPoolLinked: true,
    adaptiveLearningReadiness: true,
  };
}
