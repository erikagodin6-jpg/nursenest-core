import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

test("ECG routes exist only in the strict mastery structure", () => {
  for (const route of [
    "src/app/(app)/modules/ecg/basic/lessons/page.tsx",
    "src/app/(app)/modules/ecg/basic/quizzes/page.tsx",
    "src/app/(app)/modules/ecg/basic/worksheets/page.tsx",
    "src/app/(app)/modules/ecg/advanced/lessons/page.tsx",
    "src/app/(app)/modules/ecg/advanced/video-drills/page.tsx",
    "src/app/(app)/modules/ecg/advanced/scenarios/page.tsx",
    "src/app/(app)/modules/ecg/advanced/worksheets/page.tsx",
    "src/app/(app)/modules/ecg-interpretation/lessons/page.tsx",
    "src/app/(app)/modules/ecg-interpretation/practice/page.tsx",
    "src/app/(app)/modules/ecg-interpretation/quiz/page.tsx",
  ]) {
    assert.equal(fs.existsSync(path.join(root, route)), true, `${route} should exist`);
  }
});

test("Advanced ECG route family is protected by the separate Advanced ECG add-on gate", () => {
  for (const route of [
    "src/app/(app)/modules/ecg/advanced/lessons/page.tsx",
    "src/app/(app)/modules/ecg/advanced/video-drills/page.tsx",
    "src/app/(app)/modules/ecg/advanced/scenarios/page.tsx",
    "src/app/(app)/modules/ecg/advanced/worksheets/page.tsx",
  ]) {
    const source = read(route);
    assert.match(source, /AdvancedEcgContentGate/, `${route} must render through AdvancedEcgContentGate`);
  }

  const gate = read("src/components/advanced-ecg/advanced-ecg-content-gate.tsx");
  assert.match(gate, /loadAdvancedEcgAccess/);
  assert.match(gate, /AdvancedEcgPremiumHub/);
  assert.match(gate, /!access\.ok/);
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
  const src = read("src/lib/practice-tests/cat-question-completeness.ts");
  assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
  assert.match(src, /questionFormat:\s*ECG_QUESTION_FORMAT/);
  assert.match(src, /tags:\s*\{\s*has:\s*"ecg-video"\s*\}/);
});

test("ECG learner pools only expose clinician-reviewed approved safe items", () => {
  const src = read("src/lib/ecg-module/ecg-question-store.ts");
  assert.match(src, /isEcgQuestionLearnerVisible/);
  assert.match(src, /clinicianReviewedAt/);
  assert.match(src, /qaStatus/);
  assert.match(src, /publishSafetyStatus/);
});

test("ECG readiness uses governance metadata instead of raw inventory alone", () => {
  const src = read("src/lib/ecg-module/ecg-module-readiness.ts");
  assert.match(src, /getEcgQuestionGovernanceFlags/);
  assert.match(src, /readyQuestions/);
  assert.match(src, /clinicianReviewedAt/);
  assert.match(src, /qaStatus/);
  assert.match(src, /publishSafetyStatus/);
  assert.match(src, /Publish-ready ECG question count/);
});

test("ECG Prisma model includes clinician QA governance metadata", () => {
  const schema = read("prisma/schema.prisma");
  assert.match(schema, /clinicianReviewedAt\s+DateTime\?/);
  assert.match(schema, /clinicianReviewedBy\s+String\?/);
  assert.match(schema, /waveformFidelity\s+String/);
  assert.match(schema, /qaStatus\s+String/);
  assert.match(schema, /publishSafetyStatus\s+String/);
});

test("ECG answer route records isolated ECG analytics instead of grading through core question bank", () => {
  const src = read("src/app/api/modules/ecg/questions/[id]/answer/route.ts");
  assert.match(src, /recordEcgQuestionAnswer/);
  const service = read("src/lib/ecg-module/ecg-question-store.ts");
  assert.match(service, /ecgVideoQuestionPracticeAnswerAttempt/);
  assert.match(service, /ecgVideoQuestionAnswerOptionAggregate/);
  assert.match(service, /ecgVideoQuestionPerformanceAggregate/);
});

test("ECG learner layout uses dynamic robots metadata; legacy interpretation stays noindex nofollow", () => {
  const layout = read("src/app/(app)/modules/ecg/layout.tsx");
  const legacyLayout = read("src/app/(app)/modules/ecg-interpretation/layout.tsx");
  const access = read("src/lib/ecg-module/ecg-module.server.ts");
  assert.match(layout, /index:\s*false/);
  assert.match(layout, /generateMetadata/);
  assert.match(legacyLayout, /index:\s*false/);
  assert.match(legacyLayout, /follow:\s*false/);
  assert.match(access, /auth\.ecg_module_preview/);
  assert.match(access, /notFound\(\)/);
});

test("ECG module publish route is admin-only and refuses failed readiness gates", () => {
  const src = read("src/app/api/admin/modules/ecg/publish/route.ts");
  assert.match(src, /requireAdmin/);
  assert.match(src, /assertEcgModuleCanPublish/);
  assert.match(src, /ecg_publish_blocked/);
  assert.match(src, /setEcgModuleStatus\("published"\)/);
});

test("ECG readiness enforces minimum content, generation loops, deduped inserts, and clinical strip gates", () => {
  const readiness = read("src/lib/ecg-module/ecg-module-readiness.ts");
  const generation = read("src/lib/ecg-module/ecg-question-generation.ts");
  const dedup = read("src/lib/ecg-module/ecg-question-dedup.ts");
  const validation = read("src/lib/ecg-module/ecg-strip-clinical-validation.ts");
  assert.match(readiness, /totalQuestions:\s*300/);
  assert.match(readiness, /for \(let loop = 0; loop < 5/);
  assert.match(readiness, /remaining = 100/);
  assert.match(generation, /filterDuplicateGeneratedQuestions/);
  assert.match(generation, /createMany/);
  assert.match(generation, /skipDuplicates:\s*true/);
  assert.match(dedup, /normalizeQuestionText/);
  assert.match(validation, /Atrial fibrillation cannot be regular/);
  assert.match(validation, /requires manual staff review/);
});

test("ECG deterministic strip media replaces AI image source of truth", () => {
  const media = read("src/components/study/ecg-video-question-media.tsx");
  const client = read("src/components/ecg-module/ecg-module-client.tsx");
  const draft = read("src/lib/ecg-video-quiz/admin-ecg-video-question-draft.ts");
  assert.match(media, /EcgLiveStrip/);
  assert.match(client, /EcgLiveStrip/);
  assert.match(draft, /ecgVideo/);
  assert.doesNotMatch(read("src/lib/ecg-module/ecg-waveform-generator.ts"), /prompt|image generation|dall-e|gpt-image/i);
});
