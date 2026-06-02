import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("personal study notebook reuses learner notes persistence and defines requested categories", () => {
  const util = read("src/lib/learner/personal-study-notebook.ts");
  const schema = read("prisma/schema.prisma");

  assert.match(schema, /model LearnerNote/);
  assert.doesNotMatch(schema, /model PersonalStudyNotebook/);

  for (const category of [
    "notes",
    "saved_questions",
    "saved_pearls",
    "saved_memory_hooks",
    "saved_rationales",
    "ecg_notes",
    "lab_notes",
    "pharmacology_notes",
  ]) {
    assert.match(util, new RegExp(`"${category}"`));
  }
});

test("notebook API persists source metadata through the subscriber-protected note path", () => {
  const route = read("src/app/api/learner/notebook/route.ts");

  assert.match(route, /requireSubscriberSession/);
  assert.match(route, /enforceLearnerNotesProtection/);
  assert.match(route, /prisma\.learnerNote\.upsert/);
  assert.match(route, /encodeNotebookBody/);
  assert.match(route, /sourceType/);
});

test("notebook dashboard includes search filters favorites tags recent activity and exports", () => {
  const page = read("src/app/(app)/app/(learner)/account/notebook/page.tsx");
  const client = read("src/app/(app)/app/(learner)/account/notebook/personal-study-notebook-client.tsx");

  assert.match(page, /My Study Notebook/);
  assert.match(client, /Search notebook/);
  assert.match(client, /All systems/);
  assert.match(client, /All topics/);
  assert.match(client, /Any date/);
  assert.match(client, /Favorites/);
  assert.match(client, /All tags/);
  assert.match(page, /recentCount/);
  assert.match(client, /Print/);
  assert.match(client, /PDF/);
  assert.match(client, /mailto:/);
});

test("save to notebook is available from flashcard clinical reasoning surfaces", () => {
  const button = read("src/components/notebook/save-to-notebook-button.tsx");
  const flashcardStack = read("src/components/flashcards/flashcard-study-question-stack.tsx");
  const rationaleCard = read("src/components/study/saved-rationale-card.tsx");
  const studyNotesPanel = read("src/components/student/study-notes-panel.tsx");
  const lessonNotesDrawer = read("src/components/lessons/lesson-notes-drawer.tsx");

  assert.match(button, /data-nn-save-to-notebook/);
  assert.match(button, /\/api\/learner\/notebook/);
  assert.match(flashcardStack, /SaveToNotebookButton/);
  assert.match(flashcardStack, /saved_rationales/);
  assert.match(flashcardStack, /saved_pearls/);
  assert.match(flashcardStack, /saved_memory_hooks/);
  assert.match(rationaleCard, /Save to Notebook/);
  assert.match(rationaleCard, /\/app\/account\/notebook/);
  assert.match(studyNotesPanel, /Save to Notebook/);
  assert.match(studyNotesPanel, /My Study Notebook across devices/);
  assert.match(lessonNotesDrawer, /Notebook notes save automatically/);
  assert.match(lessonNotesDrawer, /\/app\/account\/notebook/);
});

test("account navigation exposes the notebook under learner dashboard tools", () => {
  const header = read("src/components/layout/site-header.tsx");

  assert.match(header, /My Study Notebook/);
  assert.match(header, /\/app\/account\/notebook/);
});
