import assert from "node:assert/strict";
import test from "node:test";
import { TierCode } from "@prisma/client";
import {
  buildLabsStudyLinks,
  countLabsInventoryForTrack,
  getLabLessonByCategoryAndSlug,
  getLabLessonFlashcards,
  getLabLessonQuestions,
  labTrackFromTier,
  listLabCategoriesForTrack,
  listLabLessonsForTrack,
} from "@/lib/labs/labs-engine";

test("labs hub categories are populated for RN", () => {
  const categories = listLabCategoriesForTrack("rn");
  assert.equal(categories.length, 7);
  assert.ok(categories.every((category) => category.lessons.length >= 1));
});

test("allied learners still receive a non-empty relevant subset", () => {
  const categories = listLabCategoriesForTrack("allied");
  assert.ok(categories.length >= 5);
  assert.ok(categories.every((category) => category.lessons.every((lesson) => lesson.supportedTracks.includes("allied"))));
});

test("each lab topic has full structured content plus questions and flashcards", () => {
  for (const lesson of listLabLessonsForTrack("rn")) {
    assert.ok(lesson.normalRange.length > 3, `${lesson.slug} missing normal range`);
    assert.ok(lesson.physiology.length >= 2, `${lesson.slug} missing physiology depth`);
    assert.ok(lesson.priorityThresholds.length >= 1, `${lesson.slug} missing thresholds`);
    assert.ok(lesson.treatmentAlgorithm.length >= 3, `${lesson.slug} missing algorithm`);
    assert.ok(lesson.trendInterpretation.length >= 1, `${lesson.slug} missing trend section`);
    assert.ok(lesson.patternRecognition.length >= 1, `${lesson.slug} missing pattern section`);
    assert.ok(lesson.microScenarios.length >= 1, `${lesson.slug} missing micro scenarios`);
    const qs = getLabLessonQuestions(lesson);
    assert.ok(qs.length >= 6, `${lesson.slug} missing question inventory`);
    assert.ok(qs.every((q) => q.answerDistribution && q.answerDistribution.length === q.options.length), `${lesson.slug} missing distractor bands`);
    assert.ok(getLabLessonFlashcards(lesson).length >= 5, `${lesson.slug} missing flashcard inventory`);
  }
});

test("lab lessons resolve by category and slug", () => {
  const lesson = getLabLessonByCategoryAndSlug("abgs", "abg-interpretation-priority-ladder", "rn");
  assert.ok(lesson);
  assert.match(lesson!.title, /ABG/i);
});

test("study links wire into flashcards, questions, CAT, and lab drills", () => {
  const links = buildLabsStudyLinks("ca-rn-nclex-rn", "potassium");
  assert.equal(links.flashcardsHref, "/app/flashcards?pathwayId=ca-rn-nclex-rn&topicCode=potassium");
  assert.equal(links.questionBankHref, "/app/questions?pathwayId=ca-rn-nclex-rn&topic=potassium");
  assert.equal(links.practiceTestsTopicHref, "/app/practice-tests?pathwayId=ca-rn-nclex-rn&topic=potassium");
  assert.equal(links.lessonsHubHref, "/app/lessons?pathwayId=ca-rn-nclex-rn&topicSlug=potassium");
  assert.equal(links.catLaunchHref, "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn");
  assert.match(links.catHref, /\/app\/practice-tests\?/);
  assert.equal(links.labDrillsHref, "/app/lab-drills?pathwayId=ca-rn-nclex-rn");
});

test("study links fall back safely when pathway is unknown", () => {
  const links = buildLabsStudyLinks(null, null);
  assert.equal(links.lessonsHubHref, "/app/lessons");
  assert.equal(links.catLaunchHref, "/app/practice-tests/start");
});

test("inventory counts remain non-empty so paid labs does not surface empty states", () => {
  const inventory = countLabsInventoryForTrack("rn");
  assert.ok(inventory.lessonCount >= 7);
  assert.ok(inventory.questionCount >= inventory.lessonCount * 6);
  assert.ok(inventory.flashcardCount >= inventory.lessonCount * 5);
});

test("tier mapping keeps RN, PN, NP, and Allied distinct", () => {
  assert.equal(labTrackFromTier(TierCode.RN), "rn");
  assert.equal(labTrackFromTier(TierCode.RPN), "pn");
  assert.equal(labTrackFromTier(TierCode.LVN_LPN), "pn");
  assert.equal(labTrackFromTier(TierCode.NP), "np");
  assert.equal(labTrackFromTier(TierCode.ALLIED), "allied");
});
