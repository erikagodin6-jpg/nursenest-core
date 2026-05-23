import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const layoutPath = join(here, "layout.tsx");

describe("learner shell layout — staff override isolation", () => {
  const src = readFileSync(layoutPath, "utf8");

  it("shows a staff override region only for admin_override without QA simulation", () => {
    assert.match(src, /Staff access override/);
    assert.match(src, /reason === "admin_override"/);
    assert.match(src, /!qaPayload/);
    assert.match(src, /!entitlement\.adminLearnerQaSimulation/);
  });
});
