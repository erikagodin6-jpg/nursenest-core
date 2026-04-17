import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(dir, "..", "..");

const TARGET_FILES = [
  "lib/learner/load-progress-page-payload.ts",
  "lib/study/analytics-data.ts",
  "lib/learner/load-report-card-data.ts",
  "lib/learner/load-readiness-page-payload.ts",
  "lib/learner/load-learner-profile-activity.ts",
  "lib/admin/load-admin-user-support-detail.ts",
  "lib/insights/weighted-session-grading.ts",
  "lib/study/motivation-data.ts",
  "lib/learner/readiness-dashboard-data.ts",
  "lib/learner/weak-topics-from-sessions.ts",
  "lib/learner/session-grading-aggregate.ts",
  "lib/study/unified-review-engine.ts",
  "lib/study/review-queue-data.ts",
  "lib/cat/answer-history.ts",
];

function readTarget(relPath: string): string {
  return readFileSync(join(srcRoot, relPath), "utf8");
}

test("bounded read regression: targeted examAttempt/session queries stay capped and ordered", () => {
  const offenders: string[] = [];

  for (const relPath of TARGET_FILES) {
    const src = readTarget(relPath);

    if (src.includes('lessonId: { startsWith: "pathway:" }') || src.includes("lessonId: { startsWith: 'pathway:' }")) {
      offenders.push(`${relPath}: remove lessonId startsWith('pathway:') scan`);
    }

    if (src.includes("prisma.examAttempt.findMany({")) {
      if (!/prisma\.examAttempt\.findMany\(\{[\s\S]*?take:\s*[A-Za-z0-9_.,()+\- ]+/m.test(src)) {
        offenders.push(`${relPath}: examAttempt.findMany missing explicit take`);
      }
      if (!/prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}/m.test(src)) {
        offenders.push(`${relPath}: examAttempt.findMany missing createdAt desc order`);
      }
    }

    const sessionQueryMatches = src.match(/prisma\.(examSession|practiceTest)\.findMany\(\{/g) ?? [];
    for (const match of sessionQueryMatches) {
      const model = match.includes("examSession") ? "examSession" : "practiceTest";
      const hasTake = new RegExp(`prisma\\.${model}\\.findMany\\(\\{[\\s\\S]*?take:\\s*[A-Za-z0-9_.,()+\\- ]+`, "m");
      const hasCreatedAtOrder = new RegExp(
        `prisma\\.${model}\\.findMany\\(\\{[\\s\\S]*?orderBy:\\s*(?:\\{\\s*createdAt:\\s*"desc"\\s*\\}|\\[[\\s\\S]*?createdAt:\\s*"desc"[\\s\\S]*?\\])`,
        "m",
      );
      if (!hasTake.test(src) || !hasCreatedAtOrder.test(src)) {
        offenders.push(`${relPath}: ${model}.findMany should be bounded and include createdAt desc order`);
        break;
      }
    }
  }

  assert.deepEqual(offenders, []);
});
