/**
 * Hermetic contracts: web and native shells share the same Postgres-backed progress
 * models and the same subscriber session gate — no parallel mobile progress tables.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

function read(rel: string): string {
  return readFileSync(join(nursenestCoreRoot, rel), "utf8");
}

describe("shared progress / adaptive cross-platform (static contracts)", () => {
  it("records topic outcomes and loads unified topic performance from the same module (write → read path)", () => {
    const tp = read(join("src", "lib", "learner", "topic-performance.ts"));
    assert.match(tp, /export async function recordTopicOutcomesSequential/);
    assert.match(tp, /export async function loadUnifiedTopicPerformance/);
    assert.match(tp, /prisma\.userTopicStat\.findMany/);
    assert.match(tp, /tx\.userTopicStat\.(create|update)/);
    assert.match(tp, /invalidateLearnerPrivateReadCache/);
  });

  it("dashboard adaptive summary uses the same loadUnifiedTopicPerformance as the weak-areas API", () => {
    const dash = read(join("src", "lib", "learner", "load-learner-dashboard.ts"));
    assert.match(dash, /loadUnifiedTopicPerformance/);
    assert.match(dash, /loadLearnerDashboardAnalytics/);

    const weakApi = read(join("src", "app", "api", "learner", "weak-areas", "route.ts"));
    assert.match(weakApi, /loadUnifiedTopicPerformance\(gate\.userId, gate\.entitlement/);
    assert.match(weakApi, /requireSubscriberSession/);
    assert.match(weakApi, /if\s*\(\s*!gate\.ok\s*\)\s*return\s+gate\.response/);
  });

  it("representative progress write APIs use requireSubscriberSession (same gate native shells must satisfy)", () => {
    for (const rel of [
      join("src", "app", "api", "lessons", "progress", "route.ts"),
      join("src", "app", "api", "lessons", "pathway-progress", "route.ts"),
      join("src", "app", "api", "questions", "grade", "route.ts"),
      join("src", "app", "api", "flashcards", "cards", "[cardId]", "review", "route.ts"),
      join("src", "app", "api", "practice-tests", "route.ts"),
    ]) {
      const src = read(rel);
      assert.match(src, /requireSubscriberSession/, `${rel} uses subscriber gate`);
    }
  });

  it("practice test completion forwards topic ledger updates through recordTopicOutcomesFromPracticeTest", () => {
    const ptId = read(join("src", "app", "api", "practice-tests", "[id]", "route.ts"));
    assert.match(ptId, /recordTopicOutcomesFromPracticeTest/);
  });

  it("CAT session persistence reuses PracticeTest (no separate mobile CAT table)", () => {
    const cat = read(join("src", "lib", "cat", "session-persistence.ts"));
    assert.match(cat, /practice_tests/i);
    assert.match(cat, /PracticeTest/);
  });

  it("exam session APIs use the same subscriber gate as other premium study routes", () => {
    const session = read(join("src", "app", "api", "exams", "session", "route.ts"));
    assert.match(session, /requireSubscriberSession/);
  });

  it("apps/mobile has no Prisma/sqlite progress stack; mobile-shared stays HTTP contracts only", () => {
    const mobileRoot = join(nursenestCoreRoot, "..", "apps", "mobile");
    assert.ok(existsSync(mobileRoot), "expected apps/mobile when present in monorepo");
    const mobilePkg = read(join("..", "apps", "mobile", "package.json"));
    assert.equal(/@prisma|prisma|sqlite/i.test(mobilePkg), false, "mobile app must not embed a local progress DB client");
    const apiClient = read(join("..", "apps", "mobile", "lib", "api.ts"));
    assert.match(apiClient, /Cookie.*cookieJar/s, "native shell forwards session cookies to shared APIs");

    const mobileSharedPkg = join(nursenestCoreRoot, "..", "packages", "nursenest-mobile-shared", "package.json");
    assert.ok(existsSync(mobileSharedPkg), "expected packages/nursenest-mobile-shared");
    const contracts = read(join("..", "packages", "nursenest-mobile-shared", "src", "contracts.ts"));
    assert.equal(/prisma|sqlite/i.test(contracts), false, "mobile-shared stays HTTP contract only");
  });

  it("subscriber gate chains auth session to getUserAccess for DB-backed entitlements", () => {
    const gate = read(join("src", "lib", "entitlements", "require-subscriber-session.ts"));
    assert.match(gate, /requireSubscriberSessionDeps\.auth\(\)/);
    assert.match(gate, /requireSubscriberSessionDeps\.getUserAccess\(userId\)/);
    assert.match(gate, /requireSubscriberSessionDeps\.accessScopeFromUserAccess/);
  });
});
