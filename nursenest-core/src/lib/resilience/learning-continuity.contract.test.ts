import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  EMERGENCY_STUDY_MODE_MESSAGE,
  TIER_1_LEARNING_ACTIVITIES,
  TIER_2_OPTIONAL_SERVICES,
  isTier2OptionalService,
} from "./learning-continuity";

function read(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

test("Tier 1 learning activities are explicit and complete", () => {
  assert.deepEqual([...TIER_1_LEARNING_ACTIVITIES], [
    "flashcards",
    "practice_questions",
    "cat_exams",
    "lessons",
    "clinical_skills",
    "pharmacology",
    "ecg",
  ]);
});

test("Tier 2 services include social, growth, analytics, readiness, and recommendations", () => {
  for (const service of ["adaptive_learning", "recommendations", "analytics", "friends", "referrals", "leaderboards", "readiness", "gamification", "notifications"]) {
    assert.ok(isTier2OptionalService(service), `${service} should be optional Tier 2`);
  }
  assert.ok(!isTier2OptionalService("cat_exams"));
  assert.ok(TIER_2_OPTIONAL_SERVICES.length >= 9);
});

test("Emergency Study Mode copy preserves learner confidence", () => {
  assert.equal(
    EMERGENCY_STUDY_MODE_MESSAGE,
    "Some advanced services are temporarily unavailable. Your learning activities remain fully accessible.",
  );
  assert.match(read("src/components/student/learner-degraded-mode-banner.tsx"), /EMERGENCY_STUDY_MODE_MESSAGE/);
});

test("synthetic learning monitor covers every Tier 1 activity family", () => {
  const source = read("scripts/synthetic-learning-monitor.ts");
  for (const check of ["flashcards_launch", "cat_launch", "practice_questions_launch", "lesson_launch", "clinical_skills_launch", "pharmacology_launch", "ecg_launch"]) {
    assert.match(source, new RegExp(check));
  }
});

test("Tier 2 optional dependencies are guarded by safeStudyOptional", () => {
  const source = read("src/lib/study-mode/study-mode-fallback.ts");
  assert.match(source, /safeOptional/);
  assert.match(source, /non_critical_service_bypassed/);
  assert.match(source, /study_continues/);
});

