import { defaultExamSimulationTimeLimitSec } from "@/lib/exams/cat-exam-simulation";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { CatPresentationMode } from "@/lib/exams/cat-types";
import type { CatSelectionBasis } from "@/lib/practice-tests/types";

export type PracticeTestCreateParsedSubset = {
  timedMode: boolean;
  timeLimitSec?: number | null;
  questionCount: number;
  catPresentationMode: CatPresentationMode;
  /** When set, exam-simulation timed default follows pathway (NCLEX 5h vs NP 3h). */
  pathway?: ExamPathwayDefinition | null;
};

/** API layer: exam simulation always uses a random pool draw before adaptive selection. */
export function resolveCatSelectionBasisForPost(
  catPresentationMode: CatPresentationMode,
  catSelectionBasis: CatSelectionBasis | undefined,
): CatSelectionBasis {
  return catPresentationMode === "exam_simulation" ? "random" : (catSelectionBasis ?? "random");
}

/**
 * Timed limit persisted on the practice test row for CAT creates.
 * Exam simulation with no explicit limit uses pathway-based default (5h NCLEX, 3h NP).
 */
export function resolveCatPostExamTimedLimitSec(d: PracticeTestCreateParsedSubset): number | null {
  const linearDefault = d.timedMode
    ? (d.timeLimitSec ?? Math.min(14_400, Math.max(300, d.questionCount * 90)))
    : null;
  if (d.catPresentationMode === "exam_simulation" && d.timedMode) {
    return d.timeLimitSec ?? defaultExamSimulationTimeLimitSec(d.pathway ?? null);
  }
  return linearDefault;
}
