import assert from "node:assert/strict";
import { test } from "node:test";

import { PUBLIC_FLASHCARD_LANDING_DB_TIMEOUT_MS } from "./public-flashcard-landing";

test("public flashcard landing DB timeout is resilient (not sub-second)", () => {
  assert.ok(PUBLIC_FLASHCARD_LANDING_DB_TIMEOUT_MS >= 10_000);
});
