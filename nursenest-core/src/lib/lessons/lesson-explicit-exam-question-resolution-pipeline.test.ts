import test from "node:test";
import assert from "node:assert/strict";
import type { CountryCode } from "@prisma/client";
import type { ExamQuestionMcqRow } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { resolveExplicitLessonBankQuizItemsWithDiagnostics } from "@/lib/lessons/lesson-explicit-exam-question-resolution-pipeline";
import { preferExplicitAssessmentSide } from "@/lib/lessons/lesson-assessment-explicit-pure";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

const US = "US" as CountryCode;

function mcqRow(id: string, stem = "Stem?"): ExamQuestionMcqRow {
  return {
    id,
    stem,
    options: ["opt1", "opt2"],
    correctAnswer: "A",
    questionType: "MULTIPLE_CHOICE",
    rationale: null,
  };
}

test("mixed explicit ids: keeps renderable MCQs in order, drops missing / non-MCQ / bare outcomes, no fallback when one survives", () => {
  const idOk1 = "aaaaaaaaaaaaaaaa";
  const idOk2 = "bbbbbbbbbbbbbbbb";
  const idMissing = "cccccccccccccccc";
  const idSata = "dddddddddddddddd";
  const idInaccessibleBare = "eeeeeeeeeeeeeeee";

  const rows = new Map<string, ExamQuestionMcqRow>([
    [idOk1, mcqRow(idOk1, "First?")],
    [idOk2, mcqRow(idOk2, "Second?")],
    [idSata, { ...mcqRow(idSata), questionType: "SATA", stem: "Select all" }],
  ]);

  const bare = new Map([
    [idMissing, "missing" as const],
    [idInaccessibleBare, "inaccessible" as const],
  ]);

  /** Simulates a second raw occurrence of `idOk1` removed during uniq (loader records the dropped id). */
  const duplicateDropped = [idOk1];

  const { items, diagnostics } = resolveExplicitLessonBankQuizItemsWithDiagnostics({
    orderedUniqIds: [idOk1, idMissing, idOk2, idInaccessibleBare, idSata],
    accessibleRowsById: rows,
    countryCode: US,
    bareResolutionById: bare,
    duplicateDroppedIds: duplicateDropped,
    preResolveDropped: [{ id: "zzzzzzzzzzzzzzzz", reason: "malformed" }],
    hadSubscriberAccess: true,
  });

  assert.deepEqual(
    items.map((i) => i.examQuestionId),
    [idOk1, idOk2],
    "survivors preserve configured order among rows that survive finalize",
  );
  assert.equal(diagnostics.resolvedExamQuestionIds.length, 2);
  assert.equal(diagnostics.zeroResolvedWithSubscriberAccess, false);

  const reasons = new Map(diagnostics.dropped.map((d) => [d.id, d.reason]));
  assert.equal(reasons.get(idMissing), "missing");
  assert.equal(reasons.get(idInaccessibleBare), "inaccessible");
  assert.equal(reasons.get(idSata), "non_mcq");
  assert.equal(reasons.get(idOk1), "duplicate");
  assert.equal(reasons.get("zzzzzzzzzzzzzzzz"), "malformed");

  const merged: PathwayLessonQuizItem[] = [{ question: "Bank?", options: ["x", "y"], correct: 0 }];
  const explicitBank = items as PathwayLessonQuizItem[];
  assert.deepEqual(preferExplicitAssessmentSide(explicitBank, merged), explicitBank);
});

test("all explicit ids dropped: zeroResolvedWithSubscriberAccess and assessment falls back to merged bank", () => {
  const idOnlyMissing = "ffffffffffffffff";
  const { items, diagnostics } = resolveExplicitLessonBankQuizItemsWithDiagnostics({
    orderedUniqIds: [idOnlyMissing],
    accessibleRowsById: new Map(),
    countryCode: US,
    bareResolutionById: new Map([[idOnlyMissing, "missing"]]),
    hadSubscriberAccess: true,
  });
  assert.equal(items.length, 0);
  assert.equal(diagnostics.zeroResolvedWithSubscriberAccess, true);

  const merged: PathwayLessonQuizItem[] = [{ question: "Bank?", options: ["a", "b"], correct: 0 }];
  assert.deepEqual(preferExplicitAssessmentSide([], merged), merged);
  assert.ok(!items.some((i) => i.examQuestionId === idOnlyMissing));
});
