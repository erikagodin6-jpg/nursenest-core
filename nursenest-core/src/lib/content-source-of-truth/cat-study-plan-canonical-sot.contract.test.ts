import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..", "..");

function readSrc(rel: string): string {
  return readFileSync(join(coreRoot, "src", rel), "utf8");
}

describe("CAT / study-plan / weak-area surfaces — canonical Prisma-backed contracts", () => {
  it("CAT practice pool builds from ExamQuestion + entitlement gates (not static JSON banks)", () => {
    const catPool = readSrc("lib/practice-tests/cat-pool.ts");
    assert.match(catPool, /\bprisma\.examQuestion\b/);
    assert.match(catPool, /questionAccessWhere\b/);
    assert.match(catPool, /questionAccessWhereWithPathway\b/);
    assert.ok(!catPool.includes("client/src/data"), "CAT pool must not import legacy client data trees");
  });

  it("personalized weak-area study plan derives from Prisma-backed learner signals (not legacy lesson JSON)", () => {
    const plan = readSrc("lib/learner/personalized-weak-area-study-plan.ts");
    assert.match(plan, /\bprisma\./);
    assert.match(plan, /buildLearnerStudySnapshot/);
    assert.match(plan, /loadUnifiedTopicPerformance/);
    assert.ok(!plan.includes("legacyLessons"), "weak-area plan must not reference legacyLessons");
  });

  it("learner study snapshot resolves pathway lessons via canonical DB helpers", () => {
    const snap = readSrc("lib/learner/build-learner-study-snapshot.ts");
    assert.match(snap, /\bprisma\./);
    assert.match(snap, /resolvePathwayLessonForWeakTopic|resolvePathwayNextLesson/);
    assert.ok(!snap.includes("client/src/data"));
  });

  it("study-plan page wires cognition-integrated study plan (server)", () => {
    const page = readSrc("app/(student)/app/(learner)/study-plan/page.tsx");
    assert.match(page, /buildCognitionIntegratedStudyPlan/);
    assert.match(page, /buildGovernedAdaptiveRecommendations/);
  });
});
