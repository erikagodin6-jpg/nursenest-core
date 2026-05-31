import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();
const src = (path: string) => readFileSync(join(root, path), "utf8");

test("question bookmarking supports required categories and source types", () => {
  const lib = src("src/lib/bookmarks/question-bookmarks.ts");

  for (const category of ["review_later", "difficult", "exam_day_review", "need_more_practice", "favorite_questions"]) {
    assert.match(lib, new RegExp(category), `missing bookmark category ${category}`);
  }

  for (const sourceType of [
    "flashcard",
    "practice_question",
    "cat_exam",
    "ecg_question",
    "pharmacology_question",
    "clinical_skills_question",
  ]) {
    assert.match(lib, new RegExp(sourceType), `missing bookmark source type ${sourceType}`);
  }
});

test("question bookmarks are persisted through a dedicated subscriber API", () => {
  const route = src("src/app/api/learner/question-bookmarks/route.ts");

  assert.match(route, /requireSubscriberSession/, "bookmark API must require subscriber session");
  assert.match(route, /enforceLearnerNotesProtection/, "bookmark API must respect learner notes protection");
  assert.match(route, /LearnerNote/, "bookmark API should use existing LearnerNote storage, not a new silo");
  assert.match(route, /export async function GET/, "bookmark API must list bookmarks");
  assert.match(route, /export async function POST/, "bookmark API must save bookmarks");
  assert.match(route, /export async function DELETE/, "bookmark API must support bulk remove");
});

test("shared learning experiences expose the centralized question bookmark control", () => {
  const stack = src("src/components/flashcards/flashcard-study-question-stack.tsx");
  const activeStudy = src("src/components/study/active-study-session.tsx");
  const practiceSession = src("src/components/student/practice-question-session-client.tsx");
  const practiceBank = src("src/components/student/question-bank-practice-client.tsx");
  const practiceRunner = src("src/components/student/practice-test-runner-client.tsx");
  const ecg = src("src/components/ecg-module/ecg-module-client.tsx");

  assert.match(stack, /QuestionBookmarkButton/, "flashcard stack must render the reusable bookmark button");
  assert.match(activeStudy, /sourceType:\s*"flashcard"/, "flashcards must save with flashcard source type");
  assert.match(practiceSession, /sourceType:[\s\S]*"practice_question"/, "practice session must save practice questions");
  assert.match(practiceSession, /"pharmacology_question"/, "pharmacology practice questions must be classifiable");
  assert.match(practiceSession, /"clinical_skills_question"/, "clinical skills questions must be classifiable");
  assert.match(practiceBank, /bookmarkPayload/, "question bank rationale actions must receive bookmark payload");
  assert.match(practiceRunner, /sourceType=\{catMode \? "cat_exam" : "practice_question"\}/, "practice runner must distinguish CAT vs practice bookmarks");
  assert.match(ecg, /sourceType="ecg_question"/, "ECG questions must expose ECG bookmark source");
});

test("My Bookmarks dashboard provides search, sorting, analytics, bulk remove, and bulk study", () => {
  const page = src("src/app/(app)/app/(learner)/account/bookmarks/page.tsx");
  const client = src("src/app/(app)/app/(learner)/account/bookmarks/my-question-bookmarks-client.tsx");
  const actions = src("src/app/(app)/app/(learner)/account/bookmarks/actions.ts");

  assert.match(page, /My Bookmarks/, "dashboard route should be titled My Bookmarks");
  assert.match(actions, /mostBookmarkedTopics/, "dashboard analytics must include most bookmarked topics");
  assert.match(actions, /weakAreaBookmarkCount/, "dashboard analytics must include weak-area bookmarks");
  assert.match(client, /placeholder="Search by topic, source, category, or difficulty"/, "dashboard must support search");
  assert.match(client, /Sort by topic/, "dashboard must sort by topic");
  assert.match(client, /Sort by date saved/, "dashboard must sort by saved date");
  assert.match(client, /Sort by difficulty/, "dashboard must sort by difficulty");
  assert.match(client, /Bulk Remove/, "dashboard must support bulk remove");
  assert.match(client, /Bulk Study/, "dashboard must support bulk study");
});
