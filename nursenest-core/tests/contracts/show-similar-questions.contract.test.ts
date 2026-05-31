import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  buildSimilarQuestionsHref,
  deriveSimilarQuestionBasis,
  similarQuestionAdaptiveReason,
} from "@/lib/questions/similar-question-links";

const root = process.cwd();

describe("show similar questions reinforcement", () => {
  it("prioritizes medication class, ECG rhythm, NCLEX objective, concept, and topic metadata", () => {
    assert.equal(
      deriveSimilarQuestionBasis({
        sourceType: "pharmacology_question",
        sourceId: "q1",
        topic: "Pharmacology",
        medicationClass: "Beta blockers",
      })?.kind,
      "medication_class",
    );
    assert.equal(
      deriveSimilarQuestionBasis({
        sourceType: "ecg_question",
        sourceId: "q2",
        topic: "ECG",
        ecgRhythmCategory: "Atrial fibrillation",
      })?.kind,
      "ecg_rhythm_category",
    );
    assert.equal(
      deriveSimilarQuestionBasis({
        sourceType: "practice_question",
        sourceId: "q3",
        nclexObjective: "Management of Care",
        topic: "Leadership",
      })?.kind,
      "nclex_objective",
    );
    assert.equal(
      deriveSimilarQuestionBasis({
        sourceType: "flashcard",
        sourceId: "q4",
        clinicalConcept: "Hypoglycemia recognition",
        topic: "Endocrine",
      })?.kind,
      "clinical_concept",
    );
  });

  it("generates 3, 5, and all related launch links through the existing practice launcher", () => {
    const context = {
      sourceType: "practice_question" as const,
      sourceId: "q1",
      topic: "Respiratory",
      pathwayId: "canada-rn-nclex-rn",
      weakArea: true,
    };
    assert.match(buildSimilarQuestionsHref(context, 3) ?? "", /^\/app\/questions\/start\?/);
    assert.match(buildSimilarQuestionsHref(context, 3) ?? "", /count=3/);
    assert.match(buildSimilarQuestionsHref(context, 5) ?? "", /count=5/);
    assert.match(buildSimilarQuestionsHref(context, "all") ?? "", /count=30/);
    assert.match(buildSimilarQuestionsHref(context, 3) ?? "", /studyFilter=weak/);
  });

  it("routes ECG reinforcement to the ECG practice surface", () => {
    const href = buildSimilarQuestionsHref({
      sourceType: "ecg_question",
      sourceId: "ecg1",
      ecgRhythmCategory: "Complete heart block",
    }, 5);
    assert.match(href ?? "", /^\/modules\/ecg-interpretation\/practice\?/);
    assert.match(href ?? "", /similarRhythm=Complete\+heart\+block/);
  });

  it("expresses adaptive prioritization for weak, missed, and low-confidence answers", () => {
    assert.match(
      similarQuestionAdaptiveReason({ sourceType: "flashcard", sourceId: "q1", topic: "Cardiac", weakArea: true }),
      /Weak-area practice is prioritized first/,
    );
    assert.match(
      similarQuestionAdaptiveReason({ sourceType: "flashcard", sourceId: "q1", topic: "Cardiac", previouslyMissed: true }),
      /Previously missed concepts are prioritized first/,
    );
    assert.match(
      similarQuestionAdaptiveReason({ sourceType: "flashcard", sourceId: "q1", topic: "Cardiac", lowConfidence: true }),
      /Low-confidence answers are prioritized first/,
    );
  });

  it("is surfaced in flashcards, practice questions, practice exams, and ECG interpretation", () => {
    const component = readFileSync(join(root, "src/components/questions/show-similar-questions.tsx"), "utf8");
    assert.match(component, /Show Similar Questions/);
    assert.match(component, /3 Similar Questions/);
    assert.match(component, /5 Similar Questions/);
    assert.match(component, /Study All Related Questions/);

    const flashcards = readFileSync(join(root, "src/components/flashcards/flashcard-study-question-stack.tsx"), "utf8");
    assert.match(flashcards, /ShowSimilarQuestions/);
    assert.match(flashcards, /similarQuestionContext/);

    const practice = readFileSync(join(root, "src/components/student/practice-question-session-client.tsx"), "utf8");
    assert.match(practice, /similarQuestionContext/);
    assert.match(practice, /pharmacology_question/);

    const qbank = readFileSync(join(root, "src/components/student/question-bank-practice-client.tsx"), "utf8");
    assert.match(qbank, /ShowSimilarQuestions/);

    const exams = readFileSync(join(root, "src/components/student/practice-test-runner-client.tsx"), "utf8");
    assert.match(exams, /ShowSimilarQuestions/);
    assert.match(exams, /sourceType: catMode \? "cat_exam" : "practice_question"/);

    const ecg = readFileSync(join(root, "src/components/ecg-module/ecg-module-client.tsx"), "utf8");
    assert.match(ecg, /sourceType: "ecg_question"/);
    assert.match(ecg, /ecgRhythmCategory: item\.rhythmTag/);
  });
});
