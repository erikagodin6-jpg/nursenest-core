import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import type { PrismaClient } from "@prisma/client";
import { loadNpCatSessionDetailed } from "@/lib/cat/session-persistence";
import { emptyPerformanceProfile } from "@/lib/cat/performance-tracker";

test("loadNpCatSessionDetailed flags corrupt adaptive state (no silent resume)", async () => {
  const prisma = {
    practiceTest: {
      findFirst: async () => ({
        adaptiveState: { _v: 2, sessionId: "x" },
        config: { kind: "np-cat", pathwayId: "p", maxQuestions: 10, poolQuestionIds: ["a"] },
        status: "IN_PROGRESS",
      }),
    },
  } as unknown as PrismaClient;

  const r = await loadNpCatSessionDetailed(prisma, "ptid", "user-1");
  assert.equal(r.ok, false);
  if (r.ok) throw new Error("expected failure");
  assert.equal(r.reason, "corrupt_adaptive_state");
  assert.ok(r.detail?.includes("unexpected_state_version"));
});

test("loadNpCatSessionDetailed returns ok for valid v1 state", async () => {
  const prisma = {
    practiceTest: {
      findFirst: async () => ({
        adaptiveState: {
          _v: 1,
          sessionId: "s1",
          startedAt: Date.now(),
          abilityEstimate: 0,
          answeredIds: [],
          recentlySeenIds: [],
          sessionAnswers: [],
          correctStreak: 0,
          incorrectStreak: 0,
          performance: emptyPerformanceProfile(),
        },
        config: { kind: "np-cat", pathwayId: "p", maxQuestions: 10, poolQuestionIds: ["a"] },
        status: "IN_PROGRESS",
      }),
    },
  } as unknown as PrismaClient;

  const r = await loadNpCatSessionDetailed(prisma, "ptid", "user-1");
  assert.equal(r.ok, true);
  if (!r.ok) throw new Error("expected ok");
  assert.equal(r.state.sessionId, "s1");
});
