import assert from "node:assert/strict";
import test from "node:test";

import { learnerAggregateDegradedState } from "./aggregate-loader-degraded-state";

test("learner aggregate degraded state dedupes and trims panel ids", () => {
  assert.deepEqual(
    learnerAggregateDegradedState("temporarily_unavailable", [
      " report-card ",
      "report-card",
      "",
      "readiness",
    ]),
    {
      active: true,
      reason: "temporarily_unavailable",
      panels: ["report-card", "readiness"],
    },
  );
});
