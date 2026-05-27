import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

test("premium nursing APIs keep server-side subscriber gates", () => {
  const subscriberApiRoutes = [
    "src/app/api/questions/grade/route.ts",
    "src/app/api/questions/discovery/route.ts",
    "src/app/api/questions/strategy-counts/route.ts",
    "src/app/api/exams/start/route.ts",
    "src/app/api/exams/session/route.ts",
    "src/app/api/exams/session/question/route.ts",
    "src/app/api/exams/submit/route.ts",
    "src/app/api/exams/attempt/[id]/route.ts",
    "src/app/api/practice-tests/route.ts",
    "src/app/api/practice-tests/[id]/route.ts",
    "src/app/api/practice-tests/[id]/question/route.ts",
    "src/app/api/practice-tests/[id]/cat-study-review/route.ts",
    "src/app/api/practice-tests/cat-insights/route.ts",
    "src/app/api/practice-tests/cat-readiness/route.ts",
  ];

  for (const route of subscriberApiRoutes) {
    assert.match(
      source(route),
      /requireSubscriberSession/,
      `${route} must enforce subscriber access server-side`,
    );
  }
});

test("NP CAT APIs use the NP-specific subscriber gate on every lifecycle endpoint", () => {
  const npCatRoutes = [
    "src/app/api/cat/np/session/route.ts",
    "src/app/api/cat/np/answer/route.ts",
    "src/app/api/cat/np/analysis/route.ts",
    "src/app/api/cat/np/audit/route.ts",
  ];

  for (const route of npCatRoutes) {
    assert.match(
      source(route),
      /requireNpCatSubscriberSession/,
      `${route} must deny non-NP subscribers, not just anonymous users`,
    );
  }
});

test("premium practice test session pages use the shared learner activity subscription gate", () => {
  const page = source("src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx");
  assert.match(page, /loadLearnerActivityBootstrap/);
  assert.match(page, /requireSubscription:\s*true/);
});

test("practice results review does not expose out-of-scope question stems", () => {
  const page = source("src/app/(app)/app/(learner)/practice-tests/[id]/results/page.tsx");
  assert.match(page, /questionAccessWhere\(entitlement\)/);
});
