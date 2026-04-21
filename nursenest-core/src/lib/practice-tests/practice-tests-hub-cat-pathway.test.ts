import assert from "node:assert/strict";
import test from "node:test";
import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import {
  catEligiblePathwayOptions,
  hubCatStartBlocked,
  pathwayIdWhenEnteringCatMode,
  pathwayIdWhenLeavingCatMode,
} from "@/lib/practice-tests/practice-tests-hub-cat-pathway";

function opt(id: string): PracticeTestPathwayOption {
  return { id, label: id, examFamily: "NCLEX_RN", examCodeLabel: id };
}

test("catEligiblePathwayOptions filters by id list", () => {
  const o = catEligiblePathwayOptions([opt("a"), opt("b"), opt("c")], ["b"]);
  assert.equal(o.length, 1);
  assert.equal(o[0]!.id, "b");
});

test("pathwayIdWhenEnteringCatMode: single eligible auto-selects", () => {
  const id = pathwayIdWhenEnteringCatMode({
    catEligibleOptions: [opt("only")],
    pathwayIdFromUrl: null,
  });
  assert.equal(id, "only");
});

test("pathwayIdWhenEnteringCatMode: multiple requires explicit URL or returns empty", () => {
  const a = opt("p1");
  const b = opt("p2");
  assert.equal(
    pathwayIdWhenEnteringCatMode({ catEligibleOptions: [a, b], pathwayIdFromUrl: null }),
    "",
  );
  assert.equal(
    pathwayIdWhenEnteringCatMode({ catEligibleOptions: [a, b], pathwayIdFromUrl: "  " }),
    "",
  );
  assert.equal(
    pathwayIdWhenEnteringCatMode({ catEligibleOptions: [a, b], pathwayIdFromUrl: "p2" }),
    "p2",
  );
});

test("pathwayIdWhenLeavingCatMode restores default when present", () => {
  assert.equal(
    pathwayIdWhenLeavingCatMode("p2", [opt("p1"), opt("p2")]),
    "p2",
  );
  assert.equal(pathwayIdWhenLeavingCatMode("missing", [opt("p1")]), "p1");
});

test("hubCatStartBlocked: CAT with no pathway or no cat options", () => {
  assert.equal(hubCatStartBlocked({ selectionMode: "random", pathwayId: "", catEligibleOptionCount: 2 }), false);
  assert.equal(hubCatStartBlocked({ selectionMode: "cat", pathwayId: "", catEligibleOptionCount: 2 }), true);
  assert.equal(hubCatStartBlocked({ selectionMode: "cat", pathwayId: "  ", catEligibleOptionCount: 2 }), true);
  assert.equal(hubCatStartBlocked({ selectionMode: "cat", pathwayId: "p1", catEligibleOptionCount: 2 }), false);
  assert.equal(hubCatStartBlocked({ selectionMode: "cat", pathwayId: "", catEligibleOptionCount: 0 }), true);
  assert.equal(hubCatStartBlocked({ selectionMode: "cat", pathwayId: "p1", catEligibleOptionCount: 1 }), false);
});
