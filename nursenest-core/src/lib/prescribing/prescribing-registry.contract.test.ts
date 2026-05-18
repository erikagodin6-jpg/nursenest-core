import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ANTIBIOTIC_REGISTRY } from "./antibiotic-registry";

describe("prescribing registry", () => {
  it("ensures every antibiotic has a stewardship note", () => {
    for (const antibiotic of ANTIBIOTIC_REGISTRY) {
      assert.ok(antibiotic.stewardshipNote.length > 10);
    }
  });

  it("ensures every antibiotic has explicit pseudomonas metadata", () => {
    for (const antibiotic of ANTIBIOTIC_REGISTRY) {
      assert.equal(typeof antibiotic.pseudomonas, "boolean");
    }
  });

  it("ensures common uses are populated", () => {
    for (const antibiotic of ANTIBIOTIC_REGISTRY) {
      assert.ok(antibiotic.commonUses.length > 0);
    }
  });
});
