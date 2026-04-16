import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PRISMA_FIND_MANY_ABSOLUTE_MAX,
  takeForIdIn,
} from "@/lib/db/prisma-find-many-bounds";

describe("prisma-find-many-bounds (nn-db-final-003)", () => {
  it("takeForIdIn caps by array length", () => {
    assert.equal(takeForIdIn(["a", "b", "c"]), 3);
  });

  it("takeForIdIn respects explicit cap below length", () => {
    assert.equal(takeForIdIn(["a", "b", "c"], 2), 2);
  });

  it("takeForIdIn respects absolute max when explicitCap omitted", () => {
    const huge = Array.from({ length: PRISMA_FIND_MANY_ABSOLUTE_MAX + 50 }, (_, i) => `id-${i}`);
    assert.equal(takeForIdIn(huge), PRISMA_FIND_MANY_ABSOLUTE_MAX);
  });
});
