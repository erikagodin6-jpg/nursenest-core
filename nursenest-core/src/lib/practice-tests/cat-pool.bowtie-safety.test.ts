import assert from "node:assert/strict";
import test from "node:test";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CountryCode, TierCode } from "@prisma/client";
import { isCompleteCatQuestionRow, NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import {
  assessCatPracticeReadinessForPathway,
  catReadinessUnavailableMessage,
} from "@/lib/practice-tests/cat-practice-readiness";
import { getPracticeQuestionsForPathway } from "@/lib/learner-study-hub/pathway-lesson-study-materials";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

test("isCompleteCatQuestionRow rejects random object answers for non-bowtie rows", () => {
  assert.equal(
    isCompleteCatQuestionRow({
      questionType: "multiple_choice",
      stem: "A complete stem",
      options: ["A", "B"],
      correctAnswer: { arbitrary: "object" },
      rationale: "A rationale",
    }),
    false,
  );
});

test("isCompleteCatQuestionRow accepts valid bowtie object answers", () => {
  assert.equal(
    isCompleteCatQuestionRow({
      questionType: "NGN_BOWTIE",
      stem: "A complete stem",
      options: {
        format: "bowtie",
        bank: [
          { id: "condition", label: "Condition" },
          { id: "intervention", label: "Intervention" },
          { id: "monitoring", label: "Monitoring" },
        ],
      },
      correctAnswer: {
        correctMapping: {
          condition: "condition",
          intervention: "intervention",
          monitoring: "monitoring",
        },
      },
      rationale: "A rationale",
    }),
    true,
  );
});

test("regular practice/CAT pool excludes ECG-formatted and ECG-tagged rows", () => {
  assert.deepEqual(NON_ECG_PRACTICE_EXAM_WHERE, {
    NOT: [{ questionFormat: "ecg_video" }, { tags: { has: "ecg-video" } }],
  });
});

test("RN CAT readiness diagnostic explains CAT-only calibration instead of zeroing the practice pool", () => {
  const message = catReadinessUnavailableMessage(
    {
      eligibleCatQuestions: 12,
      completePracticeQuestions: 486,
    },
    30,
  );

  assert.match(message, /CAT requires calibrated questions/);
  assert.match(message, /Practice questions are available/);
  assert.match(message, /CAT-ready calibrated questions are 12 \/ 30/);
  assert.doesNotMatch(message, /0 complete questions/i);

  const source = readFileSync(join(process.cwd(), "src/lib/practice-tests/cat-practice-readiness.ts"), "utf8");
  for (const field of [
    "eligibleCatQuestions",
    "completePracticeQuestions",
    "excludedBecauseMissingCatMetadata",
    "excludedBecauseIncomplete",
    "excludedBecauseWrongPathwayOrExam",
  ]) {
    assert.match(source, new RegExp(field), `readiness response must expose ${field}`);
  }
});

const dbUrl = Boolean(process.env.DATABASE_URL?.trim());
const testDb = dbUrl && isDatabaseUrlConfigured() ? test : test.skip;

testDb("RN / US / NCLEX-RN readiness inventory never hides available practice questions behind a zero-complete CAT message", async () => {
  const pathwayId = "us-rn-nclex-rn";
  const entitlement: AccessScope = {
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: CountryCode.US,
    alliedCareer: null,
  };
  const [practice, readiness] = await Promise.all([
    getPracticeQuestionsForPathway(pathwayId, { maxQuestions: 4000, maxLessons: 600 }),
    assessCatPracticeReadinessForPathway("cat-readiness-contract", entitlement, pathwayId),
  ]);

  if (process.env.CORE_API_STRICT === "1") {
    assert.ok(practice.questions.length > 0, "expected RN / US / NCLEX-RN practice pool count to be > 0");
  }

  if (practice.questions.length > 0 && !readiness.ok) {
    assert.equal(readiness.code, "cat_pool_invalid");
    assert.ok(
      (readiness.completePracticeQuestions ?? 0) > 0 ||
        /CAT-ready calibrated questions/i.test(readiness.message),
      "CAT unavailable state must explain CAT-only exclusion when practice questions exist",
    );
    assert.doesNotMatch(readiness.message, /\b0 complete questions\b/i);
  }

  if (readiness.ok) {
    assert.ok(readiness.eligibleCatQuestions >= readiness.requiredQuestions);
  } else if (readiness.code === "cat_pool_invalid") {
    assert.match(readiness.message, /CAT-ready calibrated questions|CAT-ready calibrated questions are/i);
  }
});
