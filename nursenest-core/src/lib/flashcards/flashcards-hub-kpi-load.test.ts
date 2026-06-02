import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reduceFlashcardsHubKpiSettled } from "@/lib/flashcards/flashcards-hub-kpi-load";

describe("reduceFlashcardsHubKpiSettled", () => {
  it("does not collapse dual fetch failures into empty success", () => {
    const r = reduceFlashcardsHubKpiSettled(
      { status: "rejected", reason: new Error("stats down") },
      { status: "rejected", reason: new Error("due down") },
    );
    assert.equal(r.loadError, "fatal");
    assert.equal(r.stats, null);
    assert.equal(r.dueSummary, null);
  });

  it("preserves partial data when only one side fails", () => {
    const r = reduceFlashcardsHubKpiSettled(
      { status: "fulfilled", value: { a: 1 } },
      { status: "rejected", reason: new Error("due down") },
    );
    assert.equal(r.loadError, "partial");
    assert.deepEqual(r.stats, { a: 1 });
    assert.equal(r.dueSummary, null);
  });

  it("marks ok when both succeed", () => {
    const r = reduceFlashcardsHubKpiSettled(
      { status: "fulfilled", value: { s: true } },
      { status: "fulfilled", value: { d: true } },
    );
    assert.equal(r.loadError, "none");
  });
});
