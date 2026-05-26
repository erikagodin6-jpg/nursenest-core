import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  deriveUnifiedExamRationaleState,
  normalizeUnifiedExamWorkspaceMode,
  UNIFIED_EXAM_WORKSPACE_MODES,
} from "./unified-exam-workspace";

const root = process.cwd();

function readRepoFile(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

test("unified exam workspace mode registry covers all testing surfaces", () => {
  assert.deepEqual([...UNIFIED_EXAM_WORKSPACE_MODES], [
    "practice",
    "cat",
    "flashcards",
    "review",
    "readiness",
    "learning",
  ]);
  assert.equal(normalizeUnifiedExamWorkspaceMode("cat"), "cat");
  assert.equal(normalizeUnifiedExamWorkspaceMode("unknown"), "practice");
});

test("unified rationale state keeps CAT rationales locked until submitted", () => {
  assert.equal(
    deriveUnifiedExamRationaleState({
      mode: "cat",
      answered: true,
      submitted: false,
    }),
    "locked",
  );
  assert.equal(
    deriveUnifiedExamRationaleState({
      mode: "practice",
      answered: true,
      submitted: true,
    }),
    "available",
  );
});

test("CAT, practice, and flashcards declare the unified fixed-viewport workspace", () => {
  const examLayout = readRepoFile("src/components/exam/nclex-exam-layout.tsx");
  const flashcardSession = readRepoFile("src/components/study/active-study-session.tsx");
  const globalExamCss = readRepoFile("src/app/styles/exam/nclex-exam.css");
  const flashcardCss = readRepoFile("src/app/learner-flashcard-premium.css");

  assert.match(examLayout, /data-nn-unified-exam-workspace/);
  assert.match(examLayout, /data-nn-exam-workspace-mode=\{"cat"/);
  assert.match(examLayout, /data-nn-exam-workspace-mode=\{"practice"/);
  assert.match(flashcardSession, /data-nn-unified-exam-workspace/);
  assert.match(flashcardSession, /data-nn-exam-workspace-mode=\{"flashcards"/);
  assert.match(globalExamCss, /html:has\(\[data-nn-unified-exam-workspace\]\)/);
  assert.match(flashcardCss, /\.nn-active-flashcard-session\[data-nn-unified-exam-workspace\]/);
});
