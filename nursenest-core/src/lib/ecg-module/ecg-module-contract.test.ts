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
  ]) {
    assert.equal(fs.existsSync(path.join(root, route)), true, `${route} should exist`);
  }
});

test("ECG worksheet API reuses printable entitlement and download analytics path", () => {
  const src = read("src/app/api/modules/ecg/worksheets/route.ts");
  assert.match(src, /evaluatePrintableLearnerAccess/);
  assert.match(src, /userHasPaidPrintableAccess/);
  assert.match(src, /isPrintableStoreEnabledForLearners/);
  assert.match(src, /\/api\/printables\/\$\{encodeURIComponent\(row\.id\)\}\/download/);
});

test("ECG questions are fetched through API filters, not static dataset imports", () => {
  const src = read("src/app/api/modules/ecg/questions/route.ts");
  assert.match(src, /prisma\.examQuestion\.findMany/);
  assert.match(src, /questionFormat:\s*ECG_QUESTION_FORMAT/);
  assert.match(src, /level,/);
  assert.match(src, /mode,/);
});

test("CAT and practice exam pools exclude ECG video questions", () => {
  const src = read("src/lib/practice-tests/cat-pool.ts");
  assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
  assert.match(src, /questionFormat:\s*ECG_QUESTION_FORMAT/);
  assert.match(src, /tags:\s*\{\s*has:\s*"ecg-video"\s*\}/);
});

