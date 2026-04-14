import test from "node:test";
import assert from "node:assert/strict";
import type { Prisma } from "@prisma/client";
import {
  buildSectionsDbPayload,
  evaluateCompletion,
  mergeIncrementalPremiumSections,
  mergeQuizItemsNoDup,
  MIN_SECTION_BODY_WORDS_TO_PRESERVE,
  NN_LESSON_DB_PAYLOAD_V2,
  normalizeSectionsRich,
  quizDedupeKey,
} from "./lesson-completion-incremental-pure";
import type { PathwayLessonQuizItem, PathwayLessonSection } from "./pathway-lesson-types";

const filler = (words: number) => Array.from({ length: words }, (_, i) => `w${i}`).join(" ");

function spineSection(kind: PathwayLessonSection["kind"], wordCount: number, bodyExtra = ""): PathwayLessonSection {
  const body = `${filler(wordCount)} ${bodyExtra}`.trim();
  return {
    id: kind,
    kind,
    heading: kind,
    body,
  };
}

/** Eleven premium kinds with enough total words for strict completion when paired with quizzes. */
function completePremiumSpine(pathoParagraphs: string): PathwayLessonSection[] {
  const kinds: PathwayLessonSection["kind"][] = [
    "introduction",
    "pathophysiology_overview",
    "signs_symptoms",
    "red_flags",
    "labs_diagnostics",
    "nursing_assessment_interventions",
    "clinical_pearls",
    "client_education",
    "tier_specific_relevance",
    "country_specific_notes",
    "related_next_steps",
  ];
  return kinds.map((kind) =>
    kind === "pathophysiology_overview"
      ? spineSection(kind, 20, pathoParagraphs)
      : spineSection(kind, 35),
  );
}

function postWithRationales(n: number, prefix: string): PathwayLessonQuizItem[] {
  return Array.from({ length: n }, (_, i) => ({
    question: `${prefix} question ${i}?`,
    options: ["A", "B"],
    correct: "A",
    rationale: `Rationale ${i} with enough text.`,
  }));
}

test("mergeIncrementalPremiumSections keeps strong sections (>=50 words) and fills thin ones from proposed", () => {
  const current: PathwayLessonSection[] = [
    spineSection("introduction", MIN_SECTION_BODY_WORDS_TO_PRESERVE, "keep-me-intro"),
    spineSection("pathophysiology_overview", 10, "thin-patho"),
    ...[
      "signs_symptoms",
      "red_flags",
      "labs_diagnostics",
      "nursing_assessment_interventions",
      "clinical_pearls",
      "client_education",
      "tier_specific_relevance",
      "country_specific_notes",
      "related_next_steps",
    ].map((k) => spineSection(k as PathwayLessonSection["kind"], 40)),
  ];
  const proposed: PathwayLessonSection[] = completePremiumSpine("prop-one\n\nprop-two\n\nprop-three");
  const merged = mergeIncrementalPremiumSections(current, proposed);
  const intro = merged.find((s) => s.kind === "introduction");
  const patho = merged.find((s) => s.kind === "pathophysiology_overview");
  assert.ok(intro?.body.includes("keep-me-intro"));
  assert.ok(patho?.body.includes("prop-one"));
});

test("normalizeSectionsRich preserves recall, checkpoint, key facts, and audioUrl", () => {
  const raw: Prisma.JsonValue = [
    {
      id: "introduction",
      kind: "introduction",
      heading: "Intro",
      body: filler(30),
      recallPrompts: [{ prompt: "Recall A" }],
      checkpointQuestions: [{ q: "Check 1" }],
      keyRecallFacts: [{ fact: "Fact 1" }],
      audioUrl: "https://example.com/a.mp3",
    },
  ];
  const out = normalizeSectionsRich(raw);
  assert.equal(out.length, 1);
  assert.deepEqual(out[0]?.recallPrompts, [{ prompt: "Recall A" }]);
  assert.deepEqual(out[0]?.checkpointQuestions, [{ q: "Check 1" }]);
  assert.deepEqual(out[0]?.keyRecallFacts, [{ fact: "Fact 1" }]);
  assert.equal(out[0]?.audioUrl, "https://example.com/a.mp3");
});

test("buildSectionsDbPayload wraps sections + quizzes in nnLessonPayloadV2 when quizzes exist", () => {
  const sections = completePremiumSpine("a\n\nb\n\nc");
  const pre: PathwayLessonQuizItem[] = [{ question: "Pre?", options: ["x"], correct: "x" }];
  const post = postWithRationales(5, "post");
  const payload = buildSectionsDbPayload(sections, pre, post) as Record<string, unknown>;
  assert.equal(payload[NN_LESSON_DB_PAYLOAD_V2], true);
  assert.ok(Array.isArray(payload.sections));
  assert.ok(Array.isArray(payload.preTest));
  assert.ok(Array.isArray(payload.postTest));
});

test("quiz merge dedupes by examQuestionId and by stem; repeated merge is idempotent", () => {
  const byId: PathwayLessonQuizItem = {
    examQuestionId: "eq-1",
    question: "Stem A?",
    options: ["1"],
    correct: "1",
  };
  const sameIdAgain: PathwayLessonQuizItem = {
    examQuestionId: "eq-1",
    question: "Different wording but same examQuestionId",
    options: ["2"],
    correct: "2",
  };
  const stem = "Shared stem without id?";
  const byStem1: PathwayLessonQuizItem = { question: stem, options: ["x"], correct: "x" };
  const byStem2: PathwayLessonQuizItem = { question: stem, options: ["y"], correct: "y" };
  assert.equal(quizDedupeKey(byId), "id:eq-1");
  assert.equal(mergeQuizItemsNoDup([byId], [sameIdAgain]).length, 1);
  assert.equal(mergeQuizItemsNoDup([], [byStem1, byStem2]).length, 1);

  const unique: PathwayLessonQuizItem = { question: "Unique question two?", options: ["A"], correct: "A" };
  const once = mergeQuizItemsNoDup([byId, byStem1], [sameIdAgain, byStem2, unique]);
  assert.equal(once.length, 3);
  const twice = mergeQuizItemsNoDup(once, [sameIdAgain, byStem2, unique]);
  assert.deepEqual(twice, once);
});

test("evaluateCompletion returns COMPLETE only when spine, patho paragraphs, words, and quizzes pass", () => {
  const lesson = {
    id: "1",
    slug: "s",
    title: "Heart failure",
    topic: "Cardiac",
    topicSlug: "cardiac",
    bodySystem: "Cardiovascular",
    sections: {},
  };
  const patho = `${filler(15)}\n\n${filler(15)}\n\n${filler(15)}`;
  const sections = completePremiumSpine(patho);
  const pre = postWithRationales(3, "pre");
  const post = postWithRationales(5, "post");
  const ok = evaluateCompletion({ lesson, sections, preQuestions: pre, postQuestions: post });
  assert.equal(ok.status, "COMPLETE");
  assert.equal(ok.gaps.length, 0);
});

test("strict COMPLETE lessons are not 'upgraded' by merge when existing section is strong", () => {
  const current = completePremiumSpine(`${filler(12)}\n\n${filler(12)}\n\n${filler(12)}`);
  const proposed = completePremiumSpine("new-one\n\nnew-two\n\nnew-three");
  const merged = mergeIncrementalPremiumSections(current, proposed);
  const pathoCur = current.find((s) => s.kind === "pathophysiology_overview")!;
  const pathoOut = merged.find((s) => s.kind === "pathophysiology_overview")!;
  assert.ok(pathoCur.body.includes("w0"));
  assert.ok(!pathoOut.body.includes("new-one"));
});
