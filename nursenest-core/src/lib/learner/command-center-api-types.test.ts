import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isCommandCenterReviewOk } from "@/lib/learner/command-center-api-types";

describe("command center API types", () => {
  it("isCommandCenterReviewOk distinguishes loaded counts from error state", () => {
    assert.ok(
      isCommandCenterReviewOk({
        loadState: "ok",
        href: "/app/review",
        overdue: 0,
        dueToday: 0,
        highRisk: 0,
        total: 0,
        message: "All clear",
      }),
    );
    assert.equal(
      isCommandCenterReviewOk({
        loadState: "error",
        href: "/app/review",
        message: "DB down",
        retryable: true,
      }),
      false,
    );
  });
});
