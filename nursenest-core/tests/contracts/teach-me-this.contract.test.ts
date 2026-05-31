import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildTeachMeThisMiniLesson } from "../../src/lib/teach-me-this/teach-me-this-mini-lesson";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("teach me this mini lesson uses authored rationale content across required sections", () => {
  const lesson = buildTeachMeThisMiniLesson({
    topic: "Radiation Therapy",
    questionStem: "A client receiving radiation reports fatigue. Which intervention is best?",
    correctAnswer: "Encourage rest periods",
    rationale:
      "Radiation therapy commonly causes fatigue because healthy cells are affected along with cancer cells. Planned rest periods conserve energy while treatment continues. Protecting irradiated skin and pacing activity reduce avoidable complications.",
    clinicalPearl: "Radiation-related fatigue often accumulates over several weeks and may persist after treatment ends.",
    examTip: "For cancer-treatment questions, prioritize interventions that address expected treatment effects safely.",
    memoryHook: "Radiation fatigue: rest and protect.",
  });

  assert.match(lesson.conceptOverview, /Radiation therapy commonly causes fatigue/);
  assert.match(lesson.whyItMatters, /fatigue often accumulates/);
  assert.match(lesson.clinicalExample, /Planned rest periods/);
  assert.match(lesson.patientScenario, /client receiving radiation/);
  assert.match(lesson.nclexTip, /cancer-treatment questions/);
  assert.match(lesson.memoryHook, /Radiation fatigue/);
  assert.match(lesson.practiceQuestion.prompt, /What cue/);
});

test("teach me this panel is inline theme-aware and does not leave the study session", () => {
  const panel = read("src/components/teach-me-this/teach-me-this-panel.tsx");
  assert.match(panel, /data-nn-teach-me-this/);
  assert.match(panel, /hasAuthoredTeaching/);
  assert.match(panel, /if \(!hasTeaching && !lessonHref\) return null/);
  assert.match(panel, /Concept Overview/);
  assert.match(panel, /Why It Matters/);
  assert.match(panel, /Clinical Example/);
  assert.match(panel, /Patient Scenario/);
  assert.match(panel, /NCLEX Tip/);
  assert.match(panel, /Memory Hook/);
  assert.match(panel, /Practice Question/);
  assert.match(panel, /var\(--semantic-/);
  assert.doesNotMatch(panel, /window\.location|router\.push/);
});

test("teach me this is available from flashcards practice questions and practice exams", () => {
  assert.match(read("src/components/flashcards/flashcard-study-question-stack.tsx"), /<TeachMeThisPanel/);
  const questionBank = read("src/components/student/question-bank-practice-client.tsx");
  const practiceRunner = read("src/components/student/practice-test-runner-client.tsx");
  assert.match(questionBank, /<TeachMeThisPanel/);
  assert.match(questionBank, /low_confidence/);
  assert.match(practiceRunner, /<TeachMeThisPanel/);
  assert.match(practiceRunner, /low_confidence/);
});
