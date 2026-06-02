/**
 * Run: `NODE_ENV=test node --import tsx --test src/app/api/learner/reset-progress/route.test.ts`
 */
import "../../../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { RESET_PROGRESS_CONFIRMATION_PHRASE, USER_PROGRESS_RESET_ACTION } from "@/lib/learner/reset-progress-confirmation";
import { POST } from "@/app/api/learner/reset-progress/route";
import { resetProgressRouteDeps } from "@/app/api/learner/reset-progress/route-deps";

const userId = "user_reset_route_test_1";

afterEach(() => {
  mock.restoreAll();
});

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/learner/reset-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/learner/reset-progress", () => {
  it("returns 401 when unauthenticated", async () => {
    mock.method(resetProgressRouteDeps, "auth", async () => null);
    const res = await POST(makeRequest({ confirmation: RESET_PROGRESS_CONFIRMATION_PHRASE }));
    assert.equal(res.status, 401);
  });

  it("returns 400 when confirmation phrase is wrong (no reset)", async () => {
    const reset = mock.fn(async () => {
      throw new Error("should not run");
    });
    mock.method(resetProgressRouteDeps, "auth", async () => ({ user: { id: userId } }));
    mock.method(resetProgressRouteDeps, "isDatabaseUrlConfigured", () => true);
    mock.method(resetProgressRouteDeps, "resetUserLearningProgress", reset);
    const res = await POST(makeRequest({ confirmation: "reset" }));
    assert.equal(res.status, 400);
    assert.equal(reset.mock.callCount(), 0);
  });

  it("resets only the signed-in user and returns ok", async () => {
    const reset = mock.fn(async (_db: unknown, uid: string) => {
      assert.equal(uid, userId);
    });
    const invalidate = mock.fn(async () => {});
    const log = mock.fn(() => {});
    mock.method(resetProgressRouteDeps, "auth", async () => ({ user: { id: userId } }));
    mock.method(resetProgressRouteDeps, "isDatabaseUrlConfigured", () => true);
    mock.method(resetProgressRouteDeps, "resetUserLearningProgress", reset);
    mock.method(resetProgressRouteDeps, "invalidateLearnerPrivateReadCache", invalidate);
    mock.method(resetProgressRouteDeps, "safeServerLog", log);
    mock.method(resetProgressRouteDeps, "revalidatePath", () => {});

    const res = await POST(makeRequest({ confirmation: RESET_PROGRESS_CONFIRMATION_PHRASE }));
    assert.equal(res.status, 200);
    const json = (await res.json()) as { ok?: boolean; action?: string };
    assert.equal(json.ok, true);
    assert.equal(json.action, USER_PROGRESS_RESET_ACTION);
    assert.equal(reset.mock.callCount(), 1);
    assert.equal(invalidate.mock.callCount(), 1);
    assert.ok(log.mock.calls.some((c) => c.arguments[1] === USER_PROGRESS_RESET_ACTION));
  });
});
