import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";
import { composePostMissStudyPlan } from "@/lib/adaptive-learning/post-miss-orchestration";
import { buildPracticePostMissPlanServer } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import {
  buildTopicWeaknessSignalsFromLearnerPerformance,
  bumpTopicWeaknessSignal,
} from "@/lib/learner/learner-performance-to-weakness-signals";
import { pathwayLessonRowsToAdaptiveCandidates } from "@/lib/learner/pathway-lessons-to-adaptive-candidates";
import type { PathwayLessonDashboardRow } from "@/lib/learner/load-learner-dashboard";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Phase 5B adaptive wiring", () => {
  test("GET route requires subscriber gate + feature flag check", () => {
    const p = join(__dirname, "../../app/api/learner/adaptive-recommendations/route.ts");
    const src = readFileSync(p, "utf8");
    assert.match(src, /requireSubscriberSession/);
    assert.match(src, /isAdaptiveLearningEnabled/);
  });

  test("POST route requires subscriber gate + feature flag check", () => {
    const p = join(__dirname, "../../app/api/learner/adaptive-post-miss/route.ts");
    const src = readFileSync(p, "utf8");
    assert.match(src, /requireSubscriberSession/);
    assert.match(src, /isAdaptiveLearningEnabled/);
  });

  test("CAT advance contract file has no adaptive-post-miss hook", () => {
    const p = join(__dirname, "../practice-tests/cat-advance-contract.ts");
    const src = readFileSync(p, "utf8");
    assert.equal(src.includes("adaptive-post-miss"), false);
    assert.equal(src.includes("ADAPTIVE_LEARNING_ENABLED"), false);
  });

  test("missing performance slices yield empty signals without throwing", () => {
    const s = buildTopicWeaknessSignalsFromLearnerPerformance(null);
    assert.ok(Array.isArray(s));
    assert.equal(s.length, 0);
  });

  test("bumpTopicWeaknessSignal adds a miss for canonical key", () => {
    const now = 1_700_000_000_000;
    const out = bumpTopicWeaknessSignal([], "  Cardiac-Rhythm  ", now);
    assert.equal(out.length, 1);
    assert.ok(out[0]!.missCount >= 1);
  });

  test("practice post-miss composes plan with weak signals + lesson candidates", () => {
    const rows: PathwayLessonDashboardRow[] = [
      {
        id: "1",
        pathwayId: "us-rn-nclex-rn",
        slug: "sample-lesson",
        title: "Sample Lesson",
        topic: "Cardiac",
        topicSlug: "cardiac-rhythm",
        bodySystem: "cardiovascular",
        previewSectionCount: 3,
        seoTitle: "",
        seoDescription: "",
        locale: "en",
        structuralPublicComplete: true,
      },
    ];
    const cands = pathwayLessonRowsToAdaptiveCandidates("us-rn-nclex-rn", rows, 20);
    const plan = buildPracticePostMissPlanServer({
      pathwayId: "us-rn-nclex-rn",
      roleTrack: "rn",
      weakTopicSignals: [{ topicKey: "cardiac-rhythm", missCount: 3, lastAttemptMs: Date.now() }],
      lessonCandidates: cands,
      linkedLearning: null,
      nowMs: Date.now(),
    });
    assert.equal(plan.trigger, "practice_miss");
    assert.ok(plan.suggestedSurfaceOrder.length > 0);
    assert.ok(plan.recommendations);
  });

  test("composePostMissStudyPlan matches orchestration export", () => {
    const plan = composePostMissStudyPlan({
      trigger: "practice_miss",
      pathwayId: "us-rn-nclex-rn",
      roleTrack: "rn",
      linkedLearning: null,
      weakTopicSignals: [{ topicKey: "fluid-electrolyte", missCount: 2 }],
      lessonCandidates: [],
      nowMs: Date.now(),
    });
    assert.equal(plan.trigger, "practice_miss");
  });
});
