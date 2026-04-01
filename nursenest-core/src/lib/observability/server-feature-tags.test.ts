import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SERVER_FEATURE, SERVER_FEATURE_TAGS, type ServerFeatureTag } from "@/lib/observability/server-feature-tags";

test("SERVER_FEATURE values are unique and align with SERVER_FEATURE_TAGS", () => {
  const vals = Object.values(SERVER_FEATURE);
  assert.equal(vals.length, new Set(vals).size, "duplicate tag strings in SERVER_FEATURE");
  assert.equal(SERVER_FEATURE_TAGS.length, vals.length);
  for (const v of vals) {
    assert.ok(SERVER_FEATURE_TAGS.includes(v));
  }
});

/** Files that call `setSentryServerContext` — keep in sync when adding routes (or rely on tsc). */
const SENTRY_SERVER_CONTEXT_FILES = [
  "lib/entitlements/require-subscriber-session.ts",
  "app/api/auth/change-password/route.ts",
  "app/api/billing/portal/route.ts",
  "app/api/exams/attempt/[id]/route.ts",
  "app/api/exams/session/question/route.ts",
  "app/api/exams/session/route.ts",
  "app/api/exams/start/route.ts",
  "app/api/exams/submit/route.ts",
  "app/api/flashcards/decks/[deckRef]/review/route.ts",
  "app/api/flashcards/decks/[deckRef]/route.ts",
  "app/api/flashcards/decks/[deckRef]/study/route.ts",
  "app/api/flashcards/decks/route.ts",
  "app/api/flashcards/due-summary/route.ts",
  "app/api/flashcards/route.ts",
  "app/api/flashcards/stats/route.ts",
  "app/api/flashcards/weak-queue/route.ts",
  "app/api/learner/exam-plan/route.ts",
  "app/api/learner/insights/route.ts",
  "app/api/learner/notes/route.ts",
  "app/api/learner/pre-nursing-plan/route.ts",
  "app/api/learner/pre-nursing-progress/route.ts",
  "app/api/learner/weak-areas/route.ts",
  "app/api/lessons/pathway-progress/route.ts",
  "app/api/lessons/progress/route.ts",
  "app/api/lessons/route.ts",
  "app/api/marketing-assets/[...path]/route.ts",
  "app/api/practice-tests/[id]/route.ts",
  "app/api/practice-tests/route.ts",
  "app/api/questions/[id]/route.ts",
  "app/api/questions/discovery/route.ts",
  "app/api/questions/grade/route.ts",
  "app/api/questions/route.ts",
  "app/api/signup/route.ts",
  "app/api/subscriptions/checkout/route.ts",
  "app/api/subscriptions/webhook/route.ts",
  "app/api/trial/start/route.ts",
] as const;

test("setSentryServerContext call sites must not use raw string literals for feature", () => {
  const srcRoot = join(process.cwd(), "src");
  const offenders: string[] = [];
  for (const rel of SENTRY_SERVER_CONTEXT_FILES) {
    const p = join(srcRoot, rel);
    if (!existsSync(p)) {
      offenders.push(`missing file: ${rel}`);
      continue;
    }
    const s = readFileSync(p, "utf8");
    if (!s.includes("setSentryServerContext")) continue;
    // Disallow string literal feature tags; use SERVER_FEATURE.* only.
    if (/feature:\s*["']/.test(s)) {
      offenders.push(rel);
    }
  }
  assert.equal(offenders.length, 0, `Use SERVER_FEATURE.* only for feature. Issues: ${offenders.join(", ")}`);
});

test("ServerFeatureTag includes practice_test (CAT / practice tests)", () => {
  const _: ServerFeatureTag = SERVER_FEATURE.practiceTest;
  assert.equal(SERVER_FEATURE.practiceTest, "practice_test");
});
