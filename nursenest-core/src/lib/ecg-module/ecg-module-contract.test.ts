import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

test("ECG routes exist only in the strict mastery structure", () => {
  for (const route of [
    "src/app/modules/ecg/basic/lessons/page.tsx",
    "src/app/modules/ecg/basic/quizzes/page.tsx",
    "src/app/modules/ecg/basic/worksheets/page.tsx",
    "src/app/modules/ecg/advanced/lessons/page.tsx",
    "src/app/modules/ecg/advanced/video-drills/page.tsx",
    "src/app/modules/ecg/advanced/scenarios/page.tsx",
    "src/app/modules/ecg/advanced/worksheets/page.tsx",
    "src/app/modules/ecg-interpretation/lessons/page.tsx",
    "src/app/modules/ecg-interpretation/practice/page.tsx",
    "src/app/modules/ecg-interpretation/quiz/page.tsx",
  ]) {
    assert.equal(fs.existsSync(path.join(root, route)), true, `${route} should exist`);
  }
});

test("ECG worksheet API reuses printable entitlement and download analytics path", () => {
  const src = read("src/app/api/modules/ecg/worksheets/route.ts");
  assert.match(src, /getCurrentEcgModuleAccess/);
  assert.match(src, /accessState:\s*"admin_preview"/);
  assert.doesNotMatch(src, /evaluatePrintableLearnerAccess/);
  assert.doesNotMatch(src, /userHasPaidPrintableAccess/);
});

test("ECG questions are fetched through API filters, not static dataset imports", () => {
  const src = read("src/app/api/modules/ecg/questions/route.ts");
  assert.match(src, /listEcgQuestionsForAccess/);
  const service = read("src/lib/ecg-module/ecg-question-store.ts");
  assert.match(service, /prisma\.ecgVideoQuestion\.findMany/);
  assert.match(src, /level,/);
  assert.match(src, /mode,/);
});

test("CAT and practice exam pools exclude ECG video questions", () => {
  const src = read("src/lib/practice-tests/cat-pool.ts");
  assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
  assert.match(src, /questionFormat:\s*ECG_QUESTION_FORMAT/);
  assert.match(src, /tags:\s*\{\s*has:\s*"ecg-video"\s*\}/);
});

test("ECG answer route records isolated ECG analytics instead of grading through core question bank", () => {
  const src = read("src/app/api/modules/ecg/questions/[id]/answer/route.ts");
  assert.match(src, /recordEcgQuestionAnswer/);
  const service = read("src/lib/ecg-module/ecg-question-store.ts");
  assert.match(service, /ecgVideoQuestionPracticeAnswerAttempt/);
  assert.match(service, /ecgVideoQuestionAnswerOptionAggregate/);
  assert.match(service, /ecgVideoQuestionPerformanceAggregate/);
});

test("hidden ECG routes are admin-preview-only and emit noindex nofollow", () => {
  const layout = read("src/app/modules/ecg/layout.tsx");
  const legacyLayout = read("src/app/modules/ecg-interpretation/layout.tsx");
  const access = read("src/lib/ecg-module/ecg-module.server.ts");
  for (const source of [layout, legacyLayout]) {
    assert.match(source, /index:\s*false/);
    assert.match(source, /follow:\s*false/);
  }
  assert.match(access, /auth\.ecg_module_preview/);
  assert.match(access, /notFound\(\)/);
});
