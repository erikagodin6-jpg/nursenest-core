import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  CANONICAL_LEARNER_SURFACE_INTERACTIONS,
  CANONICAL_LEARNER_SURFACE_PROGRAMS,
  CANONICAL_LEARNER_SURFACE_VERSION,
  deriveUnifiedExamRationaleState,
  normalizeUnifiedExamWorkspaceMode,
  UNIFIED_EXAM_WORKSPACE_MODES,
} from "./unified-exam-workspace";

const root = process.cwd();

function readRepoFile(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

test("unified exam workspace mode registry covers all testing surfaces", () => {
  for (const mode of [
    "practice",
    "cat",
    "flashcards",
    "review",
    "readiness",
    "learning",
    "practice-exam",
    "loft",
    "simulation",
    "si-conversation",
    "ngn-case-study",
    "remediation",
  ]) {
    assert.ok(UNIFIED_EXAM_WORKSPACE_MODES.includes(mode as never), `${mode} must use the unified learner surface`);
  }
  assert.equal(normalizeUnifiedExamWorkspaceMode("cat"), "cat");
  assert.equal(normalizeUnifiedExamWorkspaceMode("unknown"), "practice");
});

test("canonical Flashcards learner surface registry covers programs and interaction types", () => {
  for (const program of [
    "RN",
    "RPN",
    "LPN",
    "New Grad Nurse",
    "NCLEX-RN",
    "NCLEX-PN",
    "NGN Prep",
    "FNP",
    "AGNP",
    "PMHNP",
    "PNP",
    "WHNP",
    "ECG",
    "Paramedic",
    "Respiratory Therapy",
    "Pharmacy Tech",
    "Medical Assistant",
    "HESI",
    "TEAS",
    "PSW/CNA",
    "Healthcare Foundations",
  ]) {
    assert.ok(CANONICAL_LEARNER_SURFACE_PROGRAMS.includes(program as never), `${program} must inherit ${CANONICAL_LEARNER_SURFACE_VERSION}`);
  }

  for (const interaction of [
    "mcq",
    "sata",
    "matrix-grid",
    "bow-tie",
    "ordered-response",
    "highlight",
    "hotspot",
    "trend",
    "cloze",
    "drag-and-drop",
    "ngn-case-study",
    "standalone-interactive",
    "si-conversation",
    "simulation",
  ]) {
    assert.ok(CANONICAL_LEARNER_SURFACE_INTERACTIONS.includes(interaction as never), `${interaction} must render inside the Flashcards shell`);
  }
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
  const activeStudySession = readRepoFile("src/components/study/active-study-session.tsx");
  const flashcardSessionPlayer = readRepoFile("src/components/flashcards/flashcard-session-player.tsx");
  const practiceQuestionSession = readRepoFile("src/components/student/practice-question-session-client.tsx");
  const practiceExamRunner = readRepoFile("src/components/exam/nclex-practice-runner.tsx");
  const questionRenderer = readRepoFile("src/components/questions/question-renderer.tsx");
  const globalExamCss = readRepoFile("src/app/styles/exam/nclex-exam.css");
  const flashcardCss = readRepoFile("src/app/learner-flashcard-premium.css");

  assert.match(examLayout, /data-nn-unified-exam-workspace/);
  assert.match(examLayout, /data-nn-canonical-learner-surface=\{CANONICAL_LEARNER_SURFACE_VERSION\}/);
  assert.match(examLayout, /data-nn-exam-workspace-mode=\{"cat"/);
  assert.match(examLayout, /data-nn-exam-workspace-mode=\{"practice"/);
  assert.match(activeStudySession, /data-nn-unified-exam-workspace/);
  assert.match(activeStudySession, /data-nn-canonical-learner-surface=\{CANONICAL_LEARNER_SURFACE_VERSION\}/);
  assert.match(activeStudySession, /data-nn-exam-workspace-mode=\{"flashcards"/);
  assert.match(flashcardSessionPlayer, /data-nn-canonical-learner-surface=\{CANONICAL_LEARNER_SURFACE_VERSION\}/);
  assert.match(practiceQuestionSession, /<QuestionRenderer/);
  assert.match(practiceQuestionSession, /data-nn-canonical-learner-surface=\{CANONICAL_LEARNER_SURFACE_VERSION\}/);
  assert.match(practiceExamRunner, /data-nn-canonical-learner-surface=\{CANONICAL_LEARNER_SURFACE_VERSION\}/);
  assert.match(questionRenderer, /<FlashcardStudyQuestionStack/);
  assert.match(globalExamCss, /html:has\(\[data-nn-unified-exam-workspace\]\)/);
  assert.match(flashcardCss, /\.nn-active-flashcard-session\[data-nn-unified-exam-workspace\]/);
  assert.match(flashcardCss, /\[data-nn-canonical-learner-surface="flashcards-v1"\]/);
});

test("canonical learner surface includes mobile overflow and touch safeguards", () => {
  const flashcardCss = readRepoFile("src/app/learner-flashcard-premium.css");

  assert.match(flashcardCss, /Canonical learner surface mobile hardening/);
  assert.match(flashcardCss, /max-width:\s*100vw/);
  assert.match(flashcardCss, /overflow-x:\s*hidden/);
  assert.match(flashcardCss, /-webkit-overflow-scrolling:\s*touch/);
  assert.match(flashcardCss, /env\(safe-area-inset-bottom/);
  assert.match(flashcardCss, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(flashcardCss, /touch-action:\s*manipulation/);
});

test("legacy detached learner workspaces are not reintroduced", () => {
  const files = [
    "src/components/exam/nclex-practice-runner.tsx",
    "src/components/student/practice-question-session-client.tsx",
    "src/components/questions/question-renderer.tsx",
    "src/components/flashcards/flashcard-study-question-stack.tsx",
  ];
  for (const file of files) {
    const source = readRepoFile(file);
    assert.doesNotMatch(source, /StandaloneConversationExperience|LegacyConversationLayout|LegacyConversationWorkspace/);
  }
});
